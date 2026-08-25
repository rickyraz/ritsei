import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { Principal } from "../../auth/mod.ts"
import { FinancialMajorAmount } from "../../kernel/mod.ts"
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
const Uuid = Schema.String.check(Schema.isUUID())
const Money = FinancialMajorAmount
const Quantity = Schema.String.check(Schema.isPattern(/^[1-9]\d*$/))
const InstantString = EventEnvelope.fields.occurredAt

export const Customer = Schema.Struct({
  id: Uuid,
  tenantId: Uuid,
  name: Schema.String,
  email: Schema.String,
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
  lines: Schema.Array(SalesOrderLine),
})

export type Customer = Schema.Schema.Type<typeof Customer>
export type Quotation = Schema.Schema.Type<typeof Quotation>
export type SalesOrderLine = Schema.Schema.Type<typeof SalesOrderLine>
export type SalesOrder = Schema.Schema.Type<typeof SalesOrder>

const ScopedInput = { principal: Principal, tenantId: Schema.String }
export const CreateCustomerInput = Schema.Struct({
  ...ScopedInput,
  name: Schema.String,
  email: Schema.String,
})
export const CreateQuotationInput = Schema.Struct({
  ...ScopedInput,
  customerId: Schema.String,
  total: Money,
})
export const CreateOrderInput = Schema.Struct({
  ...ScopedInput,
  customerId: Schema.String,
  quotationId: Schema.optionalKey(Schema.String),
  lines: Schema.Array(SalesOrderLine).check(Schema.isMinLength(1)),
})
export const ConfirmOrderInput = Schema.Struct({
  ...ScopedInput,
  orderId: Schema.String,
  commandId: NonEmptyString,
  correlationId: NonEmptyString,
  causationId: Schema.NullOr(NonEmptyString).pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(null)),
  ),
  idempotencyKey: NonEmptyString,
})
export const CancelConfirmedOrderInput = Schema.Struct({ ...ScopedInput, orderId: Schema.String })
export const GetConfirmedOrderTotalInput = Schema.Struct({ ...ScopedInput, orderId: Schema.String })

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
