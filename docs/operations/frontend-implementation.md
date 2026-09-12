# Frontend implementation evidence

> **Status:** F2 design-system and F3 representative-workflow evidence passed mechanically; Kobalte dependency approval is bounded and risk-accepted; the Dialog primitive is active only through the tested RITSEI `ConfirmDialog` wrapper.
>
> **Evidence date:** September 12, 2026
>
> **Owners:** Frontend and design-system owners.

> **Related documents**
>
> - Delivery gates: [`../roadmap/frontend.md`](../roadmap/frontend.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - Production Solid 2 × Effect bridge: [`../decisions/0086-promote-solid-effect-bridge-to-production-boundary.md`](../decisions/0086-promote-solid-effect-bridge-to-production-boundary.md)
> - Component ownership: [`../architecture/design-system.md`](../architecture/design-system.md)
> - Test workflow: [`../development/testing.md`](../development/testing.md)

## Scope delivered

The compatibility spike, minimal SPA shell, and User Accounts vertical slice are implemented
without backend changes. The browser keeps session credentials in memory, sends tenant and bearer
headers per request, decodes responses through generated Effect Schema contracts, and leaves
authorization and business authority on the backend.

The native Solid 2 × Effect bridge is now a production frontend boundary at
[`apps/web/src/shared/solid-effect.ts`](../../apps/web/src/shared/solid-effect.ts). The connected
User Accounts route provides its existing session-scoped `ManagedRuntime` through both the API
scope and `RuntimeContext`; the runnable `solid-effect` directory re-exports that implementation
as evidence rather than maintaining a separate adapter.

The shared UI surface remains application-local under `apps/web/src/ui/`. It contains only the
semantic tokens, controls, layouts, and accessibility behavior demonstrated by the current slice.
A development-only Storybook lives under `apps/web/.storybook/`; it exercises the real UI recipes
with controlled fixtures and does not create a separate design-system package or production component
catalog. The shared cartographic boundary now has renderer-neutral Visual Grammar contracts, a
feature-owned User Accounts projection, and an HTML/SVG fallback; optional WebGPU remains gated.

## Verified behavior

- The Solid 2 × Effect bridge tests cover missing-provider fail-fast behavior, `R`-channel
  propagation, Layer cleanup, and awaited fiber interruption. TanStack Solid Query remains the owner of shared
  remote server state; the bridge is not used as a replacement cache.
- `deno task --cwd apps/web build` passes and produces the Vite SPA. The current production output is
  33.39 kB CSS plus route-split JavaScript chunks of 6.69 kB, 12.72 kB, 20.36 kB, 65.14 kB,
  87.18 kB, and 136.41 kB before gzip; Vite reports gzip sizes from 3.08 kB to 46.95 kB.
- The browser shell test covers boot, typed connection validation, routing, dark-theme switching,
  responsive layout, and in-memory credential handling.
- The User Accounts workflow covers tenant-scoped GET/PATCH requests, query invalidation and
  refetch, permission denial, malformed responses, unknown PATCH outcomes, and focus restoration.
- The accessibility test runs axe WCAG 2A/AA checks and exercises narrow layout, reduced motion,
  forced colors, skip-link focus, labeled controls, keyboard traversal, validation focus, 200% zoom,
  route splitting, bundle limits, interaction latency, and bounded repeated use.
- The cartographic fallback test exercises typed archetype/material projection, deterministic SVG
  geometry, native marker-button keyboard activation, reduced motion, forced colors, 200% zoom, and
  axe WCAG 2A/AA checks. The textual summary and User Accounts table remain authoritative.
- `deno task --cwd apps/web compatibility` passes the Kobalte Solid 2 bundle probe with
  `@kobalte/core@2.0.0-alpha.1`. `tests/frontend/kobalte.test.ts` covers the exercised Dialog
  probe semantics plus the production `ConfirmDialog` wrapper's keyboard opening, focus
  containment/restoration, Escape and explicit close, reduced motion, forced colors, and axe WCAG
  2A/AA checks. The exact Solid 2 RC
  peer-range mismatch is an explicitly accepted prerelease risk; production use is limited to the
  tested RITSEI `ConfirmDialog` wrapper in the shell.
- `deno task --cwd apps/web storybook:build` and the CI smoke test pass with the pinned
  `storybook-solidjs-vite@11.0.0-next-20260903183420` adapter and `storybook@11.0.0-alpha.0`,
  using upstream compatibility reference commit `c6b884cc26f35852655c0d61a6f577af89977d2f`.
  The adapter's published peer range still warns for the Storybook 11 alpha; this remains bounded
  to the development tool and is covered by the build, startup, and browser-render checks. The
  Storybook tasks invoke Node because Storybook 11's worker path requires Node's `process.channel`
  support.

## Validation performed

| Check | Result |
| --- | --- |
| `deno fmt --check` | passed, 529 files |
| `deno lint` | passed, 382 files |
| `deno task check` | passed |
| `deno task --cwd apps/web build` | passed |
| `vitest run apps/web/src/shared/solid-effect.test.ts` | passed, 4 tests |
| `deno task check:affected` | passed, 17 files / 37 tests |
| `tests/frontend/cartography.test.ts` | passed, 1 browser test |
| `deno task --cwd apps/web storybook:build` | passed |
| `deno task --cwd apps/web storybook --ci --smoke-test --host 127.0.0.1 --port 6007` | passed |
| Affected frontend tests | passed, 17 files / 37 tests |
| Full repository test suite | not rerun; prior evidence was 90 files / 388 tests, 1 skipped |
| `deno task boundary:test` | passed |
| `deno task boundary:lint` | blocked by inherited `modules/authorization/tests/relationship.postgres.test.ts` boundary violation |
| `deno task roadmap:measure` | passed mechanically; frontend gates passed for the recorded evidence |
| `deno task fallow:audit` | blocked by inherited unlisted `effect` dependency findings; no introduced dead code |

## Remaining blockers

The F2 design-system manifest records the automated token, focus, keyboard, contrast, density,
theme, reduced-motion, and vendor-boundary checks as passed; the Kobalte compatibility check remains
`approved_with_risk` and only the tested Dialog wrapper is approved. The F3 readiness manifest records the
representative-workflow browser checks, bounded bundle/latency thresholds, semantic accessibility,
zoom, and repeated-use stability as passed. This is repository-local mechanical evidence only; it
does not claim production SLOs, full assistive-technology certification, or production deployment
approval.
