export const frontendEvidence = {
  "frontend.design-system": {
    path: "docs/operations/frontend-design-system-evidence.json",
    checks: [
      "kobalte-solid2-compatibility",
      "tokens",
      "focus",
      "keyboard",
      "contrast",
      "density",
      "theme",
      "reduced-motion",
      "vendor-boundaries",
    ],
  },
  "frontend.accessibility-performance": {
    path: "docs/operations/frontend-readiness-evidence.json",
    checks: [
      "keyboard",
      "screen-reader",
      "focus-errors",
      "contrast-high-contrast",
      "reduced-motion",
      "zoom-localization",
      "route-splitting",
      "bundle-size",
      "interaction-latency",
      "long-session",
      "semantic-fallback",
    ],
  },
} as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

// Proofs are repository-relative files, never URLs, absolute paths, or traversal.
export const isFrontendProofPath = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("docs/operations/") &&
  value.split("/").every((part) => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(part))

export const evaluateFrontendEvidence = (
  text: string | undefined,
  requiredChecks: readonly string[],
  proofExists: (path: string) => boolean,
): boolean => {
  try {
    const evidence: unknown = JSON.parse(text ?? "")
    if (
      !isRecord(evidence) || evidence.status !== "passed" ||
      typeof evidence.reviewer !== "string" || evidence.reviewer.trim() === "" ||
      typeof evidence.reviewDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(evidence.reviewDate) ||
      new Date(evidence.reviewDate).toISOString().slice(0, 10) !== evidence.reviewDate ||
      !isRecord(evidence.checks) || requiredChecks.length === 0
    ) return false
    const checks = evidence.checks
    if (!requiredChecks.every((name) => Object.hasOwn(checks, name))) return false
    return Object.values(checks).every((check) =>
      isRecord(check) && check.status === "passed" && isFrontendProofPath(check.proof) &&
      proofExists(check.proof)
    )
  } catch {
    return false
  }
}
