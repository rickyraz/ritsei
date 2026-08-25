import * as Schema from "effect/Schema"

const TrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim(),
  { expected: "a trimmed nonblank string" },
))

export class CustomerAlreadyExists
  extends Schema.TaggedError<CustomerAlreadyExists>()("CustomerAlreadyExists", {
    tenantId: Schema.String,
    email: Schema.String,
  }) {}
export class CustomerNotFound extends Schema.TaggedError<CustomerNotFound>()("CustomerNotFound", {
  tenantId: Schema.String,
  customerId: Schema.String,
}) {}
export class QuotationNotFound
  extends Schema.TaggedError<QuotationNotFound>()("QuotationNotFound", {
    tenantId: Schema.String,
    quotationId: Schema.String,
  }) {}
export class SalesOrderNotFound
  extends Schema.TaggedError<SalesOrderNotFound>()("SalesOrderNotFound", {
    tenantId: Schema.String,
    orderId: Schema.String,
  }) {}
export class SalesOrderInvalidState
  extends Schema.TaggedError<SalesOrderInvalidState>()("SalesOrderInvalidState", {
    tenantId: Schema.String,
    orderId: Schema.String,
    status: Schema.Literals(["draft", "confirmed", "cancelled"]),
  }) {}
export class SalesOrderConfirmationIdempotencyConflict
  extends Schema.TaggedError<SalesOrderConfirmationIdempotencyConflict>()(
    "SalesOrderConfirmationIdempotencyConflict",
    { tenantId: Schema.String, orderId: Schema.String, idempotencyKey: TrimmedNonEmptyString },
  ) {}
