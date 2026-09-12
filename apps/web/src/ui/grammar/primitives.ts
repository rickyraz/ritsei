const cartographicPrimitives = [
  "contour",
  "field",
  "route",
  "boundary",
  "marker",
  "density",
  "elevation",
  "pulse",
  "region",
] as const

export type CartographicPrimitive = (typeof cartographicPrimitives)[number]
