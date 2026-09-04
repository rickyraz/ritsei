# ADR-0072: Prefer Native Solid 2 Reactivity for Effect Integration

- Status: Accepted
- Date: 2026-09-04
- Amends: ADR-0048 only by defining the Solid 2 and Effect integration boundary
- Compatible with: ADR-0009, ADR-0010, ADR-0057
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Decision map: [`./decision-map.md`](./decision-map.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - Effect application architecture: [`./0048-define-effect-application-architecture-and-frontend-state-ownership.md`](./0048-define-effect-application-architecture-and-frontend-state-ownership.md)
> - Layered TanStack frontend boundaries: [`./0057-define-layered-tanstack-frontend-engine-boundaries.md`](./0057-define-layered-tanstack-frontend-engine-boundaries.md)
> - RITSEI runnable comparison: [`apps/web/src/experiments/solid-effect/`](../../apps/web/src/experiments/solid-effect/)
> - Pinned Solid 1.x Atom binding for compatibility evidence: [`vendor/effect/packages/atom/solid/`](../../vendor/effect/packages/atom/solid/)
> - Upstream Effect Atom/Solid package: [Effect repository](https://github.com/Effect-TS/effect/tree/main/packages/atom/solid)
> - Upstream Solid 2 source: [Solid repository](https://github.com/solidjs/solid/tree/next)

## Context

RITSEI uses SolidJS 2.0 as its frontend renderer and Effect as its application runtime. The two
systems overlap in one important area: both can represent reactive computations, subscriptions, and
lifecycle-managed resources.

Effect's `R` channel is the requirement environment for an Effect: services, configuration, and
other capabilities needed by a computation. A direct Solid 2 integration can carry a
`ManagedRuntime` through Solid Context, resolve it at the read or action boundary, and dispose its
Layer scope with the Solid owner. Effect Atom provides a portable Effect-native reactive graph and
registry, which is valuable when that graph itself must be shared or reused across frameworks.

RITSEI is a single Solid-based ERP SPA, not a multi-framework widget library. It already assigns
remote server-state caching to TanStack Solid Query, presentation reactivity to Solid, and workflow
coordination to Effect. Making Atom the default bridge would add a second reactive graph and a
second lifecycle/registry owner for ordinary UI state without a demonstrated need.

At the versions pinned by the runnable experiment (`@effect/atom-solid@4.0.0-rc.112` and
`solid-js@2.0.0-rc.5`), the official Solid binding still imports Solid 1-only APIs and declares a
Solid 1 peer range. The experiment therefore keeps the dependency for comparison, but its Atom tab
uses a local Solid 2 bridge. This is compatibility evidence, not a production adapter decision.

The question is therefore not whether Atom is valid. The question is which system owns the default
reactive graph and lifecycle for RITSEI's Solid application.

## Decision

RITSEI chooses **native Solid 2 reactivity and Solid Context for the default Effect integration**.

1. **Solid owns the presentation graph and ownership tree.** Signals, memos, stores, context, and
   Solid async semantics remain the default rendering and local-state primitives.
2. **Effect owns application behavior.** Effect services, typed failures, cancellation, retries,
   workflow coordination, and scoped resources remain independent of Solid and backend
   implementations.
3. **Solid Context carries the Effect runtime.** The integration provides a `ManagedRuntime` through
   the nearest Solid Context. Runtime creation is scoped to the providing owner, nested providers
   override services for their subtree, and cleanup disposes the runtime and its Layer scope.
4. **The `R` channel is resolved at the integration boundary.** Read computations resolve the
   nearest runtime when the Effect-backed source is created; actions resolve it when the action is
   created. Features should not repeatedly rebuild the application environment with ad hoc
   `Effect.provide` calls when a scoped runtime already exists.
5. **Cancellation crosses the boundary in both directions.** Solid superseding/disposal interrupts
   the Effect fiber; Effect failure, completion, and finalization return through Solid's async
   semantics. A bridge is incomplete if it only starts Effects but does not preserve interruption
   and cleanup.
6. **Atom is an explicit opt-in, not a default store.** Use Effect Atom when a feature needs a
   shared or portable Effect-native reactive graph, such as a long-lived subscription or complex
   derived async graph. The Atom registry must not become the DI owner, backend authority, or a
   second cache for TanStack Query.
7. **One fact has one reactive owner.** Do not mirror the same state between Solid signals/stores,
   Atom, and TanStack Query. If Atom is selected for a feature, Atom owns that reactive fact and the
   Solid adapter is only its projection; otherwise Solid or Query remains the owner.

This decision supports Atom. It rejects only Atom-first integration as RITSEI's default.

## Rationale

### One ownership tree makes service lifetime legible

When a runtime is carried by Solid Context, the Solid subtree that consumes it also defines the
scope in which its services are available. Test overrides, route-specific configuration, tenant
scoping, and future request isolation use the same context mechanism. Cleanup follows the same
owner tree as the UI rather than requiring a second registry lifecycle to be understood and
verified.

### One default reactive graph reduces synchronization failure

A Solid signal that mirrors an Atom value is not free: it creates another subscription, another
update boundary, and another place where stale or disposed state can appear. The risk is greatest
when the same remote snapshot is also present in TanStack Query. RITSEI's one-semantic-owner rule
therefore applies to frontend reactive facts as well as backend invariants.

### Effect portability does not require Atom portability

RITSEI can keep service contracts and workflow programs framework-independent by keeping them in
Effect modules that import neither Solid nor Atom. A future renderer can adapt those services at
its own boundary. Atom is valuable when the *reactive computation* must be portable, not merely
when the business service must be reusable.

### RITSEI's workload favors explicit boundaries

ERP forms, permission-aware commands, query caches, and long-lived workflow screens benefit more
from predictable ownership than from a universal reactive registry. Keeping Solid, TanStack Query,
Effect, and the backend domain in their existing roles makes it easier to determine which layer may
read, cache, cancel, authorize, or commit a fact.

## Alternatives Considered

### Atom-first integration

Rejected as the default. It provides portability and a useful shared reactive graph, but it would
make the registry a routine dependency for local Solid state and introduce a second lifecycle
model. It remains available for features with a measured shared/portable graph requirement.

### Manual `Effect.provide` at every call site

Rejected as the application-wide pattern. It can work for isolated effects and tests, but it hides
subtree overrides and makes service lifetime and configuration propagation a property of every call
site. Scoped runtime context is the default; explicit provision remains a local escape hatch.

### Solid-only application behavior

Rejected. Solid remains the renderer and presentation runtime, but Effect is still required for
explicit workflow coordination, typed failures, cancellation, and application-level resources as
defined by ADR-0048.

### Two stores by default

Rejected. Combining Solid signals and Atom for the same fact creates synchronization and disposal
work without creating authority. A feature may use both systems only when their state ownership is
disjoint and documented.

## Consequences

### Positive

- Solid's fine-grained graph remains the default frontend reactive graph.
- Effect `R` propagation, service overrides, and resource cleanup align with Solid ownership.
- The normal path has fewer registries, subscriptions, and lifecycle rules.
- Effect services remain portable without coupling public contracts to Atom.
- Atom remains available for the cases where its portability or shared graph is the actual need.

### Negative

- RITSEI must maintain a small, well-tested Solid 2 and Effect adapter.
- A future cross-framework frontend may need a separate reactive adapter.
- Features must document why they opt into Atom instead of reaching for it by habit.

### Risks

- A direct adapter could lose interruption, typed failure, async loading, or cleanup semantics while
  appearing to work for simple reads.
- A context-carried runtime could accidentally become a mutable global service locator; providers
  must remain scoped and explicit.
- An Atom feature could mirror its state into Query or Solid and recreate the duplication this ADR
  avoids.
- The Solid 2 and Effect v4 APIs are evolving; the adapter must stay behind the frontend boundary
  and be validated against pinned versions.

## Validation

The decision is considered implemented when:

- the native read path resolves `R` from a scoped Solid Context and interrupts superseded reads;
- the native action path preserves typed failures, cancellation, and compensation;
- runtime and Layer cleanup occurs when the providing Solid owner unmounts;
- nested runtime providers can override services for one subtree without changing siblings;
- remote server snapshots have one TanStack Query owner where Query is selected;
- Atom opt-ins document their ownership and do not mirror the same fact into another store; and
- representative component, integration, accessibility, and browser smoke tests cover the boundary.

The runnable comparison is intentionally kept under
[`apps/web/src/experiments/solid-effect/`](../../apps/web/src/experiments/solid-effect/). The
native examples are:

- [`src/solid-effect.ts`](../../apps/web/src/experiments/solid-effect/src/solid-effect.ts):
  `ManagedRuntime`, `RuntimeContext`, `runEffect`, and `effectAction`;
- [`src/app.tsx`](../../apps/web/src/experiments/solid-effect/src/app.tsx): scoped runtime
  composition;
- [`src/typeahead.tsx`](../../apps/web/src/experiments/solid-effect/src/typeahead.tsx): native
  interruptible read path; and
- [`src/checkout.tsx`](../../apps/web/src/experiments/solid-effect/src/checkout.tsx): native
  interruptible action path with typed failure and compensation.

The Atom comparison is explicitly reference-only:

- [`src/atom.tsx`](../../apps/web/src/experiments/solid-effect/src/atom.tsx): Atom registry,
  `Atom.fn`, `AsyncResult`, and the Solid 2 bridge used to compare the same flows.

The experiment is not a production package, public contract, or reason to mirror its local bridge
into domain or feature contracts. The vendored Effect tree remains versioned reference material; the
`atom/solid` subtree documents the pinned Solid 1.x binding only and is not a Solid 2 implementation
template. Upstream repositories provide context and version discovery.

## Related Documents

- [`../architecture/frontend.md`](../architecture/frontend.md)
- [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
- [`./0048-define-effect-application-architecture-and-frontend-state-ownership.md`](./0048-define-effect-application-architecture-and-frontend-state-ownership.md)
- [`./0057-define-layered-tanstack-frontend-engine-boundaries.md`](./0057-define-layered-tanstack-frontend-engine-boundaries.md)
- [`./0009-use-solidjs-2.md`](./0009-use-solidjs-2.md)
- [`./0010-use-vite-solidjs-spa.md`](./0010-use-vite-solidjs-spa.md)
