const [messagePath] = Deno.args

if (messagePath === undefined) {
  console.error("usage: check-commit-message.ts <commit-message-file>")
  Deno.exit(2)
}

const subject = (await Deno.readTextFile(messagePath)).split(/\r?\n/u, 1)[0] ?? ""
const valid =
  /^(feat|fix|docs|refactor|perf|test|build|ci|chore|style|revert)(\([a-z0-9-]+\))?!?: [a-z][^\r\n]*$/u
    .test(
      subject,
    ) && subject.length <= 72 && !subject.endsWith(".")

if (!valid) {
  console.error(
    [
      "Invalid commit subject.",
      "Expected <type>(<optional-scope>)!: <lowercase imperative summary>.",
      "Allowed types: feat, fix, docs, refactor, perf, test, build, ci, chore, style, revert.",
      "Keep the subject at most 72 characters and omit a trailing period.",
      "For breaking changes, add ! and a BREAKING CHANGE: footer.",
    ].join("\n"),
  )
  Deno.exit(1)
}
