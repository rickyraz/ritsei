# Process Pack Library Roadmap

> **Status:** Canonical roadmap subdocument
>
> **Owns:** Sequencing, dependencies, readiness, and exit criteria for the
> Business Pack Library.
>
> **Detailed semantics belong to:** [`../architecture/process-studio.md`](../architecture/process-studio.md).
>
> **Product positioning belongs to:** [`../architecture/reference/process-pack-positioning.md`](../architecture/reference/process-pack-positioning.md).
>
> **Snapshot date:** August 30, 2026
>
> **Related documents**
>
> - Roadmap index: [`./README.md`](./README.md)
> - Product vision: [`../product/vision.md`](../product/vision.md)
> - Process Studio architecture: [`../architecture/process-studio.md`](../architecture/process-studio.md)
> - Process Studio readiness: [`./process-studio.md`](./process-studio.md)
> - Domain maturity: [`./domain-maturity.md`](./domain-maturity.md)
> - Authorization: [`../architecture/authorization.md`](../architecture/authorization.md)
> - Analytics architecture: [`../architecture/analytics-architecture.md`](../architecture/analytics-architecture.md)
> - Capability release governance:
>   [`../decisions/0020-adopt-capability-release-and-runtime-governance.md`](../decisions/0020-adopt-capability-release-and-runtime-governance.md)
> - Governed AI boundary:
>   [`../decisions/0063-define-governed-ai-recommendation-and-agent-boundary.md`](../decisions/0063-define-governed-ai-recommendation-and-agent-boundary.md)

## Goal

Make the first-use path feel like a modern ERP product without turning Process
Packs into a second domain model:

```text
Choose business profile
        ↓
Select or accept a curated Business Pack
        ↓
Resolve PUBLIC typed capabilities
        ↓
Explain readiness and missing requirements
        ↓
Create editable DRAFT processes
        ↓
Customize and statically validate
        ↓
Review, authorize, release, and deploy
        ↓
Run through deterministic Process Studio and domain commands
```

A pack is a distribution artifact. It is not an approval, capability grant,
transaction, deployment, or runtime principal.

## Current baseline

The current repository slice provides:

- public Effect Schema contracts for pack identity, stability, asset references,
  required/optional capability references, and resolution results;
- exact capability resolution by `(kind, id, version)` with missing-required
  diagnostics;
- an experimental Distribution starter pack;
- three editable starter drafts: order confirmation, stock correction, and
  revenue posting;
- a frontend Templates lane that displays the pack and preserves ordinary
  `DRAFT` provenance; and
- tests proving pack decoding, version mismatch behavior, template references,
  draft provenance, and Process IR isolation.

This baseline deliberately does **not** provide pack persistence, installation
mutation, backend onboarding, automatic approval, release, deployment, or
execution. The current pack asset collections are empty except for a guide
reference because owner contracts for those assets do not yet exist.

## Scope

The library will eventually distribute references to:

- versioned process templates;
- typed decisions;
- forms and configuration contracts;
- recommended policies;
- analytic projections and KPIs;
- user-facing documentation; and
- compatibility and upgrade instructions.

Every process reference must resolve to a valid editable Process IR draft. Every
capability reference must resolve through the public catalog. Every released
process must continue through the existing Process Studio governance and runtime
gates.

## Non-goals

Do not build these as part of the first library increments:

- a global semantic layer that owns domain meaning;
- arbitrary pack-provided JavaScript, SQL, prompts, or private service calls;
- automatic capability grants, approvals, releases, deployments, or migrations;
- a model-controlled agent or autonomous action loop;
- a marketplace before pack trust and curation are proven; or
- a large template count without domain-contract maturity and compatibility tests.

## Delivery plan

### Phase 0 — Contract and product slice (current)

**Outcome:** A safe, inspectable pack can be shown in the designer and resolved
against an in-memory set of exact capability references.

**Evidence already present:**

- public pack schemas and resolver;
- experimental Distribution pack;
- editable templates using canonical action IDs;
- required-capability failure diagnostics;
- no pack metadata in serialized Process IR; and
- no browser-side command execution.

**Exit status:** Complete for the contract-only slice. It is not a production
installation feature.

### Phase 1 — Catalog-backed resolution

**Outcome:** A pack can be checked against the versioned Process Catalog without
copying catalog metadata into a second unverified registry.

**Deliverables:**

- resolver integration with the public catalog registry;
- exact required capability diagnostics including owner, stability, scope, and
  compatibility reason;
- optional capability reporting that never blocks installation;
- explicit rejection of missing, retired, incompatible, or non-production
  capabilities;
- a distinction between “available in this tenant” and “present in the
  catalog”; and
- tests for catalog version drift and stability transitions.

**Dependencies:** Process Studio 0.8 catalog gate, public domain contracts,
authorization metadata, and capability release governance.

**Exit gate:** A pack cannot be marked ready unless every required reference is
resolved to an allowed public catalog entry. Resolution never grants authority.

### Phase 2 — Draft materialization

**Outcome:** A user can select a resolved pack and receive ordinary editable
`DRAFT` definitions, without release or execution side effects.

**Deliverables:**

- backend operation to load a pack and its template references;
- deterministic template/version compatibility checks;
- draft materialization with tenant and actor context;
- configuration/form references decoded through typed schemas;
- missing-asset and unsupported-version diagnostics;
- persistence using the existing process definition ownership and ID policy; and
- idempotent repeated selection behavior for the same draft intent.

**Dependencies:** stable Process IR, definition storage, tenant scope, draft
authorization, and the headless runtime's version-pinning rules.

**Exit gate:** Repeating the same selection cannot create an uncontrolled set of
duplicates, and materialization cannot alter released definitions or business
facts.

### Phase 3 — First vertical pack: Distribution

**Outcome:** One profile has a complete, useful, measured onboarding path rather
than a collection of disconnected templates.

**Initial pack boundary:**

```text
Distribution
├── Order-to-Cash
├── Stock Correction
├── Revenue Posting
├── required capability references
├── configuration/form references when owner contracts exist
├── recommended projections/KPIs when analytics contracts exist
└── operator documentation
```

**Deliverables:**

- one owner-reviewed Distribution pack version;
- clear profile assumptions and configuration checklist;
- draft review for every included process;
- static validation and catalog compatibility report;
- a short operator guide for missing capabilities and failed validation; and
- evidence from a representative tenant fixture, not only static frontend data.

**Exit gate:** A new tenant can move from profile selection to a valid editable
DRAFT without private implementation knowledge, and every missing prerequisite
has an actionable explanation.

### Phase 4 — Profile onboarding and recommendations

**Outcome:** The system helps a user choose a pack without confusing
recommendation with authorization.

**Deliverables:**

- typed business-profile questionnaire or profile facts;
- deterministic profile-to-pack matching rules;
- explicit user confirmation before pack selection;
- readiness percentage only when backed by measured required/optional coverage;
- accessible onboarding and keyboard-complete interaction; and
- advisory AI integration, if later approved, that can suggest but cannot select
  authority, approve, release, or execute.

**Dependencies:** identity and tenant scope, authorization, frontend routing,
pack catalog, and a later provider-isolation implementation under the AI ADR.

**Exit gate:** Profile data can recommend a pack but cannot grant capabilities,
change domain policy, or bypass normal authorization and review.

### Phase 5 — Governed versions and upgrades

**Outcome:** Pack evolution is safe for installed drafts and released/running
processes.

**Deliverables:**

- immutable pack versions and owner provenance;
- compatibility ranges at the installation boundary;
- explicit migration/upgrade proposals for changed assets;
- diff and impact reports for templates, capability versions, and configuration;
- process definitions pinned to their selected pack/template versions;
- no silent rewrite of released definitions or running instances; and
- rollback or manual recovery guidance for failed upgrades.

**Dependencies:** capability retirement policy, release/deployment separation,
Process Studio 0.9 operational maturity, audit correlation, and recovery proof.

**Exit gate:** An upgrade is reviewable, idempotent, authorized, and reversible
or explicitly manual-recovery-only. Running instances remain pinned to their
released versions.

### Phase 6 — Curated library scale

**Outcome:** More packs can be added without weakening trust or multiplying
unowned semantics.

**Deliverables:**

- pack contribution and owner-review workflow;
- pack conformance tests and source provenance;
- compatibility matrix across supported domain/capability versions;
- deprecation and retirement handling;
- searchable pack discovery backed by safe metadata; and
- marketplace or partner distribution only after plugin and integration trust
  gates are satisfied.

**Exit gate:** Adding a pack does not require private imports, cross-domain table
writes, a second catalog source of truth, or an exception to authorization and
runtime governance.

## MVP acceptance criteria

The first production-oriented milestone is deliberately narrow:

```text
[ ] one owner-reviewed Distribution pack
[ ] immutable pack identity and version
[ ] exact required PUBLIC capability resolution
[ ] actionable missing-capability diagnostics
[ ] three editable process drafts
[ ] tenant/actor-scoped draft materialization
[ ] static Process IR validation
[ ] no automatic approval, release, deployment, or execution
[ ] audit-visible pack and template provenance
[ ] representative contract and accessibility tests
```

The MVP is complete when it improves first-use time-to-value without creating a
new authority boundary.

## Dependency map

```text
mature domain contracts
        ↓
versioned public capability catalog
        ↓
pack resolution and compatibility
        ↓
editable draft materialization
        ↓
static Process IR validation
        ↓
normal approval/release/deployment
        ↓
deterministic runtime and authorized domain commands
```

The following dependencies remain hard gates:

| Dependency | Why it blocks the pack library |
|---|---|
| Domain maturity | A pack cannot promise a process around an unstable or unowned capability. |
| Catalog governance | A pack must resolve public, versioned capabilities rather than private implementations. |
| Authorization and SoD | Pack selection is not authorization evidence. |
| Process IR/runtime | Templates must have deterministic meaning beyond a visual graph. |
| Analytics contracts | Pack-recommended KPIs must remain derived projections, not new business authority. |
| Integration governance | External actions need normalized contracts, idempotency, retry, and recovery. |
| AI boundary | Recommendations cannot mutate facts or satisfy approval. |

## Measures

Track these measures for the Distribution vertical slice before expanding the
library:

- profile selection to first valid DRAFT;
- percentage of required capabilities resolved on first attempt;
- percentage of pack drafts passing static validation without manual repair;
- number and age of unresolved required references;
- time from DRAFT to first approved release;
- upgrade compatibility success rate;
- duplicate draft/materialization rate; and
- support incidents caused by missing or misleading pack assumptions.

Do not optimize for pack count until these measures show that the pack is useful,
understandable, and safe.

## Risks and stop conditions

| Risk | Stop or mitigation |
|---|---|
| The library is empty while competitors feel ready-made. | Ship one deep vertical pack and improve onboarding before broadening count. |
| A pack hides immature domain semantics. | Remove the capability from production packs until its domain gate passes. |
| Version drift makes drafts unreleasable. | Require catalog-backed resolution and explicit compatibility diagnostics. |
| Recommendations become authority by UX implication. | Keep selection, approval, release, and execution as separate authorized actions. |
| Upgrade rewrites live behavior unexpectedly. | Pin versions and require reviewed migration proposals. |
| Asset descriptors become an ungoverned second semantic layer. | Add owner contracts and typed asset catalogs before populating non-process assets. |
| Marketplace growth introduces untrusted code or providers. | Keep distribution references-only; apply plugin/integration trust gates first. |

## Decisions still requiring explicit review

The following choices are intentionally not silently decided by this roadmap:

- whether pack artifacts require signing or another provenance mechanism;
- whether compatibility ranges belong in the pack manifest or only in the catalog;
- the canonical profile taxonomy and who owns profile facts;
- typed catalogs for forms, decisions, policies, and projections;
- pack persistence and tenant installation ownership; and
- marketplace/partner publication and review authority.

Any choice that changes trust, ownership, authorization, durability, or release
semantics requires an ADR before activation.
