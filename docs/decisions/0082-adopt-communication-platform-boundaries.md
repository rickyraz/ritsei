# ADR-0082: Adopt SAP-Separated Communication Platform Boundaries

- Status: Accepted
- Date: 2026-09-06
- Amends: ADR-0015, ADR-0037, ADR-0038 only by clarifying projection and communication boundaries
- Compatible with: ADR-0034, ADR-0036, ADR-0046, ADR-0051, ADR-0068
- Supersedes: None
- Superseded by: None

> **Related documents**
>
> - ADR index: [`./README.md`](./README.md)
> - Communication architecture: [`../architecture/communication.md`](../architecture/communication.md)
> - Messaging and transactional outbox: [`../architecture/pgque-messaging.md`](../architecture/pgque-messaging.md)
> - P3 audit and delivery boundary:
>   [`./0037-define-p3-audit-event-and-delivery-boundary.md`](./0037-define-p3-audit-event-and-delivery-boundary.md)
> - Internal messaging ownership:
>   [`./0038-move-internal-event-delivery-to-messaging.md`](./0038-move-internal-event-delivery-to-messaging.md)
> - One semantic owner per invariant: [`./0015-one-semantic-owner-per-invariant.md`](./0015-one-semantic-owner-per-invariant.md)
> - Document rendering: [`../architecture/document-rendering.md`](../architecture/document-rendering.md)

## Context

RITSEI needs transactional email and future SMS, push, WhatsApp, and in-app communication without
making every business domain know about providers. It also needs an Odoo-like Activity Timeline that
is useful to users without turning the backend into a single `chatter_messages` table.

A single communication table would mix business notes, audit evidence, attachments, workflow tasks,
document artifacts, provider attempts, and domain events. Those records have different owners,
retention, authorization, correction, and consistency rules. A direct domain-to-SMTP call would also
break the existing transactional outbox and provider boundary.

## Decision

RITSEI adopts a **Communication Platform** with provider-independent, intent-driven contracts.

Business domains emit business facts; they do not depend on communication channels, templates,
recipients, transports, or providers. Application-level communication policies may derive
`CommunicationIntent` from those facts, while explicit user or process requests may create intents
directly. The platform resolves semantic recipients, builds a versioned tenant-scoped context,
selects an immutable template version, produces a channel message model, renders an immutable
communication artifact, and records delivery attempts through a transport port.

The initial public contracts live in `foundation/communication`. A memory-only Procurement
purchase-order confirmation policy/delivery slice lives in `modules/communication` to prove the
boundary. This slice intentionally adds no persistence, provider dependency, worker, HTTP route,
campaign capability, or production activation.

### Separate backend capabilities

The following remain separate semantic records and owners:

```text
AuditEvent
Communication
DeliveryAttempt
WorkflowRun
Activity / Timeline projection
Note
Attachment
DocumentArtifact
Domain Event
```

The Activity Timeline is a federated, rebuildable read projection over those records. It is not an
audit authority, communication queue, workflow engine, document store, or business source of truth.

```text
Domain Events ────────┐
Audit Events ─────────┤
Notes / Attachments ──┤
Workflow Runs ────────┤
Document Artifacts ───┼──→ Activity Timeline projection
Communications ───────┤
Delivery Attempts ────┘
```

### Communication lifecycle

```text
Domain business fact or explicit application/process request
        ↓
Transactional outbox / command boundary
        ↓
Communication policy
        ↓
CommunicationIntent
        ↓
Recipient + policy resolution
        ↓
Versioned context + template
        ↓
Message AST / channel model
        ↓
Immutable communication artifact
        ↓
DeliveryAttempt
        ↓
EmailTransport / other channel adapter
        ↓
Provider event normalization
```

A logical `Communication` is separate from its `DeliveryAttempt` records. Retrying a provider call
creates another attempt for the same logical communication and reuses the stored artifact by default.
The platform records `ACCEPTED`, `DELIVERED`, `BOUNCED`, `REJECTED`, and `COMPLAINED` as distinct
canonical outcomes, while `UNKNOWN` belongs only to a `DeliveryAttempt`. An unknown attempt moves the
logical communication into `reconciling` or keeps it operationally pending until a canonical provider
event or explicit manual recovery resolves the uncertainty. The platform does not claim exactly-once
external delivery.

### Intent and recipient boundary

`CommunicationIntent` carries tenant scope, semantic subject, source event identity, semantic
audience, requested channels, priority, locale/timezone hints, correlation, and an idempotency key.
It does not carry provider identifiers, raw SMTP configuration, HTML, or arbitrary recipient data.

Recipient resolution is semantic and versioned. A `RecipientSnapshot` stores both the intended
audience and the actual addresses used for a historical communication. Contact changes therefore do
not rewrite delivery history.

### Context and template boundary

Templates receive only a validated, tenant-scoped, versioned `CommunicationContext`. Context builders
must not expose databases, repositories, secrets, filesystem/network capabilities, internal domain
objects, or arbitrary JavaScript.

Every rendered communication records:

```text
template_id
template_version
context_type
context_version
locale
renderer_version
content_hashes
```

Template edits create immutable versions. A template declares semantic capabilities; it never names
SMTP, SES, a provider, or a renderer implementation.

### Message model and artifact boundary

Message Model / Message AST is canonical within each channel. Shared contracts stop at intent,
context, recipient snapshot, artifact, and delivery attempt; email, SMS, push, and WhatsApp keep
separate message models. RITSEI deliberately does not define a universal `MessageAST`. For email,
the bounded `EmailMessageNode` model renders to HTML and plain text. Raw HTML is an explicit
compatibility escape hatch, not the default tenant authoring model, and arbitrary
scripts/network/filesystem/process access remain forbidden.

A `CommunicationArtifact` is immutable and contains rendered content hashes, template/context
versions, renderer version, and attachment references. Attachments reference existing immutable
Document Platform artifacts; the communication pipeline does not re-render an invoice, order, or
other document merely to send it.

### Transport boundary

`PreparedEmail` crosses `EmailTransport`. SMTP, SES, and other provider adapters remain below that
port. Credentials, provider message IDs, quotas, retry responses, and transport protocol details do
not enter business-domain contracts or template contexts.

Provider webhook handling retains opaque raw provider evidence behind the integration boundary:

```text
Provider Webhook → raw evidence → signature verification → canonical delivery event
```

Raw evidence is owner-local, access-controlled, retention-limited, and optionally referenced by a
communication attempt. Upstream contracts receive canonical delivery events, not raw provider
semantics.

Transactional communication is separate from marketing campaigns. Campaign consent, segmentation,
suppression, scheduling, and analytics must not be added to the transactional lifecycle by analogy.

## Alternatives considered

### One universal `chatter_messages` table

Rejected. It would make a UI projection the source of truth for unrelated invariants and couple
retention, authorization, correction, and indexing behavior across audit, notes, documents,
workflow, attachments, and delivery.

### Direct domain-to-provider calls

Rejected. They bypass the transactional outbox, make provider failures part of domain behavior, and
make retries and unknown outcomes inconsistent across domains.

### Email-only domain contracts

Rejected. `CommunicationIntent`, semantic audiences, versioned contexts, and delivery lifecycle are
shared primitives for future channels. Email-specific AST and transport types remain channel-local.

### Store only a rendered HTML blob

Rejected. HTML alone loses the canonical message model, plain-text output, versioned context/template
identity, and controlled renderer replacement boundary.

### Re-render on every retry

Rejected. It can change content after the business event, break audit reproducibility, and create
avoidable load. Retries use the immutable communication artifact unless an explicit new communication
is requested.

### Use the timeline as the execution queue

Rejected. A timeline is a read projection. Queueing, leasing, idempotency, fencing, and provider
attempts belong to Messaging, Jobs, and the Communication delivery boundary.

## Consequences

### Positive

- Business domains stay provider-independent and retain their own semantic authority.
- Email, future channels, template history, recipient snapshots, and delivery attempts are auditable.
- Render-once/send-many behavior avoids content drift and repeated document rendering.
- The Activity Timeline can provide Odoo-like UX without a universal mutable table.
- Existing Messaging, Document Rendering, Jobs, Integrations, and Process boundaries remain usable.
- Provider replacement does not change domain events or template context contracts.

### Negative

- The platform must maintain versioned context/template/message contracts and conformance tests.
- Recipient resolution, suppression, localization, webhook normalization, and retention require
  explicit policy rather than provider defaults.
- A projection must be rebuilt and authorized independently from source records.
- External delivery remains at-least-once/unknown-outcome work and needs operational reconciliation.

## Activation gates

This ADR establishes the architecture, not production delivery. Before durable communication delivery
is activated, the implementation must demonstrate:

1. A reviewed owner-local persistence boundary for intents, communications, artifacts, and attempts.
2. Transactional outbox integration with `modules/messaging` and bounded job execution.
3. Tenant isolation for templates, contexts, sender identities, artifacts, and attempts.
4. Idempotency, retry, fencing, timeout, rate-limit, unknown-outcome reconciliation, and
   manual-recovery tests.
5. Versioned recipient snapshots and suppression/consent policy appropriate to each channel.
6. Message AST conformance for HTML/plain text, accessibility, localization, and unsafe-link rejection.
7. Provider webhook signature verification, opaque raw-evidence retention, canonical event
   normalization, and reconciliation without exposing raw provider payloads upstream.
8. Artifact retention, audit linkage, attachment authorization, and Activity Timeline rebuild evidence.
9. Separate workload budgets from HTTP, document rendering, Process Runtime, and campaign work.
10. Security, licensing, provider failover, operational ownership, and cost review before production.

Until those gates pass, the repository keeps the contract-only implementation and does not promise
production email delivery.
