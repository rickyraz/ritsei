# RITSEI Design System and Visual Grammar

> **Status:** Canonical target architecture
>
> **Implementation status:** The frontend implementation is not yet scaffolded. This document
> governs future frontend design-system work and does not by itself add dependencies or runtime
> behavior.
>
> **Owns:** Product Patterns, Interaction Grammar, Visual Grammar, semantic design tokens, component
> contracts, styling-engine boundaries, and frontend design-system governance.
>
> **Related documents**
>
> - Frontend architecture: [`./frontend.md`](./frontend.md)
> - Active architecture: [`./architecture-spec-v4.md`](./architecture-spec-v4.md)
> - Frontend state ownership:
>   [`../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md`](../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md)
> - Vite and SolidJS SPA:
>   [`../decisions/0010-use-vite-solidjs-spa.md`](../decisions/0010-use-vite-solidjs-spa.md)
> - Process Studio: [`./process-studio.md`](./process-studio.md)
> - Authorization: [`./authorization.md`](./authorization.md)
> - Architecture enforcement: [`./architecture-enforcement.md`](./architecture-enforcement.md)
> - Documentation boundaries: [`../documentation-boundaries.md`](../documentation-boundaries.md)

## Decision

The RITSEI Design System is the canonical record of recurring product decisions about visual
language, composition, interaction, behavior, and operational representation.

Tokens, recipes, components, and styling tools are mechanisms for enforcing those decisions. They
are not the design system by themselves.

> **RITSEI is not a collection of styled pages. It is a visual and interaction projection of
> business state, relationships, movement, capacity, commitments, processes, time, locations, and
> exceptions.**

A decision belongs in the design system when multiple builders should not have to make the same
decision independently.

## One language, many compositions

RITSEI standardizes a shared visual language, not a universal page layout or dashboard template:

> **Different businesses should not share the same interface. They should share the same visual
> language.**

Manufacturing, ISP, retail, and other business models should use different compositions and dominant
representations while remaining recognizably RITSEI. A manufacturing workspace may emphasize flow,
capacity, and exception; an ISP workspace may emphasize topology, spatial relationships, and
incidents; a retail workspace may emphasize velocity, matrix, and replenishment. Their shared
identity comes from semantic vocabulary, hierarchy, state treatment, interaction behavior, density,
and accessibility—not from arranging the same cards in the same order.

> **RITSEI standardizes the language, not the sentence.**

The architecture can be summarized as:

```text
                    RITSEI
        Canonical visual language
                   │
        Extensible grammar
                   │
        Domain-aware projection

     consistency ←────────→ flexibility
```

The canonical language anchors shared identity. Governed grammar and domain-aware projections allow
business-specific expression without creating feature-local visual dialects.

RITSEI therefore chooses a projection from business meaning rather than forcing every problem into a
fixed record/view menu:

```text
record-oriented approach  -> record -> standard view
RITSEI approach           -> meaning -> appropriate projection
```

This is a product and interaction thesis, not a claim that a styling engine or component library is a
competitive moat.

## Stable language and extensible expression

The system has two deliberately different zones:

### Stable language

These are the controlled foundations that keep product surfaces speaking the same language:

```text
semantic vocabulary and states
semantic tokens
Typography and hierarchy
density and spacing rules
interaction states
attention and severity treatment
recipes and core components
accessibility and reduced-motion rules
```

Stable means governed and compatibility-aware, not frozen forever. Changes to this zone are design
system changes and must preserve meaning, accessibility, and the public component contract.

### Extensible expression

These are the parts that adapt to a business question or domain context:

```text
projection intent
visual grammar
Product Pattern composition
workspace composition
domain-specific combinations
new representations
```

Feature teams may compose or extend this zone when the business question requires it, but they must
reuse the stable language and document the resulting usage contract. A new representation is not a
new vendor-specific dialect.

## Three forms of extensibility

```text
Visual extensibility
  Change how an existing semantic concept is represented.

Grammar extensibility
  Add a governed representation for a newly identified business meaning.

Composition extensibility
  Combine approved meanings and representations differently for a business model.
```

For example, `critical` may evolve from a red box into a richer attention treatment without changing
its business meaning. A new concept such as `propagation` may be added to describe cascading impact.
An ISP projection may then compose `relationship + spatial + capacity + exception` without creating
an industry-specific component family.

New business meaning still requires a typed projection contract and an owning domain decision. Only
its visual representation and composition are flexible.

## Layer model

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
Ark UI + Panda CSS + specialized renderers
      ↓
SolidJS DOM projection
```

The layers have different owners:

| Layer               | Owns                                                                  | Must not own                       |
| ------------------- | --------------------------------------------------------------------- | ---------------------------------- |
| Domain              | Authoritative facts, invariants, capabilities, typed commands         | UI layout or styling               |
| Projection          | Decoded view models and representation intent                         | New business authority             |
| Product Pattern     | Canonical product composition and workflow behavior                   | CSS implementation details         |
| Interaction Grammar | Selection, editing, dragging, focus, confirmation, navigation         | Backend authorization              |
| Visual Grammar      | How business meaning is represented visually                          | Domain truth or renderer internals |
| Design System       | Tokens, recipes, components, accessibility, density, visual contracts | Domain mutations                   |
| Renderer            | Geometry, lifecycle, DOM/SVG/Canvas output                            | Business aggregation or policy     |

The browser renders decoded projections and invokes public commands. It never becomes the owner of a
business fact, authorization decision, transaction, or workflow invariant.

## Process Studio as an authoring surface

Process Studio is one of the primary places where RITSEI's visual language becomes usable. It lets
people write different business-process sentences with shared process vocabulary and visual grammar.
Its graph is an editing representation, not business truth.

Process Studio keeps these concerns separate:

```text
Process semantics      -> what a node or edge means
Process representation -> how that meaning is shown and edited
Process execution      -> how the runtime executes and observes it
```

The Process Studio architecture owns process design-time semantics, catalogs, Process IR, and
execution boundaries. This document owns the shared visual vocabulary, representation rules,
component contracts, and renderer boundaries used by the editor and by other projections. See
[`process-studio.md`](./process-studio.md) for the process-specific contract.

## Product Patterns are not Panda patterns

Panda layout patterns such as `Stack`, `Grid`, or `Container` describe spatial primitives. RITSEI
Product Patterns describe recurring product decisions.

Examples:

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

A Product Pattern answers questions such as:

- Where does identity appear?
- Where is lifecycle state shown?
- Where does the primary action live?
- Which actions are destructive?
- When is a drawer, dialog, or page appropriate?
- How does the user move from summary to evidence?
- How are filters, bulk actions, history, loading, and errors represented?

Product Patterns are canonical compositions. Feature teams may extend them when a new business
concept cannot be expressed, but they must not fork them for ordinary preference.

## Visual Grammar

Business semantics are not permanently bound to one visualization.

```text
Semantic        Possible projections
────────────────────────────────────────────
Movement        Flow, Sankey, map, timeline
Relationship     Graph, topology, dependency tree
Process          Stage pipeline, process flow, state journey
Capacity         Utilization, saturation, capacity matrix
Commitment       Timeline, schedule, milestone
Location         Geographic map, spatial map, network map
Exception        Decision card, alert, risk marker, attention queue
Time             Timeline, trend, event stream
```

The projection is selected by the question the user needs to answer:

```text
Movement + "Where is inventory going?"  → Flow
Movement + "What happened to this item?" → Timeline
Movement + "Where is inventory now?"     → Map
```

Industry adaptation is composition, not theming or hard-coded dashboard classes:

```text
Manufacturing = Process + Movement + Capacity + Exception
Distribution  = Movement + Location + Commitment + Exception
Retail        = Movement + Velocity + Location + Exception
ISP           = Relationship + Location + Capacity + Exception
Consulting    = Commitment + Capacity + Time + Exception
```

Do not create `ManufacturingDashboard`, `RetailDashboard`, or `ISPDashboard` as the primary
architecture. Compose approved projections and Product Patterns instead.

## Component contracts

A component has two contracts.

### Machine contract

Props, schemas, variants, slots, events, and accessibility behavior.

### Human/product contract

Every important component and Product Pattern should document:

```text
USE WHEN
DO NOT USE FOR
REQUIRES
ACCESSIBILITY NOTES
EMPTY / LOADING / ERROR BEHAVIOR
```

Example:

```text
DecisionCard

Use when:
  an operational condition requires awareness or intervention.

Do not use for:
  ordinary status, passive metrics, successful operations, or decoration.

Requires:
  a clear condition, affected scope, consequence or impact, and a next action
  when one is available.
```

This guidance is part of the contract consumed by developers and coding agents. A component API
without its usage rules is incomplete.

## Semantic state vocabulary

Consumers express intent, not appearance:

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

These taxonomies must not be collapsed into raw colors. Meaning should be reinforced with labels,
icons, shape, focus, border, or other non-color signals.

## Styling foundation

Panda CSS is the selected styling substrate. RITSEI exposes a constrained authoring profile rather
than Panda's entire API surface.

The approved design-system surface is:

```text
semantic tokens
config recipes
config slot recipes
approved layout patterns
approved conditions
css() as an exceptional escape hatch
```

Feature code must not directly use:

```text
raw foundation colors
arbitrary spacing values
styled JSX props
unapproved recipes
vendor-specific primitive styling
```

The target configuration should use strict token/property policies and disable broad JSX style-prop
authoring. Exact Panda configuration is an implementation task behind the frontend activation gate.

Panda does not determine business semantics, visualization geometry, or Product Pattern behavior. It
only implements the visual contracts owned by RITSEI.

## Accessible behavior primitives

Ark UI is the selected headless behavior and accessibility primitive source for the RITSEI UI layer.
Feature code must not import Ark UI directly. Internal RITSEI components wrap it and own the stable
public API.

```text
RITSEI Dialog
  → Ark UI dialog behavior
  → RITSEI focus, token, slot, and usage contract
```

Kobalte and Ark UI must not be used as competing primitive sources. A future replacement requires a
new decision and a single migration boundary.

## Drag and drop

Drag and drop is an interaction enhancement, not a business semantic or the only editing model.

The dnd-kit Solid adapter may implement pointer, touch, and keyboard interaction behind a RITSEI
interaction adapter. It must not be exposed as a domain contract.

```text
dnd-kit interaction state
      ↓
RITSEI interaction vocabulary
      ↓
validated application intent
      ↓
Process IR or owning public command
```

For Process Studio and other editors:

- pointer drag, keyboard movement, and structured-form editing must produce equivalent semantic
  operations;
- DOM coordinates and drag state must never become Process IR semantics;
- focus restoration, announcements, collision behavior, undo/redo, and cancellation are part of the
  interaction contract;
- graph, topology, Sankey, and canvas geometry require a specialized renderer rather than forcing
  dnd-kit to become a graph engine.

## Data visualization

TanStack Charts is a provisional quantitative renderer behind a RITSEI visualization boundary.
Feature and domain code must depend on a RITSEI `VisualizationSpec` or feature-local chart contract,
not on TanStack types.

```text
Business projection
      ↓
VisualizationSpec
      ↓
Chart renderer adapter
      ↓
TanStack Charts or another approved renderer
```

A chart renderer owns marks, channels, scales, axes, geometry, and renderer lifecycle. It does not
own fetching, authorization, business aggregation, freshness policy, or authoritative state.

Visualization tokens must distinguish:

```text
categorical series colors
semantic status colors
reference and axis colors
selection and focus colors
```

Charts must declare or visibly communicate units, currency, missing data, freshness, degraded state,
and accessible textual or tabular alternatives where the visual representation is insufficient.

TanStack Charts remains replaceable until its frontend activation and stability gates pass.

## Declarative intent

RITSEI may use bounded, typed declarative intent for view composition and Product Patterns:

```text
typed view intent
+ approved Product Patterns
+ catalog-backed action presentation
+ backend-authorized commands
```

This does not authorize a universal Odoo-style model framework. Frontend intent must not contain:

- arbitrary SQL, scripts, or expressions;
- hidden reads or mutations;
- tenant-defined authorization;
- domain invariants or persistence schemas;
- model inheritance that changes business behavior;
- Process IR or backend DomainAction values without an explicit typed boundary.

Tenant- or plugin-configurable UI intent requires a separate ADR covering schema versioning, trust,
capability filtering, migrations, caching, and compatibility.

## Ownership and collaboration

```text
Domain
  What does this mean and what is authoritative?

UX
  How should humans understand and interact with it?

UI design
  How should that meaning look and change over time?

Engineering
  How is the contract reliable, accessible, testable, and performant?
```

UX may identify a missing concept such as `affectedScope` or `propagation` in an exception. UI
design may change tokens, hierarchy, typography, density, motion, or visualization appearance
without changing business meaning. Engineering turns the result into typed, accessible contracts.

The system is intentionally neither an unconstrained toolbox nor a rigid renderer:

> **Defaults should be strong; boundaries should remain permeable.**

A new design should extend the system's vocabulary rather than bypass it.

## Frontend location

The initial implementation belongs inside the single frontend application. Do not create a separate
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
artifacts, dnd-kit, or visualization renderers.

## Agent composition rules

Coding agents must:

- compose existing Product Patterns before inventing screen-specific structure;
- use semantic variants instead of raw colors, spacing, or appearance props;
- read component `USE WHEN` and `DO NOT USE FOR` guidance;
- keep business semantics in feature projections and backend public contracts;
- use the RITSEI interaction vocabulary instead of leaking vendor state names;
- keep chart and drag implementations behind their adapters;
- propose a new pattern when repeated decisions cannot be expressed, rather than adding a local
  exception silently.

Agents must not:

- create industry-specific dashboard component families as a default;
- import Ark UI, Panda, dnd-kit, or chart packages directly into domain feature code;
- encode authorization or business invariants in view configuration;
- use color alone to communicate operational state;
- treat a component catalog as proof that a design system decision exists.

## Governance and validation

A Product Pattern or Visual Grammar addition requires:

- a named semantic problem;
- a usage contract;
- accessibility and keyboard behavior;
- empty, loading, error, and degraded states;
- density and responsive behavior;
- localization and long-content review;
- a component or interaction test where behavior is non-trivial;
- visual regression coverage when the shared contract changes.

Frontend activation gates include:

- SolidJS 2/Vite compatibility;
- Ark UI keyboard and screen-reader behavior;
- constrained Panda token and recipe enforcement;
- dnd-kit pointer/keyboard parity where used;
- renderer accessibility and deterministic output;
- bundle and interaction performance measurements;
- no forbidden vendor imports outside the internal UI layer.

## Non-goals

This document does not:

- define backend business semantics or authorization;
- define Process IR or Process Studio runtime semantics;
- select a chart, graph, map, or canvas engine for every visual grammar;
- require SSR, SolidStart, or a universal metadata-driven UI framework;
- add frontend dependencies before an implementation spike and activation gate;
- replace the frontend state ownership rules in ADR-0048.
