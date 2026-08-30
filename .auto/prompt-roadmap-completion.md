# Autoresearch: Complete the committed RITSEI roadmap

## Objective

Finish every **committed, non-optional** roadmap exit criterion in the canonical RITSEI documents,
without inventing ERP semantics, weakening invariants, or declaring a package complete because one
narrow capability works.

The target is roadmap completion, not file count, line count, test count, or documentation volume.
A capability is complete only when its owner, public contract, persistence/invariants,
authorization, failure model, transaction/concurrency/idempotency behavior, recovery behavior,
observability, compatibility, and operational evidence are executable and documented at the owning
boundary.

Optional domains and undecided financial/business semantics are not to be guessed. They must either
be implemented after concrete product evidence and an ownership decision, or be explicitly deferred
by an accepted ADR with an owner, dependency, and re-entry condition. A deferred item is not counted
as implemented.

## Canonical scope and order

Use the source-of-truth order in `AGENTS.md`. Start with these canonical roadmap tracks:

1. ERP primitives and P0/P1/P2/P3 exit criteria.
2. Foundation boundaries: kernel, auth, authorization, identity, party, catalog, messaging,
   and integrations.
3. Economic domains: inventory, accounting, sales, procurement, and billing only after invoice,
   payment, settlement, and accounting ownership is decided.
4. Financial-ledger execution: the bounded Accounting profile, trusted adapter, cutover,
   reconciliation, recovery, and no-dual-authority proof.
5. Domain maturity: every committed public capability must reach Level 3; no package remains
   `PARTIAL` for its agreed committed scope.
6. Process Studio: catalog/release contracts, static validation, headless runtime, recovery,
   monitoring, inbox, and designer/release gates, in that order.
7. External integration surface: versioned OpenAPI/CloudEvents contracts, authentication,
   deduplication, retries, provider status, and compensation/manual recovery.

Follow linked architecture documents, ADRs, schema ownership, workload-isolation, analytics,
search, and runtime rules whenever a roadmap item touches them. Do not create a new package merely
because a product checklist names a functional area.

## Current baseline

The six measured domain slices already satisfy the current Level 3 objective:

- `identity.user_account.create`
- `party.create`
- `inventory.stock.adjust`
- `accounting.revenue.post`
- `sales.order.confirm`
- `procurement.purchase_order.confirm`

Do not redo these slices. Their packages may still be `PARTIAL` because sibling capabilities are
not complete. Verify existing evidence and close the remaining committed scope instead of changing
the maturity metric.

Known gated areas include billing ownership, TigerBeetle production cutover, broader Procurement
receipt/return behavior, Process Studio runtime/designer work, and optional domains. Resolve them in
their documented dependency order; do not silently broaden their semantics.

## Metrics

Primary: `roadmap_exit_gates_completed` (count, higher is better) — frozen, independently checked
canonical exit criteria completed with executable evidence.

Secondary:

- `remaining_roadmap_exit_gates` (count, lower is better)
- `level3_capabilities`
- `partial_committed_packages`
- `open_unknown_decisions`
- `financial_activation_gates_remaining`
- `process_studio_gates_remaining`
- `integration_gates_remaining`
- `correctness_checks_passed` (boolean)

Before the first implementation experiment, inventory every committed exit criterion from the
canonical roadmap into an allowlisted gate registry with: stable ID, source document/section,
owning package or decision, dependencies, required evidence, and executable check. Freeze the
registry before optimizing. Adding, deleting, weakening, or reclassifying a gate is not progress;
it requires an explicit ADR and a new baseline.

Never change the benchmark, hard-code a score, count prose as executable evidence, or add a fake
provider solely to increase the metric. If the metric harness is wrong, fix it with a documented
measurement bug report, preserve the old result, and re-baseline transparently.

## How to run

Use the active session's benchmark and correctness checks. A new session should provide:

```sh
./.auto/measure.sh
```

The command must emit structured `METRIC name=value` lines and run fast prechecks. Correctness
checks must include the repository's required formatting, lint, type, boundary, database, focused,
and affected tests as appropriate. Keep successful output quiet and show failures clearly.

Each iteration must:

1. Read the relevant canonical docs, source, tests, and previous `.auto/log.jsonl` entries.
2. Choose one smallest unclosed gate or tightly coupled gate cluster.
3. Implement real owner-local behavior and executable proof.
4. Run `run_experiment`.
5. Run `log_experiment` with `keep` only for a genuine primary improvement; use `discard` or
   `checks_failed` honestly otherwise.
6. Record the architectural lesson, rejected alternatives, and next gate in `asi`.

Do not run measurement-only iterations after the primary metric reaches the frozen maximum. Stop
and request a new approved objective instead.

## Hard constraints

- Follow `AGENTS.md` and repository-native skills before implementing each workflow.
- Preserve source-of-truth order; create an ADR for ownership, authority, trust, durability,
  transaction, public-contract, or Process Studio execution-model changes.
- Use the default feature shape:
  `contract.ts -> errors.ts -> service.ts -> store.ts -> postgres.ts/memory.ts -> layers.ts`.
- Domain packages expose public contracts only; keep tables, repositories, drivers, and provider
  types private. Cross-domain behavior uses public typed services/facts/events.
- Keep authorization, tenant/legal-entity scope, stable tagged failures, idempotency, concurrency,
  audit/correlation, transaction boundaries, and compensation/manual recovery intact.
- New persistent identities use the kernel UUIDv7 helper. Do not use UUIDv4/random UUIDs for stored
  identities or rewrite existing rows solely for UUID version.
- PostgreSQL remains the control-plane source of truth unless the accepted financial-ledger ADR and
  its activation gates prove otherwise. Never create dual financial authority or dual-write brokers.
- Generate migrations with the pinned Drizzle Kit workflow; never rewrite an applied migration.
- Do not add dependencies without a documented reason and the required manifest/lockfile update.
- TypeScript tests use `@effect/vitest`; use `it.effect` for Effects; never use direct Vitest APIs,
  `Deno.test`, `Effect.runPromise`, or `Effect.runSync` in tests.
- Run `deno task fallow:audit` through the repository checks. Use the full or focused Fallow tasks
  to review dead code, duplication, complexity, and generic boundaries; do not weaken Fallow or
  count its findings as roadmap progress.
- Do not expose raw SQL, driver errors, credentials, provider topology, or infrastructure failures
  through public domain contracts or API responses.
- Do not start Process Studio runtime/designer work before its documented dependency gates pass.
- Do not implement billing, tax, payments, settlement, optional ERP domains, external providers,
  or production TigerBeetle activation by guessing missing business policy.
- Do not weaken tests, constraints, authorization, isolation, recovery, audit, or benchmark rules.

## Completion definition

The objective is complete only when the frozen gate registry is fully green, all committed roadmap
tracks have executable evidence, no material decision remains `UNKNOWN`, no committed package is
still `PARTIAL`, and the global roadmap exit criteria are proven. Optional or explicitly deferred
areas must remain accurately labeled with their accepted decision and re-entry condition.

When complete, record one final measurement and stop. Do not manufacture another experiment merely
to reduce the discard count.

## What's been tried

- Six eligible domains already reached bounded Level 3 action/event slices.
- Repeated clean runs after that ceiling produced no primary improvement and were discarded.
- Procurement SupplierAccount eligibility hardening is a valid deferred invariant candidate but does
  not improve the six-domain metric.
- The current domain-maturity objective is saturated; this prompt intentionally uses a new,
  gate-based roadmap objective rather than altering that benchmark.
- ADR-0061 corrected the gate harness after marker-only checks overclaimed Process Studio and
  integration phases; contract kernels remain partial until durable/operational exit evidence exists.
