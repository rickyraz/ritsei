# `boneyard-js/solid` API Specification

## 1. Package export

Add this package export:

```json
{
  "./solid": {
    "types": "./dist/solid.d.ts",
    "import": "./dist/solid.js"
  }
}
```

The module must be ESM-first and must not import `react`, `react-dom`, `preact/compat`, or any
Solid 1-only package path.

## 2. Public exports

The first release should expose only the following:

```ts
export {
  Skeleton,
  SkeletonView,
  configureBoneyard,
} from "boneyard-js/solid"

export type {
  AnimationStyle,
  BoneyardConfig,
  SkeletonProps,
  SkeletonViewProps,
} from "boneyard-js/solid"
```

Solid 2 must use its native `Loading` boundary or an explicit `loading` prop; the React `Suspense`
contract must not be copied. `BoneSuspense` is intentionally not part of this proposal.
## 3. Shared core types

The adapter consumes the framework-neutral core types without changing their serialized shape:

```ts
import type {
  AnimationStyle,
  AnyBone,
  ResponsiveBones,
  SkeletonResult,
  SnapshotConfig,
} from "boneyard-js"
```

The adapter must accept:

```ts
type InitialBones = SkeletonResult | ResponsiveBones
```

The adapter must not expose internal Boneyard registry objects, DOM extraction functions, Playwright
handles, or framework-specific renderer details.

## 4. Configuration

```ts
export interface BoneyardConfig {
  color?: string
  darkColor?: string
  animate?: AnimationStyle
  stagger?: number | boolean
  transition?: number | boolean
  boneClass?: string
  shimmerColor?: string
  darkShimmerColor?: string
  speed?: string
  shimmerAngle?: number
  select?: "container" | "viewport"
}

export declare function configureBoneyard(
  config: BoneyardConfig,
): void
```

Configuration is process-local adapter configuration. It is not a reactive store and must not be
used for tenant state, Query state, authorization, or business policy. Component props override
configuration defaults.

## 5. `Skeleton`

```ts
export interface SkeletonProps {
  loading: boolean
  children: JSX.Element
  name?: string
  initialBones?: InitialBones
  color?: string
  darkColor?: string
  animate?: AnimationStyle
  stagger?: number | boolean
  transition?: number | boolean
  boneClass?: string
  class?: string
  fallback?: JSX.Element
  fixture?: JSX.Element
  snapshotConfig?: SnapshotConfig
  select?: "container" | "viewport"
}

export declare function Skeleton(
  props: SkeletonProps,
): JSX.Element
```

Semantics:

- `loading === false`: render the real children and no skeleton overlay.
- `loading === true` with resolved bones: render the real content structure plus an accessible
  loading boundary and an inert visual bone overlay.
- `loading === true` without bones: render `fallback` when provided, otherwise a stable empty/solid
  loading surface; never throw solely because an artifact is absent.
- `name` identifies the build marker and registry entry.
- `fixture` is rendered only while `window.__BONEYARD_BUILD === true` so capture can proceed without
  live data.
- `snapshotConfig` is serialized into `data-boneyard-config` for the CLI.
- `select="container"` is the default; `select="viewport"` is an explicit compatibility option.

The adapter must preserve the content container's size while loading and must not use `display: none`
when doing so would collapse the layout being represented.

## 6. `SkeletonView`

```ts
export interface SkeletonViewProps {
  name?: string
  initialBones?: InitialBones
  color?: string
  darkColor?: string
  animate?: AnimationStyle
  stagger?: number | boolean
  class?: string
  snapshotConfig?: SnapshotConfig
  select?: "container" | "viewport"
}

export declare function SkeletonView(
  props: SkeletonViewProps,
): JSX.Element
```

`SkeletonView` is a standalone visual fallback. It does not own loading state, services, Query state,
or timers beyond its own optional visual transition.

For Solid 2 async boundaries, consumers use the native `Loading` primitive around `SkeletonView`.
The adapter must not export or emulate React `Suspense`.

## 7. Registry behavior

The generated registry must be consumable through the framework-neutral core registration contract:

```ts
import { registerBones } from "boneyard-js"
import invoiceTable from "./finance.invoice-table.bones.json"

registerBones({
  "finance.invoice-table": invoiceTable,
})
```

If `configureBoneyard` is emitted, the registry must import it from `boneyard-js/solid` only when
Solid is explicitly selected by the CLI. Registry generation must never silently emit the React
adapter for a Solid project.

## 8. Failure and fallback behavior

The adapter must fail soft for absent or stale geometry:

- invalid artifact data is rejected at the adapter boundary with a typed/diagnosable error;
- missing names render the configured fallback or a stable solid surface;
- unsupported animation values fall back to `solid`;
- a `ResizeObserver` failure falls back to viewport selection or the first available artifact; and
- no failure may expose raw Playwright, React, or internal package errors to application UI.
