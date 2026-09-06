# Proposal: `boneyard-js/solid`

> **Status:** Draft for upstream proposal
>
> **Owner:** RITSEI frontend architecture
>
> **Target package:** `boneyard-js@1.10.0`
>
> **Purpose:** Define a Solid 2-native adapter without React compatibility code, a second reactive
> graph, or production-time DOM extraction.
>
## Executive summary

`boneyard-js` already provides framework-neutral geometry and capture primitives, but the published
package currently has no `boneyard-js/solid` export. RITSEI proposes a first-party Solid 2 adapter
that preserves the core artifact format and CLI capture protocol while implementing Solid-native
ownership, lifecycle, loading semantics, accessibility, and responsive selection.

The adapter must not be a React port. It must use the current Solid 2 package layout, keep Boneyard
out of application state ownership, and leave capture tooling out of the production import graph.

## Current evidence

- Core APIs work from `boneyard-js`: `computeLayout`, `normalizeBone`, `renderBones`, and
  `snapshotBones`.
- The CLI captures a `[data-boneyard]` marker and emits responsive `.bones.json` plus a registry.
- A core-only Vite bundle contains no React, `react-dom`, or Playwright code.
- The package does not export `boneyard-js/solid`.
- The CLI currently defaults to React when it cannot identify Vue, Svelte, Angular, or Preact; Solid
  detection and registry generation therefore need an explicit proposal.

## Goals

1. Add a first-party `boneyard-js/solid` package export for Solid 2.
2. Preserve the core `SkeletonResult`, `ResponsiveBones`, and `SnapshotConfig` artifact contracts.
3. Support explicit loading boundaries and standalone fallback rendering.
4. Support build-mode fixtures and the existing `data-boneyard` capture protocol.
5. Keep registry, loading, responsive measurement, and lifecycle semantics Solid-native.
6. Keep React, Playwright, and capture-only code out of the production bundle.
7. Provide type-safe public APIs and a compatibility test matrix.

## Non-goals

- Do not make Boneyard a reactive store, Query cache, DI container, or service runtime.
- Do not mirror Solid state into an Effect graph or Boneyard registry.
- Do not port React `Suspense` or React context semantics.
- Do not add React, `react-dom`, `preact/compat`, or a Solid 1 compatibility shim.
- Do not perform DOM extraction or Playwright capture in production.
- Do not make Boneyard the owner of domain, authorization, tenant, or business state.

## Specification set

| Document | Scope |
|---|---|
| [`api.md`](./api.md) | Public module exports, props, types, and behavior |
| [`solid-2-runtime.md`](./solid-2-runtime.md) | Solid 2 ownership, lifecycle, reactivity, and SSR rules |
| [`capture-and-registry.md`](./capture-and-registry.md) | CLI, build mode, markers, Solid detection, and registry generation |
| [`runtime-artifacts.md`](./runtime-artifacts.md) | Artifact resolution, rendering, responsive selection, and production boundary |
| [`accessibility-and-motion.md`](./accessibility-and-motion.md) | Semantics, accessibility, animation, and reduced-motion behavior |
| [`testing-and-release.md`](./testing-and-release.md) | Acceptance gates, compatibility matrix, bundle checks, and release criteria |
| [`implementation-plan.md`](./implementation-plan.md) | Smallest upstream implementation and migration sequence |

## RITSEI integration

RITSEI will keep its own boundary at `apps/web/src/ui/skeleton/` and may later expose it as
`@ritsei/ui/skeleton`. The upstream adapter is an implementation dependency, not RITSEI's public
business contract.

RITSEI's ownership rule is:

```text
Solid             state, reactivity, lifecycle, cleanup
Effect            services, resources, DI, typed operations
TanStack Query    remote server state
Boneyard          static geometry artifacts and build capture
PandaCSS          appearance
RITSEI Motion     temporal behavior
RITSEI UI         semantics and accessibility
```

See ADR-0072, ADR-0078, ADR-0080, and [`docs/architecture/skeleton.md`](../../architecture/skeleton.md)
for the repository-side boundary.

## Proposed acceptance

The proposal is ready for upstream review when a prototype demonstrates:

- `import { Skeleton, SkeletonView, configureBoneyard } from "boneyard-js/solid"`;
- Solid 2 typecheck and runtime behavior with `solid-js@2` and `@solidjs/web@2`;
- build capture through `data-boneyard` and `window.__BONEYARD_SNAPSHOT`;
- typed registry generation with `boneyard-js/solid` configuration imports;
- no React or Playwright in the production adapter bundle;
- cleanup on Solid owner disposal and no observer/timer leaks;
- keyboard, screen-reader, reduced-motion, zoom, and localization evidence; and
- no change to the framework-neutral core artifact format.
