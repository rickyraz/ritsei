import * as Schema from "effect/Schema"

export class UserAccountAlreadyExists
  extends Schema.TaggedError<UserAccountAlreadyExists>()("UserAccountAlreadyExists", {
    email: Schema.String,
  }) {}

export class UserAccountNotFound
  extends Schema.TaggedError<UserAccountNotFound>()("UserAccountNotFound", {
    id: Schema.String,
  }) {}
