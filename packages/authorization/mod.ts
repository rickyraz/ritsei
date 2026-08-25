export {
  AuthorizationCapabilities,
  CapabilityCatalog,
  CapabilityDefinition,
  CapabilityDefinitions,
  CapabilityId,
  CapabilityIds,
  CapabilityOwner,
  CapabilityScope,
  CapabilityStability,
  getCapabilityDefinition,
  isCapabilityIdShape,
  isKnownCapability,
  LegacyCapabilityIds,
} from "./src/capabilities.ts"
export type { CapabilityDefinition as CapabilityDefinitionType } from "./src/capabilities.ts"

export {
  AddTenantMembershipInput,
  AuthorizationDecision,
  AuthorizationInput,
  AuthorizationService,
  Capability,
  GrantCapabilityInput,
  TenantMembership,
  TenantMembershipInput,
  TenantMembershipStatus,
} from "./src/contract.ts"
export type {
  AuthorizationService as AuthorizationServiceShape,
  Capability as CapabilityType,
  TenantMembership as TenantMembershipType,
  TenantMembershipStatus as TenantMembershipStatusType,
} from "./src/contract.ts"

export {
  AuthorizationDenied,
  CapabilityAlreadyGranted,
  TenantMembershipAlreadyExists,
  TenantMembershipNotActive,
  TenantMembershipNotFound,
  TenantMembershipUserAccountNotFound,
} from "./src/errors.ts"

export { makeAuthorizationService } from "./src/service.ts"
export { AuthorizationLive, makeAuthorizationTestLayer } from "./src/layers.ts"
