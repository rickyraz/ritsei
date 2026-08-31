import { requiredFinancialGateIds } from "../financial-readiness/evaluate.ts"

export type GateKind = "markers" | "domain" | "financial" | "composite"

export type GateRequirement = {
  readonly path: string
  readonly markers?: readonly string[]
}

export type GateCommand = {
  readonly args: readonly string[]
}

export type Gate = {
  readonly id: string
  readonly title: string
  readonly source: string
  readonly kind: GateKind
  readonly requirements?: readonly GateRequirement[]
  readonly commands?: readonly GateCommand[]
  readonly domain?: string
  readonly financialId?: string
  readonly dependencies?: readonly string[]
}

export type RoadmapTrack = {
  readonly id: string
  readonly title: string
  readonly path: string
  readonly gateIds: readonly string[]
}

const marker = (path: string, ...markers: string[]): GateRequirement => ({ path, markers })
const file = (path: string): GateRequirement => ({ path })
const task = (...args: string[]): GateCommand => ({ args: ["task", ...args] })

export const financialGateIds = requiredFinancialGateIds

export const gates: readonly Gate[] = [
  {
    id: "erp.p0",
    title: "P0 scope and identity baseline",
    source: "docs/roadmap/erp-primitives.md",
    kind: "markers",
    commands: [
      task(
        "test",
        "packages/identity/tests/identity.test.ts",
        "packages/party/tests/party.test.ts",
      ),
    ],
    requirements: [
      marker(
        "docs/roadmap/erp-primitives.md",
        "**P0 baseline status: `READY`.",
        "All P0-01 through P0-10 tasks have public contracts and executable",
        "proof.",
        "P0-10",
      ),
      file("docs/decisions/0021-define-p0-scope-and-identity-model.md"),
      file("packages/identity/tests/identity.test.ts"),
      file("packages/party/tests/party.test.ts"),
    ],
  },
  {
    id: "erp.p1",
    title: "P1 product, quantity, and location baseline",
    source: "docs/roadmap/erp-primitives.md",
    kind: "markers",
    commands: [task("test", "packages/inventory/tests/inventory.test.ts")],
    requirements: [
      marker(
        "docs/roadmap/erp-primitives.md",
        "### P1 — Product, Quantity, and Location",
        "The baseline is decided by",
        "quantity inputs and outputs have typed units",
      ),
      file("docs/decisions/0035-define-p1-inventory-primitives.md"),
      marker("packages/inventory/tests/inventory.test.ts", "adjustStock", "reserveStock"),
    ],
  },
  {
    id: "erp.p2",
    title: "P2 documents and financial semantics baseline",
    source: "docs/roadmap/erp-primitives.md",
    kind: "markers",
    commands: [task("test", "packages/accounting/tests/accounting.test.ts")],
    requirements: [
      marker(
        "docs/roadmap/erp-primitives.md",
        "### P2 — Documents and Financial Semantics",
        "The baseline is decided by",
        "document transitions have preconditions, effects, authorization, and retry behavior",
      ),
      file("docs/decisions/0036-define-p2-document-and-financial-baseline.md"),
      marker(
        "packages/accounting/tests/accounting.test.ts",
        "postRevenueForOrder",
        "reverseRevenue",
      ),
    ],
  },
  {
    id: "erp.p3",
    title: "P3 audit, events, and integration baseline",
    source: "docs/roadmap/erp-primitives.md",
    kind: "markers",
    commands: [task("test", "packages/catalog/tests/catalog.test.ts")],
    requirements: [
      marker(
        "docs/roadmap/erp-primitives.md",
        "**P3 baseline status: `READY` for the bounded PostgreSQL-internal baseline.",
        "committed facts publish typed versioned events atomically where required",
      ),
      file("docs/decisions/0037-define-p3-audit-event-and-delivery-boundary.md"),
      file("docs/decisions/0038-move-internal-event-delivery-to-messaging.md"),
      marker(
        "packages/catalog/tests/catalog.test.ts",
        "AccountingRevenuePostedEvent",
        "ProcurementPurchaseOrderConfirmedEvent",
      ),
    ],
  },
  ...[
    "identity",
    "party",
    "inventory",
    "accounting",
    "sales",
    "procurement",
  ].map((domain) => ({
    id: `domain.${domain}.level3`,
    title: `${domain} bounded Level 3 provider slice`,
    source: "tooling/domain-maturity/measure.ts",
    kind: "domain" as const,
    domain,
  })),
  ...financialGateIds.map((financialId) => ({
    id: `financial.${financialId}`,
    title: `Financial readiness: ${financialId}`,
    source: "tooling/financial-readiness/release-gate.ts",
    kind: "financial" as const,
    financialId,
  })),
  {
    id: "process.pre08",
    title: "Process Studio pre-0.8 prerequisites",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    dependencies: [
      "erp.p0",
      "erp.p1",
      "erp.p2",
      "erp.p3",
      "domain.inventory.level3",
      "domain.sales.level3",
    ],
    commands: [task("test", "packages/process/tests/process.test.ts")],
    requirements: [
      marker(
        "docs/roadmap/process-studio.md",
        "## Pre-0.8 Gate",
        "[x] scope, organization, party, product, UOM, location, document, quantity, money,",
        "[x] procurement and billing ownership is clear for any purchase or payment process",
        "[x] at least two existing domains can expose stable public commands",
        "[x] event ownership and delivery semantics are explicit",
        "[x] compensation/manual recovery metadata has an owning-domain contract",
        "[x] catalog versioning and compatibility rules have an ADR or canonical rule",
        "[x] workflow authorization is separate from domain action authorization",
        "[x] durable engine compatibility gates remain enforced",
        "[x] external action/event profile is defined separately from domain actions/events",
        "[x] connector authentication, idempotency, delivery, and compensation rules are explicit",
        "[x] capability release states and compatibility ranges are defined",
        "[x] process promotion separates release from deployment across environments",
        "[x] execution principal, delegation, SoD, and business observability are explicit",
        "[x] authentication, current tenant membership, relationship scope, and revocation fail closed",
      ),
      marker(
        "docs/architecture/identity-and-principals.md",
        "tenant membership",
        "revocation",
        "fails closed",
      ),
      file("docs/decisions/0020-adopt-capability-release-and-runtime-governance.md"),
      file("docs/decisions/0060-defer-billing-and-settlement-scope.md"),
    ],
  },
  {
    id: "process.catalog08",
    title: "Process Studio 0.8 catalog aggregation and release gate",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    dependencies: ["process.pre08"],
    commands: [task("test", "packages/process/tests/catalog-release.test.ts")],
    requirements: [
      marker(
        "packages/process/src/catalog-release.ts",
        "ProcessReleaseValidation",
        "resolveReleasedCapability",
        "unregistered capability",
      ),
      marker(
        "packages/process/tests/catalog-release.test.ts",
        "rejects unregistered actions",
        "released process",
        "catalog compatibility",
      ),
    ],
  },
  {
    id: "process.runtime085",
    title: "Process Studio 0.85 durable headless runtime",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    dependencies: ["process.catalog08"],
    commands: [task("test", "packages/process/tests/runtime.test.ts")],
    requirements: [
      marker(
        "packages/process/src/runtime-store.ts",
        "ProcessCheckpointStore",
        "durable checkpoint",
        "recoverCheckpoint",
      ),
      marker(
        "packages/process/tests/runtime-postgres.test.ts",
        "crash recovery",
        "duplicate event",
        "exact catalog version",
        "restart",
      ),
    ],
  },
  {
    id: "process.ops09",
    title: "Process Studio 0.9 operational maturity",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    dependencies: ["process.runtime085"],
    commands: [task("test", "packages/process/tests/operations.test.ts")],
    requirements: [
      marker(
        "packages/process/src/operations-store.ts",
        "ProcessOperatorStore",
        "manual recovery",
        "compensation",
        "authorized operator",
      ),
      marker(
        "packages/process/tests/operations-postgres.test.ts",
        "unknown external outcome",
        "operator control",
        "crash recovery",
      ),
    ],
  },
  {
    id: "process.designer095",
    title: "Process Studio 0.95 validated designer",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    dependencies: ["process.ops09"],
    commands: [
      task(
        "test",
        "apps/web/src/features/process-studio/designer.test.ts",
        "apps/web/src/features/process-studio/product-surface.test.ts",
      ),
    ],
    requirements: [
      marker(
        "apps/web/src/features/process-studio/",
        "process designer",
        "typed mapping",
        "keyboard",
        "deterministic Process IR",
      ),
    ],
  },
  {
    id: "process.governed10",
    title: "Process Studio 1.0 governed release",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    dependencies: ["process.designer095"],
    commands: [task("test", "packages/process/tests/release-postgres.test.ts")],
    requirements: [
      marker(
        "packages/process/src/release-store.ts",
        "immutable release",
        "deployment binding",
        "approval",
        "audit",
      ),
      marker(
        "packages/process/tests/release-postgres.test.ts",
        "release immutability",
        "promotion audit",
        "environment",
      ),
    ],
  },
  {
    id: "integration.contract08",
    title: "External integration 0.8 contract profile",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    dependencies: ["process.pre08"],
    commands: [
      task(
        "test",
        "packages/integrations/tests/openapi.test.ts",
        "packages/integrations/tests/cloudevents.test.ts",
      ),
    ],
    requirements: [
      marker(
        "packages/integrations/src/openapi.ts",
        "OpenAPI 3.2.0",
        "allowlist",
        "ExternalAction",
      ),
      marker(
        "packages/integrations/src/cloudevents.ts",
        "CloudEvents 1.0.x",
        "ExternalEvent",
        "separate envelope",
      ),
      marker(
        "packages/integrations/tests/openapi.test.ts",
        "allowlisted operation",
        "provider credentials",
      ),
    ],
  },
  {
    id: "integration.runtime085",
    title: "External integration 0.85 connector runtime",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    dependencies: ["integration.contract08"],
    commands: [task("test", "packages/integrations/tests/https-runtime.test.ts")],
    requirements: [
      marker(
        "packages/integrations/src/https-runtime.ts",
        "HTTPS",
        "verify signature",
        "WebhookIngestion",
        "deduplicate",
      ),
      marker(
        "packages/integrations/src/delivery-store.ts",
        "delivery log",
        "unknown outcome",
        "manual recovery",
      ),
      marker(
        "packages/integrations/tests/https-runtime.test.ts",
        "duplicate delivery",
        "timeout",
        "unknown outcome",
      ),
    ],
  },
  {
    id: "integration.reliability09",
    title: "External integration 0.9 reliability and compatibility",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    dependencies: ["integration.runtime085"],
    commands: [task("test", "packages/integrations/tests/reliability.test.ts")],
    requirements: [
      marker(
        "packages/integrations/src/reliability-store.ts",
        "dead letter",
        "replay protection",
        "provider status",
        "redaction",
      ),
      marker(
        "packages/integrations/tests/reliability-postgres.test.ts",
        "compatibility",
        "payload limit",
        "health metric",
      ),
    ],
  },
  {
    id: "integration.process095",
    title: "External integration 0.95 Process Studio integration",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    dependencies: ["integration.reliability09"],
    commands: [task("test", "packages/integrations/tests/process-bridge.test.ts")],
    requirements: [
      marker(
        "packages/integrations/src/process-bridge.ts",
        "ExternalCatalogEntry",
        "simulateWithoutSideEffect",
        "transport absent from Process IR",
      ),
      marker(
        "packages/integrations/tests/process-bridge.test.ts",
        "separate OAuth scope",
        "typed mapping",
        "no provider side effect",
      ),
    ],
  },
  {
    id: "integration.governed10",
    title: "External integration 1.0 governed surface",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    dependencies: ["integration.process095"],
    commands: [task("test", "packages/integrations/tests/governance.test.ts")],
    requirements: [
      marker(
        "packages/integrations/src/governance-store.ts",
        "reviewed connector",
        "connector retirement",
        "delivery controls",
        "audit",
      ),
      marker(
        "packages/integrations/tests/governance-postgres.test.ts",
        "unreviewed operation",
        "connector version",
        "retention",
      ),
    ],
  },
  {
    id: "packs.contract",
    title: "Business Pack contract slice",
    source: "docs/roadmap/process-pack-library.md",
    kind: "markers",
    dependencies: ["process.pre08"],
    commands: [task("test", "packages/process/tests/packs.test.ts")],
    requirements: [
      marker(
        "docs/roadmap/process-pack-library.md",
        "**Track ID:** `packs`",
        "## Measures",
        "## Stop conditions",
      ),
      marker(
        "packages/process/tests/packs.test.ts",
        "Distribution starter pack",
        "missing_required_capabilities",
      ),
    ],
  },
  {
    id: "roadmap.global-exit",
    title: "Global roadmap exit criteria",
    source: "docs/roadmap/README.md",
    kind: "composite",
    dependencies: [
      "erp.p0",
      "erp.p1",
      "erp.p2",
      "erp.p3",
      "domain.identity.level3",
      "domain.party.level3",
      "domain.inventory.level3",
      "domain.accounting.level3",
      "domain.sales.level3",
      "domain.procurement.level3",
      ...financialGateIds.map((id) => `financial.${id}`),
      "process.pre08",
      "process.catalog08",
      "process.runtime085",
      "process.ops09",
      "process.designer095",
      "process.governed10",
      "integration.contract08",
      "integration.runtime085",
      "integration.reliability09",
      "integration.process095",
      "integration.governed10",
    ],
  },
]

export const gateIds = gates.map((gate) => gate.id)

export const validateGateGraph = (input: readonly Gate[]): string[] => {
  const ids = input.map((gate) => gate.id)
  const knownIds = new Set(ids)
  const failures = ids
    .filter((id, index) => ids.indexOf(id) !== index)
    .map((id) => `duplicate roadmap gate ID: ${id}`)

  for (const [index, gate] of input.entries()) {
    for (const dependency of gate.dependencies ?? []) {
      if (!knownIds.has(dependency)) {
        failures.push(`${gate.id} has unknown dependency ${dependency}`)
      } else if (dependency === gate.id) {
        failures.push(`${gate.id} cannot depend on itself`)
      } else if (ids.indexOf(dependency) > index) {
        failures.push(`${gate.id} dependency ${dependency} must be declared first`)
      }
    }
  }

  return failures
}

export const roadmapTracks: readonly RoadmapTrack[] = [
  {
    id: "erp",
    title: "ERP primitives",
    path: "docs/roadmap/erp-primitives.md",
    gateIds: ["erp.p0", "erp.p1", "erp.p2", "erp.p3"],
  },
  {
    id: "domain",
    title: "Domain maturity",
    path: "docs/roadmap/domain-maturity.md",
    gateIds: [
      "domain.identity.level3",
      "domain.party.level3",
      "domain.inventory.level3",
      "domain.accounting.level3",
      "domain.sales.level3",
      "domain.procurement.level3",
    ],
  },
  {
    id: "financial",
    title: "Financial ledger execution",
    path: "docs/roadmap/financial-ledger-execution.md",
    gateIds: financialGateIds.map((id) => `financial.${id}`),
  },
  {
    id: "process",
    title: "Process Studio",
    path: "docs/roadmap/process-studio.md",
    gateIds: [
      "process.pre08",
      "process.catalog08",
      "process.runtime085",
      "process.ops09",
      "process.designer095",
      "process.governed10",
    ],
  },
  {
    id: "integration",
    title: "External integration",
    path: "docs/roadmap/integration-surface.md",
    gateIds: [
      "integration.contract08",
      "integration.runtime085",
      "integration.reliability09",
      "integration.process095",
      "integration.governed10",
    ],
  },
  {
    id: "packs",
    title: "Business Pack Library",
    path: "docs/roadmap/process-pack-library.md",
    gateIds: ["packs.contract"],
  },
]

const gateGraphFailures = validateGateGraph(gates)
if (gateGraphFailures.length > 0) throw new Error(gateGraphFailures.join("\n"))
