# ADR-0080: Adopt a Solid-Native Boneyard Skeleton Boundary

- Status: Accepted
- Date: 2026-09-06
- Amends: None
- Compatible with: ADR-0057, ADR-0072, ADR-0078, ADR-0079
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Skeleton architecture: [`../architecture/skeleton.md`](../architecture/skeleton.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - Native Solid 2 and Effect integration: [`./0072-prefer-native-solid-reactivity-for-effect-integration.md`](./0072-prefer-native-solid-reactivity-for-effect-integration.md)
> - Layered TanStack frontend boundaries: [`./0057-define-layered-tanstack-frontend-engine-boundaries.md`](./0057-define-layered-tanstack-frontend-engine-boundaries.md)
>
## Context

RITSEI needs stable loading geometry for ERP surfaces without adding a second reactive state system,
React runtime, or production-time DOM extraction. Boneyard can provide framework-neutral geometry
capture and static bone artifacts, but its adapters and registry must not become application or
lifecycle owners.

ADR-0072 already establishes that Solid owns the frontend reactive graph and ownership tree, Effect
owns services and resources through scoped `ManagedRuntime`, and TanStack Solid Query owns remote
server state. The skeleton boundary must apply those rules rather than introducing Boneyard state,
subscriptions, or a second lifecycle hierarchy.

## Decision

RITSEI adopts Boneyard core through a RITSEI-owned Solid-native skeleton boundary.

`boneyard-js@1.10.0` is currently installed as an `apps/web` development dependency for API and
capture validation. The package has no official `boneyard-js/solid` export, so the Solid-native
component adapter remains RITSEI-owned and is not activated by this decision.

- `Skeleton` owns the explicit loading boundary and `SkeletonView` owns standalone fallback rendering.
- Solid owns skeleton visibility, responsive measurement, derived geometry selection, local temporal
  transition state, lifecycle, and cleanup.
- Boneyard owns only development/build-time geometry extraction and immutable bone artifacts.
- RITSEI owns the typed skeleton name registry, public component contract, semantics, accessibility,
  and artifact compatibility.
- PandaCSS owns visual styling and semantic tokens.
- RITSEI Motion owns temporal transitions and reduced-motion behavior.
- TanStack Solid Query remains the owner of remote loading and server-state semantics.
- Effect `ManagedRuntime` remains outside the Skeleton component and is resolved only at the Solid
  application boundary.

The permanent dependency boundary is:

```text
feature
  -> RITSEI-owned Skeleton boundary
    -> Boneyard core adapter
```

Feature, domain, runtime, and service code must not import Boneyard directly. React adapters and React
compatibility packages are prohibited.

Boneyard capture runs only in development/build tooling. Production consumes committed typed
artifacts and must not run Playwright capture, DOM crawling, or full-subtree geometry extraction.

## Alternatives Considered

### Use the Boneyard React adapter

Rejected. It violates the React-free Solid frontend boundary and would introduce a second renderer
runtime only for loading UI.

### Make Boneyard a reactive store

Rejected. It would conflict with ADR-0072, duplicate Solid or TanStack ownership, and create another
lifecycle and subscription model.

### Write a bespoke geometry extractor

Rejected as the default. It duplicates Boneyard's build-time capability and creates an unnecessary
maintenance surface. A measured incompatibility may justify a future adapter change, not direct
feature imports.

### Render generic CSS-only skeletons everywhere

Retained as a valid fallback. CSS-only or hand-authored skeletons remain acceptable when no stable
artifact exists; they do not change the ownership boundary.

## Consequences

### Positive

- Solid remains the only default frontend reactive graph.
- Skeleton components stay independent from Effect runtime, Query client internals, and domain services.
- Geometry can be generated once and rendered cheaply in production.
- React and browser-capture dependencies stay outside the production runtime boundary.
- The public skeleton contract can remain stable while Boneyard artifacts evolve privately.

### Negative

- Build-time capture and registry generation add a development workflow.
- Artifact changes require review and source-control updates.
- The repository must maintain a small Solid-native adapter and compatibility checks.
- Boneyard adoption is not runtime-complete until the validation gates pass.

### Risks

- A wrapper could accidentally mirror Query or Effect state into local signals.
- Capture tooling could leak into the production bundle.
- Geometry artifacts could become stale or mismatch responsive container behavior.
- Animation could obscure loading, error, or empty-state semantics.

## Validation

The following evidence now passes:

- core API execution for `computeLayout`, `normalizeBone`, `renderBones`, and `snapshotBones`;
- generic Boneyard CLI capture from a `data-boneyard` marker page;
- core-only production bundle without React, `react-dom`, or Playwright code; and
- `boneyard-js` remains outside production dependencies while the Solid adapter is absent.

Activation still requires:

- Solid typecheck and production build with no React runtime;
- `Skeleton` and `SkeletonView` tests for pending, ready, empty, error, and background refetch;
- responsive container-selection and typed registry tests;
- accessibility, reduced-motion, localization, and zoom evidence;
- build-time capture and artifact validation;
- production bundle proof that capture tooling is absent; and
- unmount, interruption, and long-session cleanup evidence.

Until these gates pass, Boneyard remains a documented target boundary and the existing UI may use
native or CSS-only loading states without claiming Boneyard activation.

## Related Documents

- [`../architecture/skeleton.md`](../architecture/skeleton.md)
- [`../architecture/frontend.md`](../architecture/frontend.md)
- [`./0057-define-layered-tanstack-frontend-engine-boundaries.md`](./0057-define-layered-tanstack-frontend-engine-boundaries.md)
- [`./0072-prefer-native-solid-reactivity-for-effect-integration.md`](./0072-prefer-native-solid-reactivity-for-effect-integration.md)
- [`./0078-adopt-ritsei-motion-system.md`](./0078-adopt-ritsei-motion-system.md)
- [`./0079-gate-dnd-kit-solid2-activation.md`](./0079-gate-dnd-kit-solid2-activation.md)
