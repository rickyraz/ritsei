# Solid Adapter Implementation Plan

## 1. Package changes

Add a first-party export without changing the existing core entry points:

```text
boneyard-js
boneyard-js/layout
boneyard-js/solid       new production-safe Solid 2 adapter
boneyard-js/vite        existing development capture integration
```

Keep capture-only dependencies behind the CLI/Vite path. If the current package layout cannot make
Playwright unreachable from the Solid entry, publish a small runtime/core package or make the
Playwright dependency optional before promoting the adapter to production dependencies.

## 2. Source layout

Suggested upstream layout:

```text
src/
├── core/
├── react.tsx
├── solid.tsx             new Solid 2 entry
├── solid-runtime.ts      Solid-specific resolution and lifecycle helpers
├── solid-types.ts
├── vite.ts
└── ...
```

The Solid entry must not import React adapters or internal framework implementations. Shared artifact
and normalization behavior belongs in the framework-neutral core.

## 3. Implementation order

1. Extract or promote the framework-neutral artifact resolver as a public core helper.
2. Add `src/solid.tsx` with `Skeleton`, `SkeletonView`, and `configureBoneyard`.
3. Add Solid 2 fixture applications and type tests.
4. Add explicit CLI framework detection and Solid registry generation.
5. Add build-mode snapshot-hook tests.
6. Add production bundle and SSR/import tests.
7. Add accessibility, reduced-motion, resize, interruption, and cleanup tests.
8. Publish a release candidate before changing the default CLI framework behavior.

## 4. Migration from the React adapter

The Solid API may preserve these concepts:

```text
loading
name
initialBones
fixture
fallback
snapshotConfig
select
animate
stagger
transition
```

The Solid API must change framework-specific details:

| React adapter | Solid 2 adapter |
|---|---|
| `className` | `class` |
| React `ReactNode` | Solid `JSX.Element` |
| React `Suspense` / `BoneSuspense` | Solid 2 `Loading` or explicit `loading` |
| React context/store | Solid signals/memos/owned context only where necessary |
| React effect cleanup | Solid 2 owned lifecycle cleanup |
| React DOM assumptions | `@solidjs/web` JSX and standard DOM semantics |

No compatibility wrapper should recreate React semantics inside Solid.

## 5. Registry migration

The CLI should add an explicit option and config value:

```text
--framework solid
```

Project detection should recognize Solid dependencies, but an explicit value wins. Generated output
must remain valid TypeScript and must import configuration from `boneyard-js/solid`.

A migration command may rewrite an existing React-generated registry, but it must not rewrite or
reinterpret `.bones.json` artifacts.

## 6. Documentation deliverables upstream

The package release should include:

- `boneyard-js/solid` API reference;
- Solid 2 setup and Vite capture guide;
- build-mode fixture guide;
- registry and responsive selection guide;
- SSR and hydration notes;
- accessibility and reduced-motion guide;
- React-free production bundle note; and
- migration notes for users of the React adapter.

## 7. RITSEI implementation after upstream acceptance

RITSEI will then:

1. move the accepted runtime dependency into the correct application dependency section;
2. implement `apps/web/src/ui/skeleton/` as the RITSEI-owned public boundary;
3. generate and commit typed `.bones.json` artifacts;
4. add route/feature usage only after loading, empty, error, refetch, and accessibility tests;
5. keep Effect `ManagedRuntime` and TanStack Query outside the Skeleton component; and
6. remove the dev-only compatibility probe only after production evidence is complete.

## 8. Rejection conditions

Do not merge the upstream adapter if it:

- imports a React or Solid 1 runtime;
- requires `boneyard-js/vite` or Playwright in the production entry;
- stores loading or responsive state in Boneyard;
- exposes private registry internals as the application contract;
- uses React Suspense semantics in Solid 2;
- fails owner-disposal cleanup; or
- silently falls back to the React adapter for a Solid project.
