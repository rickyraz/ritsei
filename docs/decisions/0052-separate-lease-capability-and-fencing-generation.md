# ADR-0052: Separate lease capability from fencing generation

- Status: Accepted
- Date: 2026-08-25
- Amends: None
- Compatible with: ADR-0051 (adopt UUIDv7 for persistent identities)
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Canonical architecture: [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
> - Durable execution: [`../architecture/durable-execution.md`](../architecture/durable-execution.md)
> - State and consistency: [`../architecture/state-and-consistency.md`](../architecture/state-and-consistency.md)
> - Process package: [`../../packages/process/`](../../packages/process/)

## Context

A durable job lease has two different concurrency questions:

1. Does the caller possess the currently issued lease capability?
2. Is the caller's lease generation newer than every previous acquisition?

A random UUID lease token answers the first question through equality. It does not establish an
ordering relationship between two acquisitions. Therefore, checking `lease_token = $token` protects
the current job-row transition, but it is not by itself a formal fencing protocol for downstream
side effects.

This distinction matters when a worker pauses after claiming a job, the lease expires, another worker
reclaims it, and the first worker later resumes. Rejecting the old worker only at
`completeJob`/`failJob` can be too late if the worker already performed a side effect in another
transaction or subsystem.

## Decision

RITSEI separates three identity semantics:

```text
UUIDv7
-> persistent entity, event, line, workflow, and other index-visible identity

UUIDv4/CSPRNG token
-> opaque lease capability and possession proof

Monotonic BIGINT
-> lease fencing generation and stale-writer ordering
```

For a lease that crosses a side-effect boundary, use both values when both semantics are needed:

```text
Lease {
  token: opaque random capability
  generation: monotonically increasing BIGINT
  expiresAt: timestamp
}
```

Rules:

- `leaseToken` is not a business identity and must not be described as the fencing proof.
- `leaseGeneration` increments strictly on every successful acquisition of the same durable job.
- The increment occurs in the same transaction as the lease claim.
- A downstream mutation that requires fencing must carry the generation to its actual mutation
  boundary and reject a generation older than the current generation. Checking only the final job
  completion is insufficient.
- `leaseGeneration` is concurrency metadata, never a business-visible ID or ordering number.
- PostgreSQL `BIGINT` must be represented in TypeScript as `bigint` or an exact decimal string, not an
  unsafe JavaScript `number`.
- A random capability token may remain useful for possession checks. If a boundary needs only
  ordering and is already authenticated, generation alone may be sufficient.
- UUIDv7 must not be substituted for the fencing generation. UUIDv7 provides an identifier format and
  time ordering, not the per-job strict increment contract required for fencing.

The current `packages/process` token checks remain valid as lease-capability checks. Until generation
is added and enforced at each required side-effect boundary, the Process job implementation must not
claim cross-subsystem stale-writer fencing.

## Alternatives Considered

### Random UUIDv4 only

Rejected as the complete lease model. It provides a strong opaque equality token but cannot tell
whether one acquisition is newer than another.

### UUIDv7 as the lease token

Rejected. UUIDv7 is appropriate for persistent, index-visible identities, but it does not provide a
strict per-job generation sequence and it is not a substitute for an explicit concurrency counter.

### Monotonic generation only

Allowed where possession is already established by the surrounding authenticated boundary. Not the
universal default because some lease APIs also need an opaque capability that a stale or unrelated
caller cannot reuse.

### Keep both token and generation

Selected for lease flows that need both capability possession and stale-writer fencing across a
transaction or subsystem boundary.

## Consequences

### Positive

- Capability, identity, and concurrency semantics are no longer conflated.
- Stale workers can be rejected at the resource that actually receives the side effect.
- UUID policy remains simple: UUIDv7 is for persistent identities, not every UUID-shaped value.
- Existing equality-token behavior can remain during an incremental migration.

### Negative

- A full fencing implementation requires schema, public contract, worker, and transaction changes.
- Cross-domain side effects must carry concurrency metadata without turning it into business data.
- PostgreSQL `BIGINT` requires careful exact-value handling in TypeScript.

### Risks

- Adding a generation column without enforcing it at the side-effect boundary creates false fencing
  confidence.
- Reusing or resetting the generation on retry breaks stale-writer ordering.
- Treating the capability token as a secret or authorization grant would blur security and lease
  responsibilities.

## Validation

- Add a durable `lease_generation` column and increment it atomically on acquisition.
- Return and accept both lease capability and generation where the contract requires both.
- Add a test where worker A claims generation 41, worker B claims generation 42, and A's downstream
  mutation is rejected.
- Keep tests proving that an old capability token cannot renew, complete, or fail a newer lease.
- Verify that every required side-effect boundary validates generation before mutation.

## Related Documents

- RFC 9562: <https://www.rfc-editor.org/rfc/rfc9562>

### Recommended external reading

- Martin Kleppmann,
  [How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
  — fencing tokens and stale-writer rejection.
- etcd, [etcd versus other key-value stores](https://etcd.io/docs/v3.6/learning/why/)
  — leases, revisions, and fencing external resources.
- Mike Burrows,
  [The Chubby lock service for loosely-coupled distributed systems](https://research.google/pubs/the-chubby-lock-service-for-loosely-coupled-distributed-systems/)
  — production distributed lock-service design.
- Apache ZooKeeper, [Programmer’s Guide](https://zookeeper.apache.org/doc/r3.5.2-alpha/zookeeperProgrammers.pdf)
  — zxid, sequence numbers, and ordering.
- Thoughtworks,
  [Patterns of distributed systems](https://www.thoughtworks.com/en-us/insights/podcasts/technology-podcasts/patterns-distributed-systems)
  — generation clocks and high-water marks.
