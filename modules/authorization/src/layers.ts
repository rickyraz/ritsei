import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"

import { AuthorizationService, GrantCapabilityInput } from "./contract.ts"
import { makeAuthorizationService } from "./service.ts"
import { makeMemoryAuthorizationService } from "./memory.ts"

export const AuthorizationLive = Layer.effect(AuthorizationService, makeAuthorizationService)

export const makeAuthorizationTestLayer = (
  initialGrants: ReadonlyArray<Schema.Schema.Type<typeof GrantCapabilityInput>> = [],
) => Layer.succeed(AuthorizationService, makeMemoryAuthorizationService(initialGrants))
