import { assert, it } from "@effect/vitest"
import { projectAccountNetwork } from "./account-network.ts"

const accounts = [
  {
    id: "018f3f77-0c5a-7cc0-8b62-6a163d214125",
    email: "active@example.com",
    status: "active" as const,
  },
  {
    id: "018f3f77-0c5a-7cc0-8b62-6a163d214126",
    email: "disabled@example.com",
    status: "disabled" as const,
  },
]

it("keeps account relationship projections explicit and table-first", () => {
  const intent = projectAccountNetwork(accounts)
  assert.deepEqual(intent.archetypes, ["relationship", "capacity"])
  assert.equal(intent.fallback.metrics?.find((metric) => metric.label === "Active")?.value, "1")
  assert.equal(intent.fallback.metrics?.find((metric) => metric.label === "Disabled")?.value, "1")
  assert.equal(intent.semantics.description.includes("authoritative"), true)
})

it("represents an empty tenant without inventing account markers", () => {
  const intent = projectAccountNetwork([])
  assert.equal(intent.status, "empty")
  assert.equal(intent.markers.length, 0)
  assert.equal(
    intent.fallback.metrics?.find((metric) => metric.label === "Total accounts")?.value,
    "0",
  )
})
