import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import {
  UpdateUserAccountInput,
  UserAccount,
  userAccountRoutes,
} from "../../shared/contracts/generated/identity.ts"
import { RequestFailure, requestJson } from "../../shared/api.ts"

const AccountList = Schema.Array(UserAccount).check(Schema.isMaxLength(200))
export const listAccounts = Effect.fn("Frontend.Identity.listAccounts")(
  function* () {
    const body = yield* requestJson(userAccountRoutes.list)
    return yield* Schema.decodeUnknownEffect(
      Schema.fromJsonString(AccountList),
    )(body).pipe(
      Effect.mapError(() => new RequestFailure({ kind: "invalid-response" })),
    )
  },
)

export const updateAccount = Effect.fn("Frontend.Identity.updateAccount")(
  function* (input: unknown) {
    const decoded = yield* Schema.decodeUnknownEffect(UpdateUserAccountInput)(
      input,
    ).pipe(
      Effect.mapError(() => new RequestFailure({ kind: "validation" })),
    )
    const body = yield* requestJson(
      userAccountRoutes.update.replace(":id", encodeURIComponent(decoded.id)),
      "PATCH",
      { email: decoded.email },
    )
    const account = yield* Schema.decodeUnknownEffect(
      Schema.fromJsonString(UserAccount),
    )(body).pipe(
      Effect.mapError(() => new RequestFailure({ kind: "unknown-outcome" })),
    )
    if (account.id !== decoded.id) {
      return yield* Effect.fail(
        new RequestFailure({ kind: "unknown-outcome" }),
      )
    }
    return account
  },
)
