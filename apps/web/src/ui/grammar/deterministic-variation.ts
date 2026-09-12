const hashString = (value: string): number => {
  let hash = 2_166_136_261
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16_777_619)
  }
  return hash >>> 0
}

export const deterministicSeed = (parts: readonly string[]): number =>
  hashString(parts.join("\u001f"))

export const stableUnit = (seed: number, salt = 0): number => {
  const mixed = Math.imul(seed ^ salt, 2_246_822_519) ^ 3_266_489_917
  return (mixed >>> 0) / 4_294_967_295
}
