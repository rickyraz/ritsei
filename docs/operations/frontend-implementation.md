# Frontend implementation evidence

> **Status:** In progress; not production activation approval.
>
> **Evidence date:** September 5, 2026
>
> **Owners:** Frontend and design-system owners.

> **Related documents**
>
> - Delivery gates: [`../roadmap/frontend.md`](../roadmap/frontend.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - Component ownership: [`../architecture/design-system.md`](../architecture/design-system.md)
> - Test workflow: [`../development/testing.md`](../development/testing.md)

## Scope delivered

The compatibility spike, minimal SPA shell, and User Accounts vertical slice are implemented
without backend changes. The browser keeps session credentials in memory, sends tenant and bearer
headers per request, decodes responses through generated Effect Schema contracts, and leaves
authorization and business authority on the backend.

The shared UI surface remains application-local under `apps/web/src/ui/`. It contains only the
semantic tokens, controls, layouts, and accessibility behavior demonstrated by the current slice.
No Storybook, separate design-system package, GPU renderer, or speculative component catalog was
added.

## Verified behavior

- `deno task --cwd apps/web build` passes and produces the Vite SPA. The current production output is about
  20 kB CSS plus route-split JavaScript chunks of 6.7 kB, 12.7 kB, 20.4 kB, 53.4 kB, 79.1 kB,
  and 111.3 kB before gzip; Vite reports gzip sizes from 3.1 kB to 38.7 kB.
- The browser shell test covers boot, typed connection validation, routing, dark-theme switching,
  responsive layout, and in-memory credential handling.
- The User Accounts workflow covers tenant-scoped GET/PATCH requests, query invalidation and
  refetch, permission denial, malformed responses, unknown PATCH outcomes, and focus restoration.
- The accessibility test runs axe WCAG 2A/AA checks and exercises narrow layout, reduced motion,
  forced colors, skip-link focus, labeled controls, and keyboard traversal.
- `deno task --cwd apps/web compatibility` passes the Kobalte Solid 2 bundle probe with
  `@kobalte/core@2.0.0-alpha.1`. Its behavior is still unreviewed, and Deno reports the package's
  exact Solid 2 RC peer-range mismatch. Kobalte is not yet activated in production UI.

## Validation performed

| Check | Result |
| --- | --- |
| `deno fmt --check` | passed, 441 files |
| `deno lint apps packages tooling tests vitest.config.ts` | passed, 57 files |
| `deno task check` | passed |
| `deno task --cwd apps/web build` | passed |
| Frontend/architecture targeted tests | passed, 6 files / 13 tests |
| Full affected test suite | passed, 90 files / 386 tests, 1 skipped |
| `deno task boundary:test` | passed |
| `deno task boundary:lint` | passed |
| `deno task roadmap:measure` | passed mechanically; frontend gates remain open by dependency/evidence policy |
| `deno task fallow:audit` | not green; existing/baseline findings and frontend package-resolution warnings remain |

## Remaining blockers

The evidence manifests intentionally remain `blocked`. Automated browser checks are not a
substitute for reviewed screen-reader, localization/zoom, long-session, interaction-latency, or
production performance evidence. Chrome DevTools performance tracing was unavailable in this
workspace, so no Core Web Vitals claim is recorded.

The roadmap also remains gated by upstream `workload.command-reserve` and `process.designer095`.
The next legitimate promotion step is to review Kobalte behavior and obtain the required human
accessibility/performance evidence, not to add more generic UI abstractions.
