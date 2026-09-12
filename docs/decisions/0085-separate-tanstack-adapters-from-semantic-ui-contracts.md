# ADR-0085: Separate TanStack Adapters from Semantic UI Contracts

- Status: Accepted
- Date: 2026-09-12
- Amends: ADR-0057 only for the public frontend contract boundary
- Compatible with: ADR-0056, ADR-0072, ADR-0074, ADR-0075, ADR-0076, ADR-0077, ADR-0078
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - Design system architecture: [`../architecture/design-system.md`](../architecture/design-system.md)
> - Layered TanStack engine boundaries: [`./0057-define-layered-tanstack-frontend-engine-boundaries.md`](./0057-define-layered-tanstack-frontend-engine-boundaries.md)

## Context

ADR-0057 correctly assigns TanStack modules to separate technical concerns, but its example names
can be read as a requirement to create one `Ritsei*` wrapper for every TanStack package. A thin
wrapper that forwards vendor options does not add a RITSEI policy boundary and creates a second,
maintenance-heavy vendor API.

RITSEI needs two explicit layers:

```text
engine adapters                    semantic UI
----------------                    -----------
createServerQuery                  DataTable
createTableModel                   Form
createForm                         MoneyField
createVirtualizer (internal)       QuantityField
                                    PartyField
                                    LineItemsField (when justified)
```

## Decision

TanStack APIs remain implementation details. RITSEI creates an adapter only when it adds an
owned policy such as tenant-aware identity, deterministic query keys, Effect Schema decoding,
error mapping, bounded loading, or form lifecycle semantics. A pass-through wrapper is not a
RITSEI abstraction and must not be added.

Public UI contracts use product and business vocabulary:

- `DataTable` owns semantic table markup, visual grammar, loading/empty/error states, and
  accessibility; a table-model adapter may supply headless behavior internally.
- `Form` and field components own submission/accessibility presentation; a form engine adapter,
  if activated, stays internal and does not expose TanStack types.
- `MoneyField`, `QuantityField`, and `PartyField` are semantic fields because they encode RITSEI
  formatting, identity, and validation presentation rather than a vendor API.
- `FieldArray` is an internal generic repeatable-field primitive and is not a domain line-item
  contract. Add `LineItemsField` or a domain-specific line component only after a real consumer and
  public contract exist.
- `RitseiVirtualList` is a narrow semantic rendering-window component with fixed-row, bounded
  behavior. It owns no TanStack options and is not a default replacement for ordinary lists; use it
  only for measured large collections. Future engine delegation stays behind this contract.
- Query adapters are policy modules, not generic `RitseiQuery` hooks. The shared
  `createServerQuery` adapter owns tenant-scoped identity and bounded cache profiles; feature query
  modules still own endpoint loading and domain-specific invalidation. New options require a policy
  decision rather than passthrough expansion.

The dependency direction is:

```text
feature
  -> semantic RITSEI UI and feature query contracts
  -> RITSEI-owned engine adapter (only when policy exists)
  -> TanStack implementation
```

TanStack types, cache records, table models, virtualizer instances, and form instances do not cross
public feature, domain, or backend contract boundaries.

## Alternatives Considered

### One RITSEI wrapper per TanStack package

Rejected. It encourages API mirroring, exposes vendor churn through a second vocabulary, and adds
little value when no RITSEI policy is present.

### Expose TanStack directly to feature code

Rejected. Features would couple to engine lifecycle, types, and migration cost, while semantic
accessibility and ERP policy would become inconsistent.

### Build custom table, query, virtualizer, and form engines

Rejected. RITSEI owns policy and semantic presentation, not a replacement for mature technical
engines.

## Consequences

### Positive

- Public APIs describe ERP intent instead of vendor capability.
- TanStack can be replaced without changing semantic fields and product patterns.
- Generic technical abstractions are deferred until a measured need and policy boundary exist.
- The design system remains a real accessibility and visual contract rather than a renamed vendor API.

### Negative

- Each future adapter needs an explicit policy contract and activation evidence.
- Some feature teams must use a feature-owned query module instead of a universal query helper.
- Large-list performance work may initially require a feature-specific internal adapter.

### Risks

- A semantic component may still grow into a vendor pass-through; review its public props against
  this decision.
- `FieldArray` may be mistaken for a business line-item abstraction; prefer domain vocabulary when
  line semantics are real.
- Virtualization may be added before server-side bounded loading is proven.

## Validation

- Public UI modules expose no TanStack types or imports.
- New engine adapters document the RITSEI policy they own and have focused compatibility tests.
- Query keys and scope identity are deterministic and tenant-aware where a server-query adapter is
  introduced.
- Table and form interactions have keyboard and accessibility evidence.
- Virtualization is activated only for a measured large-collection use case.

## Related Documents

- [`../architecture/frontend.md`](../architecture/frontend.md)
- [`../architecture/design-system.md`](../architecture/design-system.md)
- [`./0057-define-layered-tanstack-frontend-engine-boundaries.md`](./0057-define-layered-tanstack-frontend-engine-boundaries.md)
