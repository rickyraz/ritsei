type ArtifactFile = {
  readonly path: string
  readonly size: number
  readonly sha256: string
}

type Artifact = {
  readonly id: string
  readonly kind: "deno-bundle" | "migration-assets" | "vite-dist"
  readonly source: string
  readonly path: string
  readonly files: readonly ArtifactFile[]
}

const root = Deno.cwd().replace(/\/$/u, "")
const revision = await run("git", ["rev-parse", "HEAD"])
const output = Deno.args[0] ?? `deploy/artifacts/output/${revision}`
const outputPath = await Deno.realPath(await ensureDirectory(output))
if (!outputPath.startsWith(`${root}/deploy/artifacts/`)) {
  throw new Error("artifact output must remain under deploy/artifacts/")
}
await Deno.remove(outputPath, { recursive: true })
await Deno.mkdir(outputPath, { recursive: true })

const bundles = [
  ["api", "runtime/api/mod.ts"],
  ["worker", "runtime/worker/mod.ts"],
  ["migrator", "runtime/migrator/mod.ts"],
] as const
for (const [name, entrypoint] of bundles) {
  await run("deno", [
    "bundle",
    "--no-check",
    "--platform=deno",
    "--output",
    `${outputPath}/${name}.js`,
    entrypoint,
  ])
}

await copyTree("db/migrations", `${outputPath}/migrations`)
await run("deno", [
  "task",
  "--cwd",
  "apps/web",
  "build",
  "--outDir",
  `${outputPath}/frontend`,
])

const artifacts: Artifact[] = []
for (const [name, entrypoint] of bundles) {
  artifacts.push({
    id: name,
    kind: "deno-bundle",
    source: entrypoint,
    path: relativeToRoot(`${outputPath}/${name}.js`),
    files: [await describeFile(`${outputPath}/${name}.js`)],
  })
}
artifacts.push({
  id: "migrations",
  kind: "migration-assets",
  source: "db/migrations",
  path: relativeToRoot(`${outputPath}/migrations`),
  files: await describeTree(`${outputPath}/migrations`),
})
artifacts.push({
  id: "frontend",
  kind: "vite-dist",
  source: "apps/web",
  path: relativeToRoot(`${outputPath}/frontend`),
  files: await describeTree(`${outputPath}/frontend`),
})

const manifest = {
  schemaVersion: 1,
  sourceRevision: revision,
  lockfile: {
    path: "deno.lock",
    sha256: await hashFile("deno.lock"),
  },
  toolchain: {
    deno: await run("deno", ["--version"]),
    frontend: "Vite via deno task --cwd apps/web build",
  },
  build: {
    commands: [
      "deno bundle --no-check --platform=deno runtime/api/mod.ts",
      "deno bundle --no-check --platform=deno runtime/worker/mod.ts",
      "deno bundle --no-check --platform=deno runtime/migrator/mod.ts",
      "deno task --cwd apps/web build",
    ],
    migrations: "db/migrations is copied beside the migrator bundle",
  },
  artifacts,
  sourceOnlyCaveat:
    "Historical source-only tags remain source-only; this manifest describes the artifact-backed build path.",
}
await Deno.mkdir("deploy/artifacts", { recursive: true })
await Deno.writeTextFile("deploy/artifacts/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify({ sourceRevision: revision, artifactRoot: relativeToRoot(outputPath) }))

async function run(command: string, args: readonly string[]): Promise<string> {
  const result = await new Deno.Command(command, {
    args: [...args],
    stdout: "piped",
    stderr: "piped",
  }).output()
  const stdout = new TextDecoder().decode(result.stdout).trim()
  if (!result.success) {
    const stderr = new TextDecoder().decode(result.stderr).trim()
    throw new Error(`${command} ${args.join(" ")} failed: ${stderr || stdout}`)
  }
  return stdout
}

async function ensureDirectory(path: string): Promise<string> {
  await Deno.mkdir(path, { recursive: true })
  return path
}

async function copyTree(source: string, destination: string): Promise<void> {
  await Deno.mkdir(destination, { recursive: true })
  for await (const entry of Deno.readDir(source)) {
    const sourcePath = `${source}/${entry.name}`
    const destinationPath = `${destination}/${entry.name}`
    if (entry.isDirectory) {
      await copyTree(sourcePath, destinationPath)
    } else if (entry.isFile) {
      await Deno.copyFile(sourcePath, destinationPath)
    }
  }
}

async function describeTree(directory: string, relative = ""): Promise<ArtifactFile[]> {
  const files: ArtifactFile[] = []
  for await (const entry of Deno.readDir(directory)) {
    const path = `${directory}/${entry.name}`
    const child = relative === "" ? entry.name : `${relative}/${entry.name}`
    if (entry.isDirectory) {
      files.push(...await describeTree(path, child))
    } else if (entry.isFile) {
      files.push({
        path: child,
        size: (await Deno.stat(path)).size ?? 0,
        sha256: await hashFile(path),
      })
    }
  }
  return files.sort((left, right) => left.path.localeCompare(right.path))
}

async function describeFile(path: string): Promise<ArtifactFile> {
  return {
    path: path.slice(path.lastIndexOf("/") + 1),
    size: (await Deno.stat(path)).size ?? 0,
    sha256: await hashFile(path),
  }
}

async function hashFile(path: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", await Deno.readFile(path))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function relativeToRoot(path: string): string {
  if (!path.startsWith(`${root}/`)) throw new Error(`path is outside repository: ${path}`)
  return path.slice(root.length + 1)
}
