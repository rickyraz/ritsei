import * as Schema from "effect/Schema"

const Uuid = Schema.String.check(Schema.isUUID())
const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
const ProviderFailureReason = Schema.Literals(["timeout", "unavailable", "rejected"])

export class ExternalActionNotAllowlisted
  extends Schema.TaggedError<ExternalActionNotAllowlisted>()("ExternalActionNotAllowlisted", {
    tenantId: Uuid,
    actionId: NonEmptyString,
  }) {}

export class ExternalAuthorizationDenied
  extends Schema.TaggedError<ExternalAuthorizationDenied>()("ExternalAuthorizationDenied", {
    tenantId: Uuid,
    requiredScope: NonEmptyString,
  }) {}

export class ExternalIdempotencyConflict
  extends Schema.TaggedError<ExternalIdempotencyConflict>()("ExternalIdempotencyConflict", {
    tenantId: Uuid,
    idempotencyKey: NonEmptyString,
  }) {}

export class ExternalPayloadInvalid extends Schema.TaggedError<ExternalPayloadInvalid>()(
  "ExternalPayloadInvalid",
  {
    boundary: NonEmptyString,
    identifier: NonEmptyString,
  },
) {}

export class ExternalProviderFailure extends Schema.TaggedError<ExternalProviderFailure>()(
  "ExternalProviderFailure",
  {
    tenantId: Uuid,
    actionId: NonEmptyString,
    operationId: NonEmptyString,
    reason: ProviderFailureReason,
    retryable: Schema.Boolean,
  },
) {}

export class ExternalUnknownOutcome extends Schema.TaggedError<ExternalUnknownOutcome>()(
  "ExternalUnknownOutcome",
  {
    tenantId: Uuid,
    actionId: NonEmptyString,
    idempotencyKey: NonEmptyString,
  },
) {}
