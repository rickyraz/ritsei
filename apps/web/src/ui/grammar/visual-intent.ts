import type { VisualArchetype } from "./archetypes.ts"
import type { CartographicPrimitive } from "./primitives.ts"

const visualDimensions = [
  "risk",
  "capacity",
  "movement",
  "uncertainty",
  "discrepancy",
  "value",
  "relationship",
  "progress",
] as const
export type VisualDimension = (typeof visualDimensions)[number]

const visualDensities = ["comfortable", "compact", "dense"] as const
export type VisualDensity = (typeof visualDensities)[number]

const visualSurfaceLevels = ["canvas", "content", "group", "interactive", "modal"] as const
export type VisualSurfaceLevel = (typeof visualSurfaceLevels)[number]

const visualMotionPolicies = ["static", "subtle", "active"] as const
export type VisualMotionPolicy = (typeof visualMotionPolicies)[number]

const visualIntentStatuses = ["ready", "loading", "empty", "error", "degraded"] as const
export type VisualIntentStatus = (typeof visualIntentStatuses)[number]

const markerTones = ["neutral", "info", "success", "warning", "danger"] as const
export type MarkerTone = (typeof markerTones)[number]

export interface VisualMaterial {
  readonly density: number
  readonly amplitude: number
  readonly compression: number
  readonly roughness: number
  readonly continuity: number
  readonly velocity: number
  readonly depth: number
  readonly blur: number
  readonly fieldRadius: number
  readonly contourCount: number
  readonly mass: number
  readonly level: number
  readonly concentration: number
  readonly boundarySoftness: number
  readonly proximity: number
  readonly pulse: number
}

export interface VisualFallbackMetric {
  readonly label: string
  readonly value: string
}

export interface VisualFallback {
  readonly summary: string
  readonly metrics?: readonly VisualFallbackMetric[]
}

export interface VisualMarker {
  readonly id: string
  readonly label: string
  readonly x: number
  readonly y: number
  readonly tone?: MarkerTone
  readonly value?: string
}

export interface VisualSemantics {
  readonly label: string
  readonly description: string
}

export interface VisualIntent {
  readonly archetypes: readonly [VisualArchetype, ...VisualArchetype[]]
  readonly primitives: readonly CartographicPrimitive[]
  readonly dimension: VisualDimension
  readonly material: VisualMaterial
  readonly density: VisualDensity
  readonly surface: VisualSurfaceLevel
  readonly motion: VisualMotionPolicy
  readonly status: VisualIntentStatus
  readonly semantics: VisualSemantics
  readonly fallback: VisualFallback
  readonly variation: {
    readonly seed: number
  }
  readonly markers: readonly VisualMarker[]
}
