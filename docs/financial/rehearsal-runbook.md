# Financial Staging Rehearsal Runbook

> **Status:** rehearsal procedure; execution required before activation
>
> **Reviewed:** 2026-08-31
>
> **Owner:** Operations with Accounting / Kernel / Security
>
> **Related documents**
>
> - [Staging readiness plan](./staging-readiness-plan.md)
> - [Evidence matrix](./evidence-matrix.md)
> - [Staging topology](./staging-topology.md)
> - [Staging infrastructure selection](./staging-infrastructure-selection.md)
> - [TigerBeetle recovery runbook](../operations/tigerbeetle-recovery.md)
> - [Financial ledger execution roadmap](../roadmap/financial-ledger-execution.md)

Run this procedure only in the approved staging topology and after the provider decision in
[staging infrastructure selection](./staging-infrastructure-selection.md) is approved. It is deliberately provider-neutral where
possible; provider commands must come from the version-pinned deployment procedures. Never execute
it against production without a separately approved change and cohort record.

## Abort rules

Abort and leave the cohort fenced if any of the following occurs:

- a scope, mapping, amount, currency, identity, or authorization mismatch;
- an unavailable, incomplete, invalid, or unverifiable watermark/inventory result;
- a provider-only or PostgreSQL-only transfer, duplicate, missing receipt, or projection gap;
- a worker completes with a stale lease/fencing generation;
- a signer, backup, restore, alert, or audit record is unavailable;
- an operator cannot identify the exact operation, transfer, or deployment revision;
- any step would require posting to PostgreSQL as a fallback for a TigerBeetle outcome.

Do not repair a mismatch by deleting, rewriting, or replacing an accepted TigerBeetle transfer.

## 1. Record the rehearsal identity

Before changing state, create the operator-controlled rehearsal record:

- gate ID(s), named owner, approval authority, and abort authority;
- tenant and Legal Entity cohort, base currency, mapping version, and boundary;
- deployment revisions, provider identity, endpoint references, and client version;
- start timestamp and planned failure scenarios;
- retention destination and evidence record identity (UUIDv7).

Record references, not secrets. Confirm that the release gate remains `NO-GO` during preparation.

## 2. Preflight and freeze

1. Confirm the staging database is PostgreSQL 19+ and fully migrated, including `process.jobs`.
2. Confirm the worker supervisor, lease expiry, fencing generation, and restart policy are active.
3. Confirm the trusted adapter can reach only the approved TigerBeetle endpoints.
4. Confirm the custody signer can sign and independently verify a test artifact without exposing a
   private key.
5. Freeze new financial submission, period close, and dependent corrections for the cohort.
6. Record the PostgreSQL control-plane state and the provider health/replica state.
7. Verify that no pre-existing unresolved operation, orphan, manual-recovery row, or P0 incident is
   hidden by the cohort filter.

## 3. Prepare the bounded profile

1. Run the authorized Accounting prepare command.
2. Produce the opening-balance and historical-boundary evidence from the frozen cohort.
3. Provision or verify every mapped execution account idempotently.
4. Collect source and target watermarks from the observation services. Do not accept watermarks
   typed by the operator or supplied as API payload fields.
5. Scan the complete supported inventory for the declared boundary. Reject over-limit or unsupported
   scans; do not label a bounded scan as a global point-in-time proof.
6. Compare exact account balances, transfer identities, mappings, projections, and counts.
7. Sign the canonical evidence hash and retain the artifact ID and key ID.

No activation is allowed if any comparison is blocked or any required evidence is missing.

## 4. Execute failure scenarios separately

For every scenario, record the operation ID, deterministic transfer IDs, lease/fencing generation,
provider response, PostgreSQL state, timestamps, and reconciliation result.

### 4.1 Process kill after provider acceptance

1. Start one financial operation through the supervised worker.
2. Confirm provider acceptance without allowing receipt/finalization to complete.
3. Terminate worker A at the approved kill point.
4. Start worker B after the lease/restart policy permits it.
5. Verify worker B uses the same operation and transfer IDs.
6. Verify exactly one provider transfer set, one receipt, one projection, and one event identity.

### 4.2 Worker and adapter restart

1. Lease one durable financial job with worker A.
2. Terminate A while the lease is held.
3. Wait for lease expiry and start worker B.
4. Verify B obtains a strictly higher fencing generation.
5. Verify stale completion by A is rejected and B resumes from durable operation state.

### 4.3 TigerBeetle outage

1. Inject the approved network or provider-process outage during submission.
2. Verify the operation becomes `submitted`/`unknown`, not rejected by assumption.
3. Verify no PostgreSQL financial acceptance or fallback is recorded.
4. Restore provider connectivity and resolve the same IDs.
5. Verify bounded retry and final reconciliation.

### 4.4 Replica/quorum failure

1. Remove the approved replica or network path according to the provider procedure.
2. Observe client outcomes, replica status, quorum behavior, and state-sync behavior.
3. Do not format or replace a permanently lost production-equivalent replica by guesswork.
4. Recover with the version-matched provider procedure.
5. Retain the provider logs and verify the cluster returns to normal before resuming.

### 4.5 PostgreSQL outage

1. Make PostgreSQL unavailable after a provider outcome at the approved boundary.
2. Verify the accepted provider fact is not duplicated or rolled back.
3. Restore PostgreSQL and resume the durable receipt/finalization path.
4. Reconcile exact mappings, projections, outbox identity, and provider facts.

## 5. Independent restore

1. Freeze the cohort and record the last accepted reconciliation anchor.
2. Take or select corresponding PostgreSQL and TigerBeetle backups without claiming a nonexistent
   cross-store commit point.
3. Restore PostgreSQL and TigerBeetle into isolated destinations using supported procedures.
4. Collect store-derived watermarks and snapshot references from the restored pair.
5. Compare operation IDs, transfer IDs, balances, mappings, projections, and history.
6. Quarantine every unexplained difference and keep posting fenced.
7. Rebuild derived PostgreSQL projections only after exact comparison succeeds.
8. Record the operator decision to resume or abort; independently restored stores never resume
   automatically.

## 6. Rebuild, alerts, and evidence finalization

1. Rebuild the bounded report/projection from authoritative facts and PostgreSQL metadata.
2. Compare the rebuilt report, balance facts, transfer history, projections, and deterministic
   hashes with the captured baseline.
3. Exercise unknown-outcome, accepted-unreconciled, backlog, manual-recovery, replica, disk, and
   latency alert conditions.
4. Verify alert delivery, acknowledgement, owner, and runbook reference.
5. Assemble the `FinancialStagingEvidence` envelope with the approved bounded cohort, all IDs,
   watermarks, backup/restore comparisons, metrics, alerts, mismatch/orphan counts, and timestamps.
6. Persist it through the authorized Accounting append operation; the persistence boundary rejects
   replacement and deletion and verifies the canonical hash on read.
7. Sign its canonical hash and independently verify the signature using the recorded key ID.
8. Link the evidence record to the Accounting verification artifact and retain the immutable audit
   references.

A successful local test or a zero-count query without the required deployment evidence is not a gate
pass.

## 7. Approval and closeout

1. Confirm every row in the [evidence matrix](./evidence-matrix.md) has accepted evidence.
2. Confirm no unresolved P0, security exception, mismatch, or ownerless remediation remains.
3. Have a separately authorized operator approve the immutable artifact.
4. Activate only the named bounded cohort through the Accounting state machine.
5. Verify the legacy PostgreSQL route is rejected for the activated scope and no fallback exists.
6. Record the final release-gate output and close the rehearsal with an immutable operator decision.

Any failed step leaves the profile fenced and PostgreSQL remains the default financial engine.
