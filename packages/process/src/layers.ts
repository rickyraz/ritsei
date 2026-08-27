import * as Layer from "effect/Layer"

import { ProcessService } from "./contract.ts"
import { makeProcessService } from "./postgres.ts"
import {
  makeMemoryProcessCheckpointStore,
  makePostgresProcessCheckpointStore,
  ProcessCheckpointStore,
} from "./runtime-store.ts"

export const ProcessLive = Layer.effect(ProcessService, makeProcessService)
export const ProcessPostgresLive = ProcessLive
export const ProcessRuntimeMemoryLive = Layer.succeed(
  ProcessCheckpointStore,
  makeMemoryProcessCheckpointStore(),
)
export const ProcessRuntimePostgresLive = Layer.effect(
  ProcessCheckpointStore,
  makePostgresProcessCheckpointStore,
)

export { makeProcessService }
