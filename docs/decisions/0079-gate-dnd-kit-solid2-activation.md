# ADR-0079: Gate dnd-kit Activation on Solid 2 Compatibility

- Status: Accepted
- Date: 2026-09-06
- Amends: ADR-0018 and the frontend interaction boundary
- Compatible with: ADR-0074 and ADR-0078
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Decision map: [`./decision-map.md`](./decision-map.md)
> - Process Studio architecture: [`../architecture/process-studio.md`](../architecture/process-studio.md)
> - Design system: [`../architecture/design-system.md`](../architecture/design-system.md)
>
## Context

RITSEI needs one direct-manipulation engine for Process Studio and other structured drag/drop
surfaces. The selected target is the modern multi-framework dnd-kit architecture through
`@dnd-kit/solid@0.5.0`, not the legacy React package family.

The repository currently targets Solid 2 release-candidate packages. The dnd-kit Solid adapter's
published bundle imports the removed Solid 1 package path `solid-js/web`. The real Vite probe therefore
fails before browser interaction can start. Forcing an alias or maintaining a local Solid compatibility
shim would violate the requested provider boundary and would turn an unverified adapter into a
production dependency.

## Decision

RITSEI records `@dnd-kit/solid@0.5.0` as the intended drag/drop provider, but keeps activation
**blocked / not_activated** until a Solid 2-compatible adapter release passes all of these gates:

```text
package/type check
production Vite build
pointer interaction
keyboard interaction
accessibility evidence
reduced-motion evidence
```

Until then:

- no application route imports `@dnd-kit/solid`;
- no `@dnd-kit/core` legacy package or React wrapper is introduced;
- no Solid 1 compatibility shim or Vite alias is maintained;
- Process Studio remains an exploratory prototype and cannot claim production dnd-kit evidence;
- the compatibility probe and regression test remain fail-closed evidence for the blocked state.

When the provider passes the gate, add the RITSEI-owned `ui/dnd` adapter, scoped drag providers,
semantic drag state attributes, drag handles, overlays, collision policies, and Process Studio command
translation. Keep one transform owner at a time: dnd-kit during active manipulation, Motion only for
post-drop continuity, and the domain as the sole authority over persisted results.

## Consequences

### Positive

- The application build remains green instead of hiding an incompatible Solid runtime import.
- The repository does not fork dnd-kit or silently revive removed Solid 1 APIs.
- The intended provider and activation evidence are explicit and reversible.
- Business truth remains outside browser drag state.

### Negative

- Production drag/drop activation is deferred.
- Process Studio cannot yet claim pointer, keyboard, or screen-reader dnd-kit evidence.
- A future dnd-kit release or an explicit architecture decision is required before adding the adapter.

## Validation

- `@dnd-kit/solid@0.5.0` is directly pinned in `apps/web/package.json`.
- The compatibility probe reproduces the `solid-js/web` export failure.
- The dnd compatibility test asserts the blocked result rather than converting it into success.
- The normal application remains free of dnd-kit imports while activation is blocked.

## Related Documents

- [`../architecture/process-studio.md`](../architecture/process-studio.md)
- [`../architecture/design-system.md`](../architecture/design-system.md)
- [`./0018-adopt-typed-process-studio.md`](./0018-adopt-typed-process-studio.md)
- [`./0078-adopt-ritsei-motion-system.md`](./0078-adopt-ritsei-motion-system.md)
