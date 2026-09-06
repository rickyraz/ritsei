# Solid 2 Runtime Specification

## 1. Runtime target

The adapter targets the current Solid 2 package layout:

```text
solid-js        signals, memos, effects, context, ownership primitives
@solidjs/web    JSX/web runtime types and DOM rendering primitives
```

The adapter must not import:

```text
solid-js/web
solid-js/store
solid-js/h
solid-js/html
solid-js/universal
```

It must not depend on Solid 1 APIs or conventions, including `createResource`, `batch`,
`splitProps`, `mergeProps`, `onMount`, `Suspense`, `SuspenseList`, `ErrorBoundary`, `Index`,
`classList`, `use:` directives, or one-argument `createEffect`.

The package must compile with:

```json
{
  "jsx": "react-jsx",
  "jsxImportSource": "@solidjs/web"
}
```

## 2. Solid ownership

Solid owns:

- the `loading` prop projection;
- the DOM ownership tree;
- responsive container measurement;
- derived active-bone selection;
- temporary transition state;
- observer, timer, and animation cleanup; and
- the final JSX/DOM projection.

Boneyard owns no signal, memo, store, context, subscription, or lifecycle registry.

The component must not mirror the same fact into an internal Boneyard state object. `initialBones`
is immutable input; it is not a store.

## 3. Reactive implementation rules

Use reactive reads where Solid tracks them:

```tsx
function Skeleton(props: SkeletonProps) {
  const activeBones = createMemo(() =>
    resolveBones(props.initialBones, width(), props.select ?? "container")
  )

  return (
    <div aria-busy={props.loading || undefined}>
      <Show when={!props.loading} fallback={<SkeletonOverlay bones={activeBones()} />}>
        {props.children}
      </Show>
    </div>
  )
}
```

The exact control-flow primitive may change with the current Solid 2 API, but these invariants do
not change:

- read reactive props directly rather than destructuring them at component setup;
- keep pure geometry selection in `createMemo` or an equivalent derived computation;
- keep writes and imperative actions in event or effect-apply boundaries; and
- do not use a signal as a manually synchronized copy of `props.loading`.

## 4. Lifecycle and measurement

Responsive container selection uses a local `ResizeObserver` owned by the component:

```ts
let root: HTMLDivElement | undefined

onSettled(() => {
  if (!root) return

  const observer = new ResizeObserver(([entry]) => {
    setWidth(entry.contentRect.width)
  })
  observer.observe(root)

  return () => observer.disconnect()
})
```

The implementation must:

- tolerate missing `ResizeObserver` in SSR and test environments;
- initialize to a deterministic width fallback;
- disconnect on Solid owner disposal;
- avoid a global observer or document-wide listener; and
- keep measurement out of the Boneyard registry.

Ref callbacks are for capturing the element only. Lifecycle setup belongs to an owned Solid scope.
Use the current Solid 2 cleanup primitive and do not port an `onMount`-based Solid 1 implementation.

## 5. Loading and async boundaries

The adapter accepts explicit `loading: boolean` because remote state ownership belongs to Query or
the application boundary. It must not inspect a Query client or an Effect runtime.

For Solid 2 async readiness, the recommended composition is:

```tsx
<Loading fallback={<SkeletonView name="finance.dashboard" />}>
  <FinanceDashboard />
</Loading>
```

The proposal does not add `BoneSuspense`. A React-style Suspense wrapper would create the wrong
lifecycle and async semantics for Solid 2.

## 6. SSR and hydration

The adapter must be import-safe in non-browser environments:

- no `window`, `document`, or `ResizeObserver` access at module evaluation;
- browser-only setup occurs after the component has an owned DOM element;
- committed artifacts can render without DOM extraction;
- `SkeletonView` can render a deterministic first frame during SSR; and
- hydration must not require a capture browser or Playwright.

Build-mode detection is a browser concern and must remain guarded:

```ts
const buildMode =
  typeof globalThis.window !== "undefined" &&
  globalThis.window.__BONEYARD_BUILD === true
```

## 7. Context and configuration

Global configuration may be read from an adapter-owned immutable configuration object, but it must
not become a Solid context store or service locator. If context is provided for configuration, it
must be scoped, immutable at the component boundary, and independent of Effect `ManagedRuntime`.

The adapter must not provide a `ManagedRuntime`, Query client, tenant service, or domain service.

## 8. Solid 2 compatibility tests

The package must include a Solid 2 fixture that proves:

- props remain reactive after parent signal updates;
- width changes select a new responsive artifact;
- disposal disconnects the observer;
- no Solid 1 import path is present;
- no React runtime is required; and
- build mode renders fixture content while normal mode renders application children.
