import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"
import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const checker = fileURLToPath(new URL("../../tooling/affected-check.ts", import.meta.url))

describe("affected frontend checks", () => {
  it.effect("selects production frontend scopes, including assets and git deletions", () =>
    Effect.gen(function* () {
      const directory = yield* Effect.acquireRelease(
        Effect.sync(() => mkdtempSync(join(tmpdir(), "ritsei-affected-"))),
        (path) => Effect.sync(() => rmSync(path, { recursive: true, force: true })),
      )
      const write = (path: string) => {
        mkdirSync(dirname(join(directory, path)), { recursive: true })
        writeFileSync(join(directory, path), "")
      }
      const run = (...paths: string[]) =>
        execFileSync("deno", [
          "run",
          "--no-config",
          "--allow-read",
          "--allow-run",
          checker,
          "--dry-run",
          ...paths,
        ], { cwd: directory, encoding: "utf8" })
      const git = (...args: string[]) => execFileSync("git", args, { cwd: directory })
      const selected = ["tests/frontend/shell.test.ts", "apps/web/src/ui/button.test.tsx"]
      const experiment = "apps/web/src/experiments/solid-effect/example.test.ts"
      for (const path of [...selected, experiment, "apps/web/public/deleted.svg"]) write(path)
      for (
        const path of [
          "apps/web/src/app.tsx",
          "apps/web/index.html",
          "apps/web/src/styles.css",
          "apps/web/vite.config.ts",
          "apps/web/public/icon.svg",
          "apps/web/tsconfig.json",
          "apps/web/src/deleted.ts",
          "apps/web/src/deleted.test.ts",
        ]
      ) {
        const output = run(path)
        for (const test of selected) assert.include(output, test, path)
        assert.notInclude(output, experiment)
        assert.notInclude(output, "deno task test:related")
        assert.include(output, "$ deno task test ")
      }
      assert.include(run(experiment), "No affected tests")
      assert.include(run("package.json"), "Broad repository change")
      assert.include(run("deno.lock"), "$ deno task test\n")
      git("init", "-q")
      git("add", ".")
      git(
        "-c",
        "user.name=Test",
        "-c",
        "user.email=test@example.invalid",
        "commit",
        "-qm",
        "fixture",
      )
      rmSync(join(directory, "apps/web/public/deleted.svg"))
      for (const test of selected) assert.include(run(), test)
    }))
})
