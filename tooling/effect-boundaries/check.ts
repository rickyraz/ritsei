const read = (path: string) => Deno.readTextFile(path)

const handlerSource = await read("apps/api/handlers.ts")

const requiredHandlerOperations = [
  "Http.UserAccounts.create",
  "Http.Parties.create",
  "Http.Authorization.addMember",
  "Http.Sales.createCustomer",
  "Http.Inventory.createWarehouse",
  "Http.Process.confirmOrder",
  "Http.Accounting.prepareTigerBeetleCutover",
]

for (const name of requiredHandlerOperations) {
  if (!handlerSource.includes(`Effect.fn("${name}")`)) {
    throw new Error(`missing named handler operation: ${name}`)
  }
}

if (/\b[A-Za-z]+Service\.use\(/.test(handlerSource)) {
  throw new Error("API handlers must resolve static services once per handler group")
}

const requiredLiveExports: Readonly<Record<string, string>> = {
  "packages/auth/mod.ts": "AuthLive",
  "packages/authorization/mod.ts": "AuthorizationLive",
  "packages/identity/mod.ts": "IdentityLive",
  "packages/party/mod.ts": "PartyLive",
  "packages/sales/mod.ts": "SalesLive",
  "packages/inventory/mod.ts": "InventoryLive",
  "packages/messaging/mod.ts": "MessagingLive",
  "packages/procurement/mod.ts": "ProcurementLive",
  "packages/accounting/mod.ts": "AccountingLive",
  "packages/process/mod.ts": "ProcessLive",
}

for (const [path, name] of Object.entries(requiredLiveExports)) {
  if (!(await read(path)).includes(name)) throw new Error(`${path} must export ${name}`)
}

console.log(
  `Effect boundaries valid: ${requiredHandlerOperations.length} handler operations, ${
    Object.keys(requiredLiveExports).length
  } live exports`,
)
