import * as Effect from "effect/Effect"

import { uuidv7 } from "../../kernel/mod.ts"
import type { UserAccount, UserAccountAuthenticationState } from "./contract.ts"
import { UserAccountAlreadyExists, UserAccountNotFound } from "./errors.ts"
import type { UserAccountStore } from "./store.ts"

export const makeUserAccountMemoryStore = (): UserAccountStore => {
  const stored = new Map<string, UserAccount>()
  const sessionInvalidatedAt = new Map<string, string | null>()
  const emails = new Set<string>()
  const find = Effect.fn("UserAccountStore.memory.find")(function* (id: string) {
    const userAccount = stored.get(id)
    if (userAccount === undefined) return yield* Effect.fail(new UserAccountNotFound({ id }))
    return userAccount
  })

  const create = Effect.fn("UserAccountStore.memory.create")(function* (email: string) {
    if (emails.has(email)) return yield* Effect.fail(new UserAccountAlreadyExists({ email }))
    const userAccount = { id: uuidv7(), email, status: "active" as const }
    emails.add(email)
    stored.set(userAccount.id, userAccount)
    sessionInvalidatedAt.set(userAccount.id, null)
    return userAccount
  })

  const getByIds = Effect.fn("UserAccountStore.memory.getByIds")((ids: readonly string[]) =>
    Effect.succeed(ids.flatMap((id) => {
      const userAccount = stored.get(id)
      return userAccount === undefined ? [] : [userAccount]
    }))
  )

  const getAuthenticationState = Effect.fn("UserAccountStore.memory.getAuthenticationState")((
    id: string,
  ) =>
    find(id).pipe(Effect.map((userAccount): UserAccountAuthenticationState => ({
      id: userAccount.id,
      status: userAccount.status,
      sessionInvalidatedAt: sessionInvalidatedAt.get(id) ?? null,
    })))
  )

  const list = Effect.fn("UserAccountStore.memory.list")(() => Effect.succeed([...stored.values()]))

  const update = Effect.fn("UserAccountStore.memory.update")(function* (id: string, email: string) {
    const current = yield* find(id)
    if (email !== current.email && emails.has(email)) {
      return yield* Effect.fail(new UserAccountAlreadyExists({ email }))
    }
    emails.delete(current.email)
    emails.add(email)
    const userAccount = { ...current, email }
    stored.set(userAccount.id, userAccount)
    return userAccount
  })

  const disable = Effect.fn("UserAccountStore.memory.disable")(function* (id: string) {
    const current = yield* find(id)
    const userAccount = { ...current, status: "disabled" as const }
    stored.set(id, userAccount)
    sessionInvalidatedAt.set(id, new Date().toISOString())
    return userAccount
  })

  const enable = Effect.fn("UserAccountStore.memory.enable")(function* (id: string) {
    const current = yield* find(id)
    const userAccount = { ...current, status: "active" as const }
    stored.set(id, userAccount)
    return userAccount
  })

  const remove = Effect.fn("UserAccountStore.memory.remove")(function* (id: string) {
    const userAccount = yield* find(id)
    stored.delete(id)
    sessionInvalidatedAt.delete(id)
    emails.delete(userAccount.email)
  })

  return {
    create,
    getById: find,
    getByIds,
    getAuthenticationState,
    list,
    update,
    disable,
    enable,
    remove,
  }
}
