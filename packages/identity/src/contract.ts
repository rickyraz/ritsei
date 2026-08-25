import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

export const UserAccountStatus = Schema.Literals(["active", "disabled"])
export type UserAccountStatus = Schema.Schema.Type<typeof UserAccountStatus>

export const CreateUserAccountInput = Schema.Struct({
  email: Schema.String.check(Schema.isPattern(/\S/)),
})

export const UpdateUserAccountInput = Schema.Struct({
  id: Schema.String,
  email: Schema.String.check(Schema.isPattern(/\S/)),
})

export const UserAccount = Schema.Struct({
  id: Schema.String,
  email: Schema.String,
  status: UserAccountStatus,
})

export const UserAccountAuthenticationState = Schema.Struct({
  id: Schema.String,
  status: UserAccountStatus,
  sessionInvalidatedAt: Schema.NullOr(Schema.String),
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
    | import("./errors.ts").UserAccountAlreadyExists
    | import("../../kernel/mod.ts").DatabaseFailure
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
