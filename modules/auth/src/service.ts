import * as Clock from "effect/Clock"
import * as Crypto from "effect/Crypto"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { UserAccountNotFound, UserAccountService } from "../../identity/mod.ts"
import { DatabaseFailure } from "../../../foundation/mod.ts"
import {
  AuthService,
  CreateTenantInput,
  type IssuedSession,
  IssueSessionInput,
  Principal,
  Tenant,
} from "./contract.ts"
import {
  InvalidSessionToken,
  SessionUserAccountDisabled,
  SessionUserAccountNotFound,
} from "./errors.ts"
import { makePostgresAuthStore } from "./postgres.ts"

const encodeToken = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")

const makeToken = (crypto: Crypto.Crypto) =>
  crypto.randomBytes(32).pipe(
    Effect.map(encodeToken),
    Effect.mapError((cause) => new DatabaseFailure({ operation: "session-token-generate", cause })),
  )

const hashToken = (crypto: Crypto.Crypto, token: string) =>
  crypto.digest("SHA-256", new TextEncoder().encode(token)).pipe(
    Effect.map((digest) =>
      Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("")
    ),
    Effect.mapError((cause) => new DatabaseFailure({ operation: "session-token-hash", cause })),
  )

const normalizeTenant = (input: Schema.Schema.Type<typeof CreateTenantInput>) => ({
  slug: input.slug.trim().toLowerCase(),
  timezone: input.timezone?.trim() ?? "UTC",
})

export const makeAuthService = Effect.gen(function* () {
  const store = yield* makePostgresAuthStore
  const userAccounts = yield* UserAccountService
  const crypto = yield* Crypto.Crypto
  const clock = yield* Clock.Clock
  const now = () => new Date(clock.currentTimeMillisUnsafe())

  const createTenant = Effect.fn("auth.createTenant")(function* (input: unknown) {
    const decoded = yield* Schema.decodeUnknownEffect(CreateTenantInput)(input)
    const { slug, timezone } = normalizeTenant(decoded)
    return yield* store.createTenant(slug, timezone).pipe(
      Effect.map((tenant) => ({ ...tenant } satisfies Tenant)),
    )
  })

  const issueSession = Effect.fn("auth.issueSession")(function* (input: unknown) {
    const decoded = yield* Schema.decodeUnknownEffect(IssueSessionInput)(input)
    const account = yield* userAccounts.getAuthenticationState(decoded.userAccountId).pipe(
      Effect.mapError((error) =>
        error instanceof UserAccountNotFound || error instanceof Schema.SchemaError
          ? new SessionUserAccountNotFound({ userAccountId: decoded.userAccountId })
          : error
      ),
    )
    if (account.status === "disabled") {
      return yield* Effect.fail(
        new SessionUserAccountDisabled({ userAccountId: decoded.userAccountId }),
      )
    }
    const token = yield* makeToken(crypto)
    const tokenHash = yield* hashToken(crypto, token)
    const row = yield* store.createSession(
      decoded.userAccountId,
      tokenHash,
      new Date(clock.currentTimeMillisUnsafe() + decoded.ttlSeconds * 1000),
    )
    return {
      token,
      session: {
        id: row.id,
        userAccountId: row.userAccountId,
        expiresAt: row.expiresAt.toISOString(),
      },
    } satisfies IssuedSession
  })

  const authenticate = Effect.fn("auth.authenticate")(function* (token: string) {
    const tokenHash = yield* hashToken(crypto, token)
    const row = yield* store.findActiveSession(tokenHash, now())
    if (row === undefined) return yield* Effect.fail(new InvalidSessionToken({}))
    const account = yield* userAccounts.getAuthenticationState(row.userAccountId).pipe(
      Effect.mapError((error) =>
        error instanceof UserAccountNotFound || error instanceof Schema.SchemaError
          ? new InvalidSessionToken({})
          : error
      ),
    )
    if (
      account.status === "disabled" ||
      (account.sessionInvalidatedAt !== null &&
        row.createdAt.getTime() <= Date.parse(account.sessionInvalidatedAt))
    ) return yield* Effect.fail(new InvalidSessionToken({}))
    return { userAccountId: row.userAccountId, sessionId: row.id } satisfies Schema.Schema.Type<
      typeof Principal
    >
  })

  const revoke = Effect.fn("auth.revoke")(function* (sessionId: string) {
    if (!(yield* store.revokeSession(sessionId, now()))) {
      return yield* Effect.fail(new InvalidSessionToken({}))
    }
  })

  return { createTenant, issueSession, authenticate, revoke } satisfies AuthService
})
