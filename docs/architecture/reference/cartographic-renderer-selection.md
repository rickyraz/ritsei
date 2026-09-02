# Reference: Selecting `vgpu` for RITSEI Cartographic Rendering

> **Status:** Reference analysis
>
> **Owns:** The comparative rationale, examples, and design reasoning behind the cartographic
> renderer selection.
>
> **Does not own:** Binding architecture rules. The accepted decision is
> [`ADR-0070`](../../decisions/0070-select-vgpu-and-defer-typegpu.md); current renderer and design
> system rules are owned by [`../design-system.md`](../design-system.md) and
> [`../frontend.md`](../frontend.md).
>
> **Related documents**
>
> - Cartographic visual grammar: [`../design-system.md`](../design-system.md)
> - Frontend architecture: [`../frontend.md`](../frontend.md)
> - Cartographic visual grammar decision: [`../../decisions/0069-adopt-cartographic-enterprise-visual-grammar.md`](../../decisions/0069-adopt-cartographic-enterprise-visual-grammar.md)
> - `vgpu` selection decision: [`../../decisions/0070-select-vgpu-and-defer-typegpu.md`](../../decisions/0070-select-vgpu-and-defer-typegpu.md)
> - Universal cartographic archetypes: [`./cartographic-archetypes-and-semantic-depth.md`](./cartographic-archetypes-and-semantic-depth.md)
> - Documentation boundaries: [`../../documentation-boundaries.md`](../../documentation-boundaries.md)

## 1. Executive conclusion

After considering the full RITSEI constraint set—not only which WebGPU library is technically more
capable—the preferred optional cartographic renderer is **`vgpu`**.

This reverses an earlier preference for TypeGPU. TypeGPU is not technically weak; it is arguably
more powerful as a typed GPU programming model. The choice changes because RITSEI is an ERP with a
long-lived, accessible, SolidJS-based enterprise design system. Its GPU layer must remain peripheral.

The decisive distinction is:

> **RITSEI needs a GPU renderer, not a GPU application architecture.**

The choice is therefore:

```text
Solid + Ark UI + semantic HTML
        │
        ├── CSS / SVG as the default renderer
        │
        └── optional cartographic renderer
                │
                └── vgpu → WebGPU
```

`vgpu` is an implementation behind a RITSEI-owned renderer adapter. It is not the application
runtime, the design-system foundation, the business model, or the source of authoritative state.

## 2. RITSEI's visual architecture

RITSEI's visual architecture is not:

```text
RITSEI
   ↓
WebGPU
   ↓
all UI
```

It is:

```text
                    RITSEI
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼

     Solid           Ark UI       Design Tokens
   reactivity       interaction       CSS
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                    HTML DOM
                       │
            semantic + accessible
                       │
         ┌─────────────┴──────────────┐
         │                            │
         ▼                            ▼

  normal interface              visual enhancement
  forms / tables /             topology / fields /
  dialogs / menus              dense visualization
         │                            │
         ▼                            ▼
       CSS/SVG                  RITSEI cartography
                                      │
                                      ▼
                           cartography-gpu adapter
                                      │
                                      ▼
                                     vgpu
                                      │
                                      ▼
                                   WebGPU
```

[Ark UI][1] is a headless foundation for complex, interactive, accessible components, built on Zag.js
finite-state-machine behavior and offering a Solid integration. Its component contracts cover the
WAI-ARIA and keyboard behavior needed by controls such as Select, Menu, and Tabs. [Solid's
fine-grained reactivity][6] is appropriate for updating only the presentation dependencies that
changed. A [Solid effect][2] may synchronize a changed semantic input with a renderer resource, but
it must not turn Solid into the GPU scheduler or business state machine.

The boundary is healthy because:

- Ark UI owns accessible interaction behavior behind RITSEI-owned components;
- Solid owns presentation reactivity and local interaction state;
- semantic HTML owns labels, forms, tables, controls, focus, and text alternatives;
- CSS and SVG handle most material and visual work; and
- `vgpu` is used only where a measured cartographic workload benefits from WebGPU.

## 3. Visual language is not rendering technology

RITSEI's design language is:

```text
55% Cartographic Structure
25% Architectural Paper
15% Precision Geometry
 5% Optical Glass
```

These percentages describe visual emphasis, not the percentage of the interface rendered by
WebGPU. A realistic implementation target is often:

```text
HTML / CSS / SVG     85–95%
Canvas / WebGPU       5–15%
```

Examples:

- Architectural Paper can be almost entirely CSS.
- Precision Geometry is primarily HTML and CSS.
- Optical Glass is mostly CSS `backdrop-filter` and controlled opacity.
- Static contours can often be SVG.
- WebGPU is reserved for dynamic topology, dense contour fields, warehouse spatial visualization,
  particle or data flow, large graphs, procedural fields, high-density charts, realtime deformation,
  and GPU aggregation when lower layers cannot satisfy the measured workload.

Thus, a design system may feel cartographic without making every screen a map or every component a
GPU scene.

## 4. Renderer comparison

The following is a decision-oriented fit assessment, not a benchmark. Five stars means a stronger
fit for the specific RITSEI concern; it does not mean the library is universally better.

| RITSEI concern | `vgpu` | TypeGPU |
|---|---:|---:|
| Thin rendering layer | ★★★★★ | ★★★★☆ |
| Procedural material | ★★★★★ | ★★★★☆ |
| WGSL-first workflow | ★★★★★ | ★★★★☆ |
| Small conceptual surface | ★★★★★ | ★★★☆☆ |
| Headless visual testing | ★★★★★ | ★★★☆☆ |
| Deterministic GPU mock | ★★★★★ | ★★★☆☆ |
| Compute visualization | ★★★★☆ | ★★★★★ |
| Typed GPU data model | ★★★☆☆ | ★★★★★ |
| Build/toolchain simplicity | ★★★★★ | ★★★☆☆ |
| Fit as a hidden renderer | ★★★★★ | ★★★★☆ |
| Fit as a GPU programming platform | ★★★★☆ | ★★★★★ |

The result is not that TypeGPU is less capable. It is that the current RITSEI need is closer to a
small, replaceable presentation accelerator than to a typed GPU application platform.

## 5. Why `vgpu` fits the current boundary

At the time of this decision, the public [`vgpu` package][3] describes a small GPU-first API with:

- one `Gpu` context returned by `init()`;
- explicit frames, passes, clears, and draws;
- typed WGSL imports and reflection for binding names, types, and layouts;
- browser execution plus a headless Node path backed by Dawn;
- a deterministic software mock adapter for tests and CI with the same public API shape; and
- tree-shaking/unused-declaration pruning and a deliberately small public surface.

These properties match a hidden renderer boundary:

```text
RITSEI cartography contract
          ↓
   renderer adapter
          ↓
         vgpu
```

Application code does not need to know about GPU buffers, bind groups, pipeline layouts, frame
encoding, or shader binding details. The adapter can expose semantic operations while keeping those
mechanics private.

The public [npm package listing][10] showed version `0.3.1` when this reference was recorded on
September 2, 2026. That version is historical context, not an architectural pin; any activated
version must be managed by the repository dependency and lockfile rules.

## 6. Why TypeGPU is deliberately deferred

[TypeGPU][4] is attractive because it positions itself as low-level typed building blocks for
custom GPU behavior—such as simulation, custom rendering, or proprietary inference—rather than as
RITSEI's application architecture. It provides typed GPU building blocks such as:

```text
typed schemas
typed buffers
typed resources
'use gpu' functions
compute pipelines
render pipelines
slots
CPU ↔ GPU type relationships
```

Those features make it a strong candidate for a GPU computational subsystem, a custom renderer, a
simulation, or proprietary GPU workload. They also make it easy to start treating business data as
GPU-programming data:

```text
InventoryField<T>
SupplierRiskField<T>
ManufacturingPressure<T>
FinancialLiquidityField<T>
```

followed by:

```text
domain data
    ↓
TypeGPU schema
    ↓
compute
    ↓
GPU
```

That shape is elegant for GPU software. It is an architectural smell for the current ERP design
system because the GPU starts to look like a semantic application layer. RITSEI does not want
business domains, authorization, workflow state, or authoritative facts to depend on a GPU type
system merely because visual output is accelerated.

TypeGPU is not rejected. It wins if RITSEI later needs a GPU-compute-centered subsystem such as:

```text
10 million warehouse points
        ↓
GPU aggregation
        ↓
GPU spatial indexing
        ↓
GPU forecasting field
        ↓
GPU clustering
        ↓
GPU route solver
        ↓
GPU-generated geometry
```

That future requirement would justify a separate decision about typed data schemas, compute
pipelines, raw-WebGPU interoperability, memory ownership, and GPU/CPU data relationships. It still
would not transfer business authority to shaders.

## 7. Business semantics must stop before the shader

The boundary should be:

```text
Inventory Domain
      │
      │ business semantics
      ▼
Inventory Visualization Adapter
      │
      │ generic visual semantics
      ▼
RITSEI Cartography Contract
      │
      ▼
vgpu Adapter
      │
      ▼
WebGPU
```

For example, a domain projection may contain:

```ts
{
  availableQuantity: 140,
  reservedQuantity: 105,
  reorderPoint: 60,
  warehouseCapacity: 180
}
```

The CPU-side visualization adapter converts that into:

```ts
{
  intensity: 0.71,
  pressure: 0.82,
  density: 0.65,
  velocity: 0.24,
  region: "warehouse-a"
}
```

The renderer receives only generic visual semantics such as:

```text
position
intensity
pressure
density
velocity
region
```

The GPU is a presentation accelerator, not a source of business truth. If the inventory condition is
high replenishment risk, the user must still be able to read that as text, a status, a table value,
or another semantic DOM representation without interpreting pixels.

## 8. Data-driven material variation

The surface may vary when the variation comes from data and context rather than random decoration.
This lets RITSEI feel alive without becoming noisy or theatrical:

| State or meaning | Material response |
|---|---|
| Risk | Contours become denser and critical intensity becomes stronger |
| Capacity | Elevation becomes higher |
| Flow | Lines move in the direction of the transaction or operational flow |
| Idle / stable | The field becomes flatter, sparser, and calmer |
| Forecast | The layer becomes softer or ghosted |
| Discrepancy | Contours may break, with only restrained jitter where useful |
| Success / recovery | Density decreases and the palette returns toward neutral |

The guardrail is essential:

- layout remains consistent;
- typography remains consistent;
- spacing remains consistent;
- interaction behavior remains consistent;
- semantic labels remain available; and
- only the material layer and approved visual semantics vary.

The result is not a different dashboard on every page. It is:

> **Structure stays consistent; the surface responds to business conditions.**

A useful state progression is:

```text
Low risk      → sparse, calm
Medium risk   → denser, warmer
High risk     → tight contour, critical red pressure
Recovered     → contour relaxes
```

Material variation never overrides semantic color, explicit labels, contrast, reduced-motion
behavior, or the accessible fallback.

## 9. Ark UI owns interaction, not the canvas

A warehouse visualization must not become a canvas full of fake controls:

```text
CANVAS
├─ fake dropdown
├─ fake tooltip
├─ fake buttons
├─ fake checkbox
└─ fake menu
```

The intended composition is:

```text
<section>
    │
    ├── Ark Select
    ├── Ark Combobox
    ├── Ark Tooltip
    ├── Ark Popover
    ├── Ark Dialog
    │
    └── canvas
          │
          └── warehouse rendering
```

A tooltip over a canvas remains a DOM tooltip. A selected warehouse cell remains a Solid selection
state, and the explanation remains an Ark UI popover or dialog. Pointer picking is an input method,
not a replacement for keyboard navigation, labels, focus management, or screen-reader output.

A hybrid inventory map may therefore look like:

```text
┌─────────────────────────────────────────┐
│ Warehouse A                       Filter│
│                                         │
│    ╭─────╮        ╭──────╮              │
│    │ A01 │        │ B01  │              │
│    ╰─────╯        ╰──────╯              │
│          WebGPU Canvas                  │
│                                         │
│                ▲                        │
│                │                        │
│          DOM tooltip                    │
│      "B01 · Capacity 92%"               │
└─────────────────────────────────────────┘
```

For analytical visualization, the canonical structure is:

```text
                   Inventory Visualization
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼

       Canvas        DOM summary       DOM data/table
     visual map      "3 alerts"        accessible view
          │
          ▼
    pointer picking
          │
          ▼
    Solid selection
          │
          ▼
   Ark UI popover
```

Decorative canvas output may be marked `aria-hidden="true"`. A business visualization must expose
its important information through a DOM summary, accessible labels, text, or an accessible table.

## 10. Solid must not drive the frame loop

This is an anti-pattern:

```ts
const [frame, setFrame] = createSignal(0)

requestAnimationFrame(() => {
  setFrame(frame() + 1)
})
```

It turns the application reactive graph into a permanent GPU clock. Solid should send semantic
changes such as:

```text
theme changed
warehouse data changed
selected zone changed
viewport resized
filter changed
```

Conceptually:

```ts
createEffect(() => {
  renderer.setPressure(pressure())
})
```

The renderer owns:

```text
time
delta
particles
simulation
frame scheduling
```

The application owns meaning and user intent. The renderer may animate a visual response to a
semantic change, but Solid does not need to publish a signal for every frame.

## 11. Static-first rendering and long-lived sessions

An ERP may remain open for many hours. A page should therefore not run at 60 FPS by default.
`vgpu`'s explicit frame and frame-loop model supports a static-first policy, and its
[performance guidance][7] recommends baking static inputs and avoiding uploads for values that do not
change.

Default scene:

```text
STATIC
──────

data changes
    ↓
render()
    ↓
GPU idle
```

Temporary interaction or semantic activity:

```text
ACTIVE
──────

pointer / transition / flow
          ↓
      frameLoop
          ↓
 animation settles
          ↓
         stop
```

Specific policies:

- Paper grain is rendered from `seed + dimensions + DPR`, then cached until one of those inputs
  changes.
- Topography is static or event-driven on most pages.
- Process execution may animate temporarily while an event or transition is active.
- A realtime operation center may animate continuously, but only with bounded rate, visibility
  checks, and a degraded-quality mode.
- Static data and resize-class values are not rewritten every frame.
- Reduced-motion preferences disable or replace particle flows, terrain animation, dynamic distortion,
  and continuous parallax.

This is how the system can feel alive without turning the user's laptop into a heater.

## 12. Testing is a first-class reason for the choice

A design-system renderer should be testable without relying on random GPU availability. The target
`vgpu` paths are:

```text
browser
vgpu/node   → headless Node / Dawn-backed adapter
vgpu/mock  → deterministic mock adapter for tests and CI
```

The renderer adapter should expose one RITSEI contract across those environments. A useful test
layout is:

```text
cartography/
├── unit
├── shader
├── snapshot
├── pixel-diff
└── browser-e2e
```

The exact categories are selected by the workload, but activation must cover:

- renderer-neutral projection transformations;
- semantic material mapping;
- shader validation and binding compatibility;
- deterministic mock rendering;
- headless Node smoke rendering;
- browser rendering where WebGPU is available;
- visual snapshots or pixel diffs where stable output is expected;
- semantic fallback output without WebGPU;
- keyboard and screen-reader interaction around visualizations;
- device capability detection and runtime failure recovery;
- visibility-based rendering and bounded frame rate; and
- bundle, memory, interaction-latency, and long-session power evidence.

CI must not make a physical GPU a prerequisite for every cartographic test.

## 13. TypeGPU's future winning case

TypeGPU becomes more compelling when RITSEI is building a GPU computational subsystem rather than
using GPU as a presentation layer. That includes typed CPU/GPU data relationships, large compute
pipelines, GPU-generated geometry, spatial indexing, simulation, or proprietary inference.

Its raw-WebGPU interoperability, described in its [pipeline documentation][8], is useful in that
future because a subsystem can leave the abstraction at a controlled boundary instead of rewriting
the whole system. That flexibility is a reason to keep TypeGPU deferred rather than dismissed.

The current decision is different:

```text
Current RITSEI need:
  domain-neutral visual acceleration

Future TypeGPU trigger:
  measured GPU computation that materially owns the workload
```

The future trigger requires a new ADR and measured evidence. It does not allow the GPU to become a
business, authorization, transaction, workflow, or accounting authority.

## 14. Toolchain restraint

TypeGPU can use WGSL directly, so its build plugin is not mandatory for every project. However,
TypeGPU's [build-plugin documentation][9] describes `unplugin-typegpu` as optional but highly
recommended for JavaScript/TypeScript GPU functions such as `'use gpu'`, ahead-of-time parsing, and
related tooling.

A possible stack then becomes:

```text
Solid compiler
+ Vite (SolidStart is not the RITSEI default)
+ Ark UI
+ TypeScript
+ optional TypeGPU transform
+ WGSL generation
+ WebGPU
```

That may be a good stack for a GPU application. For the current RITSEI requirement it adds
complexity before the product has a measured need for the typed GPU programming model.

The restrained current stack is:

```text
Solid
+ Ark UI
+ semantic HTML
+ CSS / SVG
+ WGSL where needed
+ vgpu behind a RITSEI adapter
```

In an ERP, a boring dependency graph is a compliment.

## 15. Package boundaries

The conceptual package shape is:

```text
packages/
│
├── design-system/
│   │
│   ├── tokens
│   ├── primitives
│   ├── themes
│   ├── typography
│   ├── surfaces
│   └── components
│
├── cartography/
│   │
│   ├── field
│   ├── contour
│   ├── route
│   ├── marker
│   ├── density
│   └── visual-semantics
│
├── cartography-gpu/
│   │
│   ├── runtime
│   ├── shaders
│   ├── topology
│   ├── paper
│   ├── optical
│   └── pulse
│   │
│   └── dependency:
│       vgpu
│
└── ui/
    └── Solid + Ark UI
```

This is a conceptual future extraction shape, not an instruction to create packages immediately.
The current repository keeps the initial implementation in the frontend application:

```text
apps/web/src/
├── ui/
│   ├── foundations/
│   ├── primitives/
│   ├── recipes/
│   ├── patterns/
│   ├── grammar/
│   ├── interaction/
│   └── renderers/
│       ├── cartography/
│       └── cartography-gpu/
├── features/
│   └── <domain>/
│       ├── projections/
│       ├── queries/
│       ├── forms/
│       └── ui/
└── app/
    ├── shell/
    ├── router/
    └── providers/
```

A separate package is justified only by measured cross-application reuse and stable public
contracts. `vgpu` must not be placed in `foundation/`, `modules/`, or `platform/`; it is a frontend
implementation dependency behind the internal UI layer.

## 16. Renderer replacement and fallback

The public cartography contract must remain independent of the GPU implementation:

```text
@ritsei/cartography
          │
          ├───────────────┐
          │               │
          ▼               ▼
    SVG renderer      GPU renderer
                         │
                         ▼
                       vgpu
```

A browser without WebGPU should still render the same semantic field through SVG, Canvas, CSS, or a
static semantic representation. If `vgpu` stagnates, raw WebGPU becomes preferable, or TypeGPU
becomes the better implementation for a measured workload, the adapter can be replaced without
changing Inventory, Process Studio, the design system's semantic contracts, or application state.

This is why the application API should look like:

```ts
createTopologyField()
createRouteField()
createDensityField()
createPaperMaterial()
createOpticalSurface()
createDataPulse()
```

It should not expose low-level implementation calls such as:

```ts
effect()
draw()
storage()
frame()
GPUBuffer
WGSL binding details
```

Those belong inside the renderer adapter.

## 17. Design tokens and GPU materials

Design tokens remain owned by the design system:

```css
--terrain-700: #365A72;
--material-contour-opacity: 0.08;
--material-contour-density: 0.40;
```

The GPU adapter may derive renderer-specific material inputs:

```text
Design Tokens
      ↓
GPU Material Tokens
      ↓
vgpu bindings
```

Components must not speak directly to shader bindings. The adapter translates semantic tokens and
visual intent into the renderer's uniforms, buffers, textures, and passes.

## 18. Final stack and non-negotiable boundaries

```text
RITSEI UI STACK
──────────────────────────────────────────

Solid
│
│ reactive application state
│
▼
Ark UI
│
│ accessible interaction/state machines
│
▼
Semantic HTML
│
├── forms
├── tables
├── buttons
├── menus
├── dialogs
├── navigation
└── accessibility
│
▼
RITSEI Design System
│
├── Cartographic Structure
├── Architectural Paper
├── Precision Geometry
└── Optical Glass
│
├────────────────────────────────────────┐
│                                        │
▼                                        ▼
CSS / SVG                        @ritsei/cartography
85–95%                                   │
                                         ▼
                               @ritsei/cartography-gpu
                                         │
                                         ▼
                                       vgpu
                                         │
                                         ▼
                                      WebGPU
                                        5–15%
```

The three boundaries that must not be crossed are:

```text
BUSINESS SEMANTICS
        │
        X
      shader

ACCESSIBILITY
        │
        X
      canvas

APP STATE
        │
        X
   frame loop
```

The owners are:

```text
Business semantics → domain/application

Accessibility → HTML + Ark UI

Reactive state → Solid

Material rendering → vgpu/WebGPU
```

The final decision is therefore:

> **Solid + Ark UI + semantic HTML as the primary platform, CSS/SVG as the default renderer, and
> `vgpu` as the optional high-performance cartographic renderer behind a RITSEI adapter.**

TypeGPU answers a different question:

> “What should I use to build a typed GPU software platform?”

`vgpu` answers the current RITSEI question:

> **“What is the smallest suitable abstraction for an accessible, HTML-first ERP design system that
> occasionally needs a powerful GPU-assisted cartographic renderer?”**

The design philosophy remains:

> **Structure before decoration. Meaning before motion. Material before effects.**

## Sources

The external sources below support the comparative facts in this reference. They are background
sources, not RITSEI authority; the repository's ADRs and canonical architecture documents govern
implementation.

[1]: https://ark-ui.com/docs/overview/about "About Ark UI"
[2]: https://docs.solidjs.com/reference/basic-reactivity/create-effect "SolidJS createEffect"
[3]: https://github.com/vercel-labs/vgpu "vgpu repository and README"
[4]: https://docs.swmansion.com/TypeGPU/why-typegpu/ "Why TypeGPU?"
[5]: https://ark-ui.com/docs/components/select "Ark UI Select"
[6]: https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity "SolidJS fine-grained reactivity"
[7]: https://github.com/vercel-labs/vgpu/blob/main/docs/topics/performance-playbook.docs.md "vgpu performance playbook"
[8]: https://docs.swmansion.com/TypeGPU/apis/pipelines/ "TypeGPU pipelines"
[9]: https://docs.swmansion.com/TypeGPU/tooling/unplugin-typegpu/ "TypeGPU build plugin"
[10]: https://www.npmjs.com/package/vgpu "vgpu on npm"
