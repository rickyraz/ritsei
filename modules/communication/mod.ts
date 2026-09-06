export {
  CommunicationConfiguration,
  CommunicationPolicy,
  CommunicationProcessingResult,
  CommunicationService,
  CommunicationTestTransport,
  ProcessPurchaseOrderConfirmedInput,
  RetryCommunicationInput,
} from "./src/contract.ts"
export type {
  CommunicationConfiguration as CommunicationConfigurationShape,
  CommunicationProcessingResult as CommunicationProcessingResultShape,
  CommunicationService as CommunicationServiceShape,
} from "./src/contract.ts"
export type { CommunicationTestLayerOptions } from "./src/layers.ts"
export {
  CommunicationNotFound,
  CommunicationStateFailure,
  UnsupportedCommunicationEvent,
} from "./src/errors.ts"
export { makeCommunicationTestLayer } from "./src/layers.ts"
