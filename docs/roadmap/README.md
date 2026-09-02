# RITSEI Roadmap

> **Status:** Canonical roadmap index
>
> **Owns:** sequencing, dependencies, readiness gates, measures, and milestone exit criteria.
>
> **Does not own:** domain invariants, runtime semantics, or historical decision rationale. Those
> belong to the owning architecture document or ADR.
>
> **Related documents**
>
> - Documentation governance: [`../documentation-boundaries.md`](../documentation-boundaries.md)
> - Product vision: [`../product/vision.md`](../product/vision.md)
> - Architecture overview: [`../architecture/overview.md`](../architecture/overview.md)
> - Process Studio architecture:
>   [`../architecture/process-studio.md`](../architecture/process-studio.md)
> - Identity and principals:
>   [`../architecture/identity-and-principals.md`](../architecture/identity-and-principals.md)
> - Integration architecture:
>   [`../architecture/integration-architecture.md`](../architecture/integration-architecture.md)
> - Product release workflow: [`../development/releasing.md`](../development/releasing.md)
> - Product SemVer ADR:
>   [`../decisions/0066-adopt-single-product-semver-authority.md`](../decisions/0066-adopt-single-product-semver-authority.md)

## How to read this folder

- This index owns the dependency graph and global exit conditions.
- Each subroadmap owns one delivery track and its phase gates.
- Architecture documents own current semantics; ADRs own difficult-to-reverse decisions.
- `tooling/roadmap-completion/registry.ts` and `deno task roadmap:measure` are the mechanical status
  source. They distinguish implementation markers, executable checks, and validated operational
  evidence; prose status must not contradict their output.

Every track uses the same small contract: scope, ordered phases, measurable exit evidence, measures,
and stop conditions. Implementation inventories belong in code, tests, or operational evidence—not
in this folder.

## Gate semantics

Roadmap status uses distinct evidence classes:

- **Mechanical gate:** repository artifacts and focused executable checks pass.
- **Operational gate:** reviewed environment, rehearsal, or recovery evidence is accepted.
- **Activation approval:** an owner explicitly approves a provider, authority, route, or deployment
  profile after its required gates pass.
- **Product release:** an annotated source release governed by
  [`../development/releasing.md`](../development/releasing.md); open roadmap gates do not prevent a
  source-only pre-release.

`roadmap.global-exit` means every gate registered in the current seven tracks passes. It does not by
itself publish a product release, activate an unregistered connector provider, or approve a
particular deployment profile. Numeric labels such as `0.8` and `1.0` are historical roadmap
milestones and gate IDs, not product SemVer.

Only `METRIC` lines emitted by `deno task roadmap:measure` are live counters. Other subroadmap
measures are required exit or activation evidence until a named evaluator emits them.

## Current position

This snapshot was reviewed on September 2, 2026. Run `deno task roadmap:measure` for the live state.

| Area                | Measured position                                                              | Next decision                                                            |
| ------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| ERP primitives      | P0–P3 pass; open unknown decisions: `0`                                        | Expand only when a requested capability needs a new primitive            |
| Domain providers    | Six bounded Level 3 slices; six provider domains plus Process remain `PARTIAL` | Mature only requested actions, not whole packages                        |
| Financial execution | `2/16` activation gates pass; production decision is **NO-GO**                 | Close outage, restore, replay, and bounded-cutover evidence              |
| Process Studio      | Pre-0.8 through governed 1.0 mechanical gates pass                             | Keep production activation behind global and operational gates           |
| Integrations        | Contract through governed-surface mechanical gates pass                        | Activate providers only with owner, credentials, recovery, and runbooks  |
| Business Packs      | Contract-only Distribution slice passes                                        | Add catalog-backed resolution before installation or onboarding mutation |
| PostgreSQL 19       | Minimum version and bounded capability pilots implemented; GA is open          | Finish GA, failover, workload, and production evidence                   |

The current product releases are pre-release, source-only snapshots. Release status and upgrade
caveats are owned by [`../development/releasing.md`](../development/releasing.md).

## Tracks

| ID            | Track                 | Owns                                                                              | Gate set          | Source                                                             |
| ------------- | --------------------- | --------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------ |
| `erp`         | ERP primitives        | reusable scope, product, document, quantity, money, audit, and event decisions    | `erp.p0`–`erp.p3` | [`erp-primitives.md`](./erp-primitives.md)                         |
| `domain`      | Domain maturity       | package/provider readiness and Level 3 action/event evidence                      | `domain.*`        | [`domain-maturity.md`](./domain-maturity.md)                       |
| `financial`   | Financial execution   | TigerBeetle transition, reconciliation, rehearsal, and activation                 | `financial.*`     | [`financial-ledger-execution.md`](./financial-ledger-execution.md) |
| `process`     | Process Studio        | catalog, runtime, operations, designer, and governed release gates                | `process.*`       | [`process-studio.md`](./process-studio.md)                         |
| `integration` | External integration  | connector contracts, delivery, reliability, Process Studio bridge, and governance | `integration.*`   | [`integration-surface.md`](./integration-surface.md)               |
| `packs`       | Business Pack Library | pack resolution, draft materialization, onboarding, and governed upgrades         | `packs.contract`  | [`process-pack-library.md`](./process-pack-library.md)             |
| `postgres19`  | PostgreSQL 19         | version floor, consistency, SQL/PGQ, and operational capability evidence          | `postgres19.*`    | [`postgresql-19.md`](./postgresql-19.md)                           |

There are seven subdocuments and seven measured tracks. `README.md` is the index, not an eighth
track. They remain separate because primitive decisions, provider maturity, financial authority,
process execution, external providers, pack distribution, and database activation have independent
owners and stop conditions. A new track requires a registry entry, a measured gate, and a documented
owner.

## Dependency graph

```text
ERP primitive decisions
        ↓
Domain contracts and Level 3 providers
        ↓
Typed Action/Event Catalog
        ↓
Headless Process IR runtime
        ↓
Recovery, compensation, and operations
        ↓
Validated designer
        ↓
Governed Process Studio release
```

Registered cross-track dependencies are explicit:

| Gate or chain              | Registered dependency                                                             |
| -------------------------- | --------------------------------------------------------------------------------- |
| `process.pre08`            | `erp.p0`–`erp.p3`, `domain.inventory.level3`, and `domain.sales.level3`           |
| later `process.*` gates    | the preceding Process Studio gate                                                 |
| `integration.contract08`   | `process.pre08`; later integration gates depend on the preceding integration gate |
| `packs.contract`           | `process.pre08`                                                                   |
| `postgres19.production-ga` | minimum-version, `WAIT FOR`, property-graph, and operational-rehearsal gates      |
| `roadmap.global-exit`      | every gate assigned to all seven registered tracks                                |

Financial execution remains a parallel activation track over the bounded Accounting port. Provider
activation, deployment-profile approval, and source publication are not inferred from this graph;
they require their separately owned evidence and approval.

## Registered roadmap exit

The registered roadmap remains open until all of these are true:

```text
[ ] no material primitive decision is UNKNOWN
[ ] each mutable fact has one semantic owner
[ ] tenant, organization, legal, product, quantity, document, and money scopes are explicit
[ ] public domain actions/events have stable failures, authorization, and compatibility
[ ] committed effects have compensation or manual recovery
[ ] Process IR and catalog versions are deterministic and pinned
[ ] restart, duplicate, unknown-outcome, and recovery behavior is proven
[ ] authentication, current tenant membership, scope, relationship/SoD, and revocation fail closed
[ ] authorization and audit are enforced outside the browser
[ ] visual behavior is only a projection over validated runtime semantics
[ ] every gate assigned to the seven registered tracks has accepted evidence
```

The global gate is composite: an open financial activation or PostgreSQL 19 production gate keeps
the global result open even when the Process Studio or integration track has passed its own
mechanical gates. A passing global gate still does not activate a particular connector provider,
approve a deployment profile, or publish a product release.

## Measures

Run:

```sh
deno task roadmap:measure
```

The command reports the following stable measures:

| Metric                                      | Desired condition                                                    |
| ------------------------------------------- | -------------------------------------------------------------------- |
| `roadmap_tracks`                            | equals the seven registered tracks                                   |
| `unregistered_roadmap_tracks`               | `0`                                                                  |
| `unassigned_roadmap_gates`                  | `0`                                                                  |
| `roadmap_global_exit`                       | `PASS` before claiming all registered roadmap work is complete       |
| `registered_gates_remaining`                | visible count, including non-global tracks                           |
| `roadmap_exit_gates_completed`              | completed dependencies of the global composite gate                  |
| `remaining_roadmap_exit_gates`              | `0` before claiming all registered roadmap work is complete          |
| `level3_capabilities`                       | at least two before catalog/runtime work; more only by evidence      |
| `open_unknown_decisions`                    | `0` for the selected scope                                           |
| `financial_activation_gates_remaining`      | `0` before financial activation                                      |
| `process_studio_mechanical_gates_remaining` | `0` before governed-release review                                   |
| `integration_surface_gates_remaining`       | `0` means the governed surface proof passes, not provider activation |
| `business_pack_contract_gates_remaining`    | `0` means the contract slice passes, not installation readiness      |
| `postgres19_capability_gates_remaining`     | `0` after the final PostgreSQL 19 GA activation review               |

The command may report open gates without failing; open gates are the roadmap status. Missing files,
unknown dependencies, invalid financial evidence, or unregistered roadmap tracks fail the command.

## Change control

- Change ownership, trust, durability, transaction semantics, or public contracts through an ADR.
- Add a track only with one owner, stable gate IDs, measured evidence, and measurable exit criteria.
- If connector or deployment activation becomes roadmap-owned, add an explicit gate instead of
  broadening `roadmap.global-exit` prose.
- Remove duplicated architecture detail; link to the canonical owner instead.
- Do not create a package merely because a roadmap item names a functional area.
- Update this index only when sequencing, dependencies, or global exit conditions change.
