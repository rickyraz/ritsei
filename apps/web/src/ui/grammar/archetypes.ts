const visualArchetypes = [
  "stock",
  "flow",
  "capacity",
  "value",
  "relationship",
  "progress",
  "asset-space",
] as const

export type VisualArchetype = (typeof visualArchetypes)[number]
