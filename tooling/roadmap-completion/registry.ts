export type GateKind = "markers" | "domain" | "financial" | "composite"

export type GateRequirement = {
  readonly path: string
  readonly markers?: readonly string[]
}

export type Gate = {
  readonly id: string
  readonly title: string
  readonly source: string
  readonly kind: GateKind
  readonly requirements?: readonly GateRequirement[]
  readonly domain?: string
  readonly financialId?: string
  readonly dependencies?: readonly string[]
}

const marker = (path: string, ...markers: string[]): GateRequirement => ({ path, markers })
const file = (path: string): GateRequirement => ({ path })

export const financialGateIds = [
  "controlled_activation",
  "process_kill_no_double_posting",
  "worker_adapter_restart",
  "tigerbeetle_outage_fail_closed",
  "replica_quorum_failure",
  "postgresql_not_financial_authority",
  "independent_backup_restore",
  "recovery_watermark",
  "global_reconciliation",
  "projection_rebuild",
  "artifact_integrity",
  "production_signing_custody",
  "key_rotation_recovery",
  "operator_alerts",
  "bounded_cohort",
  "no_unresolved_p0",
] as const

export const gates: readonly Gate[] = [
  {
    id: "erp.p0",
    title: "P0 scope and identity baseline",
    source: "docs/roadmap/erp-primitives.md",
    kind: "markers",
    requirements: [
      marker(
        "docs/roadmap/erp-primitives.md",
        "**P0 baseline status: `READY`. All P0-01 through P0-10 tasks have public contracts and executable proof.",
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
    ["identity", "identity.user_account.create"],
    ["party", "party.create"],
    ["inventory", "inventory.stock.adjust"],
    ["accounting", "accounting.revenue.post"],
    ["sales", "sales.order.confirm"],
    ["procurement", "procurement.purchase_order.confirm"],
  ].map(([domain, capability]) => ({
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
    requirements: [
      marker(
        "docs/roadmap/process-studio.md",
        "## Pre-0.8 Gate",
        "[x] scope, organization, party, product, UOM, location, document, quantity, money,",
        "[x] execution principal, delegation, SoD, and business observability are explicit",
      ),
      file("docs/decisions/0020-adopt-capability-release-and-runtime-governance.md"),
    ],
  },
  {
    id: "process.catalog08",
    title: "Process Studio 0.8 catalog aggregation and release gate",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/process/src/catalog-registry.ts",
        "ProcessCatalogRegistry",
        "resolveReleasedCapability",
      ),
      marker(
        "packages/process/tests/catalog-registry.test.ts",
        "rejects unregistered actions",
        "catalog compatibility",
      ),
    ],
  },
  {
    id: "process.runtime085",
    title: "Process Studio 0.85 durable headless runtime",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/process/src/runtime.ts",
        "ProcessRuntime",
        "pinCatalogVersion",
        "recoverCheckpoint",
      ),
      marker(
        "packages/process/tests/runtime.test.ts",
        "crash recovery",
        "duplicate event",
        "exact catalog version",
      ),
    ],
  },
  {
    id: "process.ops09",
    title: "Process Studio 0.9 operational maturity",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/process/src/operations.ts",
        "ProcessOperatorService",
        "manual recovery",
        "compensation",
      ),
      marker(
        "packages/process/tests/operations.test.ts",
        "unknown external outcome",
        "operator control",
      ),
    ],
  },
  {
    id: "process.designer095",
    title: "Process Studio 0.95 validated designer",
    source: "docs/roadmap/process-studio.md",
    kind: "markers",
    requirements: [
      marker(
        "apps/web/src/features/process-studio/",
        "process designer",
        "typed mapping",
      ),
      marker(
        "apps/web/src/features/process-studio/",
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
    requirements: [
      marker(
        "packages/process/src/release.ts",
        "immutable release",
        "deployment binding",
        "approval",
      ),
      marker(
        "packages/process/tests/release.test.ts",
        "release immutability",
        "promotion audit",
      ),
    ],
  },
  {
    id: "integration.contract08",
    title: "External integration 0.8 contract profile",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/integrations/src/contract.ts",
        "ExternalAction",
        "ExternalEvent",
        "CloudEvents",
        "OpenAPI",
      ),
      marker(
        "packages/integrations/tests/contract.test.ts",
        "allowlisted operation",
        "separate envelope",
      ),
    ],
  },
  {
    id: "integration.runtime085",
    title: "External integration 0.85 connector runtime",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/integrations/src/runtime.ts",
        "WebhookIngestion",
        "deduplicate",
        "bounded retry",
      ),
      marker(
        "packages/integrations/tests/runtime.test.ts",
        "unknown outcome",
        "manual recovery",
      ),
    ],
  },
  {
    id: "integration.reliability09",
    title: "External integration 0.9 reliability and compatibility",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/integrations/src/reliability.ts",
        "dead letter",
        "redaction",
        "provider status",
      ),
      marker(
        "packages/integrations/tests/reliability.test.ts",
        "compatibility",
        "payload limit",
      ),
    ],
  },
  {
    id: "integration.process095",
    title: "External integration 0.95 Process Studio integration",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/integrations/src/catalog.ts",
        "ExternalCatalogEntry",
        "simulateWithoutSideEffect",
      ),
      marker(
        "packages/integrations/tests/catalog.test.ts",
        "transport absent from Process IR",
        "separate OAuth scope",
      ),
    ],
  },
  {
    id: "integration.governed10",
    title: "External integration 1.0 governed surface",
    source: "docs/roadmap/integration-surface.md",
    kind: "markers",
    requirements: [
      marker(
        "packages/integrations/src/governance.ts",
        "reviewed connector",
        "connector retirement",
        "delivery controls",
      ),
      marker(
        "packages/integrations/tests/governance.test.ts",
        "unreviewed operation",
        "connector version",
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
      "process.governed10",
      "integration.governed10",
    ],
  },
]

export const gateIds = gates.map((gate) => gate.id)

if (new Set(gateIds).size !== gateIds.length) {
  throw new Error("Roadmap completion gate IDs must be unique")
}
