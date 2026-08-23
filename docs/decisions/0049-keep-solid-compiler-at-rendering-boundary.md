# ADR-0049: Keep the Solid Compiler at the Rendering Boundary

- Status: Accepted
- Date: 2026-08-23
- Amends: None
- Compatible with: ADR-0009, ADR-0010, ADR-0024, ADR-0048
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Canonical architecture: [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - Effect application architecture: [`./0048-define-effect-application-architecture-and-frontend-state-ownership.md`](./0048-define-effect-application-architecture-and-frontend-state-ownership.md)
> - Solid fine-grained reactivity: [official documentation](https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity)
> - Solid JSX lowering: [official documentation](https://docs.solidjs.com/concepts/understanding-jsx)
> - Solid 2 release status: [official releases](https://github.com/solidjs/solid/releases)
> - React Compiler: [official documentation](https://react.dev/learn/react-compiler)

## Context

RITSEI needs a renderer that can update large ERP screens with fine-grained precision without
making the renderer or its build toolchain the owner of application semantics. SolidJS 2.0 fits the
rendering requirement, while Effect owns the frontend application model, typed transitions, and
workflow effects through ADR-0048.

Solid still uses a JSX compiler or transform. The correct architectural statement is not that
Solid needs no compiler; it is that the compiler is primarily a rendering/lowering boundary. Solid's
reactive graph is expressed through runtime primitives and observers, while JSX is transformed into
DOM-oriented output and dynamic bindings.

As of August 23, 2026, the official Solid release history records `v2.0.0-beta.0` entering beta
on March 3, 2026. Solid 2.0 remains a pre-release dependency, so RITSEI must isolate this risk
from business semantics and keep the application core renderer-independent.

## Decision

Keep the Solid compiler and JSX transform inside the `apps/web` rendering build boundary:

```text
Effect application model
        |
        v
Solid reactive projection
        |
        v
Solid JSX/compiler lowering
        |
        v
DOM
```

The compiler may lower templates, static nodes, and dynamic expressions. It must not define:

- domain state or business invariants;
- authorization or transaction semantics;
- Effect service contracts or failure types;
- the ownership of application/workflow state;
- public schemas, messages, commands, or domain events.

The Solid runtime remains responsible for the reactive primitives and dependency graph used by the
presentation layer. The RITSEI application model remains responsible for explicit business intent,
workflow transitions, commands, subscriptions, and scoped resources. Compiler configuration and
generated output are implementation details of the frontend build and must not leak into public
contracts or backend packages.

RITSEI uses the official Vite integration and may adopt supported compiler/toolchain changes inside
`apps/web` without changing the application architecture. A compiler migration is accepted only
when behavior, accessibility, bundle output, and measured performance remain valid.

This makes RITSEI **compiler-neutral at the application-architecture level**, not compiler-free at
the rendering level. RITSEI does not adopt React Compiler or Foldkit as an application-semantics
layer.

## Alternatives Considered

### Claim that Solid does not need a compiler

Rejected as inaccurate. Solid JSX requires a transform/lowering step for production rendering. The
correct boundary is to keep that step below the application model rather than deny its existence.

### Make compiler analysis the application architecture

Rejected. Application correctness must remain explicit in Effect, Schema, public domain contracts,
and owning backend services. Generated memoization or dependency analysis cannot replace those
contracts.

### Adopt React and React Compiler

Not selected. React remains a valid ecosystem-first alternative, and its compiler can automate
memoization, but RITSEI prioritizes Solid's fine-grained rendering model and keeps optimization
mechanics out of domain/application semantics.

### Adopt Foldkit as the renderer and application runtime

Not selected. Foldkit provides a coherent Effect-first architecture, but it couples the renderer,
application model, and runtime more tightly than RITSEI needs. RITSEI adopts the explicit application
patterns through ADR-0048 while retaining Solid as the presentation runtime.

## Consequences

### Positive

- JSX/compiler changes remain localized to the frontend build boundary.
- Effect application contracts and backend domain semantics remain independent of generated DOM code.
- Solid's fine-grained runtime can be used without requiring a single framework-wide application model.
- Toolchain upgrades can be evaluated with ordinary frontend behavior and performance checks.
- Solid 2 pre-release risk is reduced by preserving a renderer-independent application core.

### Negative

- RITSEI must maintain a tested Vite/compiler integration for `apps/web`.
- Compiler-generated output is not a stable contract and must not be snapshotted as architecture evidence.
- Solid 2 migrations may still require frontend-specific adaptation as the ecosystem matures.

### Risks

- A compiler transform could change rendering behavior or bundle size; detect this with build, behavior,
  accessibility, and performance validation.
- Developers could mistake reactive presentation state for application state; apply ADR-0048 ownership
  rules.
- A future compiler feature could tempt the team to move business semantics into generated code;
  reject that boundary crossing.

## Validation

This decision is validated when:

- `apps/web` uses the supported Solid/Vite compiler integration without compiler assumptions in domain packages;
- JSX lowering changes do not alter public Effect Schema, command, or domain-event contracts;
- fine-grained rendering behavior is covered by user-visible and accessibility tests;
- application transitions remain testable without compiling or rendering JSX;
- frontend build changes measure bundle size and critical rendering behavior before adoption;
- Solid 2 release and migration changes are tracked separately from RITSEI domain decisions.

## Related Documents

- [`../architecture/frontend.md`](../architecture/frontend.md)
- [`../architecture/architecture-spec-v4.md`](../architecture/architecture-spec-v4.md)
- [`./0009-use-solidjs-2.md`](./0009-use-solidjs-2.md)
- [`./0010-use-vite-solidjs-spa.md`](./0010-use-vite-solidjs-spa.md)
- [`./0024-adopt-effect-schema-as-canonical-contract-schema.md`](./0024-adopt-effect-schema-as-canonical-contract-schema.md)
- [`./0048-define-effect-application-architecture-and-frontend-state-ownership.md`](./0048-define-effect-application-architecture-and-frontend-state-ownership.md)
