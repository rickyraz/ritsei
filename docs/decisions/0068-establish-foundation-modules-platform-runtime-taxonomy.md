# ADR-0068: Establish the foundation, modules, platform, and runtime taxonomy

- Status: Accepted
- Date: 2026-09-01
- Amends: None
- Compatible with: ADR-0001, ADR-0046, ADR-0048, ADR-0067
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Canonical architecture: [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
> - Architecture enforcement: [`../architecture/architecture-enforcement.md`](../architecture/architecture-enforcement.md)

## Context

The former shared `packages/kernel` combined generic contracts, PostgreSQL lifecycle, cryptography,
financial readiness, jobs, and provider adapters. It also made `package` and business `module`
ambiguous. Moving folders without separating responsibility would preserve the same coupling under a
new name.

## Decision

Use four explicit repository boundaries:

- `foundation/` contains generic primitives and contracts: identifiers, money, fencing, jobs, and
  database/consistency ports. It must not depend on business modules or concrete platform adapters.
- `modules/` contains business capabilities. Each module keeps a public `mod.ts`; private stores,
  domain implementations, and owned persistence remain behind that entry point. Modules may depend
  on foundation, their own schema, and other modules only through public contracts.
- `platform/` contains concrete technical adapters for foundation and module ports, including
  PostgreSQL, cryptography, migrations, and TigerBeetle. Platform code may consume module public
  contracts but not module internals.
- `runtime/` contains application composition roots, HTTP, workers, migrators, configuration, and
  composition-boundary adapters. `apps/web/` remains the separate frontend application and `db/`
  remains schema and migration authority.

The dependency direction is:

```text
foundation <- modules <- runtime
foundation <- platform <- runtime
modules    <- platform
modules    <- apps/web
```

Arrows mean "may depend on". `modules` must not import `platform`; `foundation` must not import
`modules`, `platform`, `runtime`, or `db`; and cross-module imports must use public `mod.ts` entries.

## Alternatives Considered

### Keep the shared kernel

Rejected because it preserves central coupling and hides whether a dependency is a contract or an
implementation.

### Rename `packages` to `modules` without extraction

Rejected because physical folder names do not enforce responsibility boundaries.

### Split every domain into multiple repositories

Rejected because RITSEI remains a modular monolith and PostgreSQL transaction boundaries are still
local to the product runtime.

## Consequences

### Positive

- Generic contracts, business capabilities, infrastructure, and composition have visible owners.
- Dependency-direction checks can reject module-to-platform and foundation-to-business coupling.
- Staged moves remain possible because each business module retains its public entry point.

### Negative

- Relative imports, test discovery, migration ownership, Fallow, and roadmap evidence paths must be
  updated together.
- Platform adapters that implement domain ports remain intentionally coupled to the relevant public
  module contract.

### Risks

A path move can appear complete while stale tooling or documentation still encodes the old taxonomy.
The dependency-direction check, public-contract check, ownership check, and boundary tests are the
regression controls.

## Validation

The repository must pass `deno check .`, `deno task test`, `deno task boundary:test`,
`deno task boundary:lint`, and the foundation/module/platform/runtime dependency-direction test.

## Related Documents

- [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
- [`../architecture/architecture-enforcement.md`](../architecture/architecture-enforcement.md)
- [`../../tooling/dependency-direction/check.ts`](../../tooling/dependency-direction/check.ts)
