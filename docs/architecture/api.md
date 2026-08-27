# HTTP API Security and Authorization Boundary

> **Status:** Canonical
>
> **Owns:** HTTP authentication, trusted principal construction, tenant-context
> resolution, request authorization order, transport failures, and API-side
> security boundaries.
>
> **Implementation status:** Target boundary. This documentation change does not
> activate provider adapters or alter the current API implementation.
>
> **Related documents**
>
> - Active architecture: [`./architecture-spec-v4.md`](./architecture-spec-v4.md)
> - Identity and principals: [`./identity-and-principals.md`](./identity-and-principals.md)
> - Authorization: [`./authorization.md`](./authorization.md)
> - Frontend: [`./frontend.md`](./frontend.md)
> - Integration surface: [`./integration-architecture.md`](./integration-architecture.md)
> - Effect HTTP decision:
>   [`../decisions/0012-use-drizzle-schema-flow-and-effect-http.md`](../decisions/0012-use-drizzle-schema-flow-and-effect-http.md)

## Request pipeline

Every protected request follows one owner-controlled path:

```text
HTTP request
   ↓
authenticate with the RITSEI auth boundary
   ↓
construct validated human/service/process/delegated Principal
   ↓
decode bounded route, headers, and payload
   ↓
resolve the untrusted tenant selector through RITSEI membership
   ↓
check the precomputed permission matrix
   ↓
check organizational scope
   ↓
check object relationship through the RITSEI AuthZ abstraction
   ↓
validate domain policy and current business state
   ↓
evaluate Separation of Duties
   ↓
execute the owning public command/query
   ↓
record safe authorization and business audit evidence
```

Authentication, coarse capability authorization, object authorization, and domain validity are
separate decisions. A later decision cannot be inferred from an earlier one.

## Authentication boundary

The API accepts only an approved authentication assertion from the configured IdentityProvider,
normally an OIDC/OAuth2 access token. ZITADEL is the recommended provider adapter, not a requirement.
The RITSEI authentication adapter validates issuer, audience, signature, lifetime, and required
subject semantics before constructing a Principal.

The API does not trust raw provider claims as ERP authority. Provider-specific SDK types, claims,
keys, tokens, and failure payloads stay below the public API and domain contracts.

Machine-to-machine requests use explicit `ServicePrincipal` context. They do not become human users
and do not receive administrative capabilities implicitly.

## Tenant resolution

`x-tenant-id`, a tenant URL segment, cookie, payload field, or IdP organization claim is an
**untrusted tenant selector**. The server must independently:

1. validate its shape;
2. resolve the RITSEI tenant;
3. require an active RITSEI membership;
4. derive the tenant-scoped capability and scope context;
5. enforce PostgreSQL tenant constraints and RLS where applicable.

A request must never query a tenant before this context is resolved. Tenant selection is not tenant
authorization.

## Authorization order

The API invokes public RITSEI domain services, which use the AuthZ Kernel abstraction. The API must
not call a relationship provider directly and must not implement business policy in handlers.

```text
Identity
  -> Capability
  -> Scope
  -> Object relationship
  -> Domain policy
  -> SoD
  -> Allow or deny
```

The permission matrix is the cheap coarse-grained gate. It does not prove access to a particular
record. Resource routes must close the BOLA class of bugs by applying tenant, scope, relationship,
and owner-domain checks to the requested object.

Queries use owner-controlled server-side filters, candidate-resource lookup, batch relationship
checks, or an approved authorization projection. They must not fetch all records and filter them in
the application after unauthorized rows have crossed the data boundary.

## Transport failures

The API keeps these outcomes distinct:

```text
401 -> missing, invalid, or expired authentication
403 -> authenticated but not authorized
404 -> safe resource-not-found response where existence must not be disclosed
409 -> business, concurrency, or idempotency conflict
503 -> unavailable authentication/authorization dependency or canonical service
```

Provider outages, stale relationship state, unknown authorization results, and missing tenant
context never become `ALLOW`. The response must not expose raw SQL, provider errors, policy internals,
credentials, or sensitive existence signals.

## Explainable denials

High-risk decisions return or record a safe explanation envelope such as:

```text
allowed
reason
capability
resource
scope
relationshipResult
businessPolicyResult
sodResult
policyVersion
grantVersion
requestId
```

The transport may expose a user-safe reason and remediation text. Raw relationship-provider tuples,
private policy expressions, internal database details, and sensitive object existence remain protected.

## Commands, queries, and audit

Commands carry idempotency, correlation, causation, and principal provenance. Queries remain
current-authority checks when the result is sensitive; projection membership or search rank is not
authorization evidence.

Authorization decision evidence is not a replacement for owner-local business history. The audit
boundary in ADR-0037 governs retention, redaction, and business-fact authority.

## Frontend boundary

Frontend route guards, hidden controls, disabled buttons, cached permission matrices, and IdP claims
are UX aids only. The backend repeats current authentication, tenant, capability, relationship,
domain-policy, and SoD checks. Tenant switching invalidates tenant-scoped server-state caches and
never reuses authorization results across tenants.

## Non-goals

This document does not define provider schemas, ERP capability ownership, relationship-provider
schemas, business invariants, or database table layout. Those remain below the API boundary.
