# ADR-0074: Use Kobalte for Solid 2 Accessible Primitives

- Status: Accepted
- Date: 2026-09-05
- Amends: ADR-0010 only for the accessible primitive selection
- Supersedes: ADR-0056 only for the accessible primitive selection
- Compatible with: ADR-0009, ADR-0057, ADR-0072
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Decision map: [`./decision-map.md`](./decision-map.md)
> - Frontend architecture: [`../architecture/frontend.md`](../architecture/frontend.md)
> - Design-system architecture: [`../architecture/design-system.md`](../architecture/design-system.md)
>
## Context

ADR-0056 selected Ark UI as the headless primitive source, but the Solid 2 compatibility spike
showed that the selected Ark release imports `solid-js/web`, which is not exported by the pinned
`solid-js@2.0.0-rc.6` package. RITSEI does not hide that incompatibility with a module alias or
runtime shim.

Kobalte's stable `0.13.x` line targets Solid 1. The Kobalte `2.0.0-alpha.1` line is the available
Solid 2-oriented release and bundles the dialog probe successfully with RITSEI's pinned Solid 2
RC.6 packages. Its exact peer range still names earlier Solid 2 RCs, so the package remains an
explicit compatibility risk rather than a production-readiness claim.

## Decision

RITSEI uses **Kobalte** as the single headless accessible primitive source behind RITSEI-owned UI
contracts.

- Pin `@kobalte/core@2.0.0-alpha.1` from the root `package.json`; do not use the stable Solid 1
  line while the application targets Solid 2.
- Keep Kobalte imports inside `apps/web/src/ui/`. Feature code consumes RITSEI-owned UI contracts.
- Keep native semantic HTML as the default and fallback for controls that do not need a headless
  primitive.
- Do not alias or shim `solid-js/web` to conceal incompatible packages.
- Treat the compatibility probe as bundle evidence only. Focus, keyboard, screen-reader,
  localization, contrast, reduced-motion, and long-session review remain required before design
  system activation.

Panda CSS remains the styling substrate. This decision does not create a separate design-system
package, component catalog, or new frontend dependency boundary.

## Alternatives considered

### Keep Ark UI

Rejected for the current Solid 2 pin because the selected release does not bundle without a
`solid-js/web` export that Solid 2 RC.6 does not provide.

### Use stable Kobalte 0.13.x

Rejected because its peer contract targets Solid 1 rather than the application’s Solid 2 runtime.

### Alias `solid-js/web`

Rejected because it would hide a renderer/package compatibility defect and make runtime behavior
less trustworthy.

### Use native HTML only

Retained as the default and fallback, but not selected as the only primitive strategy for future
composite controls that need tested headless behavior.

## Consequences

- The Kobalte dialog probe passes the Vite/Solid 2 bundle check.
- The selected Kobalte package is alpha software with an RC peer-range mismatch; upgrades require
  rerunning the compatibility and browser evidence before adoption.
- No production Kobalte wrapper is activated by this ADR alone. Existing native controls remain
  valid until a shared control has demonstrated reuse and reviewed behavior.
- The design-system and frontend roadmap gates remain blocked until human accessibility and
  performance evidence, plus their upstream dependencies, are complete.

## Validation

The implementation currently proves:

```text
deno task --cwd apps/web compatibility  -> build passed; behavior unreviewed
deno task --cwd apps/web check           -> passed
```

The first line is a bundle compatibility result, not approval of Kobalte accessibility behavior.
The exact pinned dependency and peer warning remain part of the review record.

## Related documents

- [`../architecture/frontend.md`](../architecture/frontend.md)
- [`../architecture/design-system.md`](../architecture/design-system.md)
- [`./0056-adopt-ritsei-semantic-frontend-design-system.md`](./0056-adopt-ritsei-semantic-frontend-design-system.md)
