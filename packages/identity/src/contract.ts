import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { EventEnvelope } from "../../messaging/mod.ts"
import { IdentityPrincipal } from "./events.ts"
import type { IdentityAuthorizationDenied, UserAccountAlreadyExists } from "./errors.ts"

export const UserAccountStatus = Schema.Literals(["active", "disabled"])
export type UserAccountStatus = Schema.Schema.Type<typeof UserAccountStatus>

const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))
const LowercaseTrimmedNonEmptyString = Schema.String.check(Schema.makeFilter(
  (value) => /\S/.test(value) && value === value.trim() && value === value.toLowerCase(),
  { expected: "a trimmed lowercase nonblank string" },
))
const InstantString = EventEnvelope.fields.occurredAt
const Uuid = Schema.String.check(Schema.isUUID())

export const CreateUserAccountInput = Schema.Struct({
  email: NonEmptyString,
})

export const CreateUserAccountForTenantInput = Schema.Struct({
  principal: IdentityPrincipal,
  tenantId: Uuid,
  email: NonEmptyString,
})

export const UpdateUserAccountInput = Schema.Struct({
  id: Uuid,
  email: Schema.String.check(Schema.isPattern(/\S/)),
})

export const UserAccount = Schema.Struct({
  id: Uuid,
  email: LowercaseTrimmedNonEmptyString,
  status: UserAccountStatus,
})

export const UserAccountAuthenticationState = Schema.Struct({
  id: Uuid,
  status: UserAccountStatus,
  sessionInvalidatedAt: Schema.NullOr(InstantString),
})

export type UserAccount = Schema.Schema.Type<typeof UserAccount>
export type UserAccountAuthenticationState = Schema.Schema.Type<
  typeof UserAccountAuthenticationState
>

export interface UserAccountService {
  readonly create: (
    input: unknown,
  ) => Effect.Effect<
    UserAccount,
    | import("effect/Schema").SchemaError
    | UserAccountAlreadyExists
    | import("../../kernel/mod.ts").DatabaseFailure
  >
  readonly createForTenant: (
    input: unknown,
  ) => Effect.Effect<
    UserAccount,
    | IdentityAuthorizationDenied
    | import("effect/Schema").SchemaError
    | UserAccountAlreadyExists
    | import("../../kernel/mod.ts").DatabaseFailure
    | import("../../messaging/mod.ts").EventIdempotencyConflict
  >
  readonly getById: (
    id: string,
  ) => Effect.Effect<
    UserAccount,
    import("./errors.ts").UserAccountNotFound | import("../../kernel/mod.ts").DatabaseFailure
  >
  readonly getByIds: (
    ids: readonly string[],
  ) => Effect.Effect<readonly UserAccount[], import("../../kernel/mod.ts").DatabaseFailure>
  readonly getAuthenticationState: (
    id: string,
  ) => Effect.Effect<
    UserAccountAuthenticationState,
    import("./errors.ts").UserAccountNotFound | import("../../kernel/mod.ts").DatabaseFailure
  >
  readonly list: () => Effect.Effect<
    readonly UserAccount[],
    import("../../kernel/mod.ts").DatabaseFailure
  >
  readonly update: (
    input: unknown,
  ) => Effect.Effect<
    UserAccount,
    | import("./errors.ts").UserAccountAlreadyExists
    | import("./errors.ts").UserAccountNotFound
    | import("effect/Schema").SchemaError
    | import("../../kernel/mod.ts").DatabaseFailure
  >
  readonly disable: (
    id: string,
  ) => Effect.Effect<
    UserAccount,
    import("./errors.ts").UserAccountNotFound | import("../../kernel/mod.ts").DatabaseFailure
  >
  readonly enable: (
    id: string,
  ) => Effect.Effect<
    UserAccount,
    import("./errors.ts").UserAccountNotFound | import("../../kernel/mod.ts").DatabaseFailure
  >
  readonly remove: (
    id: string,
  ) => Effect.Effect<
    void,
    import("./errors.ts").UserAccountNotFound | import("../../kernel/mod.ts").DatabaseFailure
  >
}

export const UserAccountService = Context.Service<UserAccountService>(
  "RITSEI/UserAccountService",
)
