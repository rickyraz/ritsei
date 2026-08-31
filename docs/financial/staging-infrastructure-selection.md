# Financial Staging Infrastructure Selection

> **Status:** Proposed provider-selection brief; not approved and not provisioned
>
> **Reviewed:** 2026-08-31
>
> **Owner:** Operations / Security / Kernel / Accounting
>
> **Owns:** the minimum production-equivalent staging capability shape, provider options, cost
> assumptions, irreversible choices, and provisioning prerequisites.
>
> **Does not own:** financial authority semantics, readiness gate definitions, evidence acceptance
> policy, or rehearsal execution. Those remain owned by the linked architecture and readiness
> documents.
>
> **Related documents**
>
> - Proposed provider decision: [`../decisions/0064-propose-gcp-financial-staging-platform.md`](../decisions/0064-propose-gcp-financial-staging-platform.md)
> - Proposed Cloudflare boundary: [`../decisions/0065-propose-cloudflare-financial-edge-evidence-plane.md`](../decisions/0065-propose-cloudflare-financial-edge-evidence-plane.md)
> - Financial staging topology: [`./staging-topology.md`](./staging-topology.md)
> - Staging readiness plan: [`./staging-readiness-plan.md`](./staging-readiness-plan.md)
> - Evidence matrix: [`./evidence-matrix.md`](./evidence-matrix.md)
> - Rehearsal runbook: [`./rehearsal-runbook.md`](./rehearsal-runbook.md)
> - Financial ledger architecture: [`../architecture/financial-ledger.md`](../architecture/financial-ledger.md)
> - TigerBeetle recovery runbook: [`../operations/tigerbeetle-recovery.md`](../operations/tigerbeetle-recovery.md)
> - Workload isolation: [`../architecture/workload-isolation.md`](../architecture/workload-isolation.md)

## Decision summary

The recommended first staging platform is **Google Cloud**, using Compute Engine for the
provider-controlled hosts and managed services only for custody, secrets, observability, immutable
evidence, and artifact storage.

Cloudflare is an optional adjacent plane, not a platform replacement. It may provide DNS/WAF,
private authenticated ingress, optional non-authoritative Workers, and a hash-bound R2 evidence copy.
It must not host PostgreSQL or TigerBeetle, receive financial-provider credentials, or become a
second evidence authority. The boundary is proposed separately in
[`ADR-0065`](../decisions/0065-propose-cloudflare-financial-edge-evidence-plane.md).

The recommendation is **proposed, not accepted**. No resources may be provisioned, no TigerBeetle
cluster may be formatted, no WORM retention policy may be locked, and no destructive rehearsal may
run until the provider decisions in this document are approved.

The minimum current-gate shape is:

```text
Internet
└── optional Cloudflare DNS/WAF/Workers
    └── private authenticated path
        └── GCP staging project
            └── private VPC in one region
                ├── TigerBeetle: 6 dedicated replicas, 2 per zone across 3 zones
                ├── PostgreSQL 19+: 1 control-plane primary VM
                ├── workers: 2 supervised worker/adapter VMs in separate zones
                ├── API: 1 host with no TigerBeetle credential
                ├── query/load generator: temporary host with no command/provider credential
                ├── locked dual-region GCS evidence bucket
                ├── separate backup bucket/project
                ├── HSM-backed signer, secret manager, metrics, and alert delivery
                └── separate restore project/VPC/region
                    ├── PostgreSQL restore target
                    └── provider-approved isolated TigerBeetle restore target

Optional independent evidence copy: signed/hash-verified envelope to Cloudflare R2 Bucket Lock.
```

This is the smallest shape that can honestly exercise the current process-kill, worker-restart,
provider-outage, replica/quorum, PostgreSQL-authority, restore, custody, alert, and bounded-cohort
gates. A single-cloud three-zone layout does **not** prove tolerance of a complete cloud-provider
outage. If the approved production profile makes that claim, use six TigerBeetle replicas across
three cloud providers instead.

## Non-negotiable constraints

- TigerBeetle remains the target financial execution, balance, and transfer-history authority.
- PostgreSQL remains the control plane and must never be a silent financial fallback after provider
  acceptance.
- The existing `FinancialLedgerPort` remains provider-independent.
- Provider clients, credentials, topology, raw provider failures, custody details, and storage
  products remain behind infrastructure adapters.
- Cloudflare is optional edge/evidence infrastructure only; it is never financial authority.
- An R2 copy is hash-bound secondary evidence, not a second accepted record or authority.
- Cloudflare Containers are excluded from TigerBeetle and PostgreSQL authority hosting.
- Hyperdrive is excluded from the financial readiness path until PostgreSQL 19 compatibility and
  private-path behavior are proven.
- The existing 16-gate registry, frozen measurements, accepted evidence classes, and benchmark
  results are unchanged.
- Local PostgreSQL append-only evidence is not WORM evidence.
- Missing, incomplete, invalid, mismatched, or unverifiable evidence fails closed.
- A provider must supply a supported complete inventory, cursor, CDC, or equivalent history boundary
  before it can support the global reconciliation gate.
- A restore target remains fenced until store-derived watermarks, balances, histories, mappings,
  projections, and hashes are compared and an authorized operator approves recovery.
- This document does not authorize activation or production traffic.

## Minimum production-equivalent profile

The following assumptions keep the profile bounded without weakening a gate:

- one named tenant and Legal Entity cohort;
- one base currency and the existing fixed two-decimal amount boundary;
- durable `process.jobs` state and the existing worker fencing protocol;
- no billing, tax, payments, settlement, FX, wallet, credit, budget, valuation, or quantity scope;
- two supervised workers, not two Effect fibers in one process;
- no direct API or frontend path to TigerBeetle;
- no production credentials in staging or restore environments;
- no automatic resume after restore;
- restore resources are created ephemerally and destroyed only after evidence retention is complete.

PostgreSQL HA is not a separate current financial gate. Therefore the minimum current-gate profile is
one PostgreSQL 19+ primary plus an isolated restore target, without claiming PostgreSQL failover
HA. If the production deployment profile already requires PostgreSQL HA, add a synchronous standby
and a third consensus/witness placement before calling the staging profile production-equivalent.

## Adjacent Cloudflare boundary

Cloudflare is not required for the first financial rehearsal. If adopted, it is limited to the
following capability:

1. **Required capability:** Global DNS/WAF/edge protection and an optional independent, immutable
   evidence copy.
2. **Minimum production-equivalent topology:** Cloudflare terminates protected ingress to a private,
   authenticated GCP API path; R2 uses separate credentials and Bucket Lock; no Cloudflare path can
   reach PostgreSQL or TigerBeetle directly.
3. **Provider-neutral requirement:** Edge and evidence operations cannot authorize financial work,
   mutate accepted facts, or bypass Accounting authorization and custody boundaries.
4. **Concrete provider options:** Cloudflare DNS/WAF, Workers, R2, and optional Hyperdrive; equivalent
   edge and object-lock services remain possible alternatives.
5. **Recommended default:** Use Cloudflare only for edge protection and optional R2 secondary
   evidence; keep GCS as the primary evidence destination and GCP KMS/HSM as signer custody.
6. **Why it satisfies readiness:** It separates ingress and an evidence copy from the authority host
   without changing `FinancialLedgerPort` or the TigerBeetle topology.
7. **Cost/operational complexity:** Low for bounded traffic and evidence volume, but budget separate
   egress, WAF, Workers, R2 operations, retention, and audit costs.
8. **Failure modes to inject:** Cloudflare ingress outage, WAF misconfiguration, private-path failure,
   R2 write denial, R2 retention enforcement, R2 read mismatch, and loss of the secondary copy.
9. **Evidence to capture:** Zone/WAF revision, route identity, worker deployment digest, R2 object
   identity/generation, retention state, hash/signature comparison, and provider audit records.
10. **Reversible later:** Edge routing and Workers are reversible. R2 Bucket Lock is irreversible
    after retention is locked; provider separation must be revalidated if removed.

Explicit exclusions:

- Cloudflare Containers do not host TigerBeetle replicas or PostgreSQL authority.
- Hyperdrive is not a financial command/readiness dependency until PostgreSQL 19 compatibility is
  proven.
- Keyless SSL/HSM integrations do not replace the GCP custody signer for financial evidence.

## Capability decisions

### 1. PostgreSQL

1. **Required capability:** PostgreSQL 19+, complete repository schema including `process.jobs`,
   durable control-plane transactions, WAL/base backups, and independent restore.
2. **Minimum production-equivalent topology:** One dedicated PostgreSQL 19+ primary VM with zonal
   SSD, TLS, bounded connection pools, and one separate restore VM created for the rehearsal.
3. **Provider-neutral requirement:** PostgreSQL owns tenant, Legal Entity, intent, job, mapping,
   projection, checkpoint, and evidence-reference state; it does not authorize an accepted
   TigerBeetle transfer or provide financial fallback.
4. **Concrete provider options:** GCP Compute Engine, AWS EC2, Azure VM, or a managed PostgreSQL
   service after PostgreSQL 19+ and backup/restore compatibility are verified.
5. **Recommended default:** Self-managed PostgreSQL 19+ on GCP Compute Engine.
6. **Why it satisfies readiness:** The exact supported major version, migration graph, outage point,
   WAL recovery, and isolated restore can be controlled and observed.
7. **Cost/operational complexity:** Approximately `$150–$350/month` for the primary, storage, and
   ordinary backup path; a production HA pair adds cost and operational ownership.
8. **Failure modes to inject:** PostgreSQL outage after provider acceptance, WAL gap, disk-full,
   connection exhaustion, credential denial, delayed restart, and restore divergence.
9. **Evidence to capture:** `server_version_num`, migration manifest, backup/WAL IDs, restore
   timestamps, watermarks, comparison report, and proof the database cannot reach TigerBeetle.
10. **Reversible later:** Yes. A managed PostgreSQL service can replace the VM after version,
    extension, backup, restore, and failure-injection compatibility is proven.

### 2. TigerBeetle HA topology

1. **Required capability:** Authoritative accepted transfers, balances, transfer history, quorum,
   state synchronization, supervised restart, and supported recovery.
2. **Minimum production-equivalent topology:** Six dedicated replicas, two in each of three low-
   latency zones, with one replica and one data disk per machine.
3. **Provider-neutral requirement:** The adapter is the only TigerBeetle client path. The topology
   must preserve deterministic IDs, same-ID retries, bounded calls, fail-closed unknown outcomes,
   and no PostgreSQL fallback.
4. **Concrete provider options:** Six GCP VMs, six AWS EC2 instances, six Azure VMs, or the
   TigerBeetle managed service. A three-cloud layout is an additional availability profile, not a
   free substitute for the six-replica requirement.
5. **Recommended default:** Self-managed six-replica GCP cluster across three zones for the current
   gate set. Select multi-cloud only if the production availability objective requires provider-loss
   tolerance.
6. **Why it satisfies readiness:** It permits replica loss, quorum, state-sync, client-outcome,
   restart, and recovery rehearsals without treating a one-replica development process as proof.
7. **Cost/operational complexity:** Approximately `$800–$1,300/month` for six appropriately sized
   nodes and disks; three-cloud operation is approximately `$2,500–$5,000+/month` and requires
   multi-provider networking, support, and recovery ownership.
8. **Failure modes to inject:** Replica kill, zone isolation, packet loss, client timeout, quorum
   loss, state-sync interruption, disk pressure, provider endpoint outage, and recovery of a lost
   replica.
9. **Evidence to capture:** Cluster ID, replica count, site mapping, binary/client versions,
   health and quorum transitions, state-sync records, operation/transfer IDs, and recovery logs.
10. **Reversible later:** Hosting is reversible by creating a new cluster. Replica count, cluster
    identity, site distribution, and migration/recovery procedure are high-cost decisions.

A provider selection is incomplete until it supplies a supported complete inventory/cursor/history
boundary for global reconciliation and a supported backup/restore procedure. Raw VM snapshots or
an operation-scoped scan must not be relabeled as global or authoritative evidence.

### 3. Compute and runtime

1. **Required capability:** Durable, supervised execution with controlled process termination and
   worker fencing.
2. **Minimum production-equivalent topology:** Two worker/adapter VMs in separate zones, one API
   host, and one temporary query/load-generator host. TigerBeetle runs on its own dedicated nodes.
3. **Provider-neutral requirement:** Workers lease durable jobs, preserve operation identities, obey
   fencing generations, use bounded retries, and invoke public Accounting contracts.
4. **Concrete provider options:** GCE VMs with `systemd`, AWS EC2/ECS, Azure VMs, or Kubernetes.
5. **Recommended default:** GCE VMs with `systemd`; use containers only as the packaging format, not
   as a replacement for process supervision.
6. **Why it satisfies readiness:** The kill-after-acceptance and lease-expiry scenarios require
   independent worker processes with a real supervisor and restart policy.
7. **Cost/operational complexity:** Approximately `$200–$450/month` for the application hosts.
8. **Failure modes to inject:** Kill after provider acceptance, kill while a lease is held, OOM,
   CPU pressure, delayed restart, adapter network loss, and stale completion.
9. **Evidence to capture:** Host identity, image digest, supervisor events, worker identity, lease
   generation, operation ID, timestamps, and stale-completion rejection.
10. **Reversible later:** Yes, provided the public contracts and deployment evidence remain stable.

### 4. Workload identity

1. **Required capability:** Separate, auditable identities for API, workers, backups, signer,
   operators, and restore resources.
2. **Minimum production-equivalent topology:** One user-managed service account per workload class,
   attached to the relevant VM; no downloaded service-account keys.
3. **Provider-neutral requirement:** Least privilege, explicit tenant scope, separate operator and
   worker identity, and audit records for every custody, backup, and evidence operation.
4. **Concrete provider options:** GCP service accounts and Workload Identity Federation, AWS IAM
   roles, Azure managed identities, or SPIFFE/SPIRE.
5. **Recommended default:** GCP attached service accounts plus Workload Identity Federation for
   external CI and operator automation.
6. **Why it satisfies readiness:** It proves the signer, evidence, backup, and restore paths are
   controlled by distinct principals rather than shared static credentials.
7. **Cost/operational complexity:** Low; the main cost is policy review and audit configuration.
8. **Failure modes to inject:** Revoked permission, wrong principal, expired token, denied KMS
   access, denied evidence access, and restore identity reaching live resources.
9. **Evidence to capture:** IAM policies, principal IDs, audit log entries, denied operations, token
   issuance, and proof no key files exist on hosts or in artifacts.
10. **Reversible later:** Yes. Identity names and roles can be replaced while retaining the public
    service boundaries.

### 5. KMS/HSM-backed signing

1. **Required capability:** Non-exportable Ed25519 signing key, key ID resolution, historical key
   verification, least-privilege access, audit logs, and fail-closed outage behavior.
2. **Minimum production-equivalent topology:** One provider custody key with active and historical
   versions, separate sign and verify permissions, and independent verification of a test artifact.
3. **Provider-neutral requirement:** Preserve the existing `FinancialVerificationSigner` contract;
   private key material must never enter application memory or evidence.
4. **Concrete provider options:** GCP Cloud KMS HSM, GCP single-tenant HSM, an external HSM through
   an approved integration, or another cloud HSM only after Ed25519 compatibility is demonstrated.
5. **Recommended default:** GCP Cloud KMS HSM with the existing Ed25519 algorithm, subject to
   Security approval of residency, audit, rotation, and outage behavior.
6. **Why it satisfies readiness:** It provides provider-controlled custody, a stable key ID, audit
   evidence, historical verification, and a real denied/unavailable signing path.
7. **Cost/operational complexity:** Multi-tenant HSM is expected to be low-cost for this volume;
   single-tenant HSM is a multi-thousand-dollar monthly decision and is not the minimum default.
8. **Failure modes to inject:** IAM denial, KMS outage, quota failure, active-key rotation,
   historical-key verification, audit-log loss, signer timeout, and failed independent verify.
9. **Evidence to capture:** Key resource/version, algorithm, protection level, IAM policy, sign/
   verify results, custody audit records, and no private-key export.
10. **Reversible later:** The adapter and provider are reversible. Key location, protection class,
    residency, and some key properties are not safely changed after creation.

### 6. Secret management

1. **Required capability:** Secure storage and rotation for database credentials, TLS material,
   provider endpoint credentials, and alert integrations.
2. **Minimum production-equivalent topology:** Secret Manager with separate secrets and access
   policies for every workload and environment.
3. **Provider-neutral requirement:** No secrets in repository files, images, public DTOs, evidence,
   logs, command output, or restore artifacts.
4. **Concrete provider options:** GCP Secret Manager, AWS Secrets Manager, Azure Key Vault, or
   HashiCorp Vault.
5. **Recommended default:** GCP Secret Manager with workload-specific access and versioned rotation.
6. **Why it satisfies readiness:** Access denial, rotation, recovery, and audit behavior can be
   exercised without exposing credential values.
7. **Cost/operational complexity:** Negligible for the bounded staging cohort; use the provider's
   free tier where applicable.
8. **Failure modes to inject:** Missing permission, unavailable backend, stale version, failed
   rotation, revoked TLS credential, and accidental restore-environment access.
9. **Evidence to capture:** Secret version IDs, rotation records, principal, access result, and
   proof that secret values are absent from logs and evidence.
10. **Reversible later:** Yes.

### 7. Metrics

1. **Required capability:** Metrics for unknown outcomes, accepted-but-unreconciled age, backlog,
   manual recovery, replica health, disk, latency, outage, and projection lag.
2. **Minimum production-equivalent topology:** Collection agent or OpenTelemetry collector on every
   host, bounded labels/cardinality, durable retention, and alertable missing-data behavior.
3. **Provider-neutral requirement:** Missing or delayed telemetry fails the relevant readiness proof;
   metrics must retain operation, deployment, and scope correlation without sensitive payloads.
4. **Concrete provider options:** Cloud Monitoring, Managed Service for Prometheus/Grafana,
   Datadog, AWS CloudWatch, or Azure Monitor.
5. **Recommended default:** Cloud Monitoring with OpenTelemetry/StatsD collection and explicit
   retention for the rehearsal window.
6. **Why it satisfies readiness:** It supplies time-correlated evidence for provider failure,
   reconciliation lag, replica behavior, disk pressure, and recovery.
7. **Cost/operational complexity:** Budget `$25–$150/month`, depending on log volume, retention,
   and metric cardinality.
8. **Failure modes to inject:** Collector stopped, exporter blocked, delayed samples, quota or
   cardinality failure, clock skew, and loss of one replica's telemetry.
9. **Evidence to capture:** Metric definitions, labels, raw samples, collection timestamps, alert
   evaluations, missing-data behavior, and deployment revision.
10. **Reversible later:** Yes.

### 8. Alert delivery

1. **Required capability:** Fired, delivered, acknowledged, owned, and resolved alerts.
2. **Minimum production-equivalent topology:** Managed alert policies routed to a durable machine
   channel plus an independent operator channel.
3. **Provider-neutral requirement:** Delivery and acknowledgement must be externally observable;
   configured-but-undelivered alerts do not satisfy the gate.
4. **Concrete provider options:** Cloud Monitoring, Pub/Sub, PagerDuty, Opsgenie, email, SNS, or
   Azure Action Groups.
5. **Recommended default:** Cloud Monitoring to Pub/Sub and email; add PagerDuty when formal
   on-call acknowledgement is required.
6. **Why it satisfies readiness:** It proves the required outage, unknown, lag, manual-recovery,
   replica, disk, and latency alerts reach an operator and are acknowledged.
7. **Cost/operational complexity:** `$0–$75/month` for native channels; third-party paging is
   quote-dependent.
8. **Failure modes to inject:** Each critical alert condition, blocked notification channel,
   duplicate delivery, failed acknowledgement, and alert recovery/reopen.
9. **Evidence to capture:** Policy revision, incident ID, fired/delivered/acknowledged timestamps,
   operator identity, notification logs, and runbook reference.
10. **Reversible later:** Yes.

### 9. Immutable/append-only evidence storage

1. **Required capability:** WORM retention for signed evidence envelopes, manifests, hashes, audit
   references, and operator decisions.
2. **Minimum production-equivalent topology:** Separate dual-region object-storage bucket, approved
   retention policy, immutable lock, uniform IAM, and separate writer/compliance roles.
3. **Provider-neutral requirement:** The application append-only contract is reinforced by an
   independent storage retention control; local PostgreSQL is not accepted WORM evidence.
4. **Concrete provider options:** GCS Bucket Lock, S3 Object Lock, Azure immutable Blob Storage, or
   a dedicated WORM archive.
5. **Recommended default:** Dual-region GCS bucket with Bucket Lock after retention-owner approval.
6. **Why it satisfies readiness:** It prevents replacement and deletion during the retention period
   and supplies independent storage-policy evidence.
7. **Cost/operational complexity:** A few dollars per month for the expected staging evidence volume;
   operations, egress, and retention duration remain variable.
8. **Failure modes to inject:** Overwrite/delete attempt, privileged break-glass access, retention
   violation, KMS outage, audit-log loss, and evidence hash mismatch.
9. **Evidence to capture:** Bucket policy and lock state, object generation, retention expiration,
   hash, signature, access logs, and failed mutation attempts.
10. **Reversible later:** **No after locking.** Create an unlocked pre-production bucket first; lock
    only after retention, residency, owner, and legal policy are approved.

### 10. Backup storage

1. **Required capability:** Independent PostgreSQL and TigerBeetle backup artifacts with retention,
   source-watermark references, and supported restore procedures.
2. **Minimum production-equivalent topology:** Separate backup project/bucket and credentials;
   PostgreSQL base backups plus WAL; TigerBeetle backup/export only through a provider-approved
   procedure.
3. **Provider-neutral requirement:** Never claim a cross-store commit point that does not exist;
   record exact source watermarks, snapshot references, and restore points.
4. **Concrete provider options:** GCS plus `pgBackRest`, S3 plus `pgBackRest`, Azure Blob plus
   `pgBackRest`, or managed TigerBeetle disaster recovery.
5. **Recommended default:** GCS for PostgreSQL backups; defer the TigerBeetle backup decision until
   the provider supplies a supported procedure.
6. **Why it satisfies readiness:** It enables independent paired restore without inventing a
   database/provider transaction boundary.
7. **Cost/operational complexity:** `$25–$150/month` for PostgreSQL backup storage and transfer;
   TigerBeetle-managed recovery is quote-based.
8. **Failure modes to inject:** Corrupt/incomplete backup, missing WAL, wrong restore point,
   access denial, backup outage, and accidental restore into the live environment.
9. **Evidence to capture:** Backup IDs, source LSN/watermark, retention policy, restore logs,
   artifact hashes, paired comparisons, and fencing state.
10. **Reversible later:** Storage provider is reversible; backup format and provider recovery
    procedure may require a new evidence rehearsal.

### 11. Isolated restore environment

1. **Required capability:** Independent restore of PostgreSQL and TigerBeetle without live access or
   automatic resumption.
2. **Minimum production-equivalent topology:** Separate project/account, VPC, IAM set, and region;
   one PostgreSQL restore target and a provider-approved isolated TigerBeetle restore target.
3. **Provider-neutral requirement:** Restored stores remain fenced until exact comparison and an
   authorized recovery decision.
4. **Concrete provider options:** Separate GCP project, AWS account, Azure subscription, or a
   managed clean-room recovery environment.
5. **Recommended default:** Separate GCP project and region, created ephemerally for each rehearsal.
6. **Why it satisfies readiness:** It proves paired restore and prevents accidental writes to live
   or staging authority.
7. **Cost/operational complexity:** `$300–$1,000` per restore rehearsal, depending on duration,
   data volume, and TigerBeetle restore topology.
8. **Failure modes to inject:** Wrong backup, partial restore, missing WAL, live-network route,
   credential crossover, comparison mismatch, and attempted resume.
9. **Evidence to capture:** Project/VPC IDs, routes, identities, restore points, watermarks,
   comparison report, fencing status, and operator decision.
10. **Reversible later:** Yes, when resources are ephemeral and credentials are not reused.

### 12. Networking and failure domains

1. **Required capability:** Private provider access, explicit failure domains, narrow adapter reach,
   and injectable network failures.
2. **Minimum production-equivalent topology:** One region with three zones; two TigerBeetle
   replicas per zone; private IPs; worker-to-provider firewall rules; isolated restore VPC.
3. **Provider-neutral requirement:** API, frontend, reporting, and plugins cannot reach TigerBeetle;
   hard-isolated query workloads cannot receive command-primary credentials.
4. **Concrete provider options:** GCP VPC, AWS VPC, Azure VNet, or three-cloud private networking.
5. **Recommended default:** GCP VPC across three zones. Use multi-cloud only when the approved
   production claim requires complete provider-loss tolerance.
6. **Why it satisfies readiness:** It enables zone/network isolation and proves the provider path is
   separate from API and reporting paths.
7. **Cost/operational complexity:** `$50–$250/month` for NAT, flow logs, private connectivity, and
   egress; multi-cloud adds substantial operational cost.
8. **Failure modes to inject:** Zone isolation, packet loss, latency, DNS failure, PostgreSQL path
   blackhole, TigerBeetle endpoint block, and KMS/storage egress denial.
9. **Evidence to capture:** Network diagram, routes, firewall rules, flow logs, latency/packet-loss
   metrics, endpoint health, and access audit.
10. **Reversible later:** VPC and routes are reversible. Multi-cloud, residency, and latency
    decisions are high-cost.

### 13. Application artifact/image immutability

1. **Required capability:** Reproducible API, worker, adapter, and TigerBeetle binaries tied to an
   exact deployment revision.
2. **Minimum production-equivalent topology:** OCI images and binaries in an artifact registry;
   deployment manifests use immutable digests rather than mutable tags.
3. **Provider-neutral requirement:** Evidence records image/binary digest, source revision, build
   identity, client version, and provider compatibility.
4. **Concrete provider options:** GCP Artifact Registry, AWS ECR, Azure Container Registry, or an
   OCI registry with signed provenance.
5. **Recommended default:** Artifact Registry with immutable tags, digest-pinned manifests, and
   signed release metadata.
6. **Why it satisfies readiness:** It prevents a later tag mutation from changing the tested
   artifact and makes evidence reproducible.
7. **Cost/operational complexity:** Usually less than `$25/month` for the bounded staging image
   volume.
8. **Failure modes to inject:** Mutable-tag attempt, digest mismatch, unsigned artifact, registry
   outage, denied builder identity, and rollback to a prior digest.
9. **Evidence to capture:** Image digest, binary checksum, SBOM/provenance, source revision,
   builder identity, deployment manifest, and registry audit logs.
10. **Reversible later:** Registry/provider is reversible; accepted evidence remains bound to the
    original digest.

## Cost envelope

The following is a planning estimate, not a provider quote. It assumes one always-on GCP region,
modest staging data, six TigerBeetle nodes, one PostgreSQL primary, two workers, one API host, a
small load generator, ordinary zonal disks, bounded logs/metrics, and no commercial support plan.

| Cost area | Monthly estimate | Notes |
| --- | ---: | --- |
| TigerBeetle six-node cluster | `$800–$1,300` | Dedicated nodes and data disks |
| PostgreSQL and application hosts | `$350–$800` | Primary, workers, API, and ordinary storage |
| Backups, evidence, observability, network | `$150–$400` | Highly dependent on retention and egress |
| Optional Cloudflare edge/R2 plane | Not included | Reprice WAF, Workers, R2, egress, and audit retention |
| **Continuous single-cloud total** | **`$1,300–$2,300`** | Restore cluster and optional Cloudflare plane excluded |
| One restore rehearsal burst | `$300–$1,000` | Ephemeral restore resources |
| Three-cloud TigerBeetle profile | `$2,500–$5,000+` | Provider networking and operations included only roughly |
| Single-tenant HSM | `+$3,500+` | Not the recommended minimum |

Reprice the selected region and instance family before approval. Do not reduce replica count,
retention, custody, restore isolation, or alert requirements to meet a cost target.

## Provider decisions required before provisioning

1. Single-cloud three-zone TigerBeetle versus three-cloud provider-loss tolerance.
2. Self-managed TigerBeetle versus TigerBeetle managed service.
3. Supported TigerBeetle backup/restore procedure.
4. Supported complete inventory, cursor, CDC, and history boundary for global reconciliation.
5. Self-managed PostgreSQL 19+ versus a managed service with verified version support.
6. HSM key residency, Ed25519 compatibility, rotation, audit, and outage behavior.
7. Evidence WORM retention duration, residency, owner, and break-glass policy.
8. Alert acknowledgement provider and operator roster.
9. Production-equivalent latency, data-residency, and failure-domain objectives.
10. Whether Cloudflare is adopted for edge protection or an independent R2 evidence copy.
11. Final budget and provider support level.

## Reversible and irreversible choices

### Reversible with bounded revalidation

- Compute instance family and VM image.
- Worker packaging and supervisor implementation.
- Metrics and alert backend.
- Secret manager.
- Artifact registry.
- PostgreSQL hosting model after compatibility proof.
- VPC routing before evidence capture.
- Cloudflare edge routing, Workers, and an unlocked R2 staging bucket.

### High-cost or irreversible

- TigerBeetle replica count and cluster identity.
- Single-cloud versus multi-cloud availability claim.
- Locked WORM retention policy.
- KMS key location, residency, and protection policy.
- Backup format and TigerBeetle recovery procedure.
- Data residency and cross-provider network design.
- Evidence retention policy after accepted artifacts are written.
- R2 Bucket Lock retention once it is locked.

## Provisioning status

```text
infrastructure_ready_to_provision: no
resources_provisioned: no
cluster_formatted: no
worm_policy_locked: no
destructive_rehearsal_executed: no
financial_authority_changed: no
roadmap_benchmarks_changed: no
```

The first step is not resource creation. Operations, Security, Kernel, Accounting, and the release
owner must approve the provider decision record and obtain compatibility confirmation for PostgreSQL
19+, TigerBeetle backup/restore and inventory boundaries, Ed25519 custody, WORM retention, and alert
acknowledgement.

After approval, the first non-destructive provisioning step is an empty isolated project/VPC/IAM
skeleton. It must contain no financial data, no formatted TigerBeetle cluster, no locked evidence
bucket, and no production credential.

## Provider references

These references inform provider compatibility review; they do not change RITSEI's provider-neutral
contracts or readiness gates.

- [TigerBeetle cluster recommendations](https://docs.tigerbeetle.com/operating/cluster)
- [TigerBeetle hardware requirements](https://docs.tigerbeetle.com/operating/hardware)
- [TigerBeetle deployment](https://docs.tigerbeetle.com/operating/deploying)
- [TigerBeetle recovery](https://docs.tigerbeetle.com/operating/recovering)
- [TigerBeetle monitoring](https://docs.tigerbeetle.com/operating/monitoring)
- [TigerBeetle change data capture](https://docs.tigerbeetle.com/operating/cdc)
- [Google Cloud KMS algorithms](https://cloud.google.com/kms/docs/algorithms)
- [Google Cloud KMS pricing](https://cloud.google.com/kms/pricing)
- [Google Cloud Compute Engine pricing](https://cloud.google.com/compute/vm-instance-pricing)
- [Google Cloud Secret Manager pricing](https://cloud.google.com/secret-manager/pricing)
- [Google Cloud Storage Bucket Lock](https://cloud.google.com/storage/docs/bucket-lock)
- [Google Cloud Storage pricing](https://cloud.google.com/storage/pricing)
- [Google Cloud Monitoring pricing](https://cloud.google.com/stackdriver/pricing)
- [Google Cloud Artifact Registry image management](https://cloud.google.com/artifact-registry/docs/docker/manage-images)
- [Cloudflare Containers lifecycle](https://developers.cloudflare.com/containers/concepts/architecture/)
- [Cloudflare R2 Bucket Lock](https://developers.cloudflare.com/r2/buckets/bucket-locks/)
- [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
- [Cloudflare Hyperdrive supported databases](https://developers.cloudflare.com/hyperdrive/reference/supported-databases-and-features/)
- [Cloudflare HSM integrations](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/)
