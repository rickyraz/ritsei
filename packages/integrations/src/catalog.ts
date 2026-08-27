import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import type { ExternalActionCatalogEntry, ExternalEventCatalogEntry } from "./contract.ts"
import { ExternalActionNotAllowlisted, ExternalPayloadInvalid } from "./errors.ts"

export type ExternalCatalogEntry = ExternalActionCatalogEntry | ExternalEventCatalogEntry

export type SimulateExternalActionInput = {
  readonly tenantId: string
  readonly action: ExternalActionCatalogEntry
  readonly input: unknown
}

export type ExternalSimulationResult = {
  readonly simulated: true
  readonly actionId: string
  readonly version: number
  readonly requiredScope: string
  readonly validatedInput: unknown
  readonly sideEffect: false
}

const Uuid = Schema.String.check(Schema.isUUID())
const decodeExternalInput = (schema: Schema.Top, input: unknown) =>
  Schema.decodeUnknownEffect(schema as Schema.Codec<unknown, unknown, never, never>)(input)

export const simulateWithoutSideEffect = (
  input: SimulateExternalActionInput,
): Effect.Effect<ExternalSimulationResult, ExternalActionNotAllowlisted | ExternalPayloadInvalid> =>
  Effect.gen(function* () {
    if (!Schema.is(Uuid)(input.tenantId)) {
      return yield* Effect.fail(
        new ExternalPayloadInvalid({
          boundary: "external.simulation.tenant",
          identifier: input.action.id,
        }),
      )
    }
    if (!input.action.allowlisted || input.action.stability !== "PUBLIC") {
      return yield* Effect.fail(
        new ExternalActionNotAllowlisted({
          tenantId: input.tenantId,
          actionId: input.action.id,
        }),
      )
    }
    const validatedInput = yield* decodeExternalInput(input.action.inputSchema, input.input).pipe(
      Effect.mapError(() =>
        new ExternalPayloadInvalid({
          boundary: "external.simulation.input",
          identifier: input.action.id,
        })
      ),
    )
    return {
      simulated: true,
      actionId: input.action.id,
      version: input.action.version,
      requiredScope: input.action.requiredScope,
      validatedInput,
      sideEffect: false,
    }
  })
