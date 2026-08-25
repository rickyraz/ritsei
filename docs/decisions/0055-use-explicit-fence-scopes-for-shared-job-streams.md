# ADR-0055: Use explicit fence scopes for shared job streams

- Status: Accepted
- Date: 2026-08-25
- Amends: ADR-0053 (clarify per-job lease-generation invariants)
- Compatible with: ADR-0054 (keep fencing and idempotency identities orthogonal)
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Lease capability and fencing generation:
>   [`./0052-separate-lease-capability-and-fencing-generation.md`](./0052-separate-lease-capability-and-fencing-generation.md)
> - Per-job lease-generation invariants:
>   [`./0053-clarify-per-job-lease-generation-invariants.md`](./0053-clarify-per-job-lease-generation-invariants.md)
> - Durable execution: [`../architecture/durable-execution.md`](../architecture/durable-execution.md)

## Context

A single correctness-critical resource can be reached by more than one durable job row. Accounting
submission and reconciliation are one example: they have different job types and idempotency keys,
but both may mutate one financial operation.

A generation stored only on each independent job row cannot order those workers. Two unrelated rows
could both claim generation `1`, and comparing those numbers would create false fencing confidence.

## Decision

Lease generations are allocated within an explicit **fence scope**.

```text
fence scope
-> one ordered stream of lease acquisitions for one protected resource or invariant

job row
-> one scheduled attempt participating in that stream

lease generation
-> counter allocated from the scope's monotonic sequence
```

Rules:

- `job_fence_scopes(tenant_id, fence_scope, generation)` is Process-owned state that allocates the
  next generation for a scope.
- A job row stores its `fence_scope` and the generation received by its current acquisition.
- The default scope is unique to the durable job row. A producer must explicitly provide a shared
  scope when multiple job rows can mutate the same protected resource.
- Generation is monotonic within one scope, never decreases or resets, and has no ordering meaning
  across different scopes.
- Claim locks and increments the scope counter in the same transaction that leases the job.
- Renew, complete, and fail reuse the claimed generation; they do not increment it.
- The downstream resource must validate both scope and generation. It must never compare generation
  values from different scopes.
- A producer must derive the scope from the protected resource identity, not from an untrusted worker
  or HTTP input.

For example:

```text
accounting.financial_operation/{tenantId}/{operationId}
```

is one scope shared by submit and reconcile jobs for that operation.

## Alternatives Considered

### Keep generation only on each job row

Rejected when multiple job rows can mutate one resource. Independent counters cannot establish an
ordering relationship across those rows.

### Use one global sequence

Rejected because it adds unnecessary global coordination and implies ordering between unrelated
resources.

### Make every resource use one job row

Valid for a simpler workflow, but not selected as a repository-wide requirement. Explicit scopes
preserve separate scheduled job identities while keeping one fencing stream for the protected
resource.

## Consequences

### Positive

- Submit/reconcile or other distinct job rows can share one correct fencing stream.
- Per-scope counters avoid false global ordering.
- The default remains cheap: an isolated job gets its own scope.
- Resource owners can map one stable scope to their local high-water mark.

### Negative

- Job producers must choose and persist a correct scope.
- Scope allocation adds one Process-owned row lock per claim.
- Existing jobs require a safe default scope during migration.

### Risks

- A scope that covers too many resources can cause unrelated work to stale-fence each other.
- A scope that is too narrow cannot protect a resource touched by multiple jobs.
- A producer that omits an explicit shared scope silently falls back to per-job fencing.

## Validation

- Migration creates `process.job_fence_scopes` and backfills safe default job scopes.
- Concurrent claims in one shared scope receive distinct generations.
- Claims in different scopes may both receive generation `1` without being treated as conflicting.
- Accounting submit and reconcile jobs use the same operation-scoped fence scope.
- Downstream tests reject a lower generation only when its scope also matches the protected resource.

## Related Documents

- [`../architecture/durable-execution.md`](../architecture/durable-execution.md)
- [`../architecture/state-and-consistency.md`](../architecture/state-and-consistency.md)
