import { extractModuleSpecifiers } from "../public-contract/check.ts"
import { collectSourceFiles, type SourceFile } from "../source-files.ts"

type Zone =
  | "apps"
  | "apps-web"
  | "database"
  | "foundation"
  | "modules"
  | "platform"
  | "runtime"
  | "runtime-adapters"
  | "tests"
  | "tooling"

const sourceRoots = [
  "apps",
  "foundation",
  "modules",
  "platform",
  "runtime",
  "tests",
  "tooling",
] as const

const normalizePath = (path: string) => path.replaceAll("\\", "/")

const zonePrefixes: readonly (readonly [string, Zone])[] = [
  ["apps/web/", "apps-web"],
  ["apps/", "apps"],
  ["foundation/", "foundation"],
  ["modules/", "modules"],
  ["platform/", "platform"],
  ["runtime/adapters/", "runtime-adapters"],
  ["runtime/", "runtime"],
  ["tests/", "tests"],
  ["tooling/", "tooling"],
  ["db/", "database"],
]

const zoneOf = (path: string): Zone | undefined => {
  const normalized = normalizePath(path)
  return zonePrefixes.find(([prefix]) => normalized.startsWith(prefix))?.[1]
}

const allowedImports: Readonly<Record<Zone, readonly Zone[]>> = {
  apps: ["apps", "apps-web", "foundation", "modules", "platform", "runtime", "tooling"],
  "apps-web": ["foundation", "modules"],
  database: ["database"],
  foundation: ["foundation"],
  modules: ["database", "foundation", "modules"],
  platform: ["foundation", "modules", "platform"],
  runtime: [
    "database",
    "foundation",
    "modules",
    "platform",
    "runtime",
    "runtime-adapters",
    "tooling",
  ],
  "runtime-adapters": ["database", "foundation", "modules", "platform", "runtime"],
  tests: [
    "apps",
    "apps-web",
    "database",
    "foundation",
    "modules",
    "platform",
    "runtime",
    "runtime-adapters",
    "tooling",
  ],
  tooling: ["database", "foundation", "modules", "platform", "runtime", "tooling"],
}

const resolveLocal = (file: string, specifier: string): string | undefined => {
  if (specifier.startsWith("@ritsei/")) {
    const name = specifier.slice("@ritsei/".length).split("/")[0]
    return name === undefined || name === "" ? undefined : `modules/${name}/mod.ts`
  }
  if (!specifier.startsWith(".")) return undefined
  return decodeURIComponent(
    new URL(specifier, `file:///${normalizePath(file)}`).pathname.slice(1),
  )
}

const moduleName = (path: string) => normalizePath(path).match(/^modules\/([^/]+)\//)?.[1]
const isTestPath = (path: string) =>
  /(?:^|\/)tests\//.test(normalizePath(path)) || /\.(?:test|spec)\.(?:ts|tsx)$/.test(path)

const isPublicModuleEntry = (path: string) => /^modules\/[^/]+\/mod\.tsx?$/.test(path)

const invalidZoneImport = (
  file: SourceFile,
  sourceZone: Zone,
  targetZone: Zone,
  target: string,
): string | undefined =>
  targetZone !== sourceZone && !allowedImports[sourceZone].includes(targetZone)
    ? `${file.path}: ${sourceZone} cannot import ${target}`
    : undefined

const invalidModuleImport = (
  file: SourceFile,
  sourceModule: string | undefined,
  targetZone: Zone,
  target: string,
): string | undefined => {
  const targetModule = targetZone === "modules" ? moduleName(target) : undefined
  if (
    targetZone !== "modules" ||
    targetModule === undefined ||
    targetModule === sourceModule ||
    isPublicModuleEntry(target)
  ) return undefined
  return `${file.path}: module imports must use modules/${targetModule}/mod.ts`
}

const analyzeImport = (
  file: SourceFile,
  sourceZone: Zone,
  sourceModule: string | undefined,
  specifier: string,
): string | undefined => {
  const target = resolveLocal(file.path, specifier)
  if (target === undefined) return undefined
  const targetZone = zoneOf(target)
  if (targetZone === undefined) return undefined
  return invalidZoneImport(file, sourceZone, targetZone, target) ??
    invalidModuleImport(file, sourceModule, targetZone, target)
}

export const analyzeDependencyDirection = (files: readonly SourceFile[]): readonly string[] =>
  files.flatMap((file) => {
    const sourceZone = zoneOf(file.path)
    if (
      sourceZone === undefined ||
      sourceZone === "tests" ||
      sourceZone === "tooling" ||
      isTestPath(file.path)
    ) return []

    const sourceModule = sourceZone === "modules" ? moduleName(file.path) : undefined
    return extractModuleSpecifiers(file.source)
      .map((specifier) => analyzeImport(file, sourceZone, sourceModule, specifier))
      .filter((failure): failure is string => failure !== undefined)
  }).toSorted()

export const checkDependencyDirection = async (): Promise<readonly string[]> => {
  const files = (await Promise.all(
    sourceRoots.map((root) => collectSourceFiles(root, [".ts", ".tsx"])),
  )).flat()
  return analyzeDependencyDirection(files)
}

if (import.meta.main) {
  const failures = await checkDependencyDirection()
  if (failures.length > 0) {
    console.error(failures.join("\n"))
    Deno.exit(1)
  }
  console.log("dependency direction valid")
}
