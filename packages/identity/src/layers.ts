import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { UserAccountService } from "./contract.ts"
import { makeUserAccountMemoryStore } from "./memory.ts"
import { makeUserAccountPostgresStore } from "./postgres.ts"
import { makeUserAccountServiceFromStore } from "./service.ts"

export const makeUserAccountService = makeUserAccountServiceFromStore(makeUserAccountPostgresStore)
export const IdentityLive = Layer.effect(UserAccountService, makeUserAccountService)

export const makeUserAccountTestLayer = () =>
  Layer.effect(
    UserAccountService,
    makeUserAccountServiceFromStore(Effect.succeed(makeUserAccountMemoryStore())),
  )
