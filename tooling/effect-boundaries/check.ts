const read = (path: string) => Deno.readTextFile(path)

const handlerSource = await read("runtime/api/handlers.ts")

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
  "modules/auth/mod.ts": "AuthLive",
  "modules/authorization/mod.ts": "AuthorizationLive",
  "modules/identity/mod.ts": "IdentityLive",
  "modules/party/mod.ts": "PartyLive",
  "modules/sales/mod.ts": "SalesLive",
  "modules/inventory/mod.ts": "InventoryLive",
  "modules/messaging/mod.ts": "MessagingLive",
  "modules/procurement/mod.ts": "ProcurementLive",
  "modules/accounting/mod.ts": "AccountingLive",
  "modules/process/mod.ts": "ProcessLive",
}

for (const [path, name] of Object.entries(requiredLiveExports)) {
  if (!(await read(path)).includes(name)) throw new Error(`${path} must export ${name}`)
}

console.log(
  `Effect boundaries valid: ${requiredHandlerOperations.length} handler operations, ${
    Object.keys(requiredLiveExports).length
  } live exports`,
)
