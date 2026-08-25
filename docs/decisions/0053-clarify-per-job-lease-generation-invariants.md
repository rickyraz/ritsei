# ADR-0053: Clarify per-job lease-generation invariants

- Status: Accepted
- Date: 2026-08-25
- Amends: ADR-0052 (separate lease capability from fencing generation)
- Compatible with: ADR-0051 (adopt UUIDv7 for persistent identities)
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Lease capability and fencing decision:
>   [`./0052-separate-lease-capability-and-fencing-generation.md`](./0052-separate-lease-capability-and-fencing-generation.md)
> - Canonical architecture: [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
> - Durable execution: [`../architecture/durable-execution.md`](../architecture/durable-execution.md)

## Context

ADR-0052 separates a random lease capability from a monotonic fencing generation. Its rules need
additional precision so an implementation cannot accidentally reset generations, confuse
authentication with lease possession, or claim fencing without state at the resource being fenced.

## Decision

The following invariants refine ADR-0052:

- `leaseGeneration` is scoped to one durable job identity. No global ordering between different jobs
  is implied or required.
- `leaseGeneration` increments strictly once for every distinct successful acquisition or
  reacquisition of that job.
- It must never decrease or reset while that durable job row exists.
- A retry of the same acquisition command or an uncertain transaction outcome must not create a
  second generation for the same successful acquisition. The implementation must distinguish an
  idempotent request retry from a distinct successful reacquisition.
- A fenced downstream resource stores its own highest accepted generation, or an equivalent durable
  monotonic watermark. It compares incoming generations against that stored value at the actual
  mutation boundary.
- An incoming generation lower than the resource's stored highest accepted generation is stale and
  must be rejected. Equal generations are not stale, but duplicate side effects still require the
  resource's normal idempotency semantics. A higher generation may advance the watermark atomically
  with the accepted mutation.
- Authentication identifies the caller; it does not prove current lease possession. Generation alone
  may be sufficient only when lease possession is independently enforced and the boundary requires
  stale-writer ordering rather than a separate capability check.
- Concurrent claims for the same job must be serialized so two distinct successful acquisitions can
  never receive the same generation.

Conceptually, generations may look like this:

```text
Job A: 1 -> 2 -> 3
Job B: 1 -> 2
```

A global sequence is unnecessary for per-job fencing.

## Alternatives Considered

### Global fencing sequence

Rejected as the default because fencing is scoped to one durable job. A global sequence adds
coordination and obscures the ownership boundary without improving stale-writer rejection for a
specific resource.

### Increment on every request attempt

Rejected because idempotent retries and ambiguous transaction outcomes are not necessarily distinct
successful acquisitions. Generation advancement belongs to the durable successful claim transition.

### Compare against `process.jobs` only

Rejected for cross-subsystem fencing. The actual mutated resource must retain the comparison state;
otherwise a stale worker can perform a side effect before a later job-completion check notices it.

## Consequences

### Positive

- Generation lifetime and scope are explicit.
- Resource-local high-water marks make fencing enforceable without a lease-table round trip.
- Authentication, possession, idempotency, and stale-writer ordering remain separate concerns.
- Concurrent acquisition behavior has a testable invariant.

### Negative

- An implementation needs an idempotency strategy for claim commands whose commit outcome is
  uncertain.
- Each fenced resource needs durable comparison state and an atomic update protocol.
- Equal-generation duplicate handling remains the responsibility of the resource's idempotency
  contract.

### Risks

- Resetting a generation or reusing one across distinct successful acquisitions breaks stale-writer
  ordering.
- A generation column without a resource-local high-water mark creates false fencing confidence.
- A global sequence could be mistaken for proof that two different jobs are ordered relative to one
  another.

## Validation

- Add a test proving a job's generation never decreases or resets across retries and reacquisitions.
- Add an idempotent claim-retry test proving the same successful acquisition does not advance twice.
- Add a concurrent-acquisition test proving two successful acquisitions of one job never observe the
  same generation.
- Add a fenced-resource test where generation 41 is accepted, generation 42 supersedes it, and a
  later mutation with generation 41 is rejected by the resource.
- Add an equal-generation test proving duplicate handling follows the resource's idempotency
  contract rather than the fencing comparison alone.

## Related Documents

- RFC 9562: <https://www.rfc-editor.org/rfc/rfc9562>
- Martin Kleppmann, “How to do distributed locking”:
  <https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html>
