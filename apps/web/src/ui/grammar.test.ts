import { assert, describe, it } from "@effect/vitest"
import { deterministicSeed } from "./grammar/deterministic-variation.ts"
import { materialForDimension, projectVisualIntent } from "./grammar/projection.ts"

describe("Visual Grammar", () => {
  it("maps semantic dimensions to different material channels", () => {
    const risk = materialForDimension("risk", 1)
    const capacity = materialForDimension("capacity", 1)
    const movement = materialForDimension("movement", 1)

    assert.equal(risk.compression, 1)
    assert.equal(risk.amplitude, 0)
    assert.equal(capacity.amplitude, 1)
    assert.equal(capacity.compression, 0)
    assert.equal(movement.velocity, 1)
    assert.equal(movement.depth, 0)
  })

  it("clamps projection values and keeps stable variation deterministic", () => {
    const first = projectVisualIntent({
      variationKey: "tenant-account-network",
      archetypes: ["relationship", "capacity"],
      primitives: ["field", "marker"],
      dimension: "relationship",
      value: 4,
      semantics: { label: "Accounts", description: "Account summary." },
      fallback: { summary: "Account summary." },
      markers: [{ id: "active", label: "Active", x: -20, y: 140 }],
    })
    const second = projectVisualIntent({
      variationKey: "tenant-account-network",
      archetypes: ["relationship", "capacity"],
      primitives: ["field", "marker"],
      dimension: "relationship",
      value: 4,
      semantics: { label: "Accounts", description: "Account summary." },
      fallback: { summary: "Account summary." },
      markers: [{ id: "active", label: "Active", x: -20, y: 140 }],
    })

    assert.deepEqual(first, second)
    assert.equal(first.material.proximity, 1)
    assert.equal(first.markers[0]?.x, 0)
    assert.equal(first.markers[0]?.y, 100)
    assert.equal(
      deterministicSeed(["tenant-account-network", "relationship", "compact", "content", "ready"]),
      first.variation.seed,
    )
  })
})
