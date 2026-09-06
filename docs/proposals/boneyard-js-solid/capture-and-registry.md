# Capture and Registry Specification

## 1. Existing capture contract

The Solid adapter must preserve the generic Boneyard capture contract:

```html
<div data-boneyard="finance.invoice-table">
  <div data-boneyard-content>
    <!-- fixture or rendered content -->
  </div>
</div>
```

The CLI finds `[data-boneyard]`, reads the first child as the capture target, and invokes:

```ts
window.__BONEYARD_SNAPSHOT(
  target,
  name,
  snapshotConfig,
)
```

The function must return a framework-neutral `SkeletonResult`.

## 2. Build mode

The CLI sets this flag before navigation:

```ts
window.__BONEYARD_BUILD = true
```

`Skeleton` must use it only to select build fixtures and must not change application business state.
The normal child content remains the default outside build mode.

The adapter must install the snapshot hook through a build-only entry or an explicit opt-in:

```ts
if (window.__BONEYARD_BUILD) {
  window.__BONEYARD_SNAPSHOT = snapshotBones
}
```

The hook must not be installed by the production application entry by default. A Vite build-time
entry or CLI-provided browser module is preferred so the production application does not import
DOM extraction code.

## 3. Snapshot configuration

`Skeleton` serializes `snapshotConfig` to a safe data attribute:

```html
<div
  data-boneyard="finance.invoice-table"
  data-boneyard-config='{"excludeTags":["nav"]}'
>
  ...
</div>
```

The serializer must:

- use JSON, not executable JavaScript;
- escape attribute content safely;
- reject functions, DOM nodes, and non-serializable values; and
- omit the attribute when no configuration is supplied.

## 4. Solid framework detection

The CLI and Vite integration must support an explicit framework value:

```json
{
  "framework": "solid"
}
```

Automatic detection must recognize any of:

```text
solid-js
@solidjs/web
@solidjs/vite-plugin
solid-js/web  (legacy detection only; not an import target)
```

When Solid is selected:

- generated registry configuration imports `boneyard-js/solid`;
- no React `"use client"` directive is emitted;
- no React adapter is used as a fallback; and
- an ambiguous project must fail with a diagnostic instead of silently choosing React.

## 5. Registry generation

The generated registry must remain framework-neutral for artifact registration:

```ts
import { registerBones } from "boneyard-js"
import { configureBoneyard } from "boneyard-js/solid"
import financeInvoiceTable from "./finance.invoice-table.bones.json"

configureBoneyard({
  select: "container",
})

registerBones({
  "finance.invoice-table": financeInvoiceTable,
})
```

The CLI must generate a typed registry extension based on the project TypeScript configuration and
must preserve the existing `.bones.json` format. It must not import private Boneyard files.

RITSEI may wrap the generated registry in its own `skeletonRegistry` so application code does not
import Boneyard directly.

## 6. Breakpoints and selection

The CLI captures viewport breakpoints. The adapter supports two selection policies:

```text
container  select the nearest artifact from the measured skeleton container (default)
viewport    select using window.innerWidth for shell layouts matching CLI viewport captures
```

The generated artifact must preserve numeric breakpoint keys and deterministic selection rules.
A missing exact breakpoint selects the greatest breakpoint less than or equal to the current width;
if none exists, select the smallest available breakpoint.

## 7. Incremental capture

Capture must retain existing artifacts when a route is not visited, unless `--force` is supplied.
Duplicate names on a page must be reported deterministically. Hashes may skip unchanged captures,
but a stale or malformed artifact must not be silently accepted.

## 8. Build tooling boundary

The CLI and `boneyard-js/vite` integration may import Playwright. The Solid adapter must not.
The package must document two separate entry classes:

```text
boneyard-js/solid   production-safe component adapter
boneyard-js/vite    development capture integration
boneyard-js CLI     development/build capture command
```

The production package graph must not require the CLI or Vite plugin to render committed artifacts.
If the current package cannot separate the Playwright dependency from the core runtime, the adapter
must provide a documented bundle proof and recommend installing capture tooling as a dev-only path.
