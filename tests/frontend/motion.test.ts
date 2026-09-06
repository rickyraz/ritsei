import { assert, it } from "@effect/vitest"
import {
  motionDistance,
  motionDuration,
  motionEasing,
  motionSpring,
  prefersReducedMotion,
  semanticMotion,
} from "../../apps/web/src/ui/motion/index.ts"

it("keeps RITSEI motion tokens semantic and reduced-motion safe", () => {
  assert.equal(motionDuration.normal, 180)
  assert.equal(motionDistance.subtle, 4)
  assert.deepEqual(motionEasing.standard, [0.2, 0, 0, 1])
  assert.equal(semanticMotion.spatial.duration, 240)
  assert.equal(motionSpring.spatial.damping, 35)
  assert.isFalse(prefersReducedMotion())
})
