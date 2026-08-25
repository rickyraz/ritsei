import * as Schema from "effect/Schema"

const Uuid = Schema.String.check(Schema.isUUID())
const LowercaseTrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim() && value === value.toLowerCase(),
  { expected: "a trimmed lowercase nonblank string" },
))
const TrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim(),
  { expected: "a trimmed nonblank string" },
))

export class IdentityAuthorizationDenied extends Schema.TaggedError<IdentityAuthorizationDenied>()(
  "IdentityAuthorizationDenied",
  { tenantId: Uuid, capability: TrimmedNonEmptyString },
) {}

export class UserAccountAlreadyExists
  extends Schema.TaggedError<UserAccountAlreadyExists>()("UserAccountAlreadyExists", {
    email: LowercaseTrimmedNonEmptyString,
  }) {}

export class UserAccountNotFound
  extends Schema.TaggedError<UserAccountNotFound>()("UserAccountNotFound", {
    id: Uuid,
  }) {}
