# Financial Staging Readiness Plan

> **Status:** planning-only; **NO-GO** for activation
>
> **Reviewed:** 2026-08-31
>
> **Owner:** Accounting / Kernel / Operations
>
> **Related documents**
>
> - [Financial ledger architecture](../architecture/financial-ledger.md)
> - [Financial ledger execution roadmap](../roadmap/financial-ledger-execution.md)
> - [Staging topology](./staging-topology.md)
> - [Staging infrastructure selection](./staging-infrastructure-selection.md)
> - [Proposed Cloudflare edge/evidence boundary](../decisions/0065-propose-cloudflare-financial-edge-evidence-plane.md)
> - [Evidence matrix](./evidence-matrix.md)
> - [Rehearsal runbook](./rehearsal-runbook.md)
> - [TigerBeetle recovery runbook](../operations/tigerbeetle-recovery.md)
> - [Frozen readiness record](../operations/financial-readiness-evidence-2026-08-18.json)

This plan sequences the first production-equivalent TigerBeetle rehearsal. It does not approve
activation, select a new financial authority, or define billing, tax, payment, settlement,
inventory-value, or other deferred semantics.

## Current decision

The frozen readiness record from **August 18, 2026** records 2 of 16 financial gates as mechanically
complete and 14 as requiring `staging-real` or `production-real` evidence. Repository tests,
local-real runs, and mock adapters cannot substitute for those evidence classes. PostgreSQL remains
the default financial engine until every accepted gate passes.

As of **August 31, 2026**, no approved staging deployment, production-equivalent TigerBeetle
cluster, custody signer, paired backup/restore environment, supervised worker topology, or alert
delivery backend is available in this repository session. The proposed provider selection remains
unapproved and must not be treated as provisioning authorization.

## Local prerequisites

Implemented locally:

- provider-neutral `FinancialLedgerPort` and typed operation outcomes;
- store-derived watermark and bounded inventory contracts;
- PostgreSQL and TigerBeetle observation adapters behind a kernel registry;
- fail-closed scan limits, scope/metadata validation, watermark revalidation, duplicate detection,
  and deterministic fact hashing;
- operation-scoped projection rebuild output with a deterministic report snapshot hash;
- provider-neutral staging evidence cohort, backup/restore, telemetry, and canonical-hash contracts;
- authorized append-only staging evidence capture with tenant-scoped lookup and read-time integrity verification;
- immutable signed verification-artifact plumbing and the development/test signer boundary.

Still intentionally open:

- provider-wide TigerBeetle CDC or a supported complete global cursor;
- an authoritative per-cohort TigerBeetle scope/filter suitable for shared production clusters;
- complete independent balance/history rebuild proof;
- append-only staging evidence capture in an approved deployment with immutable/WORM retention;
- production custody, metrics delivery, alert acknowledgement, backup/restore, and failure rehearsal
  evidence.

The local observation boundary is not an activation proof. A bounded scan is rejected when it is
unavailable, over its limit, incomplete, out of scope, or contains invalid provider metadata.

## Readiness sequence

1. **Approve the cohort and owner.** Name the tenant/Legal Entity scope, deployment revision,
   operator roles, retention owner, and abort authority.
2. **Provision the approved topology.** First approve the
   [staging infrastructure selection](./staging-infrastructure-selection.md), then use PostgreSQL
   19+, the supervised worker deployment, the trusted adapter network path, and a production-
   equivalent multi-replica TigerBeetle cluster. Keep credentials and custody outside repository
   contracts.
3. **Migrate and seed only the bounded profile.** Preserve PostgreSQL history. Verify the opening
   balance and mapping boundary before any activation attempt.
4. **Capture a store-derived baseline.** Collect source and target watermarks, snapshot references,
   complete supported inventory, operation/transfer identities, lease generations, metrics, and
   alert state. Do not accept caller-authored production watermarks.
5. **Run the fault matrix.** Execute the approved process-kill, worker-restart, provider-outage,
   quorum, PostgreSQL-outage, and restore scenarios separately. Preserve operation IDs and exact
   provider outcomes.
6. **Rebuild and compare.** Rebuild the PostgreSQL projection from the authoritative provider facts;
   compare balances, transfer history, mappings, projections, and hashes. Any unexplained mismatch
   blocks the cohort.
7. **Sign and retain evidence.** Persist the provider-neutral evidence envelope through the approved
   append-only owner boundary. Sign its canonical hash with the custody-approved signer and retain
   the key ID, verification result, and audit references.
8. **Approve, activate, or abort.** Only an authorized operator may approve an immutable artifact.
   Activation remains fenced unless every required gate is green. A failed rehearsal leaves the
   profile on PostgreSQL and records the failure; it never falls back from TigerBeetle to PostgreSQL
   after acceptance.

## Exit condition

The plan exits only when the [evidence matrix](./evidence-matrix.md) has accepted evidence for every
financial gate, the final bounded cohort has zero unexplained mismatches, no P0 remains unresolved,
and the mechanical release gate still reports `GO` without changing its frozen registry or evidence
policy. Until then the result is **NO-GO — PostgreSQL remains the default financial engine.**
