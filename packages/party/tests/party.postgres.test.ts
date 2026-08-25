import { assert, it } from "@effect/vitest"
import * as Effect from "effect/Effect"

import { makeAuthService } from "../../auth/mod.ts"
import { makeUserAccountService, UserAccountService } from "../../identity/mod.ts"
import { AuthorizationService, makeAuthorizationTestLayer } from "../../authorization/mod.ts"
import {
  Database,
  makePostgresDatabase,
  runMigrations,
  uuidv7,
  WebCryptoLive,
} from "../../kernel/mod.ts"
import { withTemporaryDatabase } from "../../../tests/support/postgres-database.ts"
import {
  BranchAlreadyExists,
  ExternalIdentifierAlreadyAssigned,
  LegalEntityAlreadyExists,
  makePartyService,
  OrganizationRequired,
  PartyCapabilities,
  PartyCreatedEvent,
  PartyEventPublisher,
  PartyRelationshipAlreadyExists,
  PartyRelationshipNotFound,
  PartyRelationshipRoleNotAssigned,
  PartyRepresentationAlreadyExists,
  PartyRepresentationNotFound,
} from "../mod.ts"
import { makeMessagingService } from "../../messaging/mod.ts"

const databaseUrl = Deno.env.get("DATABASE_URL")
const postgresFailure = (effect: () => Promise<unknown>) =>
  Effect.tryPromise({ try: effect, catch: (cause) => cause }).pipe(Effect.flip)

it.effect.skipIf(databaseUrl === undefined)(
  "enforces scoped external identifier uniqueness in PostgreSQL",
  () =>
    withTemporaryDatabase(databaseUrl!, (client) =>
      Effect.gen(function* () {
        yield* runMigrations(client)
        const database = makePostgresDatabase(client)
        const userAccountService = yield* makeUserAccountService.pipe(
          Effect.provideService(Database, database),
        )
        const auth = yield* makeAuthService.pipe(
          Effect.provideService(Database, database),
          Effect.provide(WebCryptoLive),
          Effect.provideService(UserAccountService, userAccountService),
        )
        const principal = { userAccountId: "party-integration", sessionId: "session" }
        const tenant = yield* auth.createTenant({ slug: `party-${uuidv7()}` })
        yield* Effect.gen(function* () {
          const authorization = yield* AuthorizationService
          const messaging = yield* makeMessagingService.pipe(
            Effect.provideService(Database, database),
          )
          const party = yield* makePartyService.pipe(
            Effect.provideService(Database, database),
            Effect.provideService(AuthorizationService, authorization),
            Effect.provideService(PartyEventPublisher, { append: messaging.append }),
          )
          const first = yield* party.create({
            principal,
            tenantId: tenant.id,
            kind: "organization",
            name: "First",
          })
          const [createdEvent] = yield* Effect.promise(() =>
            client<{
              event_type: string
              event_version: number
              aggregate_type: string
              aggregate_id: string
              payload: { partyId: string; kind: string }
            }[]>`
              select event_type, event_version, aggregate_type, aggregate_id, payload
              from messaging.event_outbox
              where tenant_id = ${tenant.id}
                and event_type = ${PartyCreatedEvent.id}
                and aggregate_id = ${first.id}
            `
          )
          assert.deepStrictEqual(createdEvent, {
            event_type: PartyCreatedEvent.id,
            event_version: PartyCreatedEvent.version,
            aggregate_type: PartyCreatedEvent.aggregateType,
            aggregate_id: first.id,
            payload: { partyId: first.id, kind: "organization" },
          })
          const second = yield* party.create({
            principal,
            tenantId: tenant.id,
            kind: "organization",
            name: "Second",
          })
          const identifier = {
            principal,
            tenantId: tenant.id,
            partyId: first.id,
            provider: "GS1",
            scheme: "GLN",
            scope: "global",
            value: "1234567890123",
          }
          yield* party.attachIdentifier(identifier)
          assert.instanceOf(
            yield* Effect.flip(party.attachIdentifier({ ...identifier, partyId: second.id })),
            ExternalIdentifierAlreadyAssigned,
          )
          const invalidProvider = yield* postgresFailure(() =>
            client`
              insert into party.party_identifiers
                (tenant_id, party_id, provider, scheme, scope, value)
              values
                (${tenant.id}, ${first.id}, ' gs1 ', 'GLN', 'global', ${uuidv7()})
            `
          )
          assert.strictEqual((invalidProvider as { code?: string }).code, "23514")
          assert.strictEqual(
            (invalidProvider as { constraint_name?: string }).constraint_name,
            "party_identifiers_provider_check",
          )
          const invalidScheme = yield* postgresFailure(() =>
            client`
              insert into party.party_identifiers
                (tenant_id, party_id, provider, scheme, scope, value)
              values
                (${tenant.id}, ${first.id}, 'GS1', ' gln ', 'global', ${uuidv7()})
            `
          )
          assert.strictEqual((invalidScheme as { code?: string }).code, "23514")
          assert.strictEqual(
            (invalidScheme as { constraint_name?: string }).constraint_name,
            "party_identifiers_scheme_check",
          )
          const invalidScope = yield* postgresFailure(() =>
            client`
              insert into party.party_identifiers
                (tenant_id, party_id, provider, scheme, scope, value)
              values
                (${tenant.id}, ${first.id}, 'GS1', 'GLN', ' ', ${uuidv7()})
            `
          )
          assert.strictEqual((invalidScope as { code?: string }).code, "23514")
          assert.strictEqual(
            (invalidScope as { constraint_name?: string }).constraint_name,
            "party_identifiers_scope_check",
          )
          const invalidValue = yield* postgresFailure(() =>
            client`
              insert into party.party_identifiers
                (tenant_id, party_id, provider, scheme, scope, value)
              values
                (${tenant.id}, ${first.id}, 'GS1', 'GLN', 'global', ${` ${uuidv7()} `})
            `
          )
          assert.strictEqual((invalidValue as { code?: string }).code, "23514")
          assert.strictEqual(
            (invalidValue as { constraint_name?: string }).constraint_name,
            "party_identifiers_value_check",
          )
        }).pipe(
          Effect.provide(
            makeAuthorizationTestLayer([
              {
                userAccountId: principal.userAccountId,
                tenantId: tenant.id,
                capability: "party.create",
              },
              {
                userAccountId: principal.userAccountId,
                tenantId: tenant.id,
                capability: "party.party_identifier.attach",
              },
            ]),
          ),
        )
      })),
)

it.effect.skipIf(databaseUrl === undefined)(
  "enforces legal entity ownership and branch uniqueness in PostgreSQL",
  () =>
    withTemporaryDatabase(databaseUrl!, (client) =>
      Effect.gen(function* () {
        yield* runMigrations(client)
        const database = makePostgresDatabase(client)
        const userAccountService = yield* makeUserAccountService.pipe(
          Effect.provideService(Database, database),
        )
        const auth = yield* makeAuthService.pipe(
          Effect.provideService(Database, database),
          Effect.provide(WebCryptoLive),
          Effect.provideService(UserAccountService, userAccountService),
        )
        const principal = { userAccountId: "scope-integration", sessionId: "session" }
        const tenant = yield* auth.createTenant({
          slug: `scope-${uuidv7()}`,
          timezone: "UTC",
        })
        const otherTenant = yield* auth.createTenant({
          slug: `scope-other-${uuidv7()}`,
          timezone: "UTC",
        })
        const authorizationLayer = makeAuthorizationTestLayer([
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: "party.create",
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: "party.legal_entity.create",
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: "party.branch.create",
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: "party.party_role.assign",
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: "party.party_relationship.create",
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: PartyCapabilities.partyRelationshipRead,
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: otherTenant.id,
            capability: PartyCapabilities.partyRelationshipRead,
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: "party.party_identifier.attach",
          },
        ])

        yield* Effect.gen(function* () {
          const authorization = yield* AuthorizationService
          const party = yield* makePartyService.pipe(
            Effect.provideService(Database, database),
            Effect.provideService(AuthorizationService, authorization),
          )
          const organization = yield* party.create({
            principal,
            tenantId: tenant.id,
            kind: "organization",
            name: "Scope Organization",
          })
          const person = yield* party.create({
            principal,
            tenantId: tenant.id,
            kind: "person",
            name: "Scope Person",
          })
          const secondOrganization = yield* party.create({
            principal,
            tenantId: tenant.id,
            kind: "organization",
            name: "Second Scope Organization",
          })
          const legalEntity = yield* party.createLegalEntity({
            principal,
            tenantId: tenant.id,
            organizationId: organization.id,
          })
          const secondLegalEntity = yield* party.createLegalEntity({
            principal,
            tenantId: tenant.id,
            organizationId: secondOrganization.id,
          })
          const scopedIdentifier = {
            principal,
            tenantId: tenant.id,
            provider: "GLEIF",
            scheme: "LEI",
            scope: "registry",
            value: "5493001KJTIIGC8Y1R12",
          }
          const firstIdentifier = yield* party.attachIdentifier({
            ...scopedIdentifier,
            partyId: organization.id,
            legalEntityId: legalEntity.id,
          })
          const secondIdentifier = yield* party.attachIdentifier({
            ...scopedIdentifier,
            partyId: secondOrganization.id,
            legalEntityId: secondLegalEntity.id,
          })
          assert.strictEqual(firstIdentifier.legalEntityId, legalEntity.id)
          assert.strictEqual(secondIdentifier.legalEntityId, secondLegalEntity.id)
          assert.instanceOf(
            yield* Effect.flip(party.attachIdentifier({
              ...scopedIdentifier,
              partyId: organization.id,
              legalEntityId: legalEntity.id,
            })),
            ExternalIdentifierAlreadyAssigned,
          )
          assert.instanceOf(
            yield* Effect.flip(party.createRelationship({
              principal,
              tenantId: tenant.id,
              partyId: person.id,
              legalEntityId: legalEntity.id,
              kind: "supplier",
            })),
            PartyRelationshipRoleNotAssigned,
          )
          yield* party.assignRole({
            principal,
            tenantId: tenant.id,
            partyId: organization.id,
            role: "customer",
          })
          const relationship = yield* party.createRelationship({
            principal,
            tenantId: tenant.id,
            partyId: organization.id,
            legalEntityId: legalEntity.id,
            kind: "customer",
          })
          assert.strictEqual(relationship.active, true)
          assert.deepStrictEqual(
            yield* party.getRelationship({
              principal,
              tenantId: tenant.id,
              relationshipId: relationship.id,
            }),
            relationship,
          )
          assert.instanceOf(
            yield* Effect.flip(party.getRelationship({
              principal,
              tenantId: otherTenant.id,
              relationshipId: relationship.id,
            })),
            PartyRelationshipNotFound,
          )
          assert.instanceOf(
            yield* Effect.flip(party.createRelationship({
              principal,
              tenantId: tenant.id,
              partyId: organization.id,
              legalEntityId: legalEntity.id,
              kind: "customer",
            })),
            PartyRelationshipAlreadyExists,
          )
          assert.instanceOf(
            yield* Effect.flip(party.createLegalEntity({
              principal,
              tenantId: tenant.id,
              organizationId: organization.id,
            })),
            LegalEntityAlreadyExists,
          )
          assert.instanceOf(
            yield* Effect.flip(party.createLegalEntity({
              principal,
              tenantId: tenant.id,
              organizationId: person.id,
            })),
            OrganizationRequired,
          )
          const invalidLegalEntity = yield* postgresFailure(() =>
            client`
              insert into party.legal_entities (tenant_id, organization_party_id)
              values (${tenant.id}, ${person.id})
            `
          )
          assert.strictEqual((invalidLegalEntity as { code?: string }).code, "23514")
          assert.strictEqual(
            (invalidLegalEntity as { constraint_name?: string }).constraint_name,
            "legal_entities_organization_party_kind_check",
          )
          const invalidPartyKindChange = yield* postgresFailure(() =>
            client`
              update party.parties set kind = 'person'
              where tenant_id = ${tenant.id} and id = ${organization.id}
            `
          )
          assert.strictEqual((invalidPartyKindChange as { code?: string }).code, "23514")
          assert.strictEqual(
            (invalidPartyKindChange as { constraint_name?: string }).constraint_name,
            "legal_entities_organization_party_kind_check",
          )
          const branch = yield* party.createBranch({
            principal,
            tenantId: tenant.id,
            legalEntityId: legalEntity.id,
            name: "Jakarta",
            timezone: "Asia/Jakarta",
            localTaxRegistration: "TAX-JKT-001",
            dedicatedJournalCode: "JKT-OPS",
          })
          assert.strictEqual(branch.timezone, "Asia/Jakarta")
          assert.strictEqual(branch.localTaxRegistration, "TAX-JKT-001")
          assert.strictEqual(branch.dedicatedJournalCode, "JKT-OPS")
          assert.instanceOf(
            yield* Effect.flip(party.createBranch({
              principal,
              tenantId: tenant.id,
              legalEntityId: legalEntity.id,
              name: "Jakarta",
            })),
            BranchAlreadyExists,
          )
        }).pipe(Effect.provide(authorizationLayer))
      })),
)

it.effect.skipIf(databaseUrl === undefined)(
  "enforces identity-party representation scope in PostgreSQL",
  () =>
    withTemporaryDatabase(databaseUrl!, (client) =>
      Effect.gen(function* () {
        yield* runMigrations(client)
        const database = makePostgresDatabase(client)
        const userAccountService = yield* makeUserAccountService.pipe(
          Effect.provideService(Database, database),
        )
        const auth = yield* makeAuthService.pipe(
          Effect.provideService(Database, database),
          Effect.provide(WebCryptoLive),
          Effect.provideService(UserAccountService, userAccountService),
        )
        const principal = { userAccountId: "representation-admin", sessionId: "session" }
        const tenant = yield* auth.createTenant({ slug: `representation-${uuidv7()}` })
        const userAccount = yield* userAccountService.create({
          email: `representation-${uuidv7()}@example.test`,
        })
        const authorizationLayer = makeAuthorizationTestLayer([
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: PartyCapabilities.partyCreate,
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: PartyCapabilities.partyRepresentationCreate,
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: PartyCapabilities.partyRepresentationActivate,
          },
          {
            userAccountId: principal.userAccountId,
            tenantId: tenant.id,
            capability: PartyCapabilities.partyRepresentationDeactivate,
          },
        ])

        yield* Effect.gen(function* () {
          const authorization = yield* AuthorizationService
          const party = yield* makePartyService.pipe(
            Effect.provideService(Database, database),
            Effect.provideService(AuthorizationService, authorization),
          )
          const representedParty = yield* party.create({
            principal,
            tenantId: tenant.id,
            kind: "organization",
            name: "Represented Organization",
          })
          const input = {
            principal,
            tenantId: tenant.id,
            userAccountId: userAccount.id,
            partyId: representedParty.id,
            kind: "representative",
          }
          const representation = yield* party.createPartyRepresentation(input)
          assert.strictEqual(representation.active, true)
          const blankKind = yield* postgresFailure(() =>
            client`
              insert into party.party_representations
                (tenant_id, user_account_id, party_id, kind)
              values (${tenant.id}, ${userAccount.id}, ${representedParty.id}, '   ')
            `
          )
          assert.strictEqual((blankKind as { code?: string }).code, "23514")
          assert.strictEqual(
            (blankKind as { constraint_name?: string }).constraint_name,
            "party_representations_kind_check",
          )
          assert.instanceOf(
            yield* Effect.flip(party.createPartyRepresentation(input)),
            PartyRepresentationAlreadyExists,
          )
          const inactive = yield* party.setPartyRepresentationActive({
            principal,
            tenantId: tenant.id,
            representationId: representation.id,
            active: false,
          })
          assert.strictEqual(inactive.active, false)
          assert.instanceOf(
            yield* Effect.flip(party.setPartyRepresentationActive({
              principal,
              tenantId: tenant.id,
              representationId: "00000000-0000-0000-0000-000000000000",
              active: true,
            })),
            PartyRepresentationNotFound,
          )
        }).pipe(Effect.provide(authorizationLayer))
      })),
)
