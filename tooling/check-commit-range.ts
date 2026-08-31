import { commitSubjectError } from "./check-commit-message.ts"

const [base, head] = Deno.args

if (base === undefined || head === undefined || Deno.args.length !== 2) {
  console.error("usage: check-commit-range.ts <base-sha> <head-sha>")
  Deno.exit(2)
}

const zeroSha = /^0+$/u
const range = zeroSha.test(base) ? head : `${base}..${head}`
const result = await new Deno.Command("git", {
  args: ["log", "--format=%H%x00%s", "--no-decorate", range],
  stdout: "piped",
  stderr: "piped",
}).output()

if (!result.success) {
  const stderr = new TextDecoder().decode(result.stderr).trim()
  console.error(`Unable to inspect commit range: ${stderr}`)
  Deno.exit(1)
}

const commits = new TextDecoder().decode(result.stdout).trimEnd().split(/\r?\n/u).filter(Boolean)
const failures = commits.flatMap((commit) => {
  const separator = commit.indexOf("\0")
  const sha = separator === -1 ? commit : commit.slice(0, separator)
  const subject = separator === -1 ? "" : commit.slice(separator + 1)
  const error = commitSubjectError(subject)
  return error === undefined ? [] : [`${sha}: ${error}`]
})

if (failures.length > 0) {
  console.error(failures.join("\n"))
  Deno.exit(1)
}

console.log(`Validated ${commits.length} commit subject${commits.length === 1 ? "" : "s"}.`)
