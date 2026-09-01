import { collectSourceFiles, type SourceFile } from "../source-files.ts"

const normalizePath = (path: string) => path.replaceAll("\\", "/")

export const extractModuleSpecifiers = (source: string): readonly string[] => {
  const specifiers = new Set<string>()
  const patterns = [
    /\bimport\s+(?:type\s+)?(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/gs,
    /\bexport\s+(?:type\s+)?(?:\*|\{[\s\S]*?\})\s+from\s+["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ]

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specifiers.add(match[1]!)
  }
  return [...specifiers]
}

const packageTarget = (file: string, specifier: string) => {
  const alias = specifier.match(/^@ritsei\/([^/]+)(?:\/(.+))?$/)
  if (alias !== null) return { name: alias[1]!, path: alias[2] ?? "mod.ts" }

  if (!specifier.startsWith(".")) return undefined
  const resolved = decodeURIComponent(
    new URL(specifier, `file:///${normalizePath(file)}`).pathname.slice(1),
  )
  const target = resolved.match(/^modules\/([^/]+)\/(.+)$/)
  return target === null ? undefined : { name: target[1]!, path: target[2]! }
}

export const analyzePublicPackageImports = (
  files: readonly SourceFile[],
  packageNames: readonly string[],
): readonly string[] => {
  const packages = new Set(packageNames)
  const failures: string[] = []

  for (const file of files) {
    const path = normalizePath(file.path)
    const containingPackage = path.match(/^modules\/([^/]+)\//)?.[1]

    for (const specifier of extractModuleSpecifiers(file.source)) {
      const target = packageTarget(path, specifier)
      if (target === undefined) continue
      if (!packages.has(target.name)) {
        failures.push(`${path}: import references unknown package ${target.name}`)
        continue
      }
      if (containingPackage === target.name) continue
      if (target.path !== "mod.ts") {
        failures.push(
          `${path}: cross-package import ${
            JSON.stringify(specifier)
          } must use modules/${target.name}/mod.ts`,
        )
      }
    }
  }

  return failures.toSorted()
}

export const checkPublicPackageImports = async (): Promise<readonly string[]> => {
  const packageNames: string[] = []
  for await (const entry of Deno.readDir("modules")) {
    if (!entry.isDirectory) continue
    try {
      if ((await Deno.stat(`modules/${entry.name}/mod.ts`)).isFile) packageNames.push(entry.name)
    } catch (cause) {
      if (!(cause instanceof Deno.errors.NotFound)) throw cause
    }
  }

  const files = (await Promise.all(
    ["apps", "foundation", "modules", "platform", "runtime", "tests", "tooling"].map((root) =>
      collectSourceFiles(root, [".ts", ".tsx"])
    ),
  )).flat()
  return analyzePublicPackageImports(files, packageNames)
}

if (import.meta.main) {
  const failures = await checkPublicPackageImports()
  if (failures.length > 0) {
    console.error(failures.join("\n"))
    Deno.exit(1)
  }
  console.log("public package imports valid")
}
