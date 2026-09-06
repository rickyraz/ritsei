import { animate } from "motion"
import { motionSpring } from "./tokens.ts"
import { prefersReducedMotion } from "./preference.ts"

export type SpatialTarget = Partial<{
  x: number
  y: number
  scale: number
}>

export function animateSpatial(element: HTMLElement, target: SpatialTarget) {
  if (prefersReducedMotion()) {
    return animate(element, target, { duration: 0 })
  }

  return animate(element, target, {
    type: "spring",
    ...motionSpring.spatial,
  })
}
