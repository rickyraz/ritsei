# ADR-0058: Define a Provider-Neutral Identity and Authentication Boundary

- Status: Accepted
- Date: 2026-08-27
- Amends: ADR-0030 only for the authentication/session provider boundary
- Compatible with: ADR-0014, ADR-0021, ADR-0006, ADR-0019
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Identity and principals: [`../architecture/identity-and-principals.md`](../architecture/identity-and-principals.md)
> - API boundary: [`../architecture/api.md`](../architecture/api.md)
> - Authorization architecture: [`../architecture/authorization.md`](../architecture/authorization.md)
> - User-account lifecycle:
>   [`./0030-user-account-lifecycle-and-tenant-membership.md`](./0030-user-account-lifecycle-and-tenant-membership.md)
> - Scope and identity model: [`./0021-define-p0-scope-and-identity-model.md`](./0021-define-p0-scope-and-identity-model.md)

## Context

RITSEI needs mature authentication and IAM capabilities without making the ERP modular monolith a
second identity product. Login, MFA, passkeys, SSO, external identity providers, machine
credentials, sessions, and credential lifecycle have a different ownership boundary from ERP tenant
membership, capabilities, scopes, SoD, and business policy.

The repository has `identity` and `auth` packages with a local UserAccount/session baseline. The
target must preserve those RITSEI contracts while defining a provider-neutral external identity
boundary. Provider groups, organizations, roles, and claims must never become implicit ERP authority.

## Decision

Adopt a provider-neutral **IdentityProvider** boundary using OIDC/OAuth2 as the external identity
contract. ZITADEL is the recommended adapter, but it is not a required dependency or deployment
service for RITSEI.

```text
Configured IdentityProvider
  -> OIDC/OAuth2 assertion validation, provider session/credential operations,
     human and machine authentication

RITSEI identity
  -> internal UserAccount and issuer+subject mapping

RITSEI auth boundary
  -> validate the selected provider assertion and construct the RITSEI Principal

RITSEI authorization
  -> tenant membership, roles, capabilities, grants, scopes, SoD, and policy
```

The selected provider is a composition-root/deployment concern. Public contracts expose only
provider-neutral RITSEI principals, authentication outcomes, and provenance. A deployment must select
an approved authentication profile; the absence of ZITADEL is not an unauthenticated mode.

The supported profiles are:

```text
Recommended
  OIDC/OAuth2 + ZITADEL adapter

Portable
  OIDC/OAuth2 + another approved external identity adapter

Transitional
  explicitly approved local/BFF session adapter during migration
```

The transitional profile does not create an implicit alternate authority. It remains bounded by the
same RITSEI principal, tenant, membership, authorization, revocation, and audit contracts.

### Authentication and session model

The target external API profile validates OIDC/OAuth2 assertions at the RITSEI authentication
boundary. The selected external provider owns interactive sessions and credential lifecycle for that
profile. RITSEI must not create a second password, MFA, or independent long-lived credential
authority.

A local session implementation may remain as an explicitly selected migration or BFF compatibility
path. It cannot override provider revocation, create an unauthenticated fallback, or silently create
a second session model.

Provider selection must not leak into domain contracts, capability IDs, tenant policy, or audit
semantics. Switching from ZITADEL to another approved adapter must not change RITSEI authorization
meaning.

### Mapping and tenant authority

RITSEI maps an external subject using `issuer + subject` to one internal `UserAccount`. Email and
provider display data are not identity keys. Provider organizations, projects, groups, roles, and
claims are untrusted inputs for ERP authorization.

RITSEI owns tenant membership, membership status, roles, capabilities, grants, scopes, and SoD.
Tenant selection from a header, URL, cookie, payload, or provider claim must be independently
validated by RITSEI. PostgreSQL tenant constraints and RLS remain defense in depth.

### Human and machine principals

The selected IdentityProvider may authenticate human and machine identities. RITSEI constructs
explicit `HumanPrincipal`, `ServicePrincipal`, `ProcessPrincipal`, or `DelegatedPrincipal` context.
Machine principals receive named business capabilities and never become administrators by default.
Delegated execution preserves initiator, effective actor, scope, expiry, and audit provenance.

### Revocation and failure

RITSEI revalidates internal account status, active tenant membership, capability, and scope after
authentication. Disabling an internal account or suspending membership denies access even if the
external provider subject remains active.

Invalid assertions return authentication failure. Selected-provider outage, unavailable revocation
evidence, unavailable adapter configuration, ambiguous subject mapping, or invalid tenant context
fails closed for protected work. No authentication or provider failure may fall through to an allow
decision or an unauthenticated local mode.

### Provisioning

Provider provisioning is an idempotent mapping operation. It may establish or update an
external-subject reference, but it does not grant tenant membership or capabilities. RITSEI owns
membership, account status, and cross-tenant effects; `party` owns `PartyRepresentation`. Partial
provisioning leaves the account inaccessible until the required RITSEI membership exists.

## Alternatives Considered

### Make ZITADEL a required RITSEI dependency

Rejected. ZITADEL remains the recommended supported adapter, but hard-coding it raises deployment
coupling and prevents installations from using an existing approved OIDC/OAuth2 identity provider.

### Build RITSEI IAM internally

Rejected. It duplicates security-sensitive identity, credential, MFA, SSO, session, and machine
identity behavior that is not ERP business authority.

### Treat provider organizations or roles as ERP authorization

Rejected. Provider topology and claims do not encode RITSEI tenant membership, business capabilities,
scopes, SoD, or domain policy.

### Keep independent local credentials and provider credentials

Rejected for the target external-provider profiles. Two credential authorities create ambiguous
revocation and recovery semantics. A local session may remain only as an explicitly bounded
migration/BFF compatibility path.

### Use email as the internal identity key

Rejected. Email changes, aliases, and issuer collisions do not define stable identity ownership.

## Consequences

### Positive

- RITSEI avoids implementing a second IAM product.
- ZITADEL remains a first-class recommended deployment option.
- Existing installations can use another approved OIDC/OAuth2 provider.
- ERP membership and authorization remain tenant-aware and RITSEI-owned.
- Provider claims cannot silently widen business authority.
- Authentication failures and authorization denials remain separate.
- Provider replacement does not change public RITSEI authorization contracts.

### Negative

- RITSEI needs external-subject mapping and selected-provider outage handling.
- Revocation and provisioning require explicit synchronization and revalidation.
- Each supported adapter needs conformance coverage.
- The current local session implementation requires a later migration decision.

### Risks

- A provider organization or group may be mistaken for a tenant or role.
- A stale token or cache may outlive account or membership revocation.
- Machine clients may be over-granted if capabilities are not explicit.
- Provider switching may be implemented as a semantic change instead of an adapter change.
- Provisioning may create an inaccessible orphan account if membership fails.

## Validation

This decision is validated when the implementation can prove:

- approved OIDC/OAuth2 adapters produce the same provider-neutral Principal contract;
- valid, invalid, expired, and wrong-audience assertions map to stable API outcomes;
- `issuer + subject` mapping is deterministic and collision-safe;
- provider claims cannot grant a tenant, role, capability, or scope without RITSEI state;
- account disable and membership suspension revoke protected access;
- human, machine, process, and delegated principal provenance survives a request and command;
- selected-provider outage, stale revocation, and ambiguous mapping fail closed;
- no public contract exposes provider SDK types, tokens, credentials, or raw claims;
- provisioning retries are idempotent and partial membership cannot authorize access;
- switching between approved adapters does not change authorization, SoD, policy, or audit meaning.

## Related Documents

- [`../architecture/identity-and-principals.md`](../architecture/identity-and-principals.md)
- [`../architecture/api.md`](../architecture/api.md)
- [`../architecture/authorization.md`](../architecture/authorization.md)
- [`./0030-user-account-lifecycle-and-tenant-membership.md`](./0030-user-account-lifecycle-and-tenant-membership.md)
