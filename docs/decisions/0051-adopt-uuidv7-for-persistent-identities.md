# ADR-0051: Adopt UUIDv7 for persistent identities

- Status: Accepted
- Date: 2026-08-25
- Amends: None
- Compatible with: ADR-0014 (separate internal and external identifiers)
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Canonical architecture: [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
> - PostgreSQL architecture: [`../architecture/postgresql-19-architecture.md`](../architecture/postgresql-19-architecture.md)
> - Testing strategy: [`../development/testing.md`](../development/testing.md)

## Context

RITSEI uses PostgreSQL `uuid` columns for domain entities, events, workflow records, and other
cross-boundary identities. PostgreSQL-owned primary keys already default to `uuidv7()`, but some
application-created identities still used `crypto.randomUUID()`, which produces UUIDv4 values.

UUIDv4 is valid for opaque random values, but its random ordering makes growing B-tree indexes less
local than time-ordered identifiers. RITSEI needs one policy that covers database-generated and
application-generated persistent identities without introducing sequential database coordination or
business-number semantics into primary keys.

## Decision

RITSEI adopts **UUIDv7 as the default for new persistent identities**.

- PostgreSQL-generated entity IDs continue to use the existing `uuidv7()` default.
- Application-created persistent IDs use the kernel-owned `uuidv7()` helper, implemented with
  `@std/uuid`'s `generate` API from `@std/uuid/v7`. Domain packages do not import the third-party
  package directly.
- New persistent entity IDs, stored event IDs, stored line IDs, and other index-visible identities
  use UUIDv7.
- `created_at` remains the canonical audit timestamp; UUIDv7 ordering is not a substitute for it.
- Existing UUIDv4 values are not migrated solely to change their version. UUIDv4 and UUIDv7 remain
  valid values in the PostgreSQL `uuid` type during the transition.
- UUIDv4 remains allowed for opaque ephemeral values such as process lease tokens and test-only
  fixture randomness when ordering is not part of the identity's semantics.
- Human-readable business numbers remain separate fields and must not be encoded into primary IDs.

The runtime dependency is pinned in the root manifest:

```text
@std/uuid: jsr:^1.1.1
```

The implementation boundary is `packages/kernel/src/ids.ts`; domain code calls the exported kernel
helper instead of binding itself to the package.

## Alternatives Considered

### Keep UUIDv4 everywhere

Rejected for new persistent identities because it preserves distributed generation but gives up the
ordering and index-locality properties needed by growing PostgreSQL tables.

### Use sequential BIGINT identities

Rejected as the default because identity generation would require database sequence coordination and
would expose a different identity type across distributed application boundaries.

### Use ULID or a custom identifier

Rejected for primary identities because UUIDv7 preserves the PostgreSQL `uuid` type and existing
UUID ecosystem while providing time-ordered semantics.

### Generate all IDs in PostgreSQL

Rejected as the only mechanism because some durable application and event identities must be known
before a write or passed across a transaction boundary. Both database and application generation must
share the same UUIDv7 policy.

## Consequences

### Positive

- New persistent IDs retain UUID interoperability and distributed generation.
- New B-tree inserts are generally more time-local than UUIDv4 inserts.
- Database defaults and application-generated IDs follow one identity policy.
- The package dependency is isolated behind the kernel boundary.
- Existing rows and external identifiers remain compatible during gradual adoption.

### Negative

- UUIDv7 embeds creation time in the identifier's high bits; it is not a secret token.
- The application now carries one small runtime dependency for IDs.
- UUIDv7 ordering is time-based, not a replacement for explicit ordering columns or timestamps.
- Mixed UUIDv4/UUIDv7 populations remain during migration of existing data.

### Risks

- Clock behavior and same-millisecond generation must not be treated as a business ordering
  guarantee.
- UUIDv7 must not be used where a secret, nonce, or authentication token is required.
- Any new explicit application ID can accidentally override a database UUIDv7 default; code review and
  boundary checks must preserve the policy.

## Validation

- `db/schema/common.ts` and migration snapshots retain PostgreSQL `uuidv7()` defaults.
- Production application-generated persistent IDs use the kernel UUIDv7 helper.
- Process lease tokens and test-only random fixtures remain explicitly outside the persistent-ID rule.
- The kernel ID test verifies UUID version 7 output.
- Full typecheck, formatting, lint, tests, and architecture boundary checks pass.

## Evidence

- RFC 9562: <https://www.rfc-editor.org/rfc/rfc9562>
- Buildkite, “Goodbye integers. Hello UUIDv7!”:
  <https://buildkite.com/resources/blog/goodbye-integers-hello-uuids/>
- CYBERTEC, “Unexpected downsides of UUID keys in PostgreSQL”:
  <https://www.cybertec-postgresql.com/en/unexpected-downsides-of-uuid-keys-in-postgresql/>
- PlanetScale, “B-trees and database indexes”:
  <https://planetscale.com/blog/btrees-and-database-indexes>
- `@std/uuid` documentation: <https://jsr.io/@std/uuid/doc>
