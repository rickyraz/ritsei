import { assert, describe, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"

import { AuthorizationDenied, makeAuthorizationTestLayer } from "../../authorization/mod.ts"
import {
  EventEnvelopeShape,
  makeMessagingTestLayer,
  MessagingService,
} from "../../messaging/mod.ts"
import {
  ConfirmOrderInput,
  CreateOrderInput,
  CreateQuotationInput,
  Customer,
  CustomerAlreadyExists,
  makeSalesTestLayer,
  Quotation,
  SalesOrder,
  SalesOrderConfirmationIdempotencyConflict,
  SalesOrderConfirmedEvent,
  SalesOrderInvalidState,
  SalesOrderLine,
  SalesOrderNotFound,
  SalesService,
} from "../mod.ts"

const principal = { userAccountId: "seller", sessionId: "session" }
const tenantId = "00000000-0000-4000-8000-000000000001"
const confirmationMetadata = {
  commandId: "sales-confirm-command",
  correlationId: "sales-confirm-correlation",
  causationId: null,
} as const
const capabilities = [
  "sales.customer.create",
  "sales.quotation.create",
  "sales.order.create",
  "sales.order.confirm",
  "sales.order.read",
  "sales.order.cancel",
] as const

const authorizationLayer = makeAuthorizationTestLayer(
  [tenantId, "00000000-0000-4000-8000-000000000002"].flatMap((tenantId) =>
    capabilities.map((capability) => ({
      userAccountId: principal.userAccountId,
      tenantId,
      capability,
    }))
  ),
)

const withSales = <A, E>(
  program: Effect.Effect<A, E, SalesService>,
  onPublished?: (event: EventEnvelopeShape) => void,
) => {
  const messaging = Layer.effect(
    MessagingService,
    Effect.gen(function* () {
      const base = yield* MessagingService
      if (onPublished === undefined) return base
      return {
        ...base,
        append: (input: unknown) =>
          base.append(input).pipe(Effect.tap((event) => Effect.sync(() => onPublished(event)))),
      }
    }),
  ).pipe(Layer.provide(makeMessagingTestLayer()))
  return Effect.provide(
    program,
    makeSalesTestLayer().pipe(
      Layer.provide(Layer.merge(authorizationLayer, messaging)),
    ),
  )
}

describe("sales contract", () => {
  it.effect("validates sales order lifecycle IDs as UUIDs", () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        Schema.decodeUnknownEffect(ConfirmOrderInput)({
          principal,
          tenantId,
          orderId: "not-a-uuid",
          commandId: "command-1",
          correlationId: "correlation-1",
          causationId: null,
          idempotencyKey: "confirmation-1",
        }),
      )
      assert.strictEqual(error._tag, "SchemaError")

      const invalidTenant = yield* Effect.flip(
        Schema.decodeUnknownEffect(ConfirmOrderInput)({
          principal,
          tenantId: "not-a-uuid",
          orderId: "00000000-0000-4000-8000-000000000031",
          commandId: "command-1",
          correlationId: "correlation-1",
          causationId: null,
          idempotencyKey: "confirmation-1",
        }),
      )
      assert.strictEqual(invalidTenant._tag, "SchemaError")
    }))

  it.effect("validates sales creation relationship IDs as UUIDs", () =>
    Effect.gen(function* () {
      const invalidQuotationCustomer = yield* Effect.flip(
        Schema.decodeUnknownEffect(CreateQuotationInput)({
          principal,
          tenantId,
          customerId: "not-a-uuid",
          total: "10.00",
        }),
      )
      assert.strictEqual(invalidQuotationCustomer._tag, "SchemaError")

      const invalidOrderQuotation = yield* Effect.flip(
        Schema.decodeUnknownEffect(CreateOrderInput)({
          principal,
          tenantId,
          customerId: "00000000-0000-4000-8000-000000000032",
          quotationId: "not-a-uuid",
          lines: [{
            itemId: "00000000-0000-4000-8000-000000000041",
            quantity: "1",
            unitPrice: "10.00",
          }],
        }),
      )
      assert.strictEqual(invalidOrderQuotation._tag, "SchemaError")
    }))

  it.effect("bounds order-line quantities to PostgreSQL bigint", () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        Schema.decodeUnknownEffect(SalesOrderLine)({
          itemId: "00000000-0000-4000-8000-000000000041",
          quantity: "9223372036854775808",
          unitPrice: "10.00",
        }),
      )
      assert.strictEqual(error._tag, "SchemaError")
    }))

  it.effect("publishes one confirmation event across idempotent replay", () => {
    const published: EventEnvelopeShape[] = []
    return withSales(
      Effect.gen(function* () {
        const sales = yield* SalesService
        const customer = yield* sales.createCustomer({
          principal,
          tenantId,
          name: "ACME",
          email: "event@acme.test",
        })
        yield* Schema.decodeUnknownEffect(Customer)(customer)
        const order = yield* sales.createOrder({
          principal,
          tenantId,
          customerId: customer.id,
          lines: [{
            itemId: "00000000-0000-4000-8000-000000000041",
            quantity: "2",
            unitPrice: "10.00",
          }],
        })
        const input = {
          principal,
          tenantId,
          orderId: order.id,
          ...confirmationMetadata,
          idempotencyKey: "confirm-event",
        }
        const confirmed = yield* sales.confirmOrder(input)
        yield* Schema.decodeUnknownEffect(SalesOrder)(confirmed)
        assert.strictEqual(published.length, 1)
        assert.strictEqual(published[0].eventType, SalesOrderConfirmedEvent.id)
        assert.strictEqual(published[0].tenantId, tenantId)
        assert.strictEqual(published[0].aggregateId, confirmed.id)
        assert.strictEqual(published[0].commandId, confirmationMetadata.commandId)
        assert.deepStrictEqual(published[0].payload, {
          orderId: confirmed.id,
          total: confirmed.total,
        })
        assert.deepStrictEqual(yield* sales.confirmOrder(input), confirmed)
        assert.strictEqual(published.length, 1)
      }),
      (event) => published.push(event),
    )
  })

  it.effect("exposes confirmed cancellation only as a coordinator participant", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      assert.isFalse("cancelOrder" in sales)
      assert.isTrue("cancelConfirmedOrder" in sales)
    })))

  it.effect("creates customer, quotation, and order", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      const customer = yield* sales.createCustomer({
        principal,
        tenantId,
        name: "ACME",
        email: " SALES@ACME.TEST ",
      })
      const quotation = yield* sales.createQuotation({
        principal,
        tenantId,
        customerId: customer.id,
        total: "1250.00",
      })
      const order = yield* sales.createOrder({
        principal,
        tenantId,
        customerId: customer.id,
        quotationId: quotation.id,
        lines: [{
          itemId: "00000000-0000-4000-8000-000000000041",
          quantity: "10",
          unitPrice: "125.00",
        }],
      })

      yield* Schema.decodeUnknownEffect(Quotation)(quotation)
      assert.strictEqual(customer.email, "sales@acme.test")
      assert.strictEqual(quotation.status, "draft")
      assert.strictEqual(order.quotationId, quotation.id)
      assert.instanceOf(
        yield* Effect.flip(
          sales.getConfirmedOrderTotal({ principal, tenantId, orderId: order.id }),
        ),
        SalesOrderInvalidState,
      )

      const confirmed = yield* sales.confirmOrder({
        principal,
        tenantId,
        orderId: order.id,
        ...confirmationMetadata,
        idempotencyKey: "confirm-1",
      })
      const repeated = yield* sales.confirmOrder({
        principal,
        tenantId,
        orderId: order.id,
        ...confirmationMetadata,
        idempotencyKey: "confirm-1",
      })
      assert.strictEqual(confirmed.status, "confirmed")
      assert.strictEqual(confirmed.id, repeated.id)
      assert.isNotNull(confirmed.confirmedAt)
      assert.strictEqual(
        yield* sales.getConfirmedOrderTotal({ principal, tenantId, orderId: confirmed.id }),
        "1250.00",
      )
      assert.instanceOf(
        yield* Effect.flip(sales.getConfirmedOrderTotal({
          principal,
          tenantId: "00000000-0000-4000-8000-000000000002",
          orderId: confirmed.id,
        })),
        SalesOrderNotFound,
      )
    })))

  it.effect("rejects a different confirmation key after confirmation", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      const customer = yield* sales.createCustomer({
        principal,
        tenantId,
        name: "ACME",
        email: "confirm-key@acme.test",
      })
      const order = yield* sales.createOrder({
        principal,
        tenantId,
        customerId: customer.id,
        lines: [{
          itemId: "00000000-0000-4000-8000-000000000041",
          quantity: "1",
          unitPrice: "10.00",
        }],
      })
      yield* sales.confirmOrder({
        principal,
        tenantId,
        orderId: order.id,
        ...confirmationMetadata,
        idempotencyKey: "confirm-a",
      })
      assert.instanceOf(
        yield* Effect.flip(sales.confirmOrder({
          principal,
          tenantId,
          orderId: order.id,
          ...confirmationMetadata,
          idempotencyKey: "confirm-b",
        })),
        SalesOrderConfirmationIdempotencyConflict,
      )
    })))

  it.effect("denies sales capability in an ungranted tenant", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      assert.instanceOf(
        yield* Effect.flip(sales.createCustomer({
          principal,
          tenantId: "00000000-0000-4000-8000-000000000003",
          name: "Untrusted Tenant Customer",
          email: "untrusted@example.test",
        })),
        AuthorizationDenied,
      )
    })))

  it.effect("denies sales cancellation in an ungranted tenant", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      assert.instanceOf(
        yield* Effect.flip(sales.cancelConfirmedOrder({
          principal,
          tenantId: "00000000-0000-4000-8000-000000000003",
          orderId: "00000000-0000-4000-8000-000000000099",
        })),
        AuthorizationDenied,
      )
    })))

  it.effect("denies sales confirmation in an ungranted tenant", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      assert.instanceOf(
        yield* Effect.flip(sales.confirmOrder({
          principal,
          tenantId: "00000000-0000-4000-8000-000000000003",
          orderId: "00000000-0000-4000-8000-000000000099",
          ...confirmationMetadata,
          idempotencyKey: "ungranted-confirmation",
        })),
        AuthorizationDenied,
      )
    })))

  it.effect("denies confirmed-order total reads without capability", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      assert.instanceOf(
        yield* Effect.flip(sales.getConfirmedOrderTotal({
          principal,
          tenantId: "00000000-0000-4000-8000-000000000003",
          orderId: "00000000-0000-4000-8000-000000000099",
        })),
        AuthorizationDenied,
      )
    })))

  it.effect("enforces tenant email uniqueness", () =>
    withSales(Effect.gen(function* () {
      const sales = yield* SalesService
      const command = { principal, tenantId, name: "ACME", email: "same@acme.test" }
      const customer = yield* sales.createCustomer(command)
      assert.instanceOf(yield* Effect.flip(sales.createCustomer(command)), CustomerAlreadyExists)
      const otherCustomer = yield* sales.createCustomer({
        ...command,
        tenantId: "00000000-0000-4000-8000-000000000002",
      })
      assert.notStrictEqual(otherCustomer.id, customer.id)
      assert.strictEqual(otherCustomer.email, customer.email)
    })))
})
