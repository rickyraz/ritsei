# Frontend Architecture

> **Status:** Canonical and active
>
> **Owns:** Frontend runtime shape, application-model and state ownership,
> framework selection, routing boundaries, server-state handling, data-heavy UI
> primitives, contract validation, and presentation-layer constraints.
>
> **Related documents**
>
> - Active architecture: [`./architecture-spec-v4.md`](./architecture-spec-v4.md)
> - SolidJS decision: [`../decisions/0009-use-solidjs-2.md`](../decisions/0009-use-solidjs-2.md)
> - SPA architecture decision: [`../decisions/0010-use-vite-solidjs-spa.md`](../decisions/0010-use-vite-solidjs-spa.md)
> - Contract schema decision: [`../decisions/0024-adopt-effect-schema-as-canonical-contract-schema.md`](../decisions/0024-adopt-effect-schema-as-canonical-contract-schema.md)
> - Effect application architecture: [`../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md`](../decisions/0048-define-effect-application-architecture-and-frontend-state-ownership.md)
> - Design system and Visual Grammar: [`./design-system.md`](./design-system.md)
> - Layered TanStack frontend engine boundaries:
>   [`../decisions/0057-define-layered-tanstack-frontend-engine-boundaries.md`](../decisions/0057-define-layered-tanstack-frontend-engine-boundaries.md)
> - Solid compiler boundary: [`../decisions/0049-keep-solid-compiler-at-rendering-boundary.md`](../decisions/0049-keep-solid-compiler-at-rendering-boundary.md)
> - Authorization architecture: [`./authorization.md`](./authorization.md)
> - Identity and principals: [`./identity-and-principals.md`](./identity-and-principals.md)
> - HTTP API boundary: [`./api.md`](./api.md)
> - Process Studio architecture: [`./process-studio.md`](./process-studio.md)
> - Architecture enforcement: [`./architecture-enforcement.md`](./architecture-enforcement.md)
> - Testing strategy: [`../development/testing.md`](../development/testing.md)
> - Documentation ownership: [`../documentation-boundaries.md`](../documentation-boundaries.md)

## Decision

RITSEI uses an API-first frontend with a separately deployed backend:

```text
Vite
└── SolidJS 2.0 SPA
    ├── Router
    ├── TanStack Solid Query (selective server-state cache)
    ├── TanStack Solid Table
    ├── TanStack Solid Virtual
    ├── TanStack Solid Form
    ├── Effect application model
    ├── Effect Schema
    └── RITSEI Design System (Ark UI + constrained Panda CSS)
```

SolidStart is not the default application foundation.

The RITSEI Design System owns Product Patterns, Interaction Grammar, Visual Grammar, semantic tokens,
component contracts, density, and frontend styling boundaries. Ark UI is the single headless behavior
primitive source behind RITSEI-owned components. Panda CSS is the constrained styling substrate. See
[`design-system.md`](./design-system.md).

It may be introduced only when server rendering, a frontend-owned BFF,
server-session management, server functions, or unified full-stack deployment
becomes an explicit requirement.

## Application Architecture

RITSEI separates the frontend application model from the renderer:

```text
SolidJS 2.0
  -> renderer and presentation runtime

Effect + Effect Schema
  -> application model, typed transitions, effects, and contracts
```

SolidJS owns DOM projection, fine-grained presentation reactivity, and local
ephemeral interaction state. It does not own durable business semantics,
authorization, transaction invariants, or authoritative domain state.

Effect is the frontend application runtime for explicit workflow coordination.
Effect Schema remains the canonical runtime contract language at frontend
boundaries. This is an Effect-first, Foldkit-inspired application architecture,
not a Foldkit dependency or renderer/runtime selection.

For workflows that need explicit coordination, use:

```text
View intent / Message
        |
        v
transition(Model, Message)
        |
        +--> new Model
        `--> Command, Subscription, or Resource operation
                         |
                         v
                    Effect service/API
                         |
                         v
                    result Message
```

- **Model** is application or workflow state, not a second source of truth for
  backend domain state.
- **Message** is a typed user intent, lifecycle notification, or effect result.
- **Transition** is a deterministic state transition from a Model and Message.
- **Command** is an Effect program/value for one external operation.
- **Subscription** is a long-lived source of Messages.
- **Resource** is a scoped, lifecycle-managed Effect resource.

A browser Message is not a backend domain event. UI intent requests a public
command; only the owning backend domain can authorize and commit the domain
fact. For example:

```text
ClickedApprove
      |
      v
ApprovalRequested
      |
      v
ApprovePurchaseOrder
      |
      +--> PurchaseOrderApproved
      `--> ApprovalFailed
```

Components must not mutate authoritative business state with local setters such
as `setStatus("approved")`. They dispatch an intention or invoke the owning
public command, then render the returned state or failure.

### State ownership

| State category | Owner | Rule |
|---|---|---|
| Authoritative domain state | Backend domain, PostgreSQL, or approved financial ledger | The browser may render a decoded projection but cannot mutate authority directly. |
| Application/workflow state | Effect Model and explicit transitions | Use for multi-step coordination, pending commands, retries, reconciliation, and lifecycle state. |
| Remote server state | TanStack Solid Query | Own cache, invalidation, refresh, and server snapshots; do not mirror query data into unrelated stores. |
| Presentation state | Solid signals, memos, stores, and context | Keep ephemeral mechanics local: focus, hover, popovers, tabs, column layout, drag state, and virtualization. |
| Shareable navigation state | Router plus Effect Schema | Keep URL filters and navigation inputs typed, validated, and independent of domain implementations. |

Not every signal is an application Message, and not every application Message
belongs in a global Model. Local presentation state is intentionally allowed
and must not be forced through a Model-to-Message transition merely for
architectural uniformity.

Foldkit is an architectural reference only. RITSEI does not add Foldkit as a
dependency or couple public application contracts to its renderer, VDOM, runtime,
or release cadence. A complete frontend runtime replacement requires measured
benefit, compatibility with SolidJS and Effect v4, a migration path, and a new
ADR.

## Compiler and Rendering Boundary

Solid does use a JSX compiler or transform. RITSEI must not say that Solid
needs no compiler. The precise boundary is:

```text
Effect application model
        |
        v
Solid reactive projection
        |
        v
Solid JSX/compiler lowering
        |
        v
DOM
```

The Solid compiler lowers JSX/templates, static nodes, and dynamic bindings.
Solid's reactive primitives and observers provide the presentation dependency
graph. Neither the generated DOM code nor compiler optimization defines domain
state, authorization, transaction semantics, Effect services, or public schemas.

RITSEI is therefore **compiler-neutral at the application-architecture level**,
not compiler-free at the rendering level. Compiler configuration stays inside
`apps/web`; public contracts and Effect application transitions must not depend
on generated output or a particular compiler pass. Supported Vite/compiler
changes are validated as frontend build changes, including behavior,
accessibility, bundle output, and measured performance.

Solid 2.0 remains a pre-release dependency as of August 23, 2026. Its release
risk is contained by keeping the Effect application model and backend contracts
independent of the renderer and compiler. See [`ADR-0049`](../decisions/0049-keep-solid-compiler-at-rendering-boundary.md)
for the decision record.

## Why an SPA Fits RITSEI

RITSEI is an authenticated, long-lived, interaction-heavy application.

Its primary screens include:

```text
/accounting/journals
/inventory/stock-movements
/sales/invoices
/procurement/purchase-orders
/settings/users
```

These screens depend more on:

- persistent application state;
- complex forms;
- tables and virtualization;
- permission-aware actions;
- URL-driven filters;
- interactive dashboards;
- a separate transactional backend;

than on SEO or public first-page rendering.

The browser therefore behaves more like an application shell than a public
content website.

```text
Browser
  |
  |-- application shell
  |-- router and URL state
  |-- server-state cache
  |-- table and virtualization state
  |-- form state
  `-- session state
  |
  v
RITSEI Backend API
  |
  v
PostgreSQL
```

## Stack

| Concern | Decision |
|---|---|
| Renderer / presentation runtime | SolidJS 2.0 |
| Application runtime | Effect-based typed transitions and effects |
| Compiler boundary | Solid JSX/compiler transform inside `apps/web` |
| Build tool | Vite |
| Application shape | Client-side SPA |
| Router | Solid Router by default, or TanStack Solid Router behind an adapter |
| Server state | TanStack Solid Query |
| Tables | TanStack Solid Table |
| Virtualization | TanStack Solid Virtual |
| Forms | TanStack Solid Form |
| Runtime validation | Effect Schema |
| Design system | RITSEI Product Patterns, Interaction Grammar, and Visual Grammar |
| Accessible UI primitives | Ark UI behind RITSEI-owned components |
| Styling foundation | Constrained Panda CSS profile |
| Backend | Separate Effect-on-Deno API |
| Transactional database | PostgreSQL |

The frontend must not introduce its own business backend through route loaders,
server functions, or hidden server handlers.

## Deployment Boundary

The frontend is a separate application:

```text
apps/web/
```

It communicates with the backend through an explicit public transport contract,
such as HTTPS with JSON or another approved RPC encoding.

```text
SolidJS ERP SPA
  |
  | HTTPS / JSON / approved RPC
  v
RITSEI API
  |
  | authentication
  | authorization
  | accounting
  | inventory
  | procurement
  | sales
  | transactions
  | audit
  | idempotency
  v
PostgreSQL
```

The browser must not connect directly to PostgreSQL, PgQue, internal workers, or
private backend module endpoints.

## Dependency Direction

Allowed:

```text
apps/web
  -> shared public contracts
  -> frontend feature packages
  -> frontend infrastructure
  -> public backend API
```

Forbidden:

```text
apps/web
  -X-> backend repositories
  -X-> Drizzle table definitions
  -X-> PostgreSQL transaction services
  -X-> backend-only Effect Layers
  -X-> internal worker or relay code
```

Shared public contracts must remain independent of SolidJS, Drizzle, and backend
implementation details.

## Router Decision

### Default: Solid Router

Prefer Solid Router when the application benefits from:

- the most direct Solid integration;
- standard web primitives such as links and forms;
- a smaller framework-specific surface;
- alignment with SolidJS core primitives;
- optional future server capabilities without making them foundational.

### Alternative: TanStack Solid Router

TanStack Solid Router may be selected when typed URL state is a dominant
requirement, especially for screens with complex filtering and navigation.

Example:

```text
/invoices
  ?companyId=12
  &branchId=8
  &status=OVERDUE
  &dateFrom=2026-01-01
  &dateTo=2026-07-31
  &sort=dueDate.desc
  &page=4
```

If TanStack Solid Router is used, domain and query code must not depend directly
on router-specific types throughout the codebase.

## Router Abstraction

Feature modules own typed search models independently from the router.

```ts
export type InvoiceListSearch = {
  readonly companyId?: string
  readonly branchId?: string
  readonly status?: "DRAFT" | "POSTED" | "PAID" | "OVERDUE"
  readonly dateFrom?: string
  readonly dateTo?: string
  readonly sort?: string
  readonly page: number
  readonly pageSize: number
}
```

Search input must be decoded through a schema before it reaches feature queries.

The route layer should only:

```text
parse route and search input
-> invoke feature query or command
-> render feature UI
```

It must not own:

```text
business validation
authorization policy
query construction details
mutation semantics
accounting rules
inventory invariants
```

## Server-State Ownership

SolidJS 2.0 owns reactive async composition and pending presentation. TanStack
Solid Query owns cache policy for remote server state when the application needs
shared snapshots, staleness, invalidation, refetch, pagination, or cross-screen
reuse. Query is a server-cache protocol, not the domain model and not a
requirement for every asynchronous read.

Use Solid async composition for simple route or component-local reads when no
shared cache policy is needed. Use TanStack Solid Query for cache-worthy ERP
state such as master-data lookups, large filtered collections, aggregates,
shared detail views, and mutations that must invalidate several query identities.

An Effect application Model may coordinate a command's lifecycle, but it must
not become a second cache or mirror of query data.

TanStack Solid Query may own:

- cache identity and lifetime;
- invalidation and background refresh;
- stale/fresh policy;
- paginated or infinite server collections;
- safe optimistic coordination;
- mutation lifecycle and dependent-query refresh.

Do not copy query results into unrelated signals, global stores, or a client
collection merely to make them reactive. Authoritative business state and
business decisions remain in the backend domain or approved financial ledger.

A feature should expose reusable query options rather than constructing ad hoc
request behavior inside route components. Query keys must be deterministic,
tenant-aware where required, scope-aware where required, and based on validated
input.

```ts
export const invoiceQueries = {
  list: (input: InvoiceListInput) => ({
    queryKey: ["invoices", input] as const,
    queryFn: () => invoiceApi.list(input),
  }),

  detail: (invoiceId: string) => ({
    queryKey: ["invoices", invoiceId] as const,
    queryFn: () => invoiceApi.getById(invoiceId),
  }),
}
```

Query keys must be:

- deterministic;
- tenant-aware where required;
- scope-aware where required;
- based on validated input;
- stable across components.

## Local Reactive State

Use Solid primitives according to ownership. These are presentation primitives,
not substitutes for the application transition model:

- signals for small local mutable state;
- memos for derived state;
- stores for structured local state that benefits from granular updates;
- context for stable dependency distribution;
- TanStack Query for remote server state;
- URL search parameters for shareable list and filter state.

Context must not become a global mutable service locator.

## Table Architecture

TanStack Solid Table is the headless table model for RITSEI. It owns table
behavior, not domain policy. RITSEI should expose an owned table boundary such
as `RitseiTable` so feature code declares columns, capabilities, and semantic
formatting without importing vendor APIs into domain or projection contracts.

Table definitions may contain:

- column descriptions;
- display formatting;
- sorting metadata;
- filtering metadata;
- row selection behavior;
- presentation actions.

They must not contain:

- permission decisions that are not enforced by the backend;
- accounting calculations;
- inventory mutations;
- raw API calls hidden in cell renderers;
- direct persistence-model dependencies.

For large datasets, use server-side pagination, filtering, and sorting.
Client-side processing is limited to bounded datasets.

## Virtualization

Use TanStack Solid Virtual when row or column rendering becomes expensive or a
large tree/list would otherwise create excessive DOM. It is a rendering-window
primitive, not a replacement for server-side filtering, sorting, pagination, or
cursor loading. The client must not download an unbounded dataset merely to
virtualize its DOM.

The preferred large-collection shape is:

```text
server-side filter/sort/cursor pagination
        -> query cache or bounded client window
        -> table/list model
        -> virtualized DOM
```

Virtualization must preserve:

- keyboard navigation;
- focus behavior;
- accessible labels;
- selection state;
- stable row identity;
- scroll restoration where required.

Do not virtualize small tables without measurement.

## Forms

TanStack Solid Form is the current default form engine for ERP interaction,
behind RITSEI-owned form and field contracts such as `RitseiForm`, `MoneyField`,
`QuantityField`, `PartyField`, and `LineArray`. It manages client form state,
validation timing, async feedback, nested values, arrays, composition, and
submission interaction; it does not own business invariants.

Effect Schema remains the contract and decoding boundary. The cross-layer schema
policy is owned by [`ADR-0024`](../decisions/0024-adopt-effect-schema-as-canonical-contract-schema.md):
shared API, route, plugin, Process Studio, and normalized integration contracts
must not be duplicated with a second canonical validator. Effect v4 schemas may
be adapted to Standard Schema with `Schema.toStandardSchemaV1`.

A form layer may provide:

- field state;
- touched and dirty tracking;
- client-side feedback;
- submission coordination;
- mapping of typed backend failures.

The backend remains authoritative for:

- business validation;
- authorization;
- uniqueness;
- concurrency;
- transaction invariants.

Client validation improves feedback but never replaces server validation.

Formisch is not the core form engine at this stage. Its schema-first model is a
valid future alternative, but adoption requires demonstrated SolidJS 2
compatibility, integration with the repository's Effect Schema boundary, and a
migration path that does not leak engine APIs into RITSEI fields. Keep that
comparison behind the RITSEI form boundary rather than binding feature code to
one implementation.

## Optional TanStack Modules

The TanStack family is selected by problem, not adopted as a complete platform:

| Module | RITSEI status | Boundary |
|---|---|---|
| Solid Query | Selective core | Remote cache policy; never domain authority |
| Solid Table | Core | Headless collection behavior behind RITSEI table contracts |
| Solid Virtual | Core infrastructure | Measured rendering optimization; not server pagination |
| Solid Form | Current default | ERP form interaction behind RITSEI field contracts |
| Solid Pacer | Optional utility | Debounce, throttle, queue, or batch interaction work |
| Solid DB | R&D only | Client projection/optimistic layer; never production authority |
| Solid Devtools | Development only | Diagnostics; no application contract |
| Solid Store | Not default | Solid signals/stores remain the local-state choice |
| Solid Router | Optional | Evaluate only when typed URL requirements justify it |
| TanStack Start | Not selected | No change to the separate Vite SPA/backend boundary |
| Ranger | Feature-specific | Add only for a proven range-control need |

Pacer may reduce request and interaction noise, but it must not implement
business retry, idempotency, authorization, or transaction policy. A future
client collection layer may sit above Query for normalized read projections, but
it remains rebuildable and subordinate to backend authority.

## Contract Validation

All data entering the frontend from an API, browser storage, plugin boundary,
file import, or third-party integration is untrusted.

Use shared Effect Schema contracts to:

- decode request and response payloads;
- reject invalid data;
- version public contracts;
- preserve tagged business failures;
- normalize transport-specific representations;
- decode typed route search input.

Frontend code must not reuse backend implementation types when a public contract
should exist.

## Feature Structure

Organize the frontend by business capability rather than generic technical type.

```text
apps/web/src/
├── app/
│   ├── providers/
│   ├── router/
│   └── shell/
├── routes/
├── features/
│   ├── accounting/
│   │   ├── api/
│   │   ├── contracts/
│   │   ├── forms/
│   │   ├── queries/
│   │   ├── tables/
│   │   └── ui/
│   ├── inventory/
│   ├── procurement/
│   ├── sales/
│   └── authorization/
└── shared/
    ├── contracts/
    ├── infrastructure/
    ├── routing/
    └── ui/
```

Avoid global directories where unrelated behavior accumulates inside generic
hooks, services, stores, or utility files.

## Domain Logic

Presentation components may:

- render state;
- collect user input;
- invoke feature-level commands;
- display typed failures;
- coordinate view behavior.

Presentation components must not own:

- authoritative domain status transitions or domain events;
- accounting policy;
- authorization policy;
- transaction semantics;
- inventory invariants;
- pricing policy;
- workflow durability;
- idempotency rules.

These belong to the backend domain or explicit shared contracts.

## Process Studio UI

The planned Process Designer, Process Monitor, and Task Inbox are frontend
features over public Process Studio contracts. The designer serializes the
canonical RITSEI Process IR, discovers actions and events from typed catalogs,
and renders static validation results from the backend contract. It must not
hard-code domain capabilities or execute process semantics in the browser.

Drag-and-drop is an enhancement, not the only interaction model. The Solid dnd-kit adapter may
implement bounded pointer, touch, and keyboard interaction behind the RITSEI interaction layer, but
it must not become Process IR or business semantics. Every modeling action requires an accessible
keyboard and structured-form alternative. Detailed process semantics, governance, catalogs,
compensation, and roadmap are owned by [`process-studio.md`](./process-studio.md).

## Authorization UX

The frontend may hide or disable controls based on a backend-provided permission matrix or capability
summary. This is UX only. The backend repeats current tenant, capability, scope, object relationship,
domain-policy, and Separation-of-Duties checks for every protected command and query.

The UI must not treat identity-provider organization/group claims, cached permissions, route guards,
hidden controls, or disabled buttons as security boundaries. Tenant switching invalidates tenant-scoped
server-state caches and must not reuse authorization results across tenants.

When a denial is safe to disclose, the UI may present the typed explanation returned by the backend,
for example an approval-limit or Separation-of-Duties reason. It must not display raw provider tuples,
policy expressions, credentials, SQL, or sensitive object-existence signals.

## Error Model

The UI must distinguish:

```text
validation failure
authentication failure (401)
authorization denial (403)
safe not-found (404)
business conflict
concurrency conflict
network or transport failure
unexpected defect
```

Do not reduce all failures to a generic toast. A stale, unavailable, or unknown relationship decision
is not an allow result; the UI should show a retry/unavailable state rather than inventing permission.

Feature modules should map public tagged errors to specific recovery actions and user-facing messages.

## SolidStart Exception Gate

SolidStart may be adopted only if several of these requirements become central:

- frontend and backend move into one runtime and deployment unit;
- frontend-owned server sessions are required;
- a BFF becomes a primary boundary;
- SSR materially benefits authenticated workflows;
- server functions become a primary application interface;
- server-side file handling or report generation belongs to the frontend app;
- the team explicitly chooses convention over a manually assembled Vite stack.

Even then, backend domain ownership must remain separate from UI routing.

SolidStart is a packaging and integration choice, not the owner of ERP business
logic.

## SSR Policy

SSR is not required by default.

A proposal to add SSR must identify:

- the route or workflow;
- the measurable user benefit;
- authentication and cache behavior;
- deployment cost;
- operational ownership;
- why client rendering is insufficient.

Do not enable SSR globally for speculative performance or SEO benefits that do
not apply to authenticated ERP screens.

## Accessibility

Core workflows must support:

- semantic HTML;
- keyboard navigation;
- visible focus;
- meaningful labels;
- accessible validation feedback;
- reduced-motion preferences where relevant;
- screen-reader-compatible tables and forms.

Ark UI provides headless accessible behavior behind RITSEI-owned components, but feature
composition must still be tested.

## Performance

Optimize from measurements.

Prioritize:

1. stable query keys and bounded cache policy;
2. server-side filtering and pagination;
3. SolidJS fine-grained reactivity;
4. memoized derived state;
5. table virtualization when measured;
6. code splitting by route or feature;
7. payload and contract-size control.

Do not introduce broad global stores, speculative prefetching, or duplicated
client projections without evidence.

## Testing

Frontend changes should use the smallest useful combination of:

- unit tests for pure transformations;
- schema tests for route and API decoding;
- component tests for interaction;
- query tests for cache and invalidation behavior;
- accessibility tests;
- integration tests for feature flows;
- end-to-end tests for critical ERP workflows.

Tests should assert user-visible behavior and public contracts rather than
internal signal or memo implementation details.

## Completion Criteria

The frontend architecture is correctly implemented when:

- `apps/web/` builds as a Vite-based SolidJS 2.0 SPA;
- shared UI uses RITSEI Product Patterns and semantic contracts;
- vendor primitives and styling engines remain behind the internal UI layer;
- the backend remains separately deployable;
- no frontend code imports backend internals;
- remote state uses TanStack Solid Query;
- complex table and form behavior uses explicit feature abstractions;
- route search input is typed and validated;
- router-specific types do not leak into domain contracts;
- authorization remains enforced by the backend;
- complex workflow coordination uses explicit Effect transitions where needed;
- presentation-only state remains local to Solid primitives;
- SolidStart and SSR are absent unless an approved requirement activates them.
