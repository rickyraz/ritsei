# Runtime and Artifact Specification

## 1. Artifact contract

The Solid adapter consumes the existing framework-neutral types:

```ts
interface SkeletonResult {
  name: string
  viewportWidth: number
  width: number
  height: number
  bones: AnyBone[]
}

interface ResponsiveBones {
  breakpoints: Record<number, SkeletonResult>
}
```

The adapter must normalize compact and structured bones at the boundary using the public core
`normalizeBone` contract. It must not mutate imported JSON or store normalized bones in a reactive
registry.

## 2. Resolution

The adapter needs a pure resolver:

```ts
type BoneSelection = {
  result: SkeletonResult | null
  width: number
}

function resolveBones(
  input: SkeletonResult | ResponsiveBones | undefined,
  width: number,
  select: "container" | "viewport",
): BoneSelection
```

Resolution rules:

1. no input returns `result: null`;
2. a single `SkeletonResult` is used directly;
3. `ResponsiveBones` selects a deterministic breakpoint;
4. the selected result is never written back into the artifact;
5. invalid bones fail at the adapter boundary and use the configured fallback; and
6. width measurement is owned by Solid, not by Boneyard state.

A public core `resolveResponsive` export would be useful for adapter authors, but the Solid adapter
must not import private `dist/shared` files. Either promote the helper to the public core entry or
implement the small pure resolver inside the adapter.

## 3. Rendering

The adapter may use `renderBones` for framework-neutral HTML rendering only if the resulting markup
can be integrated without `innerHTML`-driven application state. Preferred Solid output is typed JSX
for the bone rectangles:

```tsx
<For each={bones}>
  {(bone) => (
    <div
      aria-hidden="true"
      class={props.boneClass}
      style={boneStyle(bone)}
    />
  )}
</For>
```

If `renderBones` is used, it must remain an implementation detail and must not expose raw HTML as a
public application contract. The adapter must sanitize or constrain all style values derived from
validated artifact data.

## 4. DOM structure

The recommended output is:

```html
<div data-boneyard="finance.invoice-table" aria-busy="true">
  <div data-boneyard-content>
    <!-- real children or build fixture -->
  </div>
  <div data-boneyard-overlay aria-hidden="true">
    <div data-boneyard-bone></div>
  </div>
</div>
```

Requirements:

- the overlay is `pointer-events: none`;
- bones are not focusable or announced;
- the content container retains layout geometry;
- `aria-busy` is present only while loading; and
- the data marker remains available in build mode without exposing internal state.

## 5. Production boundary

The production adapter may import only the core APIs needed for artifact normalization, resolution,
and rendering. It must not import:

```text
boneyard-js/vite
boneyard-js CLI
playwright
capture browser utilities
DOM snapshot traversal
```

The production bundle acceptance test must inspect emitted chunks and fail if they contain React,
React DOM, Playwright, or browser-launch code. A package-level Playwright dependency may remain in
node_modules for the dev CLI, but it must not be reachable from the `boneyard-js/solid` entry.

## 6. Registry ownership

The upstream adapter may provide `registerBones`, but RITSEI owns its public registry contract:

```ts
export const skeletonRegistry = {
  "finance.invoice-table": financeInvoiceTable,
  "sales.order-detail": salesOrderDetail,
} as const

export type SkeletonName = keyof typeof skeletonRegistry
```

RITSEI feature code imports `SkeletonName` and RITSEI `Skeleton`, not Boneyard registry internals.

## 7. Artifact versioning

Artifacts must carry enough information for compatibility diagnostics without coupling feature code to
Boneyard internals. The proposal should reserve optional metadata:

```ts
type ArtifactMetadata = {
  generator?: string
  generatorVersion?: string
  schemaVersion?: number
  sourceHash?: string
}
```

Unknown metadata must be ignored by older readers. An incompatible schema must produce a clear build
or test failure rather than a visually plausible but incorrect skeleton.

## 8. SSR and hydration

`SkeletonView` must render from committed artifacts without browser measurement. `Skeleton` may
measure its container after hydration, then update the selected responsive result through Solid's
reactive graph. The first frame must use a deterministic fallback to avoid hydration mismatch.
