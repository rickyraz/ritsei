import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { CreateUserAccountInput, UpdateUserAccountInput, UserAccountService } from "./contract.ts"
import type { UserAccountStore } from "./store.ts"
import { normalizeEmail } from "./store.ts"

export const makeUserAccountServiceFromStore = <R>(
  store: Effect.Effect<UserAccountStore, never, R>,
): Effect.Effect<UserAccountService, never, R> =>
  Effect.gen(function* () {
    const accountStore = yield* store
    const create = Effect.fn("UserAccountService.create")(function* (input: unknown) {
      const decoded = yield* Schema.decodeUnknownEffect(CreateUserAccountInput)(input)
      return yield* accountStore.create(normalizeEmail(decoded.email))
    })
    const getById = Effect.fn("UserAccountService.getById")((id: string) =>
      accountStore.getById(id)
    )
    const getByIds = Effect.fn("UserAccountService.getByIds")((ids: readonly string[]) =>
      accountStore.getByIds(ids)
    )
    const getAuthenticationState = Effect.fn("UserAccountService.getAuthenticationState")((
      id: string,
    ) => accountStore.getAuthenticationState(id))
    const list = Effect.fn("UserAccountService.list")(() => accountStore.list())
    const update = Effect.fn("UserAccountService.update")(function* (input: unknown) {
      const decoded = yield* Schema.decodeUnknownEffect(UpdateUserAccountInput)(input)
      return yield* accountStore.update(decoded.id, normalizeEmail(decoded.email))
    })
    const disable = Effect.fn("UserAccountService.disable")((id: string) =>
      accountStore.disable(id)
    )
    const enable = Effect.fn("UserAccountService.enable")((id: string) => accountStore.enable(id))
    const remove = Effect.fn("UserAccountService.remove")((id: string) => accountStore.remove(id))
    return {
      create,
      getById,
      getByIds,
      getAuthenticationState,
      list,
      update,
      disable,
      enable,
      remove,
    } satisfies UserAccountService
  })
