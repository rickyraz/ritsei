import * as Effect from "effect/Effect"

import { DatabaseFailure, uuidv7 } from "../../../foundation/mod.ts"
import { EventIdempotencyConflict } from "../../messaging/mod.ts"
import type {
  CancelConfirmedOrderCommand,
  ConfirmOrderCommand,
  CreateCustomerCommand,
  CreateOrderCommand,
  CreateQuotationCommand,
  Customer,
  GetConfirmedOrderTotalCommand,
  Quotation,
  SalesOrder,
} from "./contract.ts"
import {
  CustomerAlreadyExists,
  CustomerNotFound,
  QuotationCustomerMismatch,
  QuotationNotFound,
  SalesOrderConfirmationIdempotencyConflict,
} from "./errors.ts"
import type { SalesStore } from "./store.ts"
import { deriveTotal } from "./store.ts"

export const makeSalesMemoryStore = (): SalesStore => {
  const customers = new Map<string, Customer>()
  const quotations = new Map<string, Quotation>()
  const orders = new Map<string, SalesOrder>()
  const keys = new Map<string, string>()
  const id = uuidv7
  const createCustomer = Effect.fn("SalesStore.memory.createCustomer")(
    function* (input: CreateCustomerCommand) {
      const email = input.email.trim().toLowerCase()
      if ([...customers.values()].some((x) => x.tenantId === input.tenantId && x.email === email)) {
        return yield* Effect.fail(new CustomerAlreadyExists({ tenantId: input.tenantId, email }))
      }
      const customer = { id: id(), tenantId: input.tenantId, name: input.name.trim(), email }
      customers.set(customer.id, customer)
      return customer
    },
  )
  const createQuotation = Effect.fn("SalesStore.memory.createQuotation")(
    function* (input: CreateQuotationCommand) {
      if (customers.get(input.customerId)?.tenantId !== input.tenantId) {
        return yield* Effect.fail(
          new CustomerNotFound({ tenantId: input.tenantId, customerId: input.customerId }),
        )
      }
      const quotation = {
        id: id(),
        tenantId: input.tenantId,
        customerId: input.customerId,
        status: "draft" as const,
        total: input.total,
      }
      quotations.set(quotation.id, quotation)
      return quotation
    },
  )
  const createOrder = Effect.fn("SalesStore.memory.createOrder")(
    function* (input: CreateOrderCommand) {
      if (customers.get(input.customerId)?.tenantId !== input.tenantId) {
        return yield* Effect.fail(
          new CustomerNotFound({ tenantId: input.tenantId, customerId: input.customerId }),
        )
      }
      if (input.quotationId !== undefined) {
        const quotation = quotations.get(input.quotationId)
        if (quotation?.tenantId !== input.tenantId) {
          return yield* Effect.fail(
            new QuotationNotFound({ tenantId: input.tenantId, quotationId: input.quotationId }),
          )
        }
        if (quotation.customerId !== input.customerId) {
          return yield* Effect.fail(
            new QuotationCustomerMismatch({
              tenantId: input.tenantId,
              quotationId: input.quotationId,
              customerId: input.customerId,
            }),
          )
        }
      }
      const order: SalesOrder = {
        id: id(),
        tenantId: input.tenantId,
        customerId: input.customerId,
        quotationId: input.quotationId ?? null,
        status: "draft",
        confirmedAt: null,
        total: deriveTotal(input.lines),
        lines: input.lines,
      }
      orders.set(order.id, order)
      return order
    },
  )
  const confirmOrder = Effect.fn("SalesStore.memory.confirmOrder")(
    function* (
      input: ConfirmOrderCommand,
      append: (
        order: SalesOrder,
      ) => Effect.Effect<
        unknown,
        EventIdempotencyConflict | DatabaseFailure | import("effect/Schema").SchemaError
      >,
    ) {
      const order = orders.get(input.orderId)
      if (order?.tenantId !== input.tenantId) return { _tag: "not-found" as const }
      if (order.status === "confirmed") {
        return keys.get(order.id) === input.idempotencyKey
          ? { _tag: "existing" as const, order }
          : yield* Effect.fail(
            new SalesOrderConfirmationIdempotencyConflict({
              tenantId: input.tenantId,
              orderId: input.orderId,
              idempotencyKey: input.idempotencyKey,
            }),
          )
      }
      if (order.status !== "draft") return { _tag: "invalid-state" as const, status: order.status }
      const confirmed = {
        ...order,
        status: "confirmed" as const,
        confirmedAt: new Date().toISOString(),
      }
      yield* append(confirmed)
      orders.set(order.id, confirmed)
      keys.set(order.id, input.idempotencyKey)
      return { _tag: "confirmed" as const, order: confirmed }
    },
  )
  const cancelConfirmedOrder = Effect.fn("SalesStore.memory.cancelConfirmedOrder")(
    function* (input: CancelConfirmedOrderCommand) {
      const order = orders.get(input.orderId)
      if (order?.tenantId !== input.tenantId) {
        return yield* Effect.succeed({ _tag: "not-found" as const })
      }
      if (order.status === "cancelled") return yield* Effect.succeed(order)
      if (order.status !== "confirmed") {
        return yield* Effect.succeed({ _tag: "invalid-state" as const, status: order.status })
      }
      const cancelled = { ...order, status: "cancelled" as const }
      orders.set(order.id, cancelled)
      return yield* Effect.succeed(cancelled)
    },
  )
  const getConfirmedOrderTotal = Effect.fn("SalesStore.memory.getConfirmedOrderTotal")(
    function* (input: GetConfirmedOrderTotalCommand) {
      const order = orders.get(input.orderId)
      if (order?.tenantId !== input.tenantId) {
        return yield* Effect.succeed({ _tag: "not-found" as const })
      }
      return yield* Effect.succeed({
        _tag: "found" as const,
        total: order.total,
        status: order.status,
        confirmedAt: order.confirmedAt,
      })
    },
  )
  return {
    createCustomer,
    createQuotation,
    createOrder,
    confirmOrder,
    cancelConfirmedOrder,
    getConfirmedOrderTotal,
  }
}
