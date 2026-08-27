# Identity and Principal Architecture

> **Status:** Canonical
>
> **Owns:** External authentication and IAM boundaries, internal account mapping,
> principal kinds, session and revocation semantics, tenant-context resolution,
> and actor/delegation provenance.
>
> **Implementation status:** Target boundary. The current local auth/session
> implementation remains unchanged until a later implementation phase.
>
> **Related documents**
>
> - Active architecture: [`./architecture-spec-v4.md`](./architecture-spec-v4.md)
> - API boundary: [`./api.md`](./api.md)
> - Authorization: [`./authorization.md`](./authorization.md)
> - Integration surface: [`./integration-architecture.md`](./integration-architecture.md)
> - Scope and identity model:
>   [`../decisions/0021-define-p0-scope-and-identity-model.md`](../decisions/0021-define-p0-scope-and-identity-model.md)
> - User-account lifecycle:
>   [`../decisions/0030-user-account-lifecycle-and-tenant-membership.md`](../decisions/0030-user-account-lifecycle-and-tenant-membership.md)
> - IdentityProvider boundary:
>   [`../decisions/0058-define-provider-neutral-identity-and-authentication-boundary.md`](../decisions/0058-define-provider-neutral-identity-and-authentication-boundary.md)

## Position

RITSEI does not implement a second IAM product. RITSEI consumes a configured provider-neutral
**IdentityProvider** using OIDC/OAuth2 as the external identity contract. **ZITADEL is the recommended
adapter, not a required dependency.** RITSEI remains the owner of ERP account mapping, tenant
membership, authorization, business policy, and audit evidence.

Authentication answers:

```text
Who presented a valid identity assertion?
```

Authorization answers:

```text
What may that principal do in this tenant and against this resource?
```

A valid external assertion never grants an ERP capability by itself.

## Ownership split

```text
Configured IdentityProvider
  -> OIDC/OAuth2 assertion validation, provider session/credential operations,
     human and machine authentication

Recommended ZITADEL adapter
  -> one supported implementation of the IdentityProvider contract

RITSEI identity
  -> internal UserAccount, external-subject mapping, account status,
     and RITSEI account lifecycle

RITSEI party
  -> PartyRepresentation and party-side identity relationships

RITSEI auth boundary
  -> assertion validation, provider error mapping, request Principal,
     revocation handling, and authentication middleware

RITSEI authorization
  -> tenant membership, roles, capabilities, grants, scopes, relationship checks,
     SoD, domain-policy coordination, final decision, and explanation
```

Provider SDKs, issuer metadata, signing keys, client secrets, and provider-specific response types
remain inside the selected authentication adapter or composition root. They are not public domain
contracts.

## External subject mapping

An external subject from the selected IdentityProvider is mapped to a RITSEI `UserAccount` using at
least:

```text
issuer + subject
```

Email, display name, organization name, or a provider-local numeric ID is not an internal identity
key. One external subject maps deterministically to one RITSEI account within the declared issuer
scope. Mapping conflicts fail closed and are handled as identity-configuration failures, not as a
new authorization grant.

Provider organizations, projects, groups, roles, and claims do not implicitly become RITSEI tenants,
roles, capabilities, scopes, or grants. Any mapping is an explicit RITSEI-controlled provisioning or
configuration operation.

## Principal kinds

RITSEI carries principal kind and provenance explicitly:

```text
HumanPrincipal
ServicePrincipal
ProcessPrincipal
DelegatedPrincipal
```

A request context preserves, where applicable:

```text
principalId
principalKind
issuer and subject reference
session or token provenance
initiator
current actor
effective execution principal
delegated authority
correlationId
causationId
tenant selection
```

A `ProcessPrincipal` identifies durable execution and does not grant capabilities. A
`DelegatedPrincipal` records both the effective actor and the delegating authority. Impersonation is
never inferred from a token claim or hidden in a replacement user ID.

## Session and revocation

The target external API profile is:

```text
OIDC/OAuth2 assertion from the selected IdentityProvider
  -> RITSEI authentication adapter
  -> validated RITSEI Principal
```

The selected external provider owns interactive session and credential lifecycle for that profile.
RITSEI must not create a second password, MFA, or independent long-lived credential authority. A
local session record may exist during a migration or for an explicitly approved BFF/session profile,
but it cannot override selected-provider revocation or become an alternate identity source.

Authentication caches are bounded and versioned. Revocation-sensitive commands and reads require
current RITSEI account status and membership; stale or unavailable revocation evidence fails closed.
Disabling a RITSEI account denies new authorization and invalidates its RITSEI access even when the
external provider still reports the subject as active.

## Tenant context

Tenant IDs from headers, URLs, cookies, token claims, external-provider organizations, and client
payloads are untrusted selectors. RITSEI resolves the selected tenant through its own membership and
scope contracts:

```text
untrusted tenant selector
  -> validate identifier
  -> load active RITSEI membership
  -> resolve tenant-scoped capability and scope
  -> continue to authorization
```

No IdP organization claim, session, or provider relationship bypasses RITSEI membership. PostgreSQL
composite keys and RLS remain defense in depth and an independent tenant boundary.

## Machine identities

Machine identities are explicit `ServicePrincipal` values. They use the selected IdentityProvider's
machine credentials/client authentication, map to a RITSEI service identity, and receive only named
business capabilities such as:

```text
sales.order.import
customer.sync
```

A machine identity is not mapped to an administrator role by default. Human delegation, if allowed,
requires an explicit contract, expiry, scope, separation-of-duties evaluation, and audit provenance.

## Provisioning and deprovisioning

External-provider provisioning signals may create or update an external-subject mapping, but RITSEI
owns:

- internal `UserAccount` status;
- tenant membership and suspension;
- capability, role, grant, and scope assignment;
- PartyRepresentation through the `party` owner;
- removal and cross-tenant effects.

Provisioning is idempotent. A partial account/membership sequence remains inaccessible until the
required RITSEI membership is present. No provider group is silently promoted to ERP authority.

## Failure behavior

```text
invalid or missing assertion        -> 401
valid identity, denied RITSEI authz -> 403 or safe 404 policy
selected provider unavailable       -> typed unavailable response; never allow
stale revocation or tenant mapping  -> fail closed for sensitive work
```

Raw provider errors, tokens, claims, signing details, and credentials never enter public DTOs,
process definitions, audit payloads, or domain failures.

## Non-goals

This document does not define:

- ERP roles, capabilities, grants, or business policies;
- object relationship policy implementation;
- domain invariants such as amount, inventory, or fiscal-period rules;
- a general audit storage schema;
- a second local IAM or password system.

Those concerns remain owned by [`authorization.md`](./authorization.md), the owning domain, and the
accepted audit boundary in
[`../decisions/0037-define-p3-audit-event-and-delivery-boundary.md`](../decisions/0037-define-p3-audit-event-and-delivery-boundary.md).
