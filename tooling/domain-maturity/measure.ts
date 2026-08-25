type CatalogEntry = {
  readonly kind: string
  readonly owningDomain: string
  readonly stability: string
}

type DomainTarget = {
  readonly domain: string
  readonly module: string
  readonly actionsExport: string
  readonly eventsExport: string
  readonly contractTests: readonly string[]
}

const targets: readonly DomainTarget[] = [
  {
    domain: "identity",
    module: "../../packages/identity/mod.ts",
    actionsExport: "IdentityTypedActionCatalog",
    eventsExport: "IdentityTypedEventCatalog",
    contractTests: ["packages/identity/tests/identity.test.ts"],
  },
  {
    domain: "party",
    module: "../../packages/party/mod.ts",
    actionsExport: "PartyTypedActionCatalog",
    eventsExport: "PartyTypedEventCatalog",
    contractTests: ["packages/party/tests/party.test.ts"],
  },
  {
    domain: "inventory",
    module: "../../packages/inventory/mod.ts",
    actionsExport: "InventoryTypedActionCatalog",
    eventsExport: "InventoryTypedEventCatalog",
    contractTests: ["packages/inventory/tests/inventory.test.ts"],
  },
  {
    domain: "accounting",
    module: "../../packages/accounting/mod.ts",
    actionsExport: "AccountingTypedActionCatalog",
    eventsExport: "AccountingTypedEventCatalog",
    contractTests: ["packages/accounting/tests/accounting.test.ts"],
  },
  {
    domain: "sales",
    module: "../../packages/sales/mod.ts",
    actionsExport: "SalesTypedActionCatalog",
    eventsExport: "SalesTypedEventCatalog",
    contractTests: ["packages/sales/tests/sales.test.ts"],
  },
  {
    domain: "procurement",
    module: "../../packages/procurement/mod.ts",
    actionsExport: "ProcurementTypedActionCatalog",
    eventsExport: "ProcurementTypedEventCatalog",
    contractTests: ["packages/procurement/tests/procurement.test.ts"],
  },
]

const catalogTest = "packages/catalog/tests/catalog.test.ts"

const isCatalogEntry = (value: unknown): value is CatalogEntry =>
  typeof value === "object" && value !== null &&
  typeof (value as { kind?: unknown }).kind === "string" &&
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

const results = []
for (const target of targets) {
  const moduleExports = await import(target.module) as Record<string, unknown>
  const actions = entries(moduleExports[target.actionsExport])
  const events = entries(moduleExports[target.eventsExport])
  const publicAction = actions.some((entry) =>
    entry.kind === "DomainAction" && entry.owningDomain === target.domain &&
    entry.stability === "PUBLIC"
  )
  const publicEvent = events.some((entry) =>
    entry.kind === "DomainEvent" && entry.owningDomain === target.domain &&
    entry.stability === "PUBLIC"
  )
  const tests = (await Promise.all(target.contractTests.map(exists))).every(Boolean)
  const catalogCompatibility = await exists(catalogTest)
  const level3 = publicAction && publicEvent && tests && catalogCompatibility
  results.push({ target, level3, publicAction, publicEvent, tests, catalogCompatibility })
  console.log(
    `${level3 ? "PASS" : "OPEN"} ${target.domain} ` +
      `action=${publicAction} event=${publicEvent} tests=${tests} catalog=${catalogCompatibility}`,
  )
}

const level3 = results.filter((result) => result.level3).length
const publicActions = results.filter((result) => result.publicAction).length
const publicEvents = results.filter((result) => result.publicEvent).length

console.log(`METRIC domain_level3_capabilities=${level3}`)
console.log(`METRIC remaining_domain_gates=${targets.length - level3}`)
console.log(`METRIC public_actions=${publicActions}`)
console.log(`METRIC public_events=${publicEvents}`)
