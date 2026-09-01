import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import {
  type ExternalActionNotAllowlisted,
  type ExternalAuthorizationDenied,
  type ExternalIdempotencyConflict,
  ExternalPayloadInvalid,
  type ExternalProviderFailure,
  type ExternalUnknownOutcome,
} from "./errors.ts"
import { type ExternalDeliveryStore, makeMemoryExternalDeliveryStore } from "./delivery-store.ts"
import {
  type ExternalActionInvoker,
  type ExternalConnectorRuntime,
  type ExternalConnectorStore,
  type ExternalEventIngestionResult,
  type ExternalScopeAuthorizer,
  type IngestExternalEventInput,
  type InvokeExternalActionInput,
  makeExternalConnectorRuntime,
  WebhookIngestion,
} from "./runtime.ts"

const Uuid = Schema.String.check(Schema.isUUID())
const NonEmptyString = Schema.String.check(Schema.isPattern(/\S/))

export type HttpsSignatureVerifier = (input: {
  readonly tenantId: string
  readonly body: string
  readonly signature: string
}) => Effect.Effect<boolean, ExternalPayloadInvalid>

export type HttpsWebhookInput = IngestExternalEventInput & {
  readonly body: string
  readonly signature: string
  readonly correlationId: string
}

export type HttpsConnectorRuntime = {
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
  readonly ingestWebhook: (
    input: HttpsWebhookInput,
  ) => Effect.Effect<ExternalEventIngestionResult, ExternalPayloadInvalid>
}

// HTTPS action invocation stays outside PostgreSQL transactions and uses the existing typed runtime.
export const makeHttpsConnectorRuntime = (options: {
  readonly store?: ExternalConnectorStore
  readonly deliveryStore?: ExternalDeliveryStore
  readonly authorizeScope: ExternalScopeAuthorizer
  readonly invoke: ExternalActionInvoker
  readonly verifySignature: HttpsSignatureVerifier
}): HttpsConnectorRuntime => {
  const deliveryStore = options.deliveryStore ?? makeMemoryExternalDeliveryStore()
  const runtime: ExternalConnectorRuntime = makeExternalConnectorRuntime({
    store: options.store,
    authorizeScope: options.authorizeScope,
    invoke: options.invoke,
  })

  const ingestWebhook = (input: HttpsWebhookInput) =>
    Effect.gen(function* () {
      if (
        !Schema.is(Uuid)(input.tenantId) ||
        !Schema.is(NonEmptyString)(input.body) ||
        !Schema.is(NonEmptyString)(input.signature) ||
        !Schema.is(NonEmptyString)(input.correlationId)
      ) {
        return yield* Effect.fail(
          new ExternalPayloadInvalid({
            boundary: "external.https.webhook.input",
            identifier: input.event.id,
          }),
        )
      }
      const envelope = yield* Schema.decodeUnknownEffect(WebhookIngestion)(input.envelope).pipe(
        Effect.mapError(() =>
          new ExternalPayloadInvalid({
            boundary: "external.https.webhook.envelope",
            identifier: input.event.id,
          })
        ),
      )
      // The HTTPS webhook must verify signature before WebhookIngestion can deduplicate delivery.
      const verified = yield* options.verifySignature({
        tenantId: input.tenantId,
        body: input.body,
        signature: input.signature,
      })
      if (!verified) {
        return yield* Effect.fail(
          new ExternalPayloadInvalid({
            boundary: "external.https.webhook.signature",
            identifier: input.event.id,
          }),
        )
      }
      const result = yield* runtime.ingestEvent({
        tenantId: input.tenantId,
        event: input.event,
        envelope,
      })
      yield* deliveryStore.put({
        tenantId: input.tenantId,
        connectorId: input.event.connectorId,
        source: envelope.source,
        providerEventId: envelope.id,
        status: result.duplicate ? "duplicate" : "accepted",
        correlationId: input.correlationId,
      })
      return result
    })

  return { invokeAction: runtime.invokeAction, ingestWebhook }
}
