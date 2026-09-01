# RITSEI Design System: Cartographic Enterprise UI

> **Status:** Canonical and active design-system specification
>
> **Implementation status:** The design-system contract is approved. `apps/web` is still in
> frontend activation and does not yet contain the production Panda, Ark UI, renderer, or token
> runtime. This document therefore defines the target contract and its activation gates; it does
> not claim that WebGPU, glass recipes, visual regression, or production accessibility evidence
> already exists.
>
> **Owns:** Product Patterns, Interaction Grammar, Visual Grammar, semantic design tokens, material
> rules, component contracts, accessibility, density, renderer boundaries, and frontend design-system
> governance.
>
> **Related documents**
>
> - Frontend architecture: [`./frontend.md`](./frontend.md)
> - Active architecture: [`./architecture-spec-v4.md`](./architecture-spec-v4.md)
> - Design-system decision: [`../decisions/0056-adopt-ritsei-semantic-frontend-design-system.md`](../decisions/0056-adopt-ritsei-semantic-frontend-design-system.md)
> - Cartographic UI decision: [`../decisions/0069-adopt-cartographic-enterprise-visual-grammar.md`](../decisions/0069-adopt-cartographic-enterprise-visual-grammar.md)
> - Frontend state ownership: [`../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md`](../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md)
> - Vite and SolidJS SPA: [`../decisions/0010-use-vite-solidjs-spa.md`](../decisions/0010-use-vite-solidjs-spa.md)
> - Process Studio: [`./process-studio.md`](./process-studio.md)
> - Authorization: [`./authorization.md`](./authorization.md)
> - Architecture enforcement: [`./architecture-enforcement.md`](./architecture-enforcement.md)
> - Documentation boundaries: [`../documentation-boundaries.md`](../documentation-boundaries.md)

## 1. Scope and normative language

This document is the single source of truth for RITSEI's recurring visual, interaction, and
renderer decisions. Tokens, recipes, components, and styling tools implement these decisions; they
do not replace them.

The following terms are normative:

- **MUST / MUST NOT:** required for a conforming RITSEI surface.
- **SHOULD / SHOULD NOT:** default behavior; an exception requires a documented product reason.
- **MAY:** permitted when it remains inside the approved contract.

A feature deviation MUST name the semantic problem it solves, the affected states and surfaces, the
accessibility behavior, and the exit or replacement path. Local styling exceptions MUST NOT become a
new design-system dialect.

The material ratios and HTML/rendering ratios in this document are **art-direction targets**, not a
literal per-component budget or a universal page template. A form or table MAY be almost entirely
HTML and still conform. A data-dense spatial view MAY use more canvas or WebGPU when its measured
question requires it.

## 2. Design thesis

RITSEI does not use topographic patterns as decoration. Its visual language treats an ERP as a map of
business operations: structure, routes, pressure, density, relationships, movement, risk, and change
of state.

> **RITSEI is a living map of the business — precise enough to operate, expressive enough to
> understand.**

The design language has four controlled materials:

```text
55% Cartographic Structure
25% Architectural Paper
15% Precision Geometry
 5% Optical Glass
```

These percentages describe the visual emphasis of a composed experience:

- **Cartographic Structure** communicates contour, field, density, route, boundary, elevation, and
  spatial hierarchy.
- **Architectural Paper** provides calm, tactile, warm surfaces without skeuomorphism.
- **Precision Geometry** keeps grid, spacing, typography, alignment, controls, tables, and layout
  exact.
- **Optical Glass** provides temporary interactive depth for popovers, command palettes, inspectors,
  and modals only.

The governing principles are:

> **Structure before decoration.**
>
> **Meaning before motion.**
>
> **Material before effects.**

The UI MUST remain deterministic, readable, accessible, power-conscious, and fast. A visual effect
that reduces those properties is a defect, not brand expression.

## 3. Visual character and non-goals

The target character is:

- **Technical:** grid, geometry, charts, topology, and structured information.
- **Calm:** no neon, excessive glow, or visual noise.
- **Crafted:** tactile surfaces without sterile SaaS defaults.
- **Spatial:** hierarchy comes from surface, field, elevation, and density, not only shadow.
- **Distinctive:** cartographic language is part of the system and not a background image.

RITSEI is NOT:

- glassmorphism-heavy UI;
- a futuristic gaming dashboard;
- a watercolor-heavy application;
- a beige editorial dashboard;
- skeuomorphic enterprise software; or
- a generic Tailwind SaaS dashboard.

Cartographic identity MUST NOT force every screen to become a map, a graph, or a dashboard. The
business question selects the projection.

## 4. System layers

RITSEI separates business meaning from its visual projection:

```text
Business truth
      ↓
Business semantics
      ↓
Projection intent
      ↓
Product Patterns + Interaction Grammar
      ↓
Visual Grammar
      ↓
RITSEI UI components
      ↓
Behavior + visual contracts
      ↓
DOM / SVG / Canvas / WebGPU renderer adapters
```

The layers have separate owners:

| Layer | Owns | Must not own |
|---|---|---|
| Domain | Authoritative facts, invariants, capabilities, typed commands | UI layout or styling |
| Projection | Decoded view models and representation intent | New business authority |
| Product Pattern | Canonical composition and workflow behavior | CSS implementation details |
| Interaction Grammar | Selection, editing, dragging, focus, confirmation, navigation | Backend authorization |
| Visual Grammar | How business meaning is represented visually | Domain truth or renderer internals |
| Design System | Tokens, recipes, components, accessibility, density, visual contracts | Domain mutations |
| Renderer | Geometry, lifecycle, and DOM/SVG/Canvas/WebGPU output | Business aggregation or policy |

The browser renders decoded projections and invokes public commands. It never owns a business fact,
authorization decision, transaction, or workflow invariant.

## 5. Stable language and extensible expression

The system has two zones.

### Stable language

These are controlled foundations:

```text
semantic vocabulary and states
semantic tokens
typography and hierarchy
density and spacing rules
interaction states
attention and severity treatment
recipes and core components
accessibility and reduced-motion rules
renderer and fallback contracts
```

Changes to this zone are design-system changes. They MUST preserve meaning, accessibility, public
component behavior, and token compatibility.

### Extensible expression

These adapt to a business question or domain:

```text
projection intent
visual grammar
Product Pattern composition
workspace composition
domain-specific combinations
new representations
```

The three permitted forms of extensibility are:

1. **Visual extensibility:** change how an existing semantic concept is represented.
2. **Grammar extensibility:** add a governed representation for a new business meaning.
3. **Composition extensibility:** combine approved meanings and representations differently for a
   business model.

New business meaning requires an owning domain decision and a typed projection contract. It MUST NOT
be introduced as an untyped feature-local visual dialect.

## 6. Product Patterns

Product Patterns are recurring product decisions, not Panda layout primitives. Panda `Stack`,
`Grid`, and `Container` are implementation mechanisms; RITSEI patterns decide what the user sees,
why it is there, and how it behaves.

Approved starting patterns include:

```text
EntityWorkspace
OperationalWorkspace
Settings
Approval
ExceptionInvestigation
BulkOperation
MasterDetail
CommandSurface
```

A Product Pattern MUST answer:

- where identity appears;
- where lifecycle state appears;
- where the primary action lives;
- which actions are destructive;
- whether a drawer, dialog, or page is appropriate;
- how the user moves from summary to evidence;
- how filters, bulk actions, history, loading, errors, and degraded states appear; and
- how density and responsive behavior change without changing meaning.

Feature teams MUST compose an existing pattern before creating a new one. A new pattern requires a
named semantic problem and the usage contract in Section 12.

## 7. Interaction Grammar and semantic states

Consumers express intent, not appearance. These dimensions are orthogonal and MUST NOT be collapsed
into a raw color or one overloaded `status` value.

```text
Interaction:
  idle, hovered, selected, dragging, drop-target, disabled

Placement:
  neutral, valid, invalid, constrained

Operational:
  normal, informative, attention, constrained, critical, blocked

System:
  idle, active, pending, completed, failed, cancelled
```

Rules:

- one value per state dimension is the default;
- an interaction state MAY coexist with an operational state;
- `disabled` describes interaction availability, not authorization truth;
- `blocked` describes an operational condition that prevents progress;
- `critical` describes severity and does not automatically mean blocked;
- `constrained` describes a bounded capacity, policy, or placement condition; and
- an unauthorized action MUST be denied by the backend and represented with the approved
  authorization/error contract, not simulated as a local state mutation.

When several operational signals are summarized into one visual treatment, the precedence is:

```text
blocked > critical > constrained > attention > informative > normal
```

System failure and pending states MUST retain their own label or icon even when an operational state
is also shown. Every important state MUST be communicated through at least two channels chosen from
text, icon, shape, border, position, pattern, or semantic color.

## 8. Core palette

Primitive tokens are the controlled material vocabulary. They MUST be defined centrally and consumed
through semantic aliases. Feature code MUST NOT use these primitives directly.

### Dark structural colors

```css
--topo-950: #151A1E;
--topo-850: #252C32;
--topo-700: #37434B;
```

- **Topo Ink — `#151A1E`:** primary dark text, darkest canvas, strong contour, wordmark, and
  high-contrast architectural elements.
- **Topo Slate — `#252C32`:** sidebar, secondary dark surface, navigation, and dark cards.
- **Structural Slate — `#37434B`:** tertiary dark surface, subtle boundary, and secondary contour.

### Terrain colors

```css
--terrain-700: #365A72;
--terrain-500: #57778A;
--terrain-300: #A7BBC4;
```

- **Contour Blue — `#365A72`:** primary interaction, selected state, main chart, active process,
  and important relationship.
- **Terrain Blue — `#57778A`:** secondary information, hover, secondary charts, and topology.
- **Mist Terrain — `#A7BBC4`:** subtle contour, inactive data, washed chart region, and depth.

### Paper colors

```css
--paper-base: #F4F0E6;
--paper-fiber: #E9E2D3;
--surface: #FAF8F2;
```

- **Ivory Paper — `#F4F0E6`:** light-mode canvas; never substitute pure white as the default.
- **Fiber Paper — `#E9E2D3`:** inset panels, secondary regions, grouped sections, and crafted
  backgrounds.
- **Soft Surface — `#FAF8F2`:** elevated cards, inputs, and content surfaces.

Paper texture MUST be subtle enough that it does not compete with data or look like a pasted image.

### Survey accents

```css
--brass: #A88F58;
--sand-marker: #C9B786;
```

Brass and sand are survey markers, not normal actions. They MAY mark milestones, financial focal
points, topology anchors, or premium brand details. Their visual use SHOULD remain below roughly
3–5% of a composed surface.

### Semantic colors

Semantic meaning takes priority over brand consistency:

```css
--success:  #2E7D5B;
--info:     #3862B6;
--warning:  #D49A2C;
--critical: #C84A3C;
--neutral:  #64748B;
--forecast: #7567A8;
```

Semantic colors MUST be paired with explicit text, icon, or shape treatment. `--terrain-300`, brass,
and low-contrast paper values MUST NOT be used as standalone text or status indicators.

### Contrast and theme rules

- Normal text MUST meet WCAG 2.2 AA contrast of at least 4.5:1; large text MUST meet 3:1.
- Non-text controls, focus indicators, and meaningful chart marks MUST meet the applicable 3:1
  non-text contrast requirement.
- Every semantic background MUST have an approved readable foreground token; components MUST NOT
  guess a foreground by inverting the background.
- Light and dark themes MUST define semantic aliases separately. Dark mode is not a blind color
  inversion.
- High-contrast mode MUST preserve state distinctions through text, icon, border, or shape when
  low-contrast material is removed.
- Contrast checks are activation evidence for shared recipes, not an optional visual review.

## 9. Light and dark mode

Light mode is an architectural paper field:

```text
65% paper / ivory
20% topo ink / structural slate
10% terrain family
 5% mist + brass
```

The main canvas is `#F4F0E6`; elevated surfaces use `#FAF8F2`. Navigation MAY use a dark structural
block as a spatial anchor.

Dark mode is a mineral structural field:

```text
70% topo ink / slate
15% terrain
10% mist / ivory
 5% brass
```

Dark mode MUST use restrained contour opacity and MUST preserve readable text and semantic status
contrast. Paper character becomes a subtle mineral/grain surface rather than an inverted ivory
canvas.

## 10. Typography

Use one sans-serif UI family consistently. Inter, Geist, or a Söhne-like grotesk are acceptable
starting candidates; the activated application MUST select and measure one primary family rather
than mixing defaults by feature.

A display serif MAY be used for marketing, editorial reports, annual reviews, or empty-state heroes.
It MUST NOT be used for primary operational UI.

Reference hierarchy:

```text
Display      36–48px
Page Title   28–32px
Section      20–24px
Card Title   15–18px
Body         14–16px
Metadata     12–13px
Micro        11–12px
```

Typography MUST remain scannable at dense enterprise layouts. Numeric values MUST use tabular
numerals. Dates, currencies, quantities, and percentages MUST use locale-aware formatting and MUST
NOT depend on glyph shape alone for meaning.

## 11. Grid, geometry, and density

Precision Geometry is the stabilizer for expressive material:

```text
4px base grid
8px common rhythm
12 / 16 / 24 / 32px primary gaps
8–12px card radius
1px low-contrast borders
```

Rules:

- layout alignment MUST remain strict even when a cartographic layer is expressive;
- arbitrary spacing values MUST NOT appear in feature code;
- rounded corners MUST communicate grouping, not decorate every container;
- large continuous surfaces are preferred when grouping does not require cards; and
- the active density profile MUST be explicit and consistent within a workflow.

The initial density profiles are:

```text
comfortable  reading, review, and touch-heavy work
compact     default operational work
dense       high-volume tables and monitoring, only when readability evidence supports it
```

A dense profile MUST preserve target size, keyboard access, row association, and localization. Density
MUST NOT be used to hide required labels or remove error context.

## 12. Surface and elevation system

RITSEI has four surface types:

- **Base Canvas:** paper or dark mineral field; almost no shadow.
- **Content Surface:** tables, forms, documents, charts, and data regions; mostly flat.
- **Group Surface:** cards, KPI groups, summaries, and configuration blocks; slight tonal lift.
- **Interactive Surface:** selected items, inspectors, dropdowns, command menus, and floating
  controls; temporary depth is permitted.

Depth is applied in this order:

```text
tone → texture → border → blur → shadow
```

### Elevation levels

#### L0 — Background

Cartographic field or paper canvas.

```css
box-shadow: none;
```

#### L1 — Content Surface

Tables, forms, charts, and data regions.

```css
box-shadow: 0 1px 2px rgb(21 26 30 / 0.04);
```

#### L2 — Card / Panel

Grouped content only.

```css
box-shadow: 0 4px 12px rgb(21 26 30 / 0.06);
```

#### L3 — Interactive Surface

Dropdowns, inspectors, command palettes, and selected process nodes.

```css
backdrop-filter: blur(10px);
box-shadow: 0 8px 24px rgb(21 26 30 / 0.09);
```

Interactive glass opacity is controlled between `0.82` and `0.90`.

#### L4 — Modal / Popover

```css
backdrop-filter: blur(14px);
box-shadow: 0 18px 48px rgb(21 26 30 / 0.14);
```

L4 is the highest layer and MUST remain restrained.

Glass MUST NOT be used where it reduces contrast, hides an important boundary, increases motion or
power cost, or makes the underlying content harder to parse. It is never the default card treatment.

## 13. Cartographic Visual Grammar

Cartography is a representation system, not wallpaper. Its primitives are:

```text
Contour
Field
Route
Boundary
Marker
Density
Elevation
Pulse
Region
```

They represent:

| Primitive | Permitted semantic readings |
|---|---|
| Contour | density, pressure, activity, capacity, risk, complexity |
| Field | operating area, state distribution, ambient context |
| Route | movement, process, dependency, transaction path, material flow |
| Boundary | risk, policy, scope, ownership, threshold |
| Marker | event, milestone, location, exception, decision |
| Density | concentration, volume, workload, relationship intensity |
| Elevation | concentration, queue pressure, severity, capacity load |
| Pulse | active event, replenishment, pending movement, live activity |
| Region | grouped scope, forecast area, operating condition |

A primitive MUST have a declared semantic meaning in its projection contract. It MUST NOT be added
only to fill empty space.

### Topographic usage by surface

```text
Sidebar
→ medium density

Dashboard canvas
→ sparse

Charts
→ contextual

Process Studio
→ expressive

Inventory spatial view
→ expressive

Forms
→ almost none

Tables
→ none or extremely subtle

Modal background
→ contextual deformation
```

Topographic forms MUST NOT move text, break alignment, obscure focus, or sit behind a standard
enterprise table body.

### Paper material

Paper consists of:

```text
micro grain
low-frequency luminance variance
subtle directional fiber
very low contrast noise
```

The material MAY be static and SHOULD freeze when no scene changes. It MUST be imperceptible as a
texture asset and MUST NOT reduce text, chart, or control contrast.

## 14. Domain-adaptive visual language

Each domain may emphasize different cartographic primitives while sharing the same grammar:

```text
Process       → Flow
Inventory     → Space
Manufacturing → Load
Procurement   → Dependency
Finance       → Concentration
CRM           → Relationship
```

The projection is selected by the user's question:

```text
Movement + "Where is inventory going?"  → Flow
Movement + "What happened to this item?" → Timeline
Movement + "Where is inventory now?"     → Map
```

Industry composition is not a new dashboard family:

```text
Manufacturing = Process + Movement + Capacity + Exception
Distribution  = Movement + Location + Commitment + Exception
Retail        = Movement + Velocity + Location + Exception
ISP           = Relationship + Location + Capacity + Exception
Consulting    = Commitment + Capacity + Time + Exception
```

Do not create `ManufacturingDashboard`, `RetailDashboard`, or `ISPDashboard` as the primary
architecture. Compose approved projections and Product Patterns.

## 15. Domain surfaces

### Dashboard

A dashboard MUST establish hierarchy:

```text
Page context
↓
Primary business state
↓
Operational field
↓
Key exceptions
↓
Supporting metrics
```

It MUST NOT default to twelve identical cards. The visual center is operational state, not KPI card
quantity.

### Inventory

Inventory represents business space. Approved data mappings include:

```text
stock_level
capacity
turnover
pick_frequency
reorder_risk
age
movement
```

```text
Contour rapat       → operational pressure tinggi
Elevation tinggi    → capacity concentration
Fast route          → high movement
Flat area           → stable inventory
Pulse               → replenishment needed
Broken contour      → discrepancy
```

### Process Studio

Process Studio visualizes business flow using the shared grammar:

```text
normal process → sparse contour
high activity  → dense contour
bottleneck     → contour convergence
critical state → elevated region
active event   → moving pulse
```

Its graph remains an editing representation, not business truth. See
[`process-studio.md`](./process-studio.md).

### Procurement

Procurement may visualize dependency and supply pressure:

```text
Supplier → Purchase Order → Transit → Receiving → Inventory
```

Route thickness MAY represent volume. Contour density MAY represent supplier risk. Markers MAY
represent delay or exception.

### Manufacturing

Manufacturing may represent production route, WIP density, work-center load, material dependency,
bottlenecks, and machine state. Elevation MAY represent queue pressure.

### Accounting and Finance

Finance MUST NOT be forced into a literal map. It MAY use abstract cartographic language for:

```text
cash position field
liquidity concentration
aging distribution
forecast region
risk boundary
```

Numbers, tables, auditability, exact arithmetic, and reconciliation status remain primary.

### CRM and Sales

CRM may use pipeline terrain, account relationships, deal movement, territory, and revenue
concentration. The primary CRM surface MUST remain scannable and operational.

## 16. Core component contracts

Every shared component has two contracts:

### Machine contract

Props, schemas, variants, slots, events, focus behavior, keyboard behavior, and accessibility
behavior.

### Human/product contract

Every important component and Product Pattern MUST document:

```text
USE WHEN
DO NOT USE FOR
REQUIRES
ACCESSIBILITY NOTES
EMPTY / LOADING / ERROR / DEGRADED BEHAVIOR
DENSITY AND RESPONSIVE BEHAVIOR
```

Example:

```text
DecisionCard

USE WHEN:
  an operational condition requires awareness or intervention.

DO NOT USE FOR:
  ordinary status, passive metrics, successful operations, or decoration.

REQUIRES:
  a clear condition, affected scope, consequence or impact, and a next action when available.
```

### Tables

Tables MUST remain semantic HTML. They MUST be dense but readable and support:

```text
sticky headers
strong numeric alignment
minimal zebra striping
semantic status
subtle row selection
keyboard navigation
```

Canvas MUST NOT replace a standard enterprise table.

### Forms

Forms are functional objects:

```text
paper surface
1px border
clear focus state
terrain-blue interaction
minimum decorative material
```

Forms MUST expose labels, validation, error association, keyboard order, and recovery guidance.

### Buttons

- Primary uses Contour Blue (`#365A72`) through a semantic action token.
- Secondary uses paper or transparent surface with a structural border.
- Danger uses semantic critical treatment.
- Gold MUST NOT be a normal CTA.
- Labels MUST name the action and remain consistent with the resulting confirmation.

### Navigation

The sidebar is a valid cartographic anchor:

```text
Topo Ink + very subtle contour field
active item → terrain-blue region
```

Contour contrast MUST remain low enough that navigation labels and current location dominate.

### Cards

Cards are used only when grouping is needed. Avoid card-inside-card, every-metric-as-card,
all-white floating panels, and excessive shadows. Large continuous surfaces are preferred when they
make the information architecture clearer.

### Charts

Charts MUST remain accurate and readable. Cartographic material MAY provide terrain area, contour
density, route, field, marker, or forecast fog, but labels, tooltips, units, currency, missing data,
freshness, degraded state, and accessible textual/table alternatives remain explicit.

### Icons and status

Icons are geometric and precise with low personality and approximately 1.5–2px stroke. Brand
personality comes from composition and material, not icon gimmicks.

Badges are used sparingly. Important state combines semantic color with label, icon, shape, or border;
color alone is prohibited.

### Empty and loading states

Empty states MAY use a sparse contour illustration, paper field, minimal route, and small brass
marker. They MUST explain what is empty and what the user can do next.

Loading states MAY use a quiet terrain, gentle pulse, or contour propagation. They MUST be low-power,
respect reduced motion, and preserve a semantic loading label.

## 17. Interaction, drag, and accessibility rules

Drag and drop is an interaction enhancement, not a business semantic. It MAY use the Solid dnd-kit
adapter behind a RITSEI interaction adapter.

```text
dnd-kit state
      ↓
RITSEI interaction vocabulary
      ↓
validated application intent
      ↓
Process IR or owning public command
```

Pointer drag, keyboard movement, and structured-form editing MUST produce equivalent semantic
operations where editing is required. Focus restoration, announcements, collision behavior,
undo/redo, and cancellation are part of the contract. DOM coordinates MUST NOT become Process IR,
authorization, or persistence state.

Ark UI is the single headless accessibility source behind RITSEI-owned components. Feature code MUST
NOT import Ark UI, dnd-kit, Panda-generated artifacts, or renderer libraries directly.

The material layer MUST NOT carry information by itself. Canvas and WebGPU are never substitutes for
semantic DOM, accessible labels, keyboard access, or text/table alternatives.

All interactive controls MUST provide:

- visible keyboard focus;
- a logical tab order;
- an accessible name and role;
- an error or status announcement when needed;
- a target size appropriate to the interaction context; and
- behavior that remains understandable at 200% zoom and with long localized content.

## 18. Motion system

Motion explains change; it does not make a static screen look premium.

```text
Utility motion     120–180ms  hover, focus, selection
Structural motion  180–280ms  panels, navigation, inspector
Semantic motion    dynamic    process, inventory movement, events, bottlenecks
```

Semantic motion MAY be more expressive, but MUST be bounded by visibility, power, and reduced-motion
rules. Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced motion MUST disable or replace particle flows, terrain animation, dynamic distortion, and
continuous parallax. Static contour MAY remain.

## 19. HTML, CSS, SVG, Canvas, and WebGPU

HTML remains the application and semantic layer. The default implementation balance is:

```text
HTML / DOM     80–95%
Canvas/WebGPU   5–20%
```

This is a target for composed visual experiences, not a requirement that every route use a GPU. A
standard form, table, or record editor MAY be 100% semantic HTML/CSS.

### Renderer ownership

```text
Application / Solid / HTML
│
├── Forms
├── Tables
├── Navigation
├── Typography
├── Accessibility
│
└── Optional material and visualization adapters
     ├── TopologyField
     ├── Contour
     ├── PaperGrain
     ├── OpticalSurface
     ├── AmbientDepth
     └── DataPulse
```

WebGPU MAY handle procedural topology, dense visualization, field deformation, data-driven contour,
particle movement, extremely dense charts, spatial visualization, and material rendering. It MUST
NOT own semantics, fetching, authorization, business aggregation, workflow state, or authoritative
facts.

### Progressive enhancement

The fallback hierarchy is mandatory:

```text
WebGPU
↓
Canvas 2D / SVG
↓
CSS
↓
Static semantic UI
```

If WebGPU is unavailable, denied, too expensive, or fails at runtime, the application MUST remain
fully usable. No critical action, value, status, or relationship may exist only in a GPU scene.

### Renderer selection

Use CSS for simple blur, shadow, opacity, minor masks, basic texture, and static illusions.

Use SVG for small contours, simple routes, vector distortion, and a small number of interactive
paths.

Use WebGPU only when measured need includes thousands of objects, dynamic topology, continuous fields,
massive data, real-time deformation, particle visualization, or complex data-driven material that
lower layers cannot satisfy.

A modal pressure effect with only 2–3px deformation belongs in CSS or SVG. WebGPU is justified only
when the contour field is procedural and materially spans the application scene.

No WebGPU, map, chart, or material dependency is activated by this document. Activation requires an
implementation spike and the evidence in Section 23.

## 20. Shadow, glass, and material constraints

Shadow only confirms hierarchy. Paper provides physical depth, geometry provides structural depth,
cartography provides spatial depth, and glass provides temporary interactive depth.

Optical glass is limited to approximately 5% of the visual language and is approved only for:

```text
command palette
floating filter
quick inspector
selected overlay
popover
modal controls
```

Reference constraints:

```text
Blur          8–16px
Opacity       0.82–0.92
Distortion    0–1.5px
Border        translucent 1px
Highlight     extremely subtle
```

Never use huge blur, rainbow reflection, strong transparency, or large glass cards everywhere.
Contrast and performance evidence are required before a shared glass recipe is activated.

## 21. Token and styling contract

The token hierarchy is:

```text
primitive
   ↓
semantic
   ↓
component
   ↓
state
```

Example:

```css
--color-terrain-700: #365A72;
--color-action-primary: var(--color-terrain-700);
--button-primary-background: var(--color-action-primary);
```

The canonical primitive names in this document (`--topo-950`, `--terrain-700`, and so on) may be
mapped to Panda token names such as `colors.topo.950`. Feature code consumes semantic aliases, not
primitive values.

Panda CSS is the selected styling substrate. The constrained RITSEI authoring surface is:

```text
semantic tokens
config recipes
config slot recipes
approved layout patterns
approved conditions
css() as an exceptional, reviewed escape hatch
```

Feature code MUST NOT use:

- raw foundation colors;
- arbitrary spacing values;
- broad styled JSX props;
- unapproved recipes;
- vendor-specific primitive styling; or
- hard-coded material intensity in a feature component.

Material tokens are centrally controlled:

```css
--material-paper-grain: 0.018;
--material-contour-opacity: 0.08;
--material-contour-density: 0.4;

--glass-blur-interactive: 10px;
--glass-blur-modal: 14px;

--glass-opacity-interactive: 0.86;
--glass-opacity-modal: 0.90;
```

Theme, density, high-contrast, and reduced-motion variants MUST be expressed through semantic
variants and recipes rather than ad hoc feature overrides.

## 22. Frontend location and dependency boundaries

The initial implementation remains inside the single frontend application. Do not create a separate
`packages/design-system` package until measured cross-application reuse justifies it.

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

Feature UI imports RITSEI UI contracts. Only the internal UI layer imports Ark UI, Panda-generated
artifacts, dnd-kit, chart adapters, Canvas, or WebGPU renderers. Backend packages, Drizzle tables,
repositories, and private services remain forbidden frontend dependencies.

The current Process Studio model and prototype files are exploratory application material. They do
not activate the production design-system contract and MUST NOT be treated as evidence that Panda,
Ark UI, or WebGPU is already available.

## 23. Activation, validation, and governance

A Product Pattern, shared component, Visual Grammar primitive, or renderer adapter is not complete
until it has:

- a named semantic problem;
- a `USE WHEN` and `DO NOT USE FOR` contract;
- machine-typed props, variants, slots, and events;
- keyboard and screen-reader behavior;
- empty, loading, error, and degraded behavior;
- density, responsive, zoom, and localization review;
- contrast and high-contrast evidence;
- reduced-motion behavior;
- a component or interaction test when behavior is non-trivial; and
- visual regression coverage when a shared visual contract changes.

Frontend activation gates include:

- Vite and SolidJS 2 compatibility;
- Ark UI focus, keyboard, and screen-reader behavior;
- constrained Panda token, recipe, slot, density, theme, reduced-motion, and high-contrast
  enforcement;
- dnd-kit pointer/keyboard parity where used;
- deterministic renderer output and accessible fallbacks;
- bundle, route, frame-time, memory, and interaction performance measurements;
- no permanent GPU animation for static scenes;
- power behavior during long-lived enterprise sessions; and
- no forbidden vendor imports outside the internal UI layer.

WebGPU activation additionally requires:

- a semantic HTML fallback that remains fully usable;
- device capability detection and runtime failure recovery;
- visibility-based rendering and static-frame caching;
- bounded frame rate and reduced-quality mode;
- measured benefit over SVG, Canvas, or CSS for the target workload; and
- evidence that the scene does not expose business or authorization semantics only through pixels.

Agents and feature teams MUST compose existing Product Patterns, use semantic variants, preserve
backend authority, and propose a new pattern when repeated decisions cannot be expressed. They MUST
NOT create industry-specific dashboard families, use color alone for state, or bypass the renderer
boundary because a local visual effect is convenient.

## 24. Non-goals

This design system does not:

- define backend business semantics or authorization;
- define Process IR or Process Studio runtime semantics;
- select a chart, graph, map, or canvas engine for every visual grammar;
- require WebGPU, SSR, SolidStart, or a universal metadata-driven UI framework;
- add frontend dependencies before an implementation spike and activation gate;
- replace frontend state ownership in ADR-0048; or
- turn visual material into a second domain model.

## 25. Final formula

```text
55% Cartographic Structure
25% Architectural Paper
15% Precision Geometry
 5% Optical Glass
```

With implementation balance:

```text
80–95% HTML / CSS
 5–20% Canvas / WebGPU
```

The most important rule remains:

> **HTML owns interaction and semantics. WebGPU owns optional material, field, density, and
> high-complexity visualization.**

RITSEI should feel like an operating landscape, not a pile of cards. A screen is a readable business
landscape: navigable, precise, expressive when useful, and quiet when decoration would obscure the
work.
