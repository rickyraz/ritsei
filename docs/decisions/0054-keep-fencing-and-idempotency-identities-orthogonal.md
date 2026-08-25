# ADR-0054: Keep fencing and idempotency identities orthogonal

- Status: Accepted
- Date: 2026-08-25
- Amends: ADR-0053 (clarify per-job lease-generation invariants)
- Compatible with: ADR-0052 (separate lease capability from fencing generation)
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

A fencing generation and an idempotency identity solve different problems. A generation orders lease
freshness within a fence scope; it does not identify a logical business operation. A single generation
may legitimately carry more than one operation, while the same operation may be retried with the same
idempotency identity.

Using one watermark as both the fencing state and the duplicate-suppression state can therefore accept
a replay or reject a valid second operation. Equal generations are not enough to determine whether a
mutation is a duplicate.

## Decision

RITSEI keeps these identities orthogonal:

```text
leaseGeneration
-> freshness and stale-writer authority ordering

operationId / commandId / idempotencyKey
-> logical execution identity and duplicate suppression
```

Rules:

- `leaseGeneration` proves that a caller is not older than the accepted lease generation for the
  fence scope. It is not a business ID, command ID, or idempotency key.
- A fenced resource stores high-water-mark fencing state separately from idempotency state. They may
  live in the same owner table only as separate columns/constraints or in separate owner-controlled
  records.
- An incoming generation equal to the stored generation is not automatically a duplicate and does
  not authorize an arbitrary second mutation. The operation identity and the owner's idempotency
  contract decide whether it is a replay, a new valid operation, or a conflict.
- A replay of the same operation identity returns the existing result or performs an idempotent no-op.
  A different operation identity at the same generation follows the owner's normal command rules.
- For PostgreSQL-owned side effects, the fencing comparison, idempotency decision, business mutation,
  and outbox write must commit in the same owner transaction where those facts are coupled.
- External providers retain their own idempotency identity. A fencing generation does not replace a
  provider idempotency key, deterministic transfer identity, or reconciliation protocol.

## Alternatives Considered

### Use generation as the idempotency key

Rejected because one lease generation can legitimately execute multiple distinct commands, and a
command retry may need to reuse its original operation identity across a new lease generation.

### Use one `accepted_generation` watermark for duplicate suppression

Rejected because a watermark only answers whether a writer is stale. It cannot distinguish a replay of
operation A from a valid operation B at the same generation.

### Derive command IDs from lease token or generation

Rejected because lease capabilities and generations are concurrency metadata, not stable business
identity. Reacquisition would change the command identity and break durable retry/reconciliation.

## Consequences

### Positive

- Freshness, business identity, and duplicate suppression remain independently reviewable.
- Equal-generation behavior is explicit instead of being treated as an implicit replay.
- Provider idempotency and reconciliation remain available for external side effects.
- A lease can be reacquired without changing the logical operation identity.

### Negative

- Fenced resources need both a high-water mark and an idempotency mechanism.
- Tests must cover stale, equal-generation replay, equal-generation distinct operation, and higher
  generation cases separately.
- Cross-domain commands carry more than one piece of concurrency and execution metadata.

### Risks

- A developer may use `leaseGeneration` as a command ID because both are numeric/string values.
- Combining fencing and idempotency state in one field can silently accept duplicates or reject valid
  work.
- Omitting provider idempotency still leaves unknown external outcomes unsafe even when fencing is
  correct.

## Validation

- Prove that the same operation identity replayed at the same generation returns the original result
  or a no-op.
- Prove that two distinct valid operation identities at one generation are evaluated independently by
  the owner contract.
- Prove that a lower generation is rejected before either the business mutation or idempotency record
  changes.
- Prove that a higher generation can advance the fence watermark without changing the logical
  operation identity.
- Prove that external provider retries use provider-specific idempotency/reconciliation identities,
  not the lease generation.

## Related Documents

- [`../architecture/durable-execution.md`](../architecture/durable-execution.md)
- [`../architecture/state-and-consistency.md`](../architecture/state-and-consistency.md)
