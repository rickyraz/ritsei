# Testing and Release Specification

## 1. Compatibility matrix

The adapter release must declare and test a supported matrix instead of relying on peer ranges alone:

| Surface | Required evidence |
|---|---|
| `solid-js@2.x` | typecheck and browser render |
| `@solidjs/web@2.x` | JSX transform and DOM runtime |
| Vite | production bundle and dev capture |
| SSR/import safety | module import without `window` or `document` |
| Boneyard core | artifact normalization, resolution, and rendering |
| Playwright CLI | build capture and registry generation |
| React absence | production bundle scan and dependency review |

If Solid 2 is still a release candidate, each supported RC must be pinned in CI and the adapter must
fail clearly when a package export or lifecycle API changes.

## 2. Unit tests

Required unit tests:

- `loading` toggles show/hide behavior;
- `fallback` renders when no artifact is available;
- single `SkeletonResult` rendering;
- responsive breakpoint selection;
- container versus viewport selection;
- compact and structured bone normalization;
- invalid artifact fallback;
- `snapshotConfig` serialization;
- global configuration precedence;
- `solid` animation mode; and
- reduced-motion policy.

Tests must use `@effect/vitest` in RITSEI and must not call `Effect.runPromise` or `Effect.runSync`
inside test bodies.

## 3. Solid lifecycle tests

Required browser or DOM tests:

- `ResizeObserver` is disconnected on owner disposal;
- width updates replace the derived artifact without replacing the component owner;
- rapid loading toggles do not leak overlays, timers, or observers;
- unmount during a transition stops future writes;
- SSR/import does not access browser globals; and
- hydration keeps the first frame deterministic.

## 4. Capture tests

The CLI acceptance fixture must:

1. render a Solid component with `data-boneyard="probe.card"`;
2. install `window.__BONEYARD_SNAPSHOT` in build mode;
3. run the CLI at at least two breakpoints;
4. emit `probe.card.bones.json` and a registry;
5. verify a non-zero bone count and deterministic name; and
6. verify the generated registry imports `boneyard-js/solid` when Solid is selected.

A fixture must also prove that `fixture` content is used only in build mode and that application
children remain the runtime source outside capture.

## 5. Bundle tests

The `boneyard-js/solid` entry must be bundled independently and scanned for forbidden dependencies:

```text
react
react-dom
preact/compat
playwright
chromium.launch
connectOverCDP
```

The test must distinguish string literals in documentation comments from reachable imports where
possible, but an actual forbidden import must fail the build.

The full application production bundle must not contain the Boneyard CLI, Vite plugin, Playwright
browser code, or React adapter.

## 6. Accessibility tests

Required evidence:

- `aria-busy` is correct for loading and ready states;
- overlay and bones are hidden from the accessibility tree;
- no bone receives focus;
- real content retains accessible names and labels;
- keyboard navigation is unchanged across loading transitions;
- 200% and 400% zoom remain usable; and
- reduced-motion users receive a solid, non-animated state.

Use automated checks as evidence, but retain a human screen-reader review for the final adapter.

## 7. Performance tests

The adapter must measure:

- production bundle size with and without the Solid entry;
- initial render cost for a small and large artifact;
- resize update frequency and observer overhead;
- transition cleanup under repeated toggles; and
- capture duration across the declared breakpoints.

The CLI must never run in the production application process.

## 8. Release requirements

A release may publish `boneyard-js/solid` only when:

- the export is documented and type declarations are emitted;
- Solid 2 peer requirements are explicit;
- the core artifact format remains backward compatible or has a versioned migration;
- the capture CLI generates a Solid-compatible registry;
- the production entry has no React or Playwright runtime edge;
- the package has SSR/import safety evidence;
- the README documents loading, fallback, fixture, selection, and reduced-motion behavior; and
- the package changelog calls out any API or artifact changes.

## 9. RITSEI activation gate

RITSEI will not activate the adapter in product features until upstream evidence passes:

```text
package export
  -> Solid 2 typecheck
  -> core API tests
  -> capture and registry tests
  -> production bundle scan
  -> accessibility and reduced-motion tests
  -> browser interaction and unmount tests
  -> human review
```

Until then, RITSEI keeps `boneyard-js` dev-only and treats the proposal as an upstream submission,
not as a production skeleton implementation.
