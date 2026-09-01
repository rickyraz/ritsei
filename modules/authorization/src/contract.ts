import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { Principal } from "../../auth/mod.ts"
import { DatabaseFailure } from "../../../foundation/mod.ts"
import { Capability as CapabilitySchema } from "./capabilities.ts"

export const Capability = CapabilitySchema
export type Capability = Schema.Schema.Type<typeof Capability>

export const TenantMembershipStatus = Schema.Literals(["active", "suspended"])
export type TenantMembershipStatus = Schema.Schema.Type<typeof TenantMembershipStatus>

export const TenantMembership = Schema.Struct({
  userAccountId: Schema.String,
  tenantId: Schema.String,
  status: TenantMembershipStatus,
})

export type TenantMembership = Schema.Schema.Type<typeof TenantMembership>

export const AuthorizationInput = Schema.Struct({
  principal: Principal,
  tenantId: Schema.String,
  capability: Capability,
})

export const GrantCapabilityInput = Schema.Struct({
  userAccountId: Schema.String,
  tenantId: Schema.String,
  capability: Capability,
})

export const AddTenantMembershipInput = Schema.Struct({
  userAccountId: Schema.String,
  tenantId: Schema.String,
})

export const TenantMembershipInput = Schema.Struct({
  userAccountId: Schema.String,
  tenantId: Schema.String,
})

export const AuthorizationDecision = Schema.Struct({
  allowed: Schema.Literal(true),
  tenantId: Schema.String,
  capability: Capability,
  grant: Schema.Literal("membership"),
})

export interface AuthorizationService {
  readonly authorize: (
    input: unknown,
  ) => Effect.Effect<
    Schema.Schema.Type<typeof AuthorizationDecision>,
    import("./errors.ts").AuthorizationDenied | DatabaseFailure | Schema.SchemaError
  >
  readonly addMember: (
    input: unknown,
  ) => Effect.Effect<
    TenantMembership,
    | import("./errors.ts").TenantMembershipAlreadyExists
    | import("./errors.ts").TenantMembershipUserAccountNotFound
    | DatabaseFailure
    | Schema.SchemaError
  >
  readonly getMember: (
    input: unknown,
  ) => Effect.Effect<
    TenantMembership,
    import("./errors.ts").TenantMembershipNotFound | DatabaseFailure | Schema.SchemaError
  >
  readonly listMembers: (
    tenantId: string,
  ) => Effect.Effect<readonly TenantMembership[], DatabaseFailure>
  readonly suspendMember: (
    input: unknown,
  ) => Effect.Effect<
    TenantMembership,
    import("./errors.ts").TenantMembershipNotFound | DatabaseFailure | Schema.SchemaError
  >
  readonly activateMember: (
    input: unknown,
  ) => Effect.Effect<
    TenantMembership,
    import("./errors.ts").TenantMembershipNotFound | DatabaseFailure | Schema.SchemaError
  >
  readonly removeMember: (
    input: unknown,
  ) => Effect.Effect<
    void,
    import("./errors.ts").TenantMembershipNotFound | DatabaseFailure | Schema.SchemaError
  >
  readonly grant: (
    input: unknown,
  ) => Effect.Effect<
    void,
    | import("./errors.ts").CapabilityAlreadyGranted
    | import("./errors.ts").TenantMembershipNotFound
    | import("./errors.ts").TenantMembershipNotActive
    | DatabaseFailure
    | Schema.SchemaError
  >
}

export const AuthorizationService = Context.Service<AuthorizationService>(
  "RITSEI/AuthorizationService",
)
