const tag = Deno.args[0] ?? Deno.env.get("RELEASE_TAG") ?? Deno.env.get("GITHUB_REF_NAME")

if (!tag || !/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(tag)) {
  throw new Error("release tag must match vX.Y.Z")
}

const runGit = async (...args: string[]) => {
  const command = new Deno.Command("git", { args, stdout: "piped", stderr: "piped" })
  const output = await command.output()
  if (!output.success) {
    throw new Error(
      new TextDecoder().decode(output.stderr).trim() || `git ${args.join(" ")} failed`,
    )
  }
  return new TextDecoder().decode(output.stdout).trim()
}

const tagObjectType = await runGit("cat-file", "-t", `refs/tags/${tag}`)
if (tagObjectType !== "tag") {
  throw new Error(`${tag} must be an annotated tag`)
}

const target = await runGit("rev-parse", "--verify", `${tag}^{}`)
if ((await runGit("cat-file", "-t", target)) !== "commit") {
  throw new Error(`${tag} must target a commit`)
}

const expectedTarget = Deno.env.get("RELEASE_EXPECTED_TARGET")
if (expectedTarget && target !== expectedTarget) {
  throw new Error(`${tag} targets ${target}, expected ${expectedTarget}`)
}

const releaseBaseRef = Deno.env.get("RELEASE_BASE_REF")
if (releaseBaseRef !== undefined) {
  const base = await runGit("rev-parse", "--verify", releaseBaseRef)
  if (await runGit("merge-base", base, target) !== target) {
    throw new Error(`${tag} target ${target} is not contained in ${releaseBaseRef}`)
  }
}

const releaseNotes = `.github/release-notes/${tag}.md`
const notesRef = Deno.env.get("RELEASE_NOTES_REF")
const notes = notesRef === undefined
  ? await Deno.readTextFile(releaseNotes)
  : await runGit("show", `${notesRef}:${releaseNotes}`)

if (!notes.trim()) {
  throw new Error(`${releaseNotes} must not be empty`)
}
if (!notes.includes(`# RITSEI ${tag}`)) {
  throw new Error(`${releaseNotes} must identify ${tag}`)
}

for (const marker of ["pre-release", "source-only", "migration", "upgrade"]) {
  if (!notes.toLowerCase().includes(marker)) {
    throw new Error(`${releaseNotes} must mention ${marker}`)
  }
}

console.log(`release metadata check passed: ${tag} -> ${target} (${releaseNotes})`)
