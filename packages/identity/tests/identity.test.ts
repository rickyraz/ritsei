import { assert, describe, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import {
  IdentityAccountAuthorizer,
  IdentityAuthorizationDenied,
  IdentityEventPublisher,
  makeUserAccountService,
  makeUserAccountTestLayer,
  UserAccountAlreadyExists,
  UserAccountCreatedEvent,
  UserAccountNotFound,
  UserAccountService,
} from "../mod.ts"
import type { EventEnvelopeShape } from "../../messaging/mod.ts"
import { makeUserAccountMemoryStore } from "../src/memory.ts"
import { makeUserAccountServiceFromStore } from "../src/service.ts"
import {
  Database,
  DatabaseFailure,
  type DatabaseService,
  type DrizzleDatabase,
  type DrizzleTransaction,
} from "../../kernel/mod.ts"

const withUserAccount = <A, E>(program: Effect.Effect<A, E, UserAccountService>) =>
  Effect.provide(program, makeUserAccountTestLayer())

describe("user account contract", () => {
  it.effect("authorizes tenant account creation and publishes its owner event", () =>
    Effect.gen(function* () {
      const published: EventEnvelopeShape[] = []
      const service = yield* Effect.provide(
        makeUserAccountServiceFromStore(Effect.succeed(makeUserAccountMemoryStore())),
        Layer.mergeAll(
          Layer.succeed(IdentityAccountAuthorizer, {
            authorize: ({ tenantId }) =>
              tenantId === "tenant-a" ? Effect.void : Effect.fail(
                new IdentityAuthorizationDenied({
                  tenantId,
                  capability: "identity.user_account.create",
                }),
              ),
          }),
          Layer.succeed(IdentityEventPublisher, {
            append: (input) => {
              published.push(input as EventEnvelopeShape)
              return Effect.succeed(input as EventEnvelopeShape)
            },
          }),
        ),
      )
      const principal = { userAccountId: "actor", sessionId: "session" }
      const created = yield* service.createForTenant({
        principal,
        tenantId: "tenant-a",
        email: "  USER@Example.COM ",
      })

      assert.strictEqual(created.email, "user@example.com")
      assert.strictEqual(published.length, 1)
      assert.strictEqual(published[0].eventType, UserAccountCreatedEvent.id)
      assert.strictEqual(published[0].tenantId, "tenant-a")
      assert.strictEqual(published[0].aggregateId, created.id)
      assert.deepStrictEqual(published[0].payload, {
        userAccountId: created.id,
        email: created.email,
      })

      const denied = yield* Effect.flip(service.createForTenant({
        principal,
        tenantId: "tenant-b",
        email: "denied@example.com",
      }))
      assert.instanceOf(denied, IdentityAuthorizationDenied)
      assert.strictEqual((yield* service.list()).length, 1)
    }))

  it.effect("creates a normalized user account", () =>
    withUserAccount(
      Effect.gen(function* () {
        const userAccount = yield* UserAccountService.use((service) =>
          service.create({ email: "  USER@Example.COM " })
        )

        assert.strictEqual(userAccount.email, "user@example.com")
        assert.strictEqual(userAccount.id, "1")
        assert.strictEqual(userAccount.status, "active")
      }),
    ))

  it.effect("rejects duplicate email", () =>
    withUserAccount(
      Effect.gen(function* () {
        const create = UserAccountService.use((service) =>
          service.create({ email: "duplicate@example.com" })
        )
        yield* create
        const error = yield* Effect.flip(create)

        assert.instanceOf(error, UserAccountAlreadyExists)
        assert.strictEqual(error.email, "duplicate@example.com")
      }),
    ))

  it.effect("lists, updates, and removes user accounts", () =>
    withUserAccount(
      Effect.gen(function* () {
        const service = yield* UserAccountService
        const created = yield* service.create({ email: "before@example.com" })
        assert.strictEqual((yield* service.getById(created.id)).id, created.id)
        assert.strictEqual((yield* service.list()).length, 1)
        assert.strictEqual(
          (yield* service.update({ id: created.id, email: "after@example.com" })).email,
          "after@example.com",
        )
        yield* service.remove(created.id)
        assert.instanceOf(yield* Effect.flip(service.getById(created.id)), UserAccountNotFound)
      }),
    ))

  it.effect("rejects duplicate and missing updates", () =>
    withUserAccount(
      Effect.gen(function* () {
        const service = yield* UserAccountService
        const first = yield* service.create({ email: "first@example.com" })
        const second = yield* service.create({ email: "second@example.com" })

        assert.instanceOf(
          yield* Effect.flip(service.update({ id: first.id, email: second.email })),
          UserAccountAlreadyExists,
        )
        assert.instanceOf(
          yield* Effect.flip(service.update({ id: "missing", email: "missing@example.com" })),
          UserAccountNotFound,
        )
        assert.instanceOf(yield* Effect.flip(service.remove("missing")), UserAccountNotFound)
      }),
    ))

  it.effect("propagates non-constraint database failures", () => {
    const databaseFailure = new DatabaseFailure({
      operation: "user-account.test",
      cause: new Error("database unavailable"),
    })
    const database: DatabaseService = {
      query: <A>(_operation: (database: DrizzleDatabase) => Promise<A>) =>
        Effect.fail(databaseFailure),
      transaction: <A>(_operation: (transaction: DrizzleTransaction) => Promise<A>) =>
        Effect.fail(databaseFailure),
      withTransaction: <A, E, R>(_operation: Effect.Effect<A, E, R>) =>
        Effect.fail(databaseFailure),
    }

    return Effect.provide(
      Effect.gen(function* () {
        const service = yield* makeUserAccountService
        assert.instanceOf(
          yield* Effect.flip(service.create({ email: "failure@example.com" })),
          DatabaseFailure,
        )
        assert.instanceOf(
          yield* Effect.flip(service.update({ id: "missing", email: "failure@example.com" })),
          DatabaseFailure,
        )
      }),
      Layer.succeed(Database, database),
    )
  })

  it.effect("disables and enables authentication state", () =>
    withUserAccount(
      Effect.gen(function* () {
        const service = yield* UserAccountService
        const created = yield* service.create({ email: "status@example.com" })
        assert.strictEqual(
          (yield* service.getAuthenticationState(created.id)).status,
          "active",
        )
        const disabled = yield* service.disable(created.id)
        assert.strictEqual(disabled.status, "disabled")
        const disabledState = yield* service.getAuthenticationState(created.id)
        assert.strictEqual(disabledState.status, "disabled")
        assert.ok(disabledState.sessionInvalidatedAt !== null)
        assert.strictEqual((yield* service.enable(created.id)).status, "active")
        assert.strictEqual(
          (yield* service.getAuthenticationState(created.id)).status,
          "active",
        )
      }),
    ))

  it.effect("reads multiple accounts and rejects missing lifecycle records", () =>
    withUserAccount(
      Effect.gen(function* () {
        const service = yield* UserAccountService
        const created = yield* service.create({ email: "many@example.com" })
        assert.deepStrictEqual(yield* service.getByIds([]), [])
        assert.deepStrictEqual(
          yield* service.getByIds([created.id, "missing"]),
          [created],
        )
        assert.instanceOf(
          yield* Effect.flip(service.getAuthenticationState("missing")),
          UserAccountNotFound,
        )
        assert.instanceOf(yield* Effect.flip(service.disable("missing")), UserAccountNotFound)
        assert.instanceOf(yield* Effect.flip(service.enable("missing")), UserAccountNotFound)
      }),
    ))

  it.effect("rejects invalid input", () =>
    withUserAccount(
      Effect.gen(function* () {
        const error = yield* Effect.flip(
          UserAccountService.use((service) => service.create({ email: 42 })),
        )

        assert.instanceOf(error, Error)
        assert.match(error.message, /email/)
      }),
    ))
})
