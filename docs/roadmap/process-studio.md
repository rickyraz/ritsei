# Process Studio Readiness Roadmap

> **Status:** Canonical roadmap subdocument
>
> **Track ID:** `process`
>
> **Owns:** prerequisites, dependency gates, and release readiness for Process Studio.
>
> **Measured by:** `process.*` gates through `deno task roadmap:measure`.
>
> **Detailed semantics belong to:**
> [`../architecture/process-studio.md`](../architecture/process-studio.md).
>
> **Related documents**
>
> - Roadmap index: [`./README.md`](./README.md)
> - ERP primitives: [`./erp-primitives.md`](./erp-primitives.md)
> - Domain maturity: [`./domain-maturity.md`](./domain-maturity.md)
> - Process Pack Library: [`./process-pack-library.md`](./process-pack-library.md)
> - Capability governance:
>   [`../decisions/0020-adopt-capability-release-and-runtime-governance.md`](../decisions/0020-adopt-capability-release-and-runtime-governance.md)
> - AI boundary:
>   [`../decisions/0063-define-governed-ai-recommendation-and-agent-boundary.md`](../decisions/0063-define-governed-ai-recommendation-and-agent-boundary.md)
> - Durable execution:
>   [`../architecture/durable-execution.md`](../architecture/durable-execution.md)
> - Messaging: [`../architecture/pgque-messaging.md`](../architecture/pgque-messaging.md)

## Scope

Process Studio is built from stable domain contracts, not from a visual editor. The dependency order
is:

```text
primitive decisions → mature providers → typed catalogs → headless Process IR
→ recovery/operations → validated designer → governed release
```

The designer is a projection over validated runtime semantics. It does not execute commands, provide
authorization, or create an autonomous agent path. Numeric milestone labels are historical roadmap
identifiers, not product SemVer.

## Pre-0.8 Gate

**Registry gate:** `process.pre08`

Before Process Studio 0.8 work starts, resolve:

```text
[x] scope, organization, party, product, UOM, location, document, quantity, money,
    period, audit, and correlation primitives are DECIDED or explicitly out of scope
[x] procurement and billing ownership is clear for any purchase or payment process
[x] at least two existing domains can expose stable public commands
[x] event ownership and delivery semantics are explicit
[x] compensation/manual recovery metadata has an owning-domain contract
[x] catalog versioning and compatibility rules have an ADR or canonical rule
[x] workflow authorization is separate from domain action authorization
[x] durable engine compatibility gates remain enforced
[x] external action/event profile is defined separately from domain actions/events
[x] connector authentication, idempotency, delivery, and compensation rules are explicit
[x] capability release states and compatibility ranges are defined
[x] process promotion separates release from deployment across environments
[x] execution principal, delegation, SoD, and business observability are explicit
[x] authentication, current tenant membership, relationship scope, and revocation fail closed
[x] AI output is non-authoritative; no AgentPrincipal, agent node, or autonomous mutation is in scope
```

Billing remains outside the current release scope under
[ADR-0060](../decisions/0060-defer-billing-and-settlement-scope.md). This gate means the boundary is
explicit, not that Billing is implemented.

## Sequence

### 0.8 — Capability metadata (`process.catalog08`)

Register versioned Typed Action and Event Catalog entries from public contracts. Include tenant and
capability scope, stability/release state, idempotency, correlation, causation, compensation, and a
bounded precondition/effect vocabulary. External actions/events remain separate.

**Exit:** two domains publish catalog entries; metadata matches public contracts; unregistered
actions/events cannot execute; AI/provider code cannot register capabilities or access private
persistence.

### 0.85 — Minimal headless runtime (`process.runtime085`)

Implement the smallest deterministic Process IR for definitions, instances, domain commands, pure
decisions, timers, typed event waits, human tasks, execution context, and persisted step state.

**Exit:** restart/crash recovery, duplicate command/event safety, exact definition/catalog version
pinning, and observable task/timer/event/compensation state pass. Process IR contains no model call,
prompt, dynamic action, or nondeterministic AI binding.

### 0.9 — Operational maturity (`process.ops09`)

Add bounded retry, cancellation, recovery, compensation, audit correlation, SoD context, monitoring,
operator controls, release/deployment promotion, and capability retirement.

**Exit:** operators distinguish business failure, technical retry, unknown external outcome,
compensation, and manual recovery; compensation is authorized and idempotent; load, crash,
migration, and upgrade proofs pass; `pg_durable` gates remain enforced.

### 0.95 — Validated designer (`process.designer095`)

Provide a catalog-driven palette, drag-and-drop and keyboard/structured editing, typed mappings,
static validation, pure decision tables, simulation, and version comparison.

**Exit:** visual and structured editors produce identical deterministic Process IR; invalid scope,
mapping, ordering, retry, and compensation are rejected; keyboard alternatives and AI draft-only
behavior are tested.

### 1.0 — Governed Process Studio (`process.governed10`)

Preserve the simple user flow (`Draft → Test → Publish`) while the backend keeps immutable release
versions, DEV/TEST/PROD deployment bindings, approvals, retirement, Task Inbox, Process Monitor,
recovery/compensation controls, documentation, and bounded BPMN interoperability.

**Exit:** running instances remain pinned, release and execution authorization are separate,
operator recovery is safe, audit/redaction/accessibility pass, and unsupported BPMN executable
semantics are rejected.

## Product lanes

| Lane                 | Current position                                | Activation proof                                                                          |
| -------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Copilot draft        | typed draft-only surface; no provider execution | isolation, decoding, provenance, redaction, prompt-injection tests                        |
| Authorized execution | visible but gated; browser never runs commands  | backend authorization, SoD, idempotency, admission, recovery, reconciliation, fault tests |
| Curated templates    | experimental pack manifest and editable drafts  | catalog-backed installation, pack versioning, release review, asset compatibility         |

Lane labels are product modes, not principals or capabilities. Detailed authority remains in the
Process Studio architecture and ADR-0063.

## Measures

| Measure                                         | Target                                       |
| ----------------------------------------------- | -------------------------------------------- |
| `process.*` mechanical gates                    | all six pass before governed-release review  |
| deterministic IR equivalence                    | `100%` between visual and structured editors |
| browser-side business mutation                  | `0`                                          |
| unregistered or unauthorized executable actions | `0`                                          |
| running instances with floating versions        | `0`                                          |
| unresolved recovery/compensation paths          | `0` for released processes                   |

`process_studio_mechanical_gates_remaining` is the live roadmap metric. The other rows are
release-evidence requirements, not separately emitted counters. These gates do not replace
production rehearsal or financial activation approval.

## Stop conditions

Stop the next phase when a primitive is `UNKNOWN`, a provider lacks executable proof, catalog
metadata is hand-maintained, compensation is inferred, a workflow transaction spans durable
checkpoints, a visual feature hides missing runtime semantics, or `pg_durable` lacks its
compatibility and production gates.
