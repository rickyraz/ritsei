const textDecoder = new TextDecoder()
const testFilePattern = /\.(?:test|spec)\.(?:ts|tsx)$/
const sourceFilePattern = /\.(?:ts|tsx|js|jsx)$/
const broadTestTriggers = new Set([
  "package.json",
  "deno.json",
  "deno.lock",
  "vitest.config.ts",
  "vitest.contract.config.ts",
])

const normalizePath = (path: string) => path.replaceAll("\\", "/")
const isTestFile = (path: string) => testFilePattern.test(path)
const isSourceFile = (path: string) => sourceFilePattern.test(path)

const gitFiles = async (args: readonly string[]): Promise<readonly string[]> => {
  const result = await new Deno.Command("git", {
    args: [...args],
    stdout: "piped",
    stderr: "piped",
  }).output()

  if (!result.success) {
    throw new Error(textDecoder.decode(result.stderr))
  }

  return textDecoder.decode(result.stdout).split("\n").map(normalizePath).filter(Boolean)
}

const changedFiles = async (provided: readonly string[]): Promise<readonly string[]> => {
  if (provided.length > 0) return [...new Set(provided.map(normalizePath))].toSorted()

  const [tracked, untracked] = await Promise.all([
    gitFiles(["diff", "--name-only", "--diff-filter=ACMRT", "HEAD", "--"]),
    gitFiles(["ls-files", "--others", "--exclude-standard"]),
  ])
  return [...new Set([...tracked, ...untracked])].toSorted()
}

const collectTests = async (root: string): Promise<readonly string[]> => {
  const result: string[] = []

  const visit = async (directory: string): Promise<void> => {
    try {
      for await (const entry of Deno.readDir(directory)) {
        const path = `${directory}/${entry.name}`
        if (entry.isDirectory) await visit(path)
        else if (entry.isFile && isTestFile(path)) result.push(path)
      }
    } catch (cause) {
      if (!(cause instanceof Deno.errors.NotFound)) throw cause
    }
  }

  await visit(root)
  return result.toSorted()
}

const run = async (args: readonly string[], dryRun: boolean): Promise<void> => {
  console.log(`$ ${args.join(" ")}`)
  if (dryRun) return

  const result = await new Deno.Command(args[0]!, {
    args: [...args.slice(1)],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }).output()

  if (!result.success) Deno.exit(result.code)
}

const args = [...Deno.args]
const dryRun = args.includes("--dry-run")
const providedFiles = args.filter((arg) => arg !== "--dry-run")
const files = await changedFiles(providedFiles)

if (files.length === 0) {
  console.log("No changed files; skipped affected checks.")
  Deno.exit(0)
}

const packageNames = new Set<string>()
const appNames = new Set<string>()
const tests = new Set<string>()
const relatedSources = new Set<string>()
let rootAppChanged = false
let fullSuite = false
let skillsChanged = false

for (const path of files) {
  if (
    path === "AGENTS.md" ||
    path === "tooling/check-agent-skills.ts" ||
    path.startsWith(".agents/skills/")
  ) {
    skillsChanged = true
  }

  if (broadTestTriggers.has(path) || path.startsWith("db/") || path === "drizzle.config.ts") {
    fullSuite = true
    continue
  }

  if (path.startsWith("packages/")) {
    const match = path.match(/^packages\/([^/]+)\//)
    if (match === null) continue

    if (isTestFile(path)) tests.add(path)
    else if (isSourceFile(path) || path.includes("/tests/")) {
      packageNames.add(match[1]!)
      if (path.endsWith("/mod.ts")) relatedSources.add(path)
    }
    continue
  }

  if (path.startsWith("apps/")) {
    if (isTestFile(path)) tests.add(path)
    else if (isSourceFile(path)) {
      const match = path.match(/^apps\/([^/]+)\//)
      if (match === null) rootAppChanged = true
      else appNames.add(match[1]!)
    }
    continue
  }

  if (path.startsWith("tests/") && isTestFile(path)) {
    tests.add(path)
    continue
  }

  if (path.startsWith("tests/") || path === "tooling/load-env.ts") fullSuite = true
}

for (const packageName of packageNames) {
  if (!relatedSources.has(`packages/${packageName}/mod.ts`)) {
    for (const path of await collectTests(`packages/${packageName}/tests`)) tests.add(path)
  }
}

for (const appName of appNames) {
  for (const path of await collectTests(`apps/${appName}`)) tests.add(path)
}

if (rootAppChanged) {
  for (const path of await collectTests("apps")) tests.add(path)
}

if (skillsChanged) await run(["deno", "task", "skills:check"], dryRun)

if (fullSuite) {
  console.log("Broad repository change; running the full test suite.")
  await run(["deno", "task", "test"], dryRun)
} else {
  if (relatedSources.size > 0) {
    console.log(
      `Public package change; running related tests for ${[...relatedSources].join(", ")}.`,
    )
    await run(["deno", "task", "test:related", ...[...relatedSources].toSorted()], dryRun)
  }

  if (tests.size > 0) {
    const scope = packageNames.size > 1
      ? `cross-package (${[...packageNames].toSorted().join(", ")})`
      : "affected"
    console.log(`Running ${scope} tests (${tests.size} files).`)
    await run(["deno", "task", "test", ...[...tests].toSorted()], dryRun)
  } else if (relatedSources.size === 0) {
    console.log("No affected tests; skipped Vitest.")
  }
}
