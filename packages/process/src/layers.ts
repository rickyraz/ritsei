import * as Layer from "effect/Layer"

import { ProcessService } from "./contract.ts"
import { makeProcessService } from "./postgres.ts"

export const ProcessLive = Layer.effect(ProcessService, makeProcessService)
export const ProcessPostgresLive = ProcessLive

export { makeProcessService }
