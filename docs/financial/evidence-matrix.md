# Financial Staging Evidence Matrix

> **Status:** canonical evidence-planning record; not activation approval
>
> **Reviewed:** 2026-08-31
>
> **Owner:** Accounting / Kernel / Operations
>
> **Related documents**
>
> - [Staging readiness plan](./staging-readiness-plan.md)
> - [Staging topology](./staging-topology.md)
> - [Staging infrastructure selection](./staging-infrastructure-selection.md)
> - [Rehearsal runbook](./rehearsal-runbook.md)
> - [Frozen readiness record](../operations/financial-readiness-evidence-2026-08-18.json)

The frozen machine-readable readiness record remains the measurement source of truth. This matrix
organizes the evidence still required; it does not change gate IDs, accepted evidence classes, or
the frozen score. Provider capability selection and provisioning prerequisites are tracked in the
[staging infrastructure selection](./staging-infrastructure-selection.md).

| Gate                                 | Required evidence class             | Current status | Minimum evidence to retain                                                                                 |
| ------------------------------------ | ----------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| `controlled_activation`              | `staging-real` or `production-real` | blocked        | Authorized prepare, independent evidence, separate approval, activation, and rejected direct/legacy bypass |
| `process_kill_no_double_posting`     | `staging-real` or `production-real` | blocked        | Worker kill after provider acceptance, restart, one transfer set, one receipt, one projection              |
| `worker_adapter_restart`             | `staging-real` or `production-real` | blocked        | Two supervised workers, lease expiry, stale completion rejection, higher fencing generation                |
| `tigerbeetle_outage_fail_closed`     | `staging-real` or `production-real` | blocked        | Provider outage, no PostgreSQL fallback, bounded retry, same-ID reconciliation                             |
| `replica_quorum_failure`             | `staging-real` or `production-real` | blocked        | Production-equivalent replicas, quorum loss, recovery, state sync, client outcomes                         |
| `postgresql_not_financial_authority` | `staging-real` or `production-real` | blocked        | Activated cohort during provider outage with PostgreSQL acceptance/fallback absence proven                 |
| `independent_backup_restore`         | `staging-real` or `production-real` | blocked        | Paired frozen backups, isolated restores, exact comparison, zero unexplained mismatch                      |
| `recovery_watermark`                 | `staging-real` or `production-real` | blocked        | Store-derived watermarks, snapshot references, cohort identity, signed comparison                          |
| `global_reconciliation`              | `staging-real` or `production-real` | blocked        | Complete provider inventory or CDC boundary, balances, both-direction orphan detection                     |
| `projection_rebuild`                 | `staging-real` or `production-real` | blocked        | Clean projection rebuild from authoritative facts and deterministic report/history comparison              |
| `production_signing_custody`         | `staging-real` or `production-real` | blocked        | Approved KMS/HSM/equivalent custody, workload identity, policy, audit, outage behavior                     |
| `operator_alerts`                    | `staging-real` or `production-real` | blocked        | Fired and delivered alerts for outage, unknown, lag, manual recovery, replica, and latency conditions      |
| `bounded_cohort`                     | `staging-real` or `production-real` | blocked        | Named owner, exact cohort, revisions, timestamps, IDs, failures, SLOs, signed artifacts, zero mismatch     |
| `no_unresolved_p0`                   | `staging-real` or `production-real` | blocked        | All other gates pass; no open P0 incident, mismatch, security exception, or ownerless remediation          |

## Evidence envelope

Each executed gate must produce one immutable, provider-neutral `FinancialStagingEvidence` envelope
with:

- UUIDv7 record identity, gate, tenant/Legal Entity scope, operator, deployment revision, and
  provider identity;
- bounded cohort identity with named owner, approval/abort authorities, planned scenarios, and
  maximum operation count;
- endpoint references without credentials;
- operation IDs, transfer IDs, lease generations, store-derived watermarks, and snapshot references;
- normalized backup/restore comparisons, measured metrics, and alert delivery/acknowledgement state;
- start/end timestamps, result, mismatch count, and orphan count;
- canonical hash, custody-approved signature, key ID, and independent verification result.

The repository now provides the authorized append-only owner boundary, authenticated operator binding,
deterministic hash verification, and tenant-scoped lookup by gate/cohort/deployment. The local
PostgreSQL adapter is durable but is not immutable/WORM or accepted staging evidence; deployment,
custody, telemetry delivery, and rehearsal execution remain external.

The envelope is evidence of an observed rehearsal, not authorization by itself. A signed artifact
may be approved only through the Accounting cutover contract and its existing
authorization/constraint boundary.

## Accepted evidence policy

- `repo-proof` is accepted only for the frozen mechanical gates `artifact_integrity` and
  `key_rotation_recovery`.
- `local-real` and `mock-only` evidence remain useful diagnostics but do not close operational
  gates.
- A missing, incomplete, invalid, mismatched, or unverifiable record is a failed gate, not a pass
  with reduced confidence.
- The matrix must be updated only when immutable accepted evidence exists; prose or a passing local
  test does not change the release decision.
