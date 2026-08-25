# Autoresearch: Raise eligible RITSEI domains to Level 3

## Objective

Move every currently implemented domain provider in the canonical domain-maturity roadmap to a
real Level 3 Process Provider without inventing ERP semantics, weakening invariants, or touching
Process Studio runtime work.

The eligible provider domains are:

- identity
- party
- inventory
- accounting
- sales
- procurement

A domain counts only when its public package exposes a bounded PUBLIC action and PUBLIC event,
with owner authorization, tenant scope, stable failures, idempotency/concurrency proof,
compensation or manual recovery, and catalog compatibility tests. Existing bounded capabilities
may be Level 3 while unrelated sibling commands remain out of scope.

`billing` remains out of scope until invoice/payment/settlement ownership is decided. `integrations`
is a transport boundary, not an internal domain provider. `process` is an application coordinator,
not Process Studio. `workflow` and all visual/runtime Process Studio work are explicitly forbidden.

## Metrics

- **Primary:** `domain_level3_capabilities` (unitless, higher is better) — eligible provider domains
  with a real PUBLIC action/event slice and executable catalog/contract proof.
- **Secondary:** `remaining_domain_gates` (unitless, lower is better), `public_actions`,
  `public_events`.

## How to Run

`./.auto/measure.sh` — emits structured metric lines.

Repository correctness checks run automatically from `.auto/checks.sh` after every passing
measurement.

## Files in Scope

- `packages/identity/` — bounded public identity action/event slice.
- `packages/party/` — bounded party/relationship action/event slice.
- `packages/inventory/` — existing Level 3 slice and future bounded provider proofs.
- `packages/accounting/` — existing Level 3 slice and future bounded provider proofs.
- `packages/sales/` — existing Level 3 slice and future bounded provider proofs.
- `packages/procurement/` — promote the bounded Purchase Order/Goods Receipt capability.
- `packages/catalog/` and `packages/*/tests/` — compatibility and invariant proofs.
- `docs/roadmap/domain-maturity.md` and owning architecture/ADR documents when status changes.
- `tooling/domain-maturity/` and `.auto/` — objective measurement only.

## Off Limits

- Process Studio designer, Process IR, workflow runtime, process catalog aggregation, or visual UI.
- `billing` invoice/payment/settlement semantics without an accepted ownership ADR.
- `integrations` provider implementations, brokers, OAuth products, or external delivery claims.
- New dependencies, speculative ERP modules, generic repositories, or broad refactors.
- Weakening authorization, validation, constraints, transaction boundaries, idempotency, audit,
  tenant isolation, or manual-recovery behavior.
- Claiming a domain Level 3 by editing roadmap prose without an executable public contract and tests.

## Constraints

- Use the smallest bounded capability that genuinely satisfies Level 3.
- Follow `contract.ts -> errors.ts -> service.ts -> store.ts -> postgres.ts/memory.ts -> layers.ts`.
- All TypeScript tests use `@effect/vitest`; use public package contracts in catalog tests.
- Persistent writes remain owner-local and transactional; events publish through the public Messaging
  contract inside the owner transaction.
- New persistent IDs use the kernel UUIDv7 helper.
- Preserve existing public HTTP behavior unless an endpoint is explicitly needed for the selected
  bounded capability.
- Do not use benchmark-only branches, hard-coded metric overrides, or documentation-only claims.

## What's Been Tried

- Inventory, Sales, and Accounting already have bounded PUBLIC Level 3 action/event slices.
- Procurement's bounded purchase-order confirmation has now been promoted to the metric's fourth
  Level 3 provider; its canonical roadmap/architecture wording still needs to be synchronized.
- Identity and Party are partial and need carefully bounded action/event ownership before promotion.
- A Party experiment exposed that optional generic MessagingService resolution lets outer test layers
  activate production event publication unexpectedly. Use a dedicated Party-owned event-publisher
  composition boundary instead of relying on optional generic service presence.
- The previous autoresearch session completed analytic-plane documentation; that objective is closed
  and is not part of this session.
