# Process Pack Library Positioning

> **Status:** Reference
>
> **Owns:** Comparative product analysis and the non-binding product thesis for
> RITSEI's Process Pack Library.
>
> **Must not own:** Process IR semantics, capability authority, authorization,
> release rules, runtime behavior, or domain invariants. Those remain owned by
> the Process Studio architecture, the owning domains, and accepted ADRs.
>
> **Snapshot date:** August 30, 2026
>
> **Related documents**
>
> - Product vision: [`../../product/vision.md`](../../product/vision.md)
> - Process Studio architecture: [`../process-studio.md`](../process-studio.md)
> - Process Pack Library roadmap: [`../../roadmap/process-pack-library.md`](../../roadmap/process-pack-library.md)
> - Process Studio roadmap: [`../../roadmap/process-studio.md`](../../roadmap/process-studio.md)
> - Governed AI boundary:
>   [`../../decisions/0063-define-governed-ai-recommendation-and-agent-boundary.md`](../../decisions/0063-define-governed-ai-recommendation-and-agent-boundary.md)

## Purpose

RITSEI should not compete with mature ERP platforms by promising the largest template
catalog first. The stronger thesis is to distribute business knowledge as **governed
Process Packs**: portable, inspectable, typed, versioned references that resolve against
RITSEI's public capability catalog and produce editable `DRAFT` processes.

This is a strategic comparison, not an independent product benchmark. The maturity
ratings below are directional shorthand for product positioning. They are not claims
that RITSEI currently matches the listed platforms.

## Executive position

The competitive pattern is approximately:

```text
Odoo
  model + configuration + automation
  -> application behavior

Kingdee-style enterprise platform
  dynamic domain model + process + low-code/AI
  -> composable enterprise platform

RITSEI target
  Process Pack
  -> resolve PUBLIC typed catalog
  -> parameterize
  -> editable DRAFT Process IR
  -> static validation and governance
  -> immutable released process
  -> deterministic runtime
  -> authorized domain commands
```

The distinction is not “RITSEI has a Process Studio and templates.” Several ERP
platforms already provide visual customization, workflow composition, process content,
or AI-assisted automation. The distinction is what a template means and what it is
allowed to do.

## Directional comparison

| Dimension | SAP | Odoo | ERPNext | ERP China, especially Kingdee | RITSEI target |
|---|---|---|---|---|---|
| Ready to use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ now |
| Template/process knowledge | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | target ⭐⭐⭐⭐⭐ |
| Easy customization | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | target ⭐⭐⭐⭐⭐ |
| Typed business capabilities | proprietary/deep | model/action-centric | DocType/workflow-centric | metadata/domain-model driven | native architectural primitive |
| Deterministic Process IR | different architecture | not the RITSEI thesis | not the RITSEI thesis | process platform of its own | core |
| Template to governed runtime | strong, with a large ecosystem | flexible application automation | simple workflow attachment | very strong platform composition | core thesis |
| AI authority boundary | enterprise governance | more automation-oriented | not the primary thesis | highly agentic direction | deliberately strict |
| Open/inspectable architecture | relatively low | high in Community | high | relatively low | very high |

The table is useful only if the two RITSEI columns stay separate: the current
product is early, while the target is a product direction that still requires
runtime, catalog, domain-maturity, authorization, and operational evidence.

## What RITSEI should learn from each benchmark

### Odoo and ERPNext: win the first-use experience

Odoo Studio demonstrates the time-to-value advantage of visual customization:
users can work with models, views, automation, webhooks, approvals, security,
and predefined actions without starting from a blank codebase. ERPNext's workflow
model is simpler but similarly effective for immediate value: a workflow attaches
states, transitions, conditions, and approvals to a DocType.

The lesson is not to copy their persistence model or permit arbitrary process code.
The lesson is that a blank Process Studio is a product failure even when its
architecture is sophisticated.

RITSEI must therefore provide:

- a business-profile entry point;
- curated starter packs;
- useful defaults and forms;
- clear missing-capability diagnostics;
- editable drafts instead of immutable black boxes; and
- a short path from selection to a validated first process.

### SAP: do not compete on accumulated content volume

SAP's process depth and ecosystem content reflect a long enterprise history.
Signavio's BPMN-oriented process modeling is a useful benchmark for process
interoperability and organizational depth.

RITSEI should not try to beat SAP by claiming more process content at the start.
The opportunity is to make selected business knowledge more portable, inspectable,
typed, versioned, and replaceable than an opaque configuration artifact.

### Kingdee: the closest strategic benchmark

Kingdee is the closest comparison for the combination of dynamic domain modeling,
composable low-code process services, reusable business models/templates, and an
AI/agent platform. Therefore, “Process Studio plus templates plus AI” is not a
sufficient moat.

RITSEI's answer must be the boundary underneath the experience:

- packs reference public capabilities rather than private implementation;
- templates compile to a deterministic Process IR;
- domain packages retain invariants, authorization, transactions, and facts;
- AI remains advisory and cannot approve, grant capabilities, or mutate facts; and
- released processes are immutable, version-pinned, recoverable, and observable.

Vendor materials are useful competitive signals, but their feature counts and
marketing claims are not RITSEI acceptance criteria.

## The product thesis: Template Library becomes Business Pack Library

A template is too small a unit for the intended experience. A **Business Pack**
is a governed distribution unit for a way of operating a business.

```text
Distribution Business Pack
│
├── Processes
│   ├── Order-to-Cash
│   ├── Procure-to-Pay
│   ├── Return-to-Refund
│   └── Replenishment
│
├── Decisions
│   ├── Credit Policy
│   └── Approval Matrix
│
├── Capability Requirements
│
├── Configuration Schema
│
├── Recommended Projections and KPIs
│
├── Compatibility Range
│
└── Upgrade and Migration Rules
```

A pack may reference these assets, but it does not contain domain tables,
repositories, SQL, private service bindings, arbitrary scripts, or capability
grants. Its process references resolve to ordinary editable drafts, not to an
independent business model.

The current Process Pack contract resolves exact `(kind, id, version)` capability
references. Future catalog-backed compatibility may add explicit compatibility
ranges at the installation and release boundary; it must not weaken exact
runtime version pinning.

## Target user experience

The experience should be as approachable as low-code ERP products while keeping
RITSEI's stronger execution boundary:

```text
Install RITSEI
      ↓
Choose a business profile
      ↓
See recommended Business Packs
      ↓
Resolve required PUBLIC capabilities
      ↓
Show what is ready and what is missing
      ↓
Create editable DRAFT processes
      ↓
Human or advisory AI customization
      ↓
Compile and statically validate
      ↓
Review and authorize
      ↓
Release and deploy
      ↓
Run through deterministic runtime and domain commands
```

“85% ready” is a useful product hypothesis, not a promise. It should become a
measured outcome only after the first vertical slice can report setup time,
missing requirements, validation failures, and time to first approved release.

## Guardrails that make the thesis real

1. **Pack is not authority.** Selecting or installing a pack never grants a
   capability, bypasses tenant scope, satisfies Separation of Duties, approves a
   process, releases a definition, or executes a command.
2. **Pack is not a super-domain.** The owning domain keeps facts, invariants,
   authorization, transactions, events, and business failures.
3. **Pack is not executable source code.** No arbitrary JavaScript, SQL, prompts,
   private repositories, provider credentials, or hidden implementation imports.
4. **Draft remains draft.** Pack and AI provenance stays outside serialized Process
   IR and cannot elevate authorization.
5. **Versioning is explicit.** Pack versions, capability versions, Process IR
   versions, and released definition versions are distinct and pinned.
6. **Upgrade is a governed operation.** A new pack version produces a reviewable
   change or migration proposal; it does not rewrite running processes silently.
7. **Content follows maturity.** A domain capability cannot be advertised in a
   production pack before it passes its public-contract, authorization,
   idempotency, recovery, and operational gates.

## Product non-goals

The first library should not attempt to become:

- a marketplace of arbitrary plugins;
- a global Business Semantic Layer that owns domain meaning;
- a BPMN-only runtime detached from RITSEI contracts;
- an AI agent marketplace with model-controlled execution;
- a collection of hundreds of unverified JSON templates; or
- an automatic approval, release, deployment, or migration engine.

Those directions increase surface area before the basic pack-to-draft loop is
proven.

## Strategic success condition

The thesis is successful only if a user receives the usability benefit of
“install, choose how the business works, customize, and run” without paying an
architecture tax in correctness:

```text
SAP depth        + Odoo usability        + Kingdee composability/AI ambition
                         ↓
              RITSEI deterministic governance
```

Architecture is not itself a moat. The moat exists only if the pack experience
reduces time-to-value while preserving typed contracts, authorization, audit,
recovery, version compatibility, and deterministic execution.

## Sources and comparison hygiene

The following official vendor pages are the source references for this directional
snapshot. Re-check them before making time-sensitive product claims:

1. [Odoo Studio documentation](https://www.odoo.com/documentation/19.0/applications/studio.html)
2. [ERPNext Workflows documentation](https://docs.frappe.io/erpnext/workflows)
3. [SAP Signavio BPMN documentation](https://help.sap.com/docs/signavio-process-modeler/user-guide/bpmn)
4. [Kingdee Cosmic Process Service](https://www.kingdee.com/products/cosmic_process_service.html)
5. [Kingdee Cosmic AI/Agent Platform](https://www.kingdee.com/products/cosmic_ai_services.html)

This document does not convert vendor marketing language into architectural
requirements. RITSEI's binding rules remain in the canonical architecture,
accepted ADRs, and domain contracts.
