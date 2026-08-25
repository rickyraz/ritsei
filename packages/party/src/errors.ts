import * as Schema from "effect/Schema"
import type { DatabaseFailure } from "../../kernel/mod.ts"
import { AuthorizationDenied } from "../../authorization/mod.ts"
import type { PartyRelationshipKind, PartyRepresentationKind, PartyRole } from "./contract.ts"

export class PartyNotFound extends Schema.TaggedError<PartyNotFound>()("PartyNotFound", {
  tenantId: Schema.String,
  partyId: Schema.String,
}) {}
export class PartyRoleAlreadyAssigned extends Schema.TaggedError<PartyRoleAlreadyAssigned>()(
  "PartyRoleAlreadyAssigned",
  {
    tenantId: Schema.String,
    partyId: Schema.String,
    role: Schema.Literals(["customer", "supplier", "employee", "partner"]),
  },
) {}
export class PartyRelationshipAlreadyExists
  extends Schema.TaggedError<PartyRelationshipAlreadyExists>()(
    "PartyRelationshipAlreadyExists",
    {
      tenantId: Schema.String,
      partyId: Schema.String,
      legalEntityId: Schema.String,
      kind: Schema.Literals(["customer", "supplier", "employee", "partner"]),
    },
  ) {}
export class PartyRelationshipRoleNotAssigned
  extends Schema.TaggedError<PartyRelationshipRoleNotAssigned>()(
    "PartyRelationshipRoleNotAssigned",
    {
      tenantId: Schema.String,
      partyId: Schema.String,
      kind: Schema.Literals(["customer", "supplier", "employee", "partner"]),
    },
  ) {}
export class PartyRelationshipNotFound extends Schema.TaggedError<PartyRelationshipNotFound>()(
  "PartyRelationshipNotFound",
  { tenantId: Schema.String, relationshipId: Schema.String },
) {}
export class ExternalIdentifierAlreadyAssigned
  extends Schema.TaggedError<ExternalIdentifierAlreadyAssigned>()(
    "ExternalIdentifierAlreadyAssigned",
    {
      tenantId: Schema.String,
      provider: Schema.String,
      scheme: Schema.String,
      scope: Schema.String,
      legalEntityId: Schema.NullOr(Schema.String),
      value: Schema.String,
    },
  ) {}
export class OrganizationRequired extends Schema.TaggedError<OrganizationRequired>()(
  "OrganizationRequired",
  { tenantId: Schema.String, partyId: Schema.String },
) {}
export class LegalEntityAlreadyExists extends Schema.TaggedError<LegalEntityAlreadyExists>()(
  "LegalEntityAlreadyExists",
  { tenantId: Schema.String, organizationId: Schema.String },
) {}
export class LegalEntityNotFound extends Schema.TaggedError<LegalEntityNotFound>()(
  "LegalEntityNotFound",
  { tenantId: Schema.String, legalEntityId: Schema.String },
) {}
export class BranchAlreadyExists extends Schema.TaggedError<BranchAlreadyExists>()(
  "BranchAlreadyExists",
  { tenantId: Schema.String, legalEntityId: Schema.String, name: Schema.String },
) {}
export class PartyRepresentationUserAccountNotFound
  extends Schema.TaggedError<PartyRepresentationUserAccountNotFound>()(
    "PartyRepresentationUserAccountNotFound",
    { tenantId: Schema.String, userAccountId: Schema.String },
  ) {}
export class PartyRepresentationAlreadyExists
  extends Schema.TaggedError<PartyRepresentationAlreadyExists>()(
    "PartyRepresentationAlreadyExists",
    {
      tenantId: Schema.String,
      userAccountId: Schema.String,
      partyId: Schema.String,
      kind: Schema.String,
    },
  ) {}
export class PartyRepresentationNotFound extends Schema.TaggedError<PartyRepresentationNotFound>()(
  "PartyRepresentationNotFound",
  { tenantId: Schema.String, representationId: Schema.String },
) {}

export type PartyFailure =
  | AuthorizationDenied
  | DatabaseFailure
  | Schema.SchemaError
  | PartyNotFound
  | PartyRoleAlreadyAssigned
  | PartyRelationshipAlreadyExists
  | PartyRelationshipRoleNotAssigned
  | PartyRelationshipNotFound
  | ExternalIdentifierAlreadyAssigned
  | OrganizationRequired
  | LegalEntityAlreadyExists
  | LegalEntityNotFound
  | BranchAlreadyExists
  | PartyRepresentationUserAccountNotFound
  | PartyRepresentationAlreadyExists
  | PartyRepresentationNotFound

export type { PartyRelationshipKind, PartyRepresentationKind, PartyRole }
