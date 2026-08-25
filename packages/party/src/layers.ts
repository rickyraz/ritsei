import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { PartyService } from "./contract.ts"
import { makePartyMemoryStore } from "./memory.ts"
import { makePartyPostgresStore } from "./postgres.ts"
import { makePartyServiceFromStore } from "./service.ts"

export const makePartyService = makePartyServiceFromStore(makePartyPostgresStore)

export const makePartyTestLayer = (validUserAccountIds?: ReadonlySet<string>) =>
  Layer.effect(
    PartyService,
    makePartyServiceFromStore(Effect.succeed(makePartyMemoryStore(validUserAccountIds))),
  )
