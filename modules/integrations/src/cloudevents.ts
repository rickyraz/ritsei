import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { ExternalPayloadInvalid } from "./errors.ts"

const Uuid = Schema.String.check(Schema.isUUID())
const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))

export const CloudEventsEnvelope = Schema.Struct({
  specversion: Schema.Literals(["1.0"]),
  type: NonEmptyString,
  source: NonEmptyString,
  id: NonEmptyString,
  time: NonEmptyString,
  datacontenttype: Schema.Literals(["application/json"]),
  subject: Schema.optional(NonEmptyString),
  data: Schema.Unknown,
})

export type CloudEventsEnvelope = Schema.Schema.Type<typeof CloudEventsEnvelope>

export type NormalizeExternalEventInput = {
  readonly tenantId: string
  readonly connectorId: string
  readonly expectedType: string
  readonly envelope: unknown
  readonly payloadSchema: Schema.Top
}

export type NormalizedExternalEvent = {
  readonly kind: "ExternalEvent"
  readonly envelope: "CloudEvents 1.0.x"
  readonly tenantId: string
  readonly connectorId: string
  readonly id: string
  readonly type: string
  readonly source: string
  readonly payload: unknown
}

const decode = (schema: Schema.Top, input: unknown) =>
  Schema.decodeUnknownEffect(schema as Schema.Codec<unknown, unknown, never, never>)(input)

// CloudEvents is a separate envelope from the validated ExternalEvent payload.
export const normalizeCloudEvent = (
  input: NormalizeExternalEventInput,
): Effect.Effect<NormalizedExternalEvent, ExternalPayloadInvalid> =>
  Effect.gen(function* () {
    if (!Schema.is(Uuid)(input.tenantId) || !/\S/.test(input.connectorId)) {
      return yield* Effect.fail(
        new ExternalPayloadInvalid({
          boundary: "integration.cloudevents.scope",
          identifier: input.expectedType,
        }),
      )
    }
    const envelope = yield* Schema.decodeUnknownEffect(CloudEventsEnvelope)(input.envelope).pipe(
      Effect.mapError(() =>
        new ExternalPayloadInvalid({
          boundary: "integration.cloudevents.envelope",
          identifier: input.expectedType,
        })
      ),
    )
    if (envelope.type !== input.expectedType) {
      return yield* Effect.fail(
        new ExternalPayloadInvalid({
          boundary: "integration.cloudevents.type",
          identifier: input.expectedType,
        }),
      )
    }
    const payload = yield* decode(input.payloadSchema, envelope.data).pipe(
      Effect.mapError(() =>
        new ExternalPayloadInvalid({
          boundary: "integration.cloudevents.payload",
          identifier: input.expectedType,
        })
      ),
    )
    return {
      kind: "ExternalEvent" as const,
      envelope: "CloudEvents 1.0.x" as const,
      tenantId: input.tenantId,
      connectorId: input.connectorId,
      id: envelope.id,
      type: envelope.type,
      source: envelope.source,
      payload,
    }
  })
