import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { AuthorizationService } from "../../authorization/mod.ts"
import { PartyCapabilities } from "./capabilities.ts"
import {
  AssignPartyRoleInput,
  AttachExternalIdentifierInput,
  CreateBranchInput,
  CreateLegalEntityInput,
  CreatePartyInput,
  CreatePartyRelationshipInput,
  CreatePartyRepresentationInput,
  GetPartyRelationshipInput,
  PartyService,
  SetPartyRepresentationActiveInput,
} from "./contract.ts"
import type { PartyStore } from "./store.ts"

export const makePartyServiceFromStore = <R>(
  store: Effect.Effect<PartyStore, never, R>,
): Effect.Effect<
  PartyService,
  never,
  R | import("../../authorization/mod.ts").AuthorizationService
> =>
  Effect.gen(function* () {
    const partyStore = yield* store
    const authorization = yield* AuthorizationService

    const create = Effect.fn("PartyService.create")(function* (input: unknown) {
      const decoded = yield* Schema.decodeUnknownEffect(CreatePartyInput)(input)
      yield* authorization.authorize({
        principal: decoded.principal,
        tenantId: decoded.tenantId,
        capability: PartyCapabilities.partyCreate,
      })
      return yield* partyStore.create(decoded.tenantId, decoded.kind, decoded.name.trim())
    })
    const createLegalEntity = Effect.fn("PartyService.createLegalEntity")(
      function* (input: unknown) {
        const decoded = yield* Schema.decodeUnknownEffect(CreateLegalEntityInput)(input)
        yield* authorization.authorize({
          principal: decoded.principal,
          tenantId: decoded.tenantId,
          capability: PartyCapabilities.legalEntityCreate,
        })
        return yield* partyStore.createLegalEntity(decoded.tenantId, decoded.organizationId)
      },
    )
    const createBranch = Effect.fn("PartyService.createBranch")(function* (input: unknown) {
      const decoded = yield* Schema.decodeUnknownEffect(CreateBranchInput)(input)
      yield* authorization.authorize({
        principal: decoded.principal,
        tenantId: decoded.tenantId,
        capability: PartyCapabilities.branchCreate,
      })
      return yield* partyStore.createBranch(
        decoded.tenantId,
        decoded.legalEntityId,
        decoded.name.trim(),
        decoded.timezone?.trim() ?? null,
        decoded.localTaxRegistration?.trim() ?? null,
        decoded.dedicatedJournalCode?.trim() ?? null,
      )
    })
    const createPartyRepresentation = Effect.fn("PartyService.createPartyRepresentation")(
      function* (input: unknown) {
        const decoded = yield* Schema.decodeUnknownEffect(CreatePartyRepresentationInput)(input)
        yield* authorization.authorize({
          principal: decoded.principal,
          tenantId: decoded.tenantId,
          capability: PartyCapabilities.partyRepresentationCreate,
        })
        return yield* partyStore.createPartyRepresentation(
          decoded.tenantId,
          decoded.userAccountId,
          decoded.partyId,
          decoded.kind.trim(),
        )
      },
    )
    const setPartyRepresentationActive = Effect.fn("PartyService.setPartyRepresentationActive")(
      function* (input: unknown) {
        const decoded = yield* Schema.decodeUnknownEffect(SetPartyRepresentationActiveInput)(input)
        yield* authorization.authorize({
          principal: decoded.principal,
          tenantId: decoded.tenantId,
          capability: decoded.active
            ? PartyCapabilities.partyRepresentationActivate
            : PartyCapabilities.partyRepresentationDeactivate,
        })
        return yield* partyStore.setPartyRepresentationActive(
          decoded.tenantId,
          decoded.representationId,
          decoded.active,
        )
      },
    )
    const assignRole = Effect.fn("PartyService.assignRole")(function* (input: unknown) {
      const decoded = yield* Schema.decodeUnknownEffect(AssignPartyRoleInput)(input)
      yield* authorization.authorize({
        principal: decoded.principal,
        tenantId: decoded.tenantId,
        capability: PartyCapabilities.partyRoleAssign,
      })
      return yield* partyStore.assignRole(decoded.tenantId, decoded.partyId, decoded.role)
    })
    const createRelationship = Effect.fn("PartyService.createRelationship")(
      function* (input: unknown) {
        const decoded = yield* Schema.decodeUnknownEffect(CreatePartyRelationshipInput)(input)
        yield* authorization.authorize({
          principal: decoded.principal,
          tenantId: decoded.tenantId,
          capability: PartyCapabilities.partyRelationshipCreate,
        })
        return yield* partyStore.createRelationship(
          decoded.tenantId,
          decoded.partyId,
          decoded.legalEntityId,
          decoded.kind,
        )
      },
    )
    const getRelationship = Effect.fn("PartyService.getRelationship")(function* (input: unknown) {
      const decoded = yield* Schema.decodeUnknownEffect(GetPartyRelationshipInput)(input)
      yield* authorization.authorize({
        principal: decoded.principal,
        tenantId: decoded.tenantId,
        capability: PartyCapabilities.partyRelationshipRead,
      })
      return yield* partyStore.getRelationship(decoded.tenantId, decoded.relationshipId)
    })
    const attachIdentifier = Effect.fn("PartyService.attachIdentifier")(function* (input: unknown) {
      const decoded = yield* Schema.decodeUnknownEffect(AttachExternalIdentifierInput)(input)
      yield* authorization.authorize({
        principal: decoded.principal,
        tenantId: decoded.tenantId,
        capability: PartyCapabilities.partyIdentifierAttach,
      })
      return yield* partyStore.attachIdentifier(
        decoded.tenantId,
        decoded.partyId,
        decoded.provider.trim().toUpperCase(),
        decoded.scheme.trim().toUpperCase(),
        decoded.scope.trim(),
        decoded.legalEntityId ?? null,
        decoded.value.trim(),
      )
    })

    return {
      create,
      createLegalEntity,
      createBranch,
      createPartyRepresentation,
      setPartyRepresentationActive,
      assignRole,
      createRelationship,
      getRelationship,
      attachIdentifier,
    } satisfies PartyService
  })
