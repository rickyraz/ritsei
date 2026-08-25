import { eq, inArray } from "drizzle-orm"
import * as Clock from "effect/Clock"
import * as Effect from "effect/Effect"

import { userAccounts } from "../../../db/schema/identity.ts"
import { Database, isDatabaseConstraint } from "../../kernel/mod.ts"
import type { UserAccount, UserAccountAuthenticationState, UserAccountStatus } from "./contract.ts"
import { UserAccountAlreadyExists, UserAccountNotFound } from "./errors.ts"
import type { UserAccountStore } from "./store.ts"

const selectUserAccount = {
  id: userAccounts.id,
  email: userAccounts.email,
  status: userAccounts.status,
}

const selectAuthenticationState = {
  id: userAccounts.id,
  status: userAccounts.status,
  sessionInvalidatedAt: userAccounts.sessionInvalidatedAt,
}

const toUserAccount = (
  row: { readonly id: string; readonly email: string; readonly status: string },
): UserAccount => ({
  id: row.id,
  email: row.email,
  status: row.status as UserAccountStatus,
})

const toAuthenticationState = (row: {
  readonly id: string
  readonly status: string
  readonly sessionInvalidatedAt: Date | null
}): UserAccountAuthenticationState => ({
  id: row.id,
  status: row.status as UserAccountStatus,
  sessionInvalidatedAt: row.sessionInvalidatedAt === null
    ? null
    : row.sessionInvalidatedAt.toISOString(),
})

const isDuplicateEmail = (error: unknown) => isDatabaseConstraint(error, "user_accounts_email_key")

export const makeUserAccountPostgresStore = Effect.gen(function* () {
  const database = yield* Database
  const clock = yield* Clock.Clock
  const now = () => new Date(clock.currentTimeMillisUnsafe())

  const create = Effect.fn("UserAccountStore.create")(function* (email: string) {
    const rows = yield* database.query(
      (db) => db.insert(userAccounts).values({ email }).returning(selectUserAccount),
      "user-account.create",
    ).pipe(
      Effect.mapError((error) =>
        isDuplicateEmail(error) ? new UserAccountAlreadyExists({ email }) : error
      ),
    )
    return toUserAccount(rows[0]!)
  })

  const getById = Effect.fn("UserAccountStore.getById")(function* (id: string) {
    const rows = yield* database.query(
      (db) => db.select(selectUserAccount).from(userAccounts).where(eq(userAccounts.id, id)),
      "user-account.get",
    )
    const row = rows[0]
    return row === undefined
      ? yield* Effect.fail(new UserAccountNotFound({ id }))
      : toUserAccount(row)
  })

  const getByIds = Effect.fn("UserAccountStore.getByIds")(function* (ids: readonly string[]) {
    if (ids.length === 0) return []
    const rows = yield* database.query(
      (db) =>
        db.select(selectUserAccount).from(userAccounts).where(inArray(userAccounts.id, ids))
          .orderBy(userAccounts.createdAt, userAccounts.id),
      "user-account.get-many",
    )
    return rows.map(toUserAccount)
  })

  const getAuthenticationState = Effect.fn("UserAccountStore.getAuthenticationState")(
    function* (id: string) {
      const rows = yield* database.query(
        (db) =>
          db.select(selectAuthenticationState).from(userAccounts).where(eq(userAccounts.id, id)),
        "user-account.authentication-state",
      )
      const row = rows[0]
      return row === undefined
        ? yield* Effect.fail(new UserAccountNotFound({ id }))
        : toAuthenticationState(row)
    },
  )

  const list = Effect.fn("UserAccountStore.list")(function* () {
    const rows = yield* database.query(
      (db) =>
        db.select(selectUserAccount).from(userAccounts).orderBy(
          userAccounts.createdAt,
          userAccounts.id,
        ),
      "user-account.list",
    )
    return rows.map(toUserAccount)
  })

  const update = Effect.fn("UserAccountStore.update")(function* (id: string, email: string) {
    const rows = yield* database.query(
      (db) =>
        db.update(userAccounts).set({ email, updatedAt: now() }).where(eq(userAccounts.id, id))
          .returning(selectUserAccount),
      "user-account.update",
    ).pipe(
      Effect.mapError((error) =>
        isDuplicateEmail(error) ? new UserAccountAlreadyExists({ email }) : error
      ),
    )
    const row = rows[0]
    return row === undefined
      ? yield* Effect.fail(new UserAccountNotFound({ id }))
      : toUserAccount(row)
  })

  const disable = Effect.fn("UserAccountStore.disable")(function* (id: string) {
    const timestamp = now()
    const rows = yield* database.query(
      (db) =>
        db.update(userAccounts).set({
          status: "disabled",
          disabledAt: timestamp,
          sessionInvalidatedAt: timestamp,
          updatedAt: timestamp,
        }).where(eq(userAccounts.id, id)).returning(selectUserAccount),
      "user-account.disable",
    )
    const row = rows[0]
    return row === undefined
      ? yield* Effect.fail(new UserAccountNotFound({ id }))
      : toUserAccount(row)
  })

  const enable = Effect.fn("UserAccountStore.enable")(function* (id: string) {
    const rows = yield* database.query(
      (db) =>
        db.update(userAccounts).set({ status: "active", disabledAt: null, updatedAt: now() }).where(
          eq(userAccounts.id, id),
        ).returning(selectUserAccount),
      "user-account.enable",
    )
    const row = rows[0]
    return row === undefined
      ? yield* Effect.fail(new UserAccountNotFound({ id }))
      : toUserAccount(row)
  })

  const remove = Effect.fn("UserAccountStore.remove")(function* (id: string) {
    const rows = yield* database.query(
      (db) =>
        db.delete(userAccounts).where(eq(userAccounts.id, id)).returning({ id: userAccounts.id }),
      "user-account.remove",
    )
    if (rows[0] === undefined) return yield* Effect.fail(new UserAccountNotFound({ id }))
  })

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
  } satisfies UserAccountStore
})
