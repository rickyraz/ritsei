# Frontend Readiness Roadmap

> **Status:** Canonical roadmap subdocument
>
> **Track ID:** `frontend`
>
> **Owner:** `apps/web` frontend and RITSEI design-system owners.
>
> **Scope committed:** a buildable Vite/SolidJS SPA, typed application boundaries, RITSEI-owned
> Product Patterns, and one accessible representative user workflow.
>
> **Measured by:** `frontend.*` gates through `deno task roadmap:measure`.
>
> **Does not own:** backend authorization, business invariants, domain state, deployment topology,
> or mandatory WebGPU/cartographic rendering.
>
> **Detailed semantics belong to:**
> [`../architecture/frontend.md`](../architecture/frontend.md) and
> [`../architecture/design-system.md`](../architecture/design-system.md).
>
> **Related documents**
>
> - Roadmap index: [`./README.md`](./README.md)
> - Process Studio: [`./process-studio.md`](./process-studio.md)
> - Workload isolation: [`./workload.md`](./workload.md)
> - Effect application architecture:
>   [`../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md`](../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md)
> - Semantic design system:
>   [`../decisions/0056-adopt-ritsei-semantic-frontend-design-system.md`](../decisions/0056-adopt-ritsei-semantic-frontend-design-system.md)
> - Cartographic visual grammar:
>   [`../decisions/0069-adopt-cartographic-enterprise-visual-grammar.md`](../decisions/0069-adopt-cartographic-enterprise-visual-grammar.md)

## Scope

This track turns the current Process Studio UI prototype into a separately deployable application
shell without moving business authority into the browser.

```text
Vite + SolidJS SPA
    ↓
typed router and Effect Schema transport boundary
    ↓
RITSEI public API
```

Solid signals and application models own presentation and workflow state only. TanStack Solid Query
owns shared remote-cache policy where needed. Domain facts, authorization, transactions, and
corrections remain backend-owned.

The track does not select SolidStart/SSR and does not make `vgpu`, Canvas, or WebGPU the only
semantic representation of a critical value or action.

## Dependencies

```text
workload.command-reserve + Process Studio designer evidence
        ↓
frontend.shell
        ↓
frontend.application-boundaries ─┐
frontend.design-system          ├─→ frontend.accessibility-performance
```

The dependency is a product-support sequence, not a claim that every frontend screen requires a
hard-isolated deployment. Route-specific workload and renderer choices remain conditional.

## Sequence

### F0 — Application shell (`frontend.shell`)

Create a reproducible Vite/SolidJS 2.0 SPA with typed routing, public transport decoding, and a
separate backend deployment boundary. The shell must have an executable build check and must not
import repositories, Drizzle tables, backend-only layers, or worker code.

**Exit evidence:**

- `apps/web/package.json`, `apps/web/index.html`, and `apps/web/vite.config.ts` define the shell;
- `apps/web/src/app/` contains the application and routing boundary;
- a reproducible production build records its output and dependency versions; and
- the existing Process Studio designer remains a representative feature test.

### F1 — Application boundaries (`frontend.application-boundaries`)

Implement typed route/search decoding, Effect application coordination, selective TanStack Solid
Query cache ownership, mutation invalidation, and explicit loading, denial, conflict, degraded, and
recovery states. Do not mirror authoritative query results into unrelated browser stores.

**Exit evidence:**

- route input and API responses decode through Effect Schema;
- `apps/web/src/app/` and `apps/web/src/shared/` keep router, transport, and state policy local;
- representative procurement, inventory, accounting, authorization, or Process workflows cover
  query/mutation boundaries; and
- no browser path can execute a backend command or mutate a domain fact directly.

### F2 — RITSEI design system (`frontend.design-system`)

Activate RITSEI-owned UI wrappers around the approved Ark UI and constrained Panda CSS boundaries.
Product Patterns, semantic tokens, density, theme, responsive behavior, and visual grammar remain
shared contracts rather than feature-local vendor usage.

**Exit evidence:**

- `apps/web/src/ui/` owns shared controls and Product Patterns;
- `docs/operations/frontend-design-system-evidence.json` records token, focus, keyboard, contrast,
  density, theme, and reduced-motion review; and
- feature code does not import headless or styling vendors directly.

### F3 — Accessibility and performance (`frontend.accessibility-performance`)

Validate one representative business workflow end to end. Cover keyboard and screen-reader
behavior, focus and error handling, contrast/high contrast, reduced motion, zoom/localization,
route splitting, bundle size, interaction latency, and long-session stability.

**Exit evidence:**

- `apps/web/src/ui/accessibility.test.ts` provides executable shared-control checks;
- `docs/operations/frontend-readiness-evidence.json` records the reviewed workflow and thresholds;
- critical actions have semantic DOM and accessible alternatives; and
- performance or visual acceleration never removes the semantic fallback.

## Conditional stages (not registered)

Keep `frontend.vgpu` unregistered until a named cartographic workload demonstrates a measured need
beyond HTML, CSS, SVG, or Canvas. Activation requires a complete semantic fallback, deterministic
mock/headless behavior, bounded frame and power use, and recovery on renderer failure.

## Measures

| Measure                                      | Target before frontend support claim |
| -------------------------------------------- | ----------------------------------- |
| `frontend.*` mechanical gates                | all four pass                       |
| frontend imports of backend implementations  | `0`                                 |
| browser-side business mutations              | `0`                                 |
| critical workflow keyboard blockers           | `0`                                 |
| critical workflow semantic fallback failures | `0`                                 |
| unbounded render loop for static content     | `0`                                 |

The live track counters are emitted by `deno task roadmap:measure`; route performance and
accessibility thresholds remain reviewed workflow evidence.

## Stop conditions

Stop frontend promotion when browser state becomes a shadow domain model, vendor types escape the
RITSEI UI boundary, Canvas/WebGPU becomes the only semantic path, accessibility is deferred, a
permanent render loop is used for static scenes, or SolidStart/SSR is introduced without a new
approved requirement.
