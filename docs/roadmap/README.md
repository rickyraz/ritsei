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

## Current position

| Area                | Measured position                                                  | Next decision                                                            |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| ERP primitives      | P0–P3 pass; open unknown decisions: `0`                            | Expand only when a requested capability needs a new primitive            |
| Domain providers    | Six bounded Level 3 provider slices; seven packages remain partial | Mature only requested actions, not whole packages                        |
| Financial execution | `2/16` activation gates pass; production decision is **NO-GO**     | Close outage, restore, replay, and bounded-cutover evidence              |
| Process Studio      | Pre-0.8 through governed 1.0 mechanical gates pass                 | Keep production activation behind global and operational gates           |
| Integrations        | Contract through governed-surface mechanical gates pass            | Activate providers only with owner, credentials, recovery, and runbooks  |
| Business Packs      | Contract-only Distribution slice passes                            | Add catalog-backed resolution before installation or onboarding mutation |
| PostgreSQL 19      | Minimum version and bounded capability pilots implemented; GA is open | Finish GA, failover, workload, and production evidence                 |

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

There are seven subdocuments and seven measured tracks. `README.md` is the index, not an eighth track. A
new track requires a registry entry, a measured gate, and a documented owner.

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

Parallel tracks attach at explicit boundaries:

| Track                | Entry condition                                      | Exit evidence                                                                |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| Financial execution  | bounded Accounting profile and provider-neutral port | accepted transfers, projections, restore, replay, and cutover evidence       |
| External integration | separate Domain/External contracts                   | idempotent delivery, normalized failures, recovery, and connector governance |
| Business Packs       | public catalog and deterministic Process IR          | actionable resolution, editable drafts, and version-safe upgrades            |
| PostgreSQL 19        | PostgreSQL 19 development floor                    | route/query/operational evidence without production activation             |

## Global exit

The broad Process Studio/runtime milestone is open until all of these are true:

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
[ ] financial activation, integration activation, and deployment gates are separately approved
```

The global gate is composite: an open financial activation or PostgreSQL 19 production gate keeps
the global result open even when the Process Studio or integration track has passed its own
mechanical gates.

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
| `roadmap_global_exit`                       | `PASS` before broad production activation                            |
| `registered_gates_remaining`                | visible count, including non-global tracks                           |
| `roadmap_exit_gates_completed`              | completed dependencies of the global composite gate                  |
| `remaining_roadmap_exit_gates`              | `0` before broad production activation                               |
| `level3_capabilities`                       | at least two before catalog/runtime work; more only by evidence      |
| `open_unknown_decisions`                    | `0` for the selected scope                                           |
| `financial_activation_gates_remaining`      | `0` before financial activation                                      |
| `process_studio_mechanical_gates_remaining` | `0` before governed-release review                                   |
| `integration_surface_gates_remaining`       | `0` means the governed surface proof passes, not provider activation |
| `business_pack_contract_gates_remaining`    | `0` means the contract slice passes, not installation readiness      |
| `postgres19_capability_gates_remaining`     | `0` before PostgreSQL 19 production activation review                 |

The command may report open gates without failing; open gates are the roadmap status. Missing files,
unknown dependencies, invalid financial evidence, or unregistered roadmap tracks fail the command.

## Change control

- Change ownership, trust, durability, transaction semantics, or public contracts through an ADR.
- Add a track only with one owner, stable gate IDs, measured evidence, and measurable exit criteria.
- Remove duplicated architecture detail; link to the canonical owner instead.
- Do not create a package merely because a roadmap item names a functional area.
- Update this index only when sequencing, dependencies, or global exit conditions change.
