# ADR-0048: Define Effect Application Architecture and Frontend State Ownership

- Status: Accepted
- Date: 2026-08-23
- Amends: None
- Compatible with: ADR-0009, ADR-0010, ADR-0024
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Canonical architecture: [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
> - Architecture overview: [`../architecture/overview.md`](../architecture/overview.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - SolidJS 2.0 decision: [`./0009-use-solidjs-2.md`](./0009-use-solidjs-2.md)
> - Vite SPA decision: [`./0010-use-vite-solidjs-spa.md`](./0010-use-vite-solidjs-spa.md)
> - Effect Schema decision: [`./0024-adopt-effect-schema-as-canonical-contract-schema.md`](./0024-adopt-effect-schema-as-canonical-contract-schema.md)
> - Foldkit reference: [official site](https://foldkit.dev/) and [repository](https://github.com/foldkit/foldkit)

## Context

RITSEI needs both a high-performance renderer for large, interactive ERP screens and an
application architecture that makes state transitions, effects, failures, and workflow
coordination explicit. SolidJS 2.0 is well suited to fine-grained rendering and ephemeral
presentation state. Effect is already the system's application runtime for typed failures,
lifecycle, dependency injection, and concurrency.

The existing SolidJS decisions select the renderer and SPA shape, but they do not define how
frontend application behavior relates to Solid's local reactive primitives. An architecture that
uses only ad hoc component handlers would scatter workflow policy and make interaction history
harder to inspect and test. An architecture that puts every UI detail into one global model would
turn hover, focus, popover, and table mechanics into business-shaped noise.

Foldkit is a useful reference because it demonstrates an Effect-first frontend application model
with explicit messages, transitions, commands, subscriptions, and resources. RITSEI should adopt
the architectural separation, not the Foldkit renderer/runtime as a foundational dependency.

## Decision

RITSEI separates the frontend application model from the renderer:

```text
SolidJS 2.0
  -> renderer and presentation runtime

Effect + Effect Schema
  -> application model, typed transitions, effects, and contracts
```

SolidJS remains the renderer and UI runtime. It owns DOM projection, fine-grained presentation
reactivity, and local ephemeral interaction state. It does not own durable business semantics,
authorization, transaction invariants, or authoritative domain state.

Effect is the frontend application runtime for explicit workflow coordination. Effect Schema
remains the canonical runtime contract language at frontend boundaries. The frontend may use this
model without importing backend implementations or persistence types.

### Application transition model

Feature workflows should use the following shape where explicit coordination is useful:

```text
View intent / Message
        |
        v
transition(Model, Message)
        |
        +--> new Model
        `--> Command, Subscription, or Resource operation
                         |
                         v
                    Effect service/API
                         |
                         v
                    result Message
```

The vocabulary is:

- **Model**: application or workflow state, not a second source of truth for backend domain state;
- **Message**: a typed user intent, lifecycle notification, or effect result;
- **Transition**: a deterministic state transition from a Model and Message;
- **Command**: an Effect program/value for one external operation that produces result Messages;
- **Subscription**: a long-lived source of Messages such as approved realtime or browser events;
- **Resource**: a scoped, lifecycle-managed Effect resource such as a WebSocket connection.

Messages and transitions must remain distinguishable from backend domain events. A browser message
can request a business action; only the owning backend domain can authorize and commit the domain
fact.

Example:

```text
ClickedApprove
      |
      v
ApprovalRequested
      |
      v
ApprovePurchaseOrder
      |
      +--> PurchaseOrderApproved
      `--> ApprovalFailed
```

A component must not directly perform the domain transition with a local setter such as
`setStatus("approved")`. It dispatches an intention or invokes the owning public command, and then
renders the returned state or failure.

### State ownership

| State category | Owner | Rule |
|---|---|---|
| Authoritative domain state | Backend domain, PostgreSQL, or the approved financial ledger | The browser may render a decoded projection but cannot mutate authority directly. |
| Application/workflow state | Effect Model and explicit transitions | Use for multi-step coordination, pending commands, retries, reconciliation, and lifecycle state. |
| Remote server state | TanStack Solid Query | Own cache, invalidation, refresh, and server snapshots; do not mirror query data into unrelated stores. |
| Presentation state | Solid signals, memos, stores, and context | Keep ephemeral UI mechanics local: focus, hover, popovers, tabs, column layout, drag state, and virtualization. |
| Shareable navigation state | Router plus Effect Schema | Keep URL filters and navigation inputs typed, validated, and independent of domain implementations. |

Not every signal is an application message, and not every application message belongs in a global
model. Local presentation state is intentionally allowed and must not be forced through a
Model-to-Message transition merely to satisfy architectural uniformity.

### Foldkit boundary

Foldkit is an architectural reference only. RITSEI does not add Foldkit as a dependency and does
not couple its application contracts to Foldkit's renderer, VDOM, runtime, or release cadence. Any
future proposal to adopt a complete frontend runtime must provide measured benefit, compatibility
with SolidJS and Effect v4, an explicit migration path, and a new ADR.

## Alternatives Considered

### SolidJS-only application architecture

Rejected as the default. Solid remains the renderer, but component-local async handlers and hidden
mutation do not provide enough consistency or traceability for complex ERP workflows.

### Foldkit as the frontend foundation

Rejected for now. Its Effect-first model is valuable, but adopting its vertically integrated
renderer/runtime would reduce architectural freedom, make local presentation state an exception,
and add a young strategic dependency where SolidJS 2.0 already satisfies the rendering need.

### One global Model for all frontend state

Rejected. It would make business workflows explicit at the cost of coupling them to insignificant
presentation details such as hover, focus, popovers, and table virtualization.

## Consequences

### Positive

- SolidJS remains optimized for fine-grained ERP rendering.
- Complex workflows have explicit, inspectable, and testable state transitions.
- Effect owns frontend orchestration, lifecycle, typed failures, and concurrency without owning the DOM.
- Local presentation state stays small and natural.
- UI intent, application commands, and backend domain facts remain distinguishable.
- The architecture can support future Solid, desktop, CLI, or agent projections without making the renderer the domain owner.

### Negative

- Features must choose deliberately between TanStack Query, the Effect application model, and Solid local state.
- The repository must provide adapters and conventions before a reusable frontend application runtime exists.
- Some workflows will require more explicit message and transition code than an ad hoc event handler.

### Risks

- The frontend application Model could become a shadow domain model; keep authoritative state and invariants in the owning backend domain.
- TanStack Query data could be duplicated into an Effect store; enforce one owner for remote snapshots.
- Teams could treat UI messages as domain events; preserve the explicit backend command and event boundary.
- A future renderer/runtime proposal could reintroduce Foldkit coupling without measured evidence; require a new ADR.

## Validation

This decision is validated when:

- complex frontend workflows express business intent and effect outcomes as typed messages or public commands;
- transition logic is deterministic and testable without rendering the DOM;
- protected actions still pass through backend authorization and owning domain contracts;
- no component directly mutates authoritative domain status or imports persistence code;
- TanStack Solid Query remains the owner of remote server snapshots and cache lifecycle;
- presentation-local state remains in Solid primitives unless it has explicit application significance;
- Effect resources and subscriptions are scoped and released through lifecycle management;
- no Foldkit dependency is introduced without a measured compatibility and migration decision.

## Related Documents

- [`../architecture/frontend.md`](../architecture/frontend.md)
- [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
- [`../architecture/overview.md`](../architecture/overview.md)
- [`./0009-use-solidjs-2.md`](./0009-use-solidjs-2.md)
- [`./0010-use-vite-solidjs-spa.md`](./0010-use-vite-solidjs-spa.md)
- [`./0024-adopt-effect-schema-as-canonical-contract-schema.md`](./0024-adopt-effect-schema-as-canonical-contract-schema.md)
