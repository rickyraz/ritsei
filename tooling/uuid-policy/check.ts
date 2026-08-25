const roots = ["apps", "packages"]
const allowedEphemeralUses = new Map([
  ["packages/process/src/postgres.ts", "leaseToken"],
])

const isSourceFile = (path: string) =>
  /\.(?:c|m)?tsx?$/.test(path) &&
  !/(?:\.test|\.spec)\.[^.]+$/.test(path)

async function* sourceFiles(path: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(path)) {
    const child = `${path}/${entry.name}`
    if (entry.isDirectory) yield* sourceFiles(child)
    else if (entry.isFile && isSourceFile(child)) yield child
  }
}

for (const root of roots) {
  for await (const path of sourceFiles(root)) {
    const allowedName = allowedEphemeralUses.get(path)
    const lines = (await Deno.readTextFile(path)).split("\n")
    for (const [index, line] of lines.entries()) {
      if (!line.includes("crypto.randomUUID()")) continue
      if (allowedName !== undefined && line.includes(allowedName)) continue
      throw new Error(
        `${path}:${
          index + 1
        } uses crypto.randomUUID(); use kernel uuidv7() for persistent identities`,
      )
    }
  }
}

console.log("UUID identity policy valid")
