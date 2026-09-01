import * as Effect from "effect/Effect"
import * as Result from "effect/Result"
import * as Schema from "effect/Schema"

import {
  type ExternalActionCatalogEntry,
  type ExternalEventCatalogEntry,
  isAllowlistedExternalAction,
} from "./contract.ts"
import {
  ExternalActionNotAllowlisted,
  ExternalAuthorizationDenied,
  ExternalIdempotencyConflict,
  ExternalPayloadInvalid,
  ExternalProviderFailure,
  ExternalUnknownOutcome,
} from "./errors.ts"
import {
  type ExternalConnectorStore,
  type ExternalEventReceipt,
  type ExternalInvocationReceipt,
  makeMemoryExternalConnectorStore,
} from "./store.ts"

const Uuid = Schema.String.check(Schema.isUUID())
const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))

export const WebhookIngestion = Schema.Struct({
  specversion: Schema.Literals(["1.0"]),
  type: NonEmptyString,
  source: NonEmptyString,
  id: NonEmptyString,
  time: NonEmptyString,
  datacontenttype: Schema.Literals(["application/json"]),
  data: Schema.Unknown,
})

export type ExternalActionInvoker = (input: {
  readonly tenantId: string
  readonly action: ExternalActionCatalogEntry
  readonly idempotencyKey: string
  readonly input: unknown
}) => Effect.Effect<unknown, ExternalProviderFailure | ExternalUnknownOutcome, never>

export type ExternalScopeAuthorizer = (input: {
  readonly tenantId: string
  readonly requiredScope: string
}) => Effect.Effect<void, ExternalAuthorizationDenied, never>

export type InvokeExternalActionInput = {
  readonly tenantId: string
  readonly action: ExternalActionCatalogEntry
  readonly idempotencyKey: string
  readonly input: unknown
}

export type IngestExternalEventInput = {
  readonly tenantId: string
  readonly event: ExternalEventCatalogEntry
  readonly envelope: unknown
}

export type ExternalEventIngestionResult = {
  readonly duplicate: boolean
  readonly eventId: string
  readonly eventType: string
  readonly eventVersion: number
  readonly payload: unknown
}

export type ExternalConnectorRuntime = {
  readonly invokeAction: (
    input: InvokeExternalActionInput,
  ) => Effect.Effect<
    unknown,
    | ExternalActionNotAllowlisted
    | ExternalAuthorizationDenied
    | ExternalIdempotencyConflict
    | ExternalPayloadInvalid
    | ExternalProviderFailure
    | ExternalUnknownOutcome
  >
  readonly ingestEvent: (
    input: IngestExternalEventInput,
  ) => Effect.Effect<ExternalEventIngestionResult, ExternalPayloadInvalid>
}

export const ExternalWebhookEnvelope = WebhookIngestion

const validateTenant = (tenantId: string): boolean => Schema.is(Uuid)(tenantId)
const validateNonEmpty = (value: string): boolean => Schema.is(NonEmptyString)(value)
const decodeExternalSchema = (schema: Schema.Top, input: unknown) =>
  Schema.decodeUnknownEffect(schema as Schema.Codec<unknown, unknown, never, never>)(input)

export const makeExternalConnectorRuntime = (options: {
  readonly store?: ExternalConnectorStore
  readonly authorizeScope: ExternalScopeAuthorizer
  readonly invoke: ExternalActionInvoker
}): ExternalConnectorRuntime => {
  const store = options.store ?? makeMemoryExternalConnectorStore()

  // bounded retry stops at the catalog's declared maxAttempts.
  const invokeWithBoundedRetry = (
    input: InvokeExternalActionInput,
    attempt: number,
  ): Effect.Effect<unknown, ExternalProviderFailure | ExternalUnknownOutcome> =>
    options.invoke(input).pipe(
      Effect.result,
      Effect.flatMap((result) => {
        if (Result.isSuccess(result)) return Effect.succeed(result.success)
        if (
          result.failure instanceof ExternalProviderFailure &&
          result.failure.retryable &&
          attempt < input.action.retryPolicy.maxAttempts
        ) {
          return invokeWithBoundedRetry(input, attempt + 1)
        }
        return Effect.fail(result.failure)
      }),
    )

  const invokeAction: ExternalConnectorRuntime["invokeAction"] = (input) =>
    Effect.gen(function* () {
      if (!validateTenant(input.tenantId) || !validateNonEmpty(input.idempotencyKey)) {
        return yield* Effect.fail(
          new ExternalPayloadInvalid({
            boundary: "external.action.invocation",
            identifier: input.action.id,
          }),
        )
      }
      if (!isAllowlistedExternalAction(input.action) || input.action.stability !== "PUBLIC") {
        return yield* Effect.fail(
          new ExternalActionNotAllowlisted({
            tenantId: input.tenantId,
            actionId: input.action.id,
          }),
        )
      }

      yield* options.authorizeScope({
        tenantId: input.tenantId,
        requiredScope: input.action.requiredScope,
      })
      const decodedInput = yield* decodeExternalSchema(input.action.inputSchema, input.input)
        .pipe(
          Effect.mapError(() =>
            new ExternalPayloadInvalid({
              boundary: "external.action.input",
              identifier: input.action.id,
            })
          ),
        )
      const existing = yield* store.getInvocation(input.tenantId, input.idempotencyKey)
      if (existing !== undefined) {
        if (
          existing.actionId !== input.action.id ||
          existing.actionVersion !== input.action.version
        ) {
          return yield* Effect.fail(
            new ExternalIdempotencyConflict({
              tenantId: input.tenantId,
              idempotencyKey: input.idempotencyKey,
            }),
          )
        }
        if (existing.status === "unknown") {
          return yield* Effect.fail(
            new ExternalUnknownOutcome({
              tenantId: input.tenantId,
              actionId: input.action.id,
              idempotencyKey: input.idempotencyKey,
            }),
          )
        }
        return existing.output
      }

      const output = yield* invokeWithBoundedRetry({ ...input, input: decodedInput }, 1).pipe(
        Effect.tapError((error) =>
          error instanceof ExternalUnknownOutcome
            ? store.putInvocation({
              tenantId: input.tenantId,
              actionId: input.action.id,
              actionVersion: input.action.version,
              idempotencyKey: input.idempotencyKey,
              status: "unknown",
            })
            : Effect.succeed(undefined)
        ),
      )
      const decodedOutput = yield* decodeExternalSchema(input.action.outputSchema, output)
        .pipe(
          Effect.mapError(() =>
            new ExternalPayloadInvalid({
              boundary: "external.action.output",
              identifier: input.action.id,
            })
          ),
        )
      yield* store.putInvocation({
        tenantId: input.tenantId,
        actionId: input.action.id,
        actionVersion: input.action.version,
        idempotencyKey: input.idempotencyKey,
        status: "accepted",
        output: decodedOutput,
      })
      return decodedOutput
    })

  const deduplicateEvent = (
    tenantId: string,
    source: string,
    providerEventId: string,
  ) => store.getEvent(tenantId, source, providerEventId)

  const ingestEvent: ExternalConnectorRuntime["ingestEvent"] = (input) =>
    Effect.gen(function* () {
      if (!validateTenant(input.tenantId) || input.event.stability !== "PUBLIC") {
        return yield* Effect.fail(
          new ExternalPayloadInvalid({
            boundary: "external.event.registration",
            identifier: input.event.id,
          }),
        )
      }
      const envelope = yield* Schema.decodeUnknownEffect(WebhookIngestion)(input.envelope).pipe(
        Effect.mapError(() =>
          new ExternalPayloadInvalid({
            boundary: "external.event.envelope",
            identifier: input.event.id,
          })
        ),
      )
      if (envelope.type !== input.event.id) {
        return yield* Effect.fail(
          new ExternalPayloadInvalid({
            boundary: "external.event.type",
            identifier: input.event.id,
          }),
        )
      }
      const payload = yield* decodeExternalSchema(input.event.payloadSchema, envelope.data)
        .pipe(
          Effect.mapError(() =>
            new ExternalPayloadInvalid({
              boundary: "external.event.payload",
              identifier: input.event.id,
            })
          ),
        )
      const existing = yield* deduplicateEvent(input.tenantId, envelope.source, envelope.id)
      if (existing !== undefined) {
        return {
          duplicate: true,
          eventId: existing.providerEventId,
          eventType: existing.eventType,
          eventVersion: existing.eventVersion,
          payload: existing.payload,
        }
      }
      const receipt: ExternalEventReceipt = {
        tenantId: input.tenantId,
        eventType: input.event.id,
        eventVersion: input.event.version,
        source: envelope.source,
        providerEventId: envelope.id,
        payload,
      }
      yield* store.putEvent(receipt)
      return {
        duplicate: false,
        eventId: envelope.id,
        eventType: input.event.id,
        eventVersion: input.event.version,
        payload,
      }
    })

  return { invokeAction, ingestEvent }
}

export { makeMemoryExternalConnectorStore }
export type { ExternalConnectorStore, ExternalEventReceipt, ExternalInvocationReceipt }
