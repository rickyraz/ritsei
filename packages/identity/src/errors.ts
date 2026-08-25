import * as Schema from "effect/Schema"

const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))

export class IdentityAuthorizationDenied extends Schema.TaggedError<IdentityAuthorizationDenied>()(
  "IdentityAuthorizationDenied",
  { tenantId: NonEmptyString, capability: NonEmptyString },
) {}

export class UserAccountAlreadyExists
  extends Schema.TaggedError<UserAccountAlreadyExists>()("UserAccountAlreadyExists", {
    email: Schema.String,
  }) {}

export class UserAccountNotFound
  extends Schema.TaggedError<UserAccountNotFound>()("UserAccountNotFound", {
    id: Schema.String,
  }) {}
