import * as Schema from "effect/Schema"

import type { ActionCompensation, CatalogStability, CompatibilityRange } from "../../catalog/mod.ts"

export const ExternalIntegrationProfile = {
  actionTransport: "HTTPS + JSON",
  openApiStandard: "OpenAPI",
  openApiVersion: "3.2.0",
  eventTransport: "CloudEvents 1.0.x over HTTPS/Webhook",
  asyncApiVersion: "3.1.0",
  authentication: "OAuth 2.0",
  oauthSecurityBaseline: "RFC 9700",
  problemDetails: "RFC 9457",
} as const

export type ExternalActionIdempotency = "required" | "inherent" | "unsupported"

export type ExternalActionCatalogEntry = {
  readonly kind: "ExternalAction"
  readonly id: string
  readonly version: number
  readonly connectorId: string
  readonly operationId: string
  readonly stability: CatalogStability
  readonly compatibilityRange: CompatibilityRange
  readonly inputSchema: Schema.Top
  readonly outputSchema: Schema.Top
  readonly errorSchemas: readonly Schema.Top[]
  readonly requiredScope: string
  readonly idempotencyStrategy: ExternalActionIdempotency
  readonly timeoutPolicy: { readonly timeoutMs: number }
  readonly retryPolicy: { readonly maxAttempts: number }
  readonly compensation: ActionCompensation
  readonly allowlisted: boolean
}

export type ExternalEventCatalogEntry = {
  readonly kind: "ExternalEvent"
  readonly id: string
  readonly version: number
  readonly connectorId: string
  readonly source: string
  readonly stability: CatalogStability
  readonly compatibilityRange: CompatibilityRange
  readonly payloadSchema: Schema.Top
  readonly envelope: "CloudEvents 1.0.x"
  readonly transport: "HTTPS/Webhook"
  readonly scope: readonly string[]
  readonly correlationFields: readonly string[]
  readonly filterableFields: readonly string[]
  readonly deduplicationKey: string
  readonly occurredAtSemantics: "provider_time" | "ingest_time"
}

export const ExternalProblemDetails = Schema.Struct({
  type: Schema.String.check(Schema.isPattern(/\S/)),
  title: Schema.String.check(Schema.isPattern(/\S/)),
  status: Schema.Int.check(
    Schema.isGreaterThanOrEqualTo(400),
    Schema.isLessThanOrEqualTo(599),
  ),
  detail: Schema.String.check(Schema.isPattern(/\S/)),
})

export const defineExternalAction = <const Entry extends ExternalActionCatalogEntry>(
  entry: Entry,
): Entry => entry

export const defineExternalEvent = <const Entry extends ExternalEventCatalogEntry>(
  entry: Entry,
): Entry => entry

export const isAllowlistedExternalAction = (
  entry: ExternalActionCatalogEntry,
): boolean => entry.allowlisted
