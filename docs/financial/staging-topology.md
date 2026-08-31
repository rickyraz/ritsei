# Financial Staging Topology

> **Status:** approved-topology prerequisite; not provisioned
>
> **Reviewed:** 2026-08-31
>
> **Owner:** Operations / Kernel / Accounting
>
> **Related documents**
>
> - [Staging readiness plan](./staging-readiness-plan.md)
> - [Staging infrastructure selection](./staging-infrastructure-selection.md)
> - [Proposed Cloudflare edge/evidence boundary](../decisions/0065-propose-cloudflare-financial-edge-evidence-plane.md)
> - [Rehearsal runbook](./rehearsal-runbook.md)
> - [Financial ledger architecture](../architecture/financial-ledger.md)
> - [TigerBeetle recovery runbook](../operations/tigerbeetle-recovery.md)

This document describes the minimum topology shape for a production-equivalent rehearsal. It does
not contain credentials, choose a cloud provider, or authorize production activation. The proposed
provider and infrastructure selection is documented in
[`staging-infrastructure-selection.md`](./staging-infrastructure-selection.md) and remains
unapproved.

## Required shape

```text
          operator / release reviewer
                    |
             authenticated API
                    |
      +-------------+-------------+
      |                           |
PostgreSQL 19+               supervised worker
control plane                durable jobs + fencing
      |                           |
      +-------------+-------------+
                    |
           trusted financial adapter
                    |
   private network + narrow workload identity
                    |
TigerBeetle production-equivalent cluster
   replica set, quorum, state sync, backups
```

The API and worker use the same provider-neutral Accounting contracts. Only the trusted adapter may
reach TigerBeetle. Reporting, frontend code, plugins, and arbitrary domain code do not receive a
TigerBeetle credential or provider client.

## Components and boundaries

| Component              | Responsibility                                                                                                | Must not do                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| PostgreSQL 19+         | Tenant/Legal Entity metadata, intents, mappings, jobs, projections, checkpoints, signed artifact references   | Authorize an accepted TigerBeetle transfer after cutover                      |
| API                    | Authentication, request decoding, authorization handoff, public service invocation                            | Connect to TigerBeetle or accept caller-authored readiness watermarks         |
| Worker                 | Lease durable financial jobs, submit/reconcile through public Accounting service, preserve operation identity | Write Accounting tables directly or create replacement transfer IDs           |
| Financial adapter      | Provider lifecycle, deterministic mapping, bounded calls, provider-failure translation                        | Expose driver types, credentials, raw provider errors, or PostgreSQL fallback |
| TigerBeetle cluster    | Accepted transfer, balance, and transfer-history authority for the activated profile                          | Store ERP metadata or become a general reporting database                     |
| Custody signer         | Sign canonical evidence hashes and resolve historical verification keys                                       | Export production private keys to application code                            |
| Observability backend  | Receive metrics, logs, alert delivery, and operator acknowledgement                                           | Become financial authority or mutate reconciliation state                     |
| Backup/restore targets | Isolated restore rehearsal endpoints for both stores                                                          | Resume posting before cross-store watermark verification                      |

## Isolation requirements

- The rehearsal cohort is named and bounded before data is created.
- Staging credentials are distinct from development and production credentials.
- PostgreSQL primary credentials are not supplied to any hard-isolated projection or reporting
  route.
- TigerBeetle endpoints are private and reachable only from the trusted adapter/worker path.
- Operator, approval, worker, database, provider, and custody identities are separately auditable.
- Backups are taken from a frozen cohort and restored to isolated endpoints before comparison.
- The topology has a real supervisor and restart policy; a shell process or Effect fiber is not a
  durability mechanism.
- Network, disk, replica, state-sync, client-latency, unknown-outcome, and projection-lag signals
  are retained with the gate evidence.

The existing operational reference documents a six-replica production recommendation. The staging
cluster must use the approved production-equivalent replica and supervisor configuration; a local
one-replica development cluster is compatibility evidence only.

## Data and custody boundary

The staging deployment must provide:

1. a migrated PostgreSQL database with the repository's schema and process job tables;
2. a TigerBeetle cluster configured for the pinned client/provider compatibility target;
3. a supervised worker pair for lease and restart rehearsals;
4. isolated PostgreSQL and TigerBeetle backup/restore destinations;
5. an approved signing-custody integration with workload identity and audit logs;
6. an observability route that can prove alert delivery and acknowledgement.

Provider IDs, endpoint references, and deployment revisions may be recorded in evidence. Secrets,
private keys, raw SQL credentials, and driver objects must never be placed in public contracts or
committed evidence.

## Not available in this repository session

As of **August 31, 2026**, this topology is a requirement, not an available deployment. No local
process or one-replica run can close quorum, custody, restore, worker-supervision, alert-delivery,
or bounded-cohort gates.
