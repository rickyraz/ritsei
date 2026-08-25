type CatalogEntry = {
  readonly kind: string
  readonly id: string
  readonly owningDomain: string
  readonly stability: string
  readonly requiredCapability?: string
  readonly scope?: readonly string[]
  readonly idempotency?: string
  readonly retryPolicy?: { readonly maxAttempts?: number }
  readonly preconditions?: readonly string[]
  readonly effects?: readonly string[]
  readonly errorSchemas?: readonly unknown[]
  readonly transactionSemantics?: string
  readonly compensation?: { readonly kind?: string; readonly recovery?: string }
  readonly correlationFields?: readonly string[]
  readonly filterableFields?: readonly string[]
  readonly occurredAtSemantics?: string
  readonly deliveryExpectation?: string
  readonly sensitivity?: string
}

type DomainTarget = {
  readonly domain: string
  readonly module: string
  readonly actionsExport: string
  readonly eventsExport: string
  readonly contractTests: readonly string[]
  readonly publicationTest: { readonly path: string; readonly markers: readonly string[] }
  readonly catalogMarker: string
  readonly catalogEventMarker: string
}

const targets: readonly DomainTarget[] = [
  {
    domain: "identity",
    module: "../../packages/identity/mod.ts",
    actionsExport: "IdentityTypedActionCatalog",
    eventsExport: "IdentityTypedEventCatalog",
    contractTests: ["packages/identity/tests/identity.test.ts"],
    publicationTest: {
      path: "packages/identity/tests/identity.postgres.test.ts",
      markers: ["UserAccountCreatedEvent", "event_outbox", "assert.deepStrictEqual"],
    },
    catalogMarker: "IdentityTypedActionCatalog",
    catalogEventMarker: "IdentityTypedEventCatalog",
  },
  {
    domain: "party",
    module: "../../packages/party/mod.ts",
    actionsExport: "PartyTypedActionCatalog",
    eventsExport: "PartyTypedEventCatalog",
    contractTests: ["packages/party/tests/party.test.ts"],
    publicationTest: {
      path: "packages/party/tests/party.postgres.test.ts",
      markers: ["PartyCreatedEvent", "event_outbox", "assert.deepStrictEqual"],
    },
    catalogMarker: "PartyTypedActionCatalog",
    catalogEventMarker: "PartyTypedEventCatalog",
  },
  {
    domain: "inventory",
    module: "../../packages/inventory/mod.ts",
    actionsExport: "InventoryTypedActionCatalog",
    eventsExport: "InventoryTypedEventCatalog",
    contractTests: ["packages/inventory/tests/inventory.test.ts"],
    publicationTest: {
      path: "packages/inventory/tests/inventory.postgres.test.ts",
      markers: ["InventoryStockCorrectedEvent", "event_outbox", "assert.deepStrictEqual"],
    },
    catalogMarker: "InventoryTypedActionCatalog",
    catalogEventMarker: "InventoryTypedEventCatalog",
  },
  {
    domain: "accounting",
    module: "../../packages/accounting/mod.ts",
    actionsExport: "AccountingTypedActionCatalog",
    eventsExport: "AccountingTypedEventCatalog",
    contractTests: ["packages/accounting/tests/accounting.test.ts"],
    publicationTest: {
      path: "packages/accounting/tests/accounting.postgres.test.ts",
      markers: ["AccountingRevenuePostedEvent", "event_outbox", "assert.deepStrictEqual"],
    },
    catalogMarker: "AccountingTypedActionCatalog",
    catalogEventMarker: "AccountingTypedEventCatalog",
  },
  {
    domain: "sales",
    module: "../../packages/sales/mod.ts",
    actionsExport: "SalesTypedActionCatalog",
    eventsExport: "SalesTypedEventCatalog",
    contractTests: ["packages/sales/tests/sales.test.ts"],
    publicationTest: {
      path: "packages/sales/tests/sales.postgres.test.ts",
      markers: ["SalesOrderConfirmedEvent", "event_outbox", "assert.deepStrictEqual"],
    },
    catalogMarker: "SalesTypedActionCatalog",
    catalogEventMarker: "SalesTypedEventCatalog",
  },
  {
    domain: "procurement",
    module: "../../packages/procurement/mod.ts",
    actionsExport: "ProcurementTypedActionCatalog",
    eventsExport: "ProcurementTypedEventCatalog",
    contractTests: ["packages/procurement/tests/procurement.test.ts"],
    publicationTest: {
      path: "packages/procurement/tests/procurement.postgres.test.ts",
      markers: [
        "ProcurementPurchaseOrderConfirmedEvent",
        "event_outbox",
        "assert.deepStrictEqual",
      ],
    },
    catalogMarker: "ProcurementTypedActionCatalog",
    catalogEventMarker: "ProcurementTypedEventCatalog",
  },
]

const catalogTest = "packages/catalog/tests/catalog.test.ts"
const executableTestFiles = [
  catalogTest,
  ...targets.flatMap((target) => target.contractTests),
].filter((path, index, files) => files.indexOf(path) === index)

const isCatalogEntry = (value: unknown): value is CatalogEntry =>
  typeof value === "object" && value !== null &&
  typeof (value as { kind?: unknown }).kind === "string" &&
  typeof (value as { id?: unknown }).id === "string" &&
  typeof (value as { owningDomain?: unknown }).owningDomain === "string" &&
  typeof (value as { stability?: unknown }).stability === "string"

const entries = (value: unknown): readonly CatalogEntry[] =>
  Array.isArray(value) ? value.filter(isCatalogEntry) : []

const exists = async (path: string) => {
  try {
    await Deno.stat(path)
    return true
  } catch {
    return false
  }
}

const contains = async (path: string, marker: string) => {
  try {
    return (await Deno.readTextFile(path)).includes(marker)
  } catch {
    return false
  }
}

const executableContractTests = await new Deno.Command("deno", {
  args: ["task", "test", ...executableTestFiles],
  stdout: "null",
  stderr: "piped",
}).output().then((result) => {
  if (result.code !== 0) {
    console.error(new TextDecoder().decode(result.stderr))
  }
  return result.code === 0
})

const results = []
for (const target of targets) {
  const moduleExports = await import(target.module) as Record<string, unknown>
  const actions = entries(moduleExports[target.actionsExport])
  const events = entries(moduleExports[target.eventsExport])
  const publicActionEntry = actions.find((entry) =>
    entry.kind === "DomainAction" && entry.owningDomain === target.domain &&
    entry.stability === "PUBLIC"
  )
  const publicEventEntry = events.find((entry) =>
    entry.kind === "DomainEvent" && entry.owningDomain === target.domain &&
    entry.stability === "PUBLIC"
  )
  const publicAction = publicActionEntry !== undefined
  const publicEvent = publicEventEntry !== undefined
  const actionContract = publicActionEntry !== undefined &&
    publicActionEntry.requiredCapability === publicActionEntry.id &&
    publicActionEntry.scope?.includes("tenant") === true &&
    ["required", "inherent", "unsupported"].includes(publicActionEntry.idempotency ?? "") &&
    (publicActionEntry.retryPolicy?.maxAttempts ?? 0) >= 1 &&
    publicActionEntry.preconditions?.includes("authorized") === true &&
    (publicActionEntry.effects?.length ?? 0) > 0 &&
    (publicActionEntry.errorSchemas?.length ?? 0) > 0 &&
    publicActionEntry.transactionSemantics === "local_atomic" &&
    (publicActionEntry.compensation?.kind === "action" ||
      publicActionEntry.compensation?.recovery === "manual")
  const eventContract = publicEventEntry !== undefined &&
    publicEventEntry.id.startsWith(`${target.domain}.`) &&
    publicEventEntry.scope?.includes("tenant") === true &&
    publicEventEntry.occurredAtSemantics === "owner_commit_time" &&
    publicEventEntry.sensitivity === "business_internal_minimized" &&
    (publicEventEntry.correlationFields?.length ?? 0) > 0 &&
    new Set(publicEventEntry.correlationFields).size ===
      publicEventEntry.correlationFields!.length &&
    (publicEventEntry.filterableFields?.length ?? 0) > 0 &&
    publicEventEntry.correlationFields!.every((field) =>
      publicEventEntry.filterableFields!.includes(field)
    ) &&
    publicEventEntry.deliveryExpectation === "at_least_once"
  const tests = (await Promise.all(target.contractTests.map(exists))).every(Boolean)
  const catalogCompatibility = await contains(catalogTest, target.catalogMarker) &&
    await contains(catalogTest, target.catalogEventMarker)
  const publicationProof = (await Promise.all(
    target.publicationTest.markers.map((marker) => contains(target.publicationTest.path, marker)),
  )).every(Boolean)
  const level3 = publicAction && publicEvent && actionContract && eventContract && tests &&
    executableContractTests && catalogCompatibility && publicationProof
  results.push({
    target,
    level3,
    publicAction,
    publicEvent,
    actionContract,
    eventContract,
    tests,
    executableContractTests,
    catalogCompatibility,
    publicationProof,
  })
  console.log(
    `${level3 ? "PASS" : "OPEN"} ${target.domain} ` +
      `action=${publicAction} event=${publicEvent} action_contract=${actionContract} ` +
      `event_contract=${eventContract} tests=${tests} executable=${executableContractTests} ` +
      `catalog=${catalogCompatibility} publication=${publicationProof}`,
  )
}

const level3 = results.filter((result) => result.level3).length
const publicActions = results.filter((result) => result.publicAction).length
const publicEvents = results.filter((result) => result.publicEvent).length

console.log(`METRIC domain_level3_capabilities=${level3}`)
console.log(`METRIC remaining_domain_gates=${targets.length - level3}`)
console.log(`METRIC public_actions=${publicActions}`)
console.log(`METRIC public_events=${publicEvents}`)
