import { computeLayout, normalizeBone, renderBones, snapshotBones } from "boneyard-js"

export function boneyardCoreProbe() {
  const layout = computeLayout(
    {
      width: 240,
      height: 80,
      children: [{ height: 24, borderRadius: 4 }],
    },
    240,
  )

  return {
    height: layout.height,
    boneCount: layout.bones.length,
    rendered: renderBones(layout).length > 0,
    normalizedWidth: normalizeBone([0, 0, 10, 20, 4]).w,
    snapshotType: typeof snapshotBones,
  } as const
}
