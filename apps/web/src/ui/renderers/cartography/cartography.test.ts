import { assert, describe, it } from "@effect/vitest"
import { projectVisualIntent } from "../../grammar/projection.ts"
import {
  buildBoundaryPath,
  buildContourPaths,
  buildRoutePath,
  cartographyViewBox,
} from "./paths.ts"

describe("Cartography fallback renderer", () => {
  it("produces deterministic SVG geometry from a visual intent", () => {
    const intent = projectVisualIntent({
      variationKey: "process-flow",
      archetypes: ["flow", "progress"],
      primitives: ["contour", "route", "boundary"],
      dimension: "movement",
      value: 0.8,
      semantics: { label: "Process flow", description: "A process route summary." },
      fallback: { summary: "The route remains available as text." },
      motion: "active",
    })

    assert.isAtLeast(buildContourPaths(intent).length, 2)
    assert.isString(buildRoutePath(intent))
    assert.isString(buildBoundaryPath(intent))
    assert.deepEqual(buildContourPaths(intent), buildContourPaths(intent))
    assert.deepEqual(cartographyViewBox, { width: 320, height: 160 })
  })

  it("does not invent geometry for a marker-only intent", () => {
    const intent = projectVisualIntent({
      variationKey: "marker-only",
      archetypes: ["relationship"],
      primitives: ["marker"],
      dimension: "relationship",
      value: 0.2,
      semantics: { label: "Markers", description: "Marker summary." },
      fallback: { summary: "Marker summary." },
    })

    assert.deepEqual(buildContourPaths(intent), [])
    assert.isUndefined(buildRoutePath(intent))
    assert.isUndefined(buildBoundaryPath(intent))
  })
})
