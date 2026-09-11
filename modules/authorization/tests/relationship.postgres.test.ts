import { assert, it } from "@effect/vitest"
import * as Effect from "effect/Effect"

import { makeAuthService } from "../../auth/mod.ts"
import { makeUserAccountService, UserAccountService } from "../../identity/mod.ts"
import { Database, uuidv7 } from "../../../foundation/mod.ts"
import { tenantMemberships } from "../../../db/schema/authorization.ts"
import { makePostgresDatabase, runMigrations, WebCryptoLive } from "../../../platform/mod.ts"
import { makePostgresRelationshipEngine } from "../mod.ts"
import { withTemporaryDatabase } from "../../../tests/support/postgres-database.ts"

const databaseUrl = Deno.env.get("DATABASE_URL")

it.effect.skipIf(databaseUrl === undefined)(
  "evaluates tenant membership relationships and unknown relationship kinds safely",
  () =>
    withTemporaryDatabase(databaseUrl!, (client) =>
      Effect.gen(function* () {
        yield* runMigrations(client)
        const database = makePostgresDatabase(client)
        const userAccounts = yield* makeUserAccountService.pipe(
          Effect.provideService(Database, database),
        )
        const user = yield* userAccounts.create({ email: `relationship-${uuidv7()}@example.test` })
        const auth = yield* makeAuthService.pipe(
          Effect.provideService(Database, database),
          Effect.provide(WebCryptoLive),
          Effect.provideService(UserAccountService, userAccounts),
        )
        const tenant = yield* auth.createTenant({ slug: `relationship-${uuidv7()}` })
        const engine = makePostgresRelationshipEngine(database)
        const principal = { userAccountId: user.id, sessionId: "relationship-session" }

        const before = yield* engine.evaluate({
          principal,
          tenantId: tenant.id,
          resourceType: "tenant",
          resourceId: tenant.id,
          relationship: "member",
        })
        assert.strictEqual(before.allowed, false)
        assert.strictEqual(before.result, "denied")

        yield* database.query(
          (db) =>
            db.insert(tenantMemberships)
              .values({ userAccountId: user.id, tenantId: tenant.id }),
          "authorization.relationship.test.add",
        )
        const allowed = yield* engine.evaluate({
          principal,
          tenantId: tenant.id,
          resourceType: "tenant",
          resourceId: tenant.id,
          relationship: "member",
        })
        assert.strictEqual(allowed.allowed, true)
        assert.strictEqual(allowed.consistency, "current")

        const unknown = yield* engine.evaluate({
          principal,
          tenantId: tenant.id,
          resourceType: "invoice",
          resourceId: "invoice-1",
          relationship: "approver",
        })
        assert.strictEqual(unknown.allowed, false)
        assert.strictEqual(unknown.result, "unknown")
      })),
)
