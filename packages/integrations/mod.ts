export {
  defineExternalAction,
  defineExternalEvent,
  ExternalIntegrationProfile,
  ExternalProblemDetails,
  isAllowlistedExternalAction,
} from "./src/contract.ts"
export type {
  ExternalActionCatalogEntry,
  ExternalActionIdempotency,
  ExternalEventCatalogEntry,
} from "./src/contract.ts"
export { simulateWithoutSideEffect } from "./src/catalog.ts"
export type {
  ExternalCatalogEntry,
  ExternalSimulationResult,
  SimulateExternalActionInput,
} from "./src/catalog.ts"
export {
  ExternalActionNotAllowlisted,
  ExternalAuthorizationDenied,
  ExternalCompatibilityMismatch,
  ExternalIdempotencyConflict,
  ExternalPayloadInvalid,
  ExternalPayloadLimitExceeded,
  ExternalProviderFailure,
  ExternalUnknownOutcome,
} from "./src/errors.ts"
export {
  ExternalWebhookEnvelope,
  makeExternalConnectorRuntime,
  makeMemoryExternalConnectorStore,
  WebhookIngestion,
} from "./src/runtime.ts"
export {
  assessExternalDelivery,
  ExternalDeliveryState,
  ExternalProviderStatus,
  redactExternalPayload,
} from "./src/reliability.ts"
export type { ExternalReliabilityDecision, ExternalReliabilityInput } from "./src/reliability.ts"
export type {
  ExternalActionInvoker,
  ExternalConnectorRuntime,
  ExternalEventIngestionResult,
  ExternalScopeAuthorizer,
  IngestExternalEventInput,
  InvokeExternalActionInput,
} from "./src/runtime.ts"
export type {
  ExternalConnectorStore,
  ExternalEventReceipt,
  ExternalInvocationReceipt,
  ExternalInvocationStatus,
} from "./src/store.ts"
