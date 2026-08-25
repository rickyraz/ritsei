import { and, eq } from "drizzle-orm"
import * as Clock from "effect/Clock"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { customers, orderLines, orders, quotations } from "../../../db/schema/sales.ts"
import { Database, DatabaseFailure, isDatabaseConstraint } from "../../kernel/mod.ts"
import { EventIdempotencyConflict } from "../../messaging/mod.ts"
import type {
  CancelConfirmedOrderCommand,
  ConfirmOrderCommand,
  CreateCustomerCommand,
  CreateOrderCommand,
  CreateQuotationCommand,
  GetConfirmedOrderTotalCommand,
  SalesOrder,
} from "./contract.ts"
import {
  CustomerAlreadyExists,
  CustomerNotFound,
  QuotationNotFound,
  SalesOrderConfirmationIdempotencyConflict,
} from "./errors.ts"
import type { SalesStore } from "./store.ts"
import { deriveTotal, toSalesOrder } from "./store.ts"

const customerSelection = {
  id: customers.id,
  tenantId: customers.tenantId,
  name: customers.name,
  email: customers.email,
}
const quotationSelection = {
  id: quotations.id,
  tenantId: quotations.tenantId,
  customerId: quotations.customerId,
  status: quotations.status,
  total: quotations.total,
}
const orderSelection = {
  id: orders.id,
  tenantId: orders.tenantId,
  customerId: orders.customerId,
  quotationId: orders.quotationId,
  status: orders.status,
  confirmedAt: orders.confirmedAt,
  total: orders.total,
}
const orderLineSelection = {
  itemId: orderLines.itemId,
  quantity: orderLines.quantity,
  unitPrice: orderLines.unitPrice,
}

export const makeSalesPostgresStore = Effect.fn("Sales.makePostgresStore")(function* () {
  const database = yield* Database
  const clock = yield* Clock.Clock
  const now = () => new Date(clock.currentTimeMillisUnsafe())
  const createCustomer = Effect.fn("SalesStore.createCustomer")(
    function* (decoded: CreateCustomerCommand) {
      const email = decoded.email.trim().toLowerCase()
      const rows = yield* database.query((db) =>
        db.insert(customers).values({
          tenantId: decoded.tenantId,
          name: decoded.name.trim(),
          email,
        }).returning(customerSelection), "sales.customer.create").pipe(
          Effect.mapError((error) =>
            isDatabaseConstraint(error, "customers_tenant_email_key")
              ? new CustomerAlreadyExists({ tenantId: decoded.tenantId, email })
              : error
          ),
        )
      return rows[0]!
    },
  )
  const createQuotation = Effect.fn("SalesStore.createQuotation")(
    function* (decoded: CreateQuotationCommand) {
      const rows = yield* database.query((db) =>
        db.insert(quotations).values({
          tenantId: decoded.tenantId,
          customerId: decoded.customerId,
          total: decoded.total,
        }).returning(quotationSelection), "sales.quotation.create").pipe(
          Effect.mapError((error) =>
            isDatabaseConstraint(error, "quotations_tenant_customer_fkey", "23503")
              ? new CustomerNotFound({ tenantId: decoded.tenantId, customerId: decoded.customerId })
              : error
          ),
        )
      return rows[0]!
    },
  )
  const createOrder = Effect.fn("SalesStore.createOrder")(function* (decoded: CreateOrderCommand) {
    return yield* database.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({
        tenantId: decoded.tenantId,
        customerId: decoded.customerId,
        quotationId: decoded.quotationId,
        total: deriveTotal(decoded.lines),
      }).returning(orderSelection)
      const lines = await tx.insert(orderLines).values(
        decoded.lines.map((line) => ({
          tenantId: decoded.tenantId,
          orderId: order!.id,
          itemId: line.itemId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        })),
      ).returning(orderLineSelection)
      return toSalesOrder(order!, lines)
    }, "sales.order.create").pipe(Effect.mapError((error) => {
      if (isDatabaseConstraint(error, "orders_tenant_customer_fkey", "23503")) {
        return new CustomerNotFound({ tenantId: decoded.tenantId, customerId: decoded.customerId })
      }
      if (
        decoded.quotationId !== undefined &&
        isDatabaseConstraint(error, "orders_tenant_quotation_fkey", "23503")
      ) {
        return new QuotationNotFound({
          tenantId: decoded.tenantId,
          quotationId: decoded.quotationId,
        })
      }
      return error
    }))
  })
  const confirmOrder = Effect.fn("SalesStore.confirmOrder")(
    function* (
      decoded: ConfirmOrderCommand,
      append: (
        order: SalesOrder,
      ) => Effect.Effect<unknown, EventIdempotencyConflict | DatabaseFailure | Schema.SchemaError>,
    ) {
      return yield* database.withTransaction(
        Effect.gen(function* () {
          const mutation = yield* database.transaction(async (tx) => {
            const [row] = await tx.select({
              ...orderSelection,
              confirmationIdempotencyKey: orders.confirmationIdempotencyKey,
            }).from(orders).where(
              and(eq(orders.tenantId, decoded.tenantId), eq(orders.id, decoded.orderId)),
            ).for("update")
            if (row === undefined) return { _tag: "not-found" as const }
            const lines = await tx.select(orderLineSelection).from(orderLines).where(
              and(eq(orderLines.tenantId, decoded.tenantId), eq(orderLines.orderId, row.id)),
            )
            const current = toSalesOrder(row, lines)
            if (row.status === "confirmed") {
              return row.confirmationIdempotencyKey === decoded.idempotencyKey
                ? { _tag: "existing" as const, order: current }
                : { _tag: "idempotency-conflict" as const }
            }
            if (row.status !== "draft") {
              return { _tag: "invalid-state" as const, status: row.status }
            }
            const confirmedAt = now()
            const [confirmed] = await tx.update(orders).set({
              status: "confirmed",
              confirmationIdempotencyKey: decoded.idempotencyKey,
              confirmedAt,
              updatedAt: confirmedAt,
            }).where(
              and(
                eq(orders.tenantId, decoded.tenantId),
                eq(orders.id, decoded.orderId),
                eq(orders.status, "draft"),
              ),
            ).returning(orderSelection)
            return { _tag: "confirmed" as const, order: toSalesOrder(confirmed!, lines) }
          }, "sales.order.confirm")
          if (mutation._tag === "confirmed") yield* append(mutation.order)
          return mutation
        }),
        "sales.order.confirm.atomic",
      ).pipe(
        Effect.mapError((error) =>
          isDatabaseConstraint(error, "orders_tenant_confirmation_idempotency_key")
            ? new SalesOrderConfirmationIdempotencyConflict({
              tenantId: decoded.tenantId,
              orderId: decoded.orderId,
              idempotencyKey: decoded.idempotencyKey,
            })
            : error
        ),
      )
    },
  )
  const cancelConfirmedOrder = Effect.fn("SalesStore.cancelConfirmedOrder")(
    function* (decoded: CancelConfirmedOrderCommand) {
      return yield* database.transaction(async (tx) => {
        const [row] = await tx.select(orderSelection).from(orders).where(
          and(eq(orders.tenantId, decoded.tenantId), eq(orders.id, decoded.orderId)),
        ).for("update")
        if (row === undefined) return { _tag: "not-found" as const }
        const lines = await tx.select(orderLineSelection).from(orderLines).where(
          and(eq(orderLines.tenantId, decoded.tenantId), eq(orderLines.orderId, row.id)),
        )
        if (row.status === "cancelled") return toSalesOrder(row, lines)
        if (row.status !== "confirmed") {
          return { _tag: "invalid-state" as const, status: row.status }
        }
        const [cancelled] = await tx.update(orders).set({ status: "cancelled", updatedAt: now() })
          .where(
            and(
              eq(orders.tenantId, decoded.tenantId),
              eq(orders.id, decoded.orderId),
              eq(orders.status, "confirmed"),
            ),
          ).returning(orderSelection)
        return toSalesOrder(cancelled!, lines)
      }, "sales.order.cancel")
    },
  )
  const getConfirmedOrderTotal = Effect.fn("SalesStore.getConfirmedOrderTotal")(
    function* (decoded: GetConfirmedOrderTotalCommand) {
      const rows = yield* database.query(
        (db) =>
          db.select({ status: orders.status, confirmedAt: orders.confirmedAt, total: orders.total })
            .from(orders).where(
              and(eq(orders.tenantId, decoded.tenantId), eq(orders.id, decoded.orderId)),
            ).for("update"),
        "sales.order.confirmed_total.lookup",
      )
      const row = rows[0]
      return row === undefined ? { _tag: "not-found" as const } : {
        _tag: "found" as const,
        total: row.total,
        status: row.status,
        confirmedAt: row.confirmedAt?.toISOString() ?? null,
      }
    },
  )
  return {
    createCustomer,
    createQuotation,
    createOrder,
    confirmOrder,
    cancelConfirmedOrder,
    getConfirmedOrderTotal,
  } satisfies SalesStore
})()
