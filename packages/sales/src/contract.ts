import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { Principal } from "../../auth/mod.ts"
import { FinancialMajorAmount, requireExactMajorToMinor } from "../../kernel/mod.ts"
import { EventEnvelope, EventIdempotencyConflict } from "../../messaging/mod.ts"
import {
  CustomerAlreadyExists,
  CustomerNotFound,
  QuotationNotFound,
  SalesOrderConfirmationIdempotencyConflict,
  SalesOrderInvalidState,
  SalesOrderNotFound,
} from "./errors.ts"

const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
const TrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim(),
  { expected: "a trimmed nonblank string" },
))
const LowercaseTrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim() && value === value.toLowerCase(),
  { expected: "a trimmed lowercase nonblank string" },
))
const Uuid = Schema.String.check(Schema.isUUID())
const Money = FinancialMajorAmount
const Quantity = Schema.String.check(
  Schema.makeFilter(
    (value) => /^[1-9]\d*$/.test(value) && BigInt(value) <= 9_223_372_036_854_775_807n,
    { expected: "a positive PostgreSQL bigint quantity" },
  ),
)
const InstantString = EventEnvelope.fields.occurredAt

export const Customer = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  name: TrimmedNonEmptyString,
  email: LowercaseTrimmedNonEmptyString,
})
export const Quotation = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  customerId: Uuid,
  status: Schema.Literals(["draft", "sent", "accepted", "rejected", "expired"]),
  total: Money,
})
export const SalesOrderLine = Schema.Struct({
  itemId: Uuid,
  quantity: Quantity,
  unitPrice: Money,
})
export const SalesOrder = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  customerId: Uuid,
  quotationId: Schema.NullOr(Uuid),
  status: Schema.Literals(["draft", "confirmed", "cancelled"]),
  confirmedAt: Schema.NullOr(InstantString),
  total: Money,
  lines: Schema.Array(SalesOrderLine).check(Schema.isMinLength(1)),
}).check(Schema.makeFilter(
  (order) =>
    (order.status === "draft" && order.confirmedAt === null) ||
    (order.status !== "draft" && order.confirmedAt !== null),
  { expected: "sales order confirmation metadata consistent with status" },
)).check(Schema.makeFilter(
  (order) => {
    const lineTotal = order.lines.reduce(
      (total, line) => total + requireExactMajorToMinor(line.unitPrice, 2) * BigInt(line.quantity),
      0n,
    )
    return lineTotal === requireExactMajorToMinor(order.total, 2)
  },
  { expected: "sales order total must equal its line totals" },
))

export type Customer = Schema.Schema.Type<typeof Customer>
export type Quotation = Schema.Schema.Type<typeof Quotation>
export type SalesOrderLine = Schema.Schema.Type<typeof SalesOrderLine>
export type SalesOrder = Schema.Schema.Type<typeof SalesOrder>

const ScopedInput = { principal: Principal, tenantId: Uuid }
export const CreateCustomerInput = Schema.Struct({
  ...ScopedInput,
  name: NonEmptyString,
  email: NonEmptyString,
})
export const CreateQuotationInput = Schema.Struct({
  ...ScopedInput,
  customerId: Uuid,
  total: Money,
})
export const CreateOrderInput = Schema.Struct({
  ...ScopedInput,
  customerId: Uuid,
  quotationId: Schema.optionalKey(Uuid),
  lines: Schema.Array(SalesOrderLine).check(Schema.isMinLength(1)),
})
export const ConfirmOrderInput = Schema.Struct({
  ...ScopedInput,
  orderId: Uuid,
  commandId: NonEmptyString,
  correlationId: NonEmptyString,
  causationId: Schema.NullOr(NonEmptyString).pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(null)),
  ),
  idempotencyKey: NonEmptyString,
})
export const CancelConfirmedOrderInput = Schema.Struct({ ...ScopedInput, orderId: Uuid })
export const GetConfirmedOrderTotalInput = Schema.Struct({ ...ScopedInput, orderId: Uuid })

export type CreateCustomerCommand = Schema.Schema.Type<typeof CreateCustomerInput>
export type CreateQuotationCommand = Schema.Schema.Type<typeof CreateQuotationInput>
export type CreateOrderCommand = Schema.Schema.Type<typeof CreateOrderInput>
export type ConfirmOrderCommand = Schema.Schema.Type<typeof ConfirmOrderInput>
export type CancelConfirmedOrderCommand = Schema.Schema.Type<typeof CancelConfirmedOrderInput>
export type GetConfirmedOrderTotalCommand = Schema.Schema.Type<typeof GetConfirmedOrderTotalInput>

type CommonFailure =
  | import("../../authorization/mod.ts").AuthorizationDenied
  | import("../../kernel/mod.ts").DatabaseFailure
  | Schema.SchemaError
export interface SalesService {
  readonly createCustomer: (
    input: unknown,
  ) => Effect.Effect<Customer, CustomerAlreadyExists | CommonFailure>
  readonly createQuotation: (
    input: unknown,
  ) => Effect.Effect<Quotation, CustomerNotFound | CommonFailure>
  readonly createOrder: (
    input: unknown,
  ) => Effect.Effect<SalesOrder, CustomerNotFound | QuotationNotFound | CommonFailure>
  readonly confirmOrder: (
    input: unknown,
  ) => Effect.Effect<
    SalesOrder,
    | EventIdempotencyConflict
    | SalesOrderConfirmationIdempotencyConflict
    | SalesOrderInvalidState
    | SalesOrderNotFound
    | CommonFailure
  >
  readonly cancelConfirmedOrder: (
    input: unknown,
  ) => Effect.Effect<SalesOrder, SalesOrderInvalidState | SalesOrderNotFound | CommonFailure>
  readonly getConfirmedOrderTotal: (
    input: unknown,
  ) => Effect.Effect<string, SalesOrderInvalidState | SalesOrderNotFound | CommonFailure>
}

export {
  CustomerAlreadyExists,
  CustomerNotFound,
  QuotationNotFound,
  SalesOrderConfirmationIdempotencyConflict,
  SalesOrderInvalidState,
  SalesOrderNotFound,
} from "./errors.ts"

export const SalesService = Context.Service<SalesService>("RITSEI/SalesService")
