import { assert } from "@effect/vitest"
import * as Effect from "effect/Effect"
import { chromium } from "playwright"
import { preview } from "vite"

export const builtApp = Effect.gen(function* () {
  const outDir = yield* Effect.acquireRelease(
    Effect.promise(() => Deno.makeTempDir({ prefix: "ritsei-web-" })),
    (path) => Effect.promise(() => Deno.remove(path, { recursive: true })),
  )
  const child = yield* Effect.acquireRelease(
    Effect.sync(() =>
      new Deno.Command("deno", {
        args: ["task", "--cwd", "apps/web", "build", "--outDir", outDir],
        stdout: "piped",
        stderr: "piped",
      }).spawn()
    ),
    (child) =>
      Effect.promise(async () => {
        try {
          child.kill("SIGTERM")
        } catch (cause) {
          if (
            !(cause instanceof Deno.errors.NotFound) &&
            !(cause instanceof TypeError)
          ) throw cause
        }
        await child.status
      }),
  )
  const output = yield* Effect.promise(() => child.output())
  assert.isTrue(
    output.success,
    new TextDecoder().decode(output.stdout) +
      new TextDecoder().decode(output.stderr),
  )
  const server = yield* Effect.acquireRelease(
    Effect.promise(() =>
      preview({
        configFile: false,
        root: "apps/web",
        build: { outDir },
        preview: { host: "127.0.0.1", port: 0, strictPort: true },
      })
    ),
    (server) =>
      Effect.promise(() =>
        new Promise<void>((resolve, reject) => {
          server.httpServer.close((error) => error ? reject(error) : resolve())
        })
      ),
  )
  const address = server.httpServer.address()
  assert.isNotNull(address)
  assert.isNotString(address)
  if (!address || typeof address === "string") {
    return yield* Effect.die("No preview TCP address")
  }
  const browser = yield* Effect.acquireRelease(
    Effect.promise(() => chromium.launch({ headless: true })),
    (browser) => Effect.promise(() => browser.close()),
  )
  const context = yield* Effect.acquireRelease(
    Effect.promise(() => browser.newContext({ viewport: { width: 1280, height: 900 } })),
    (context) => Effect.promise(() => context.close()),
  )
  const page = yield* Effect.promise(() => context.newPage())
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  return {
    page,
    context,
    browser,
    errors,
    outDir,
    url: `http://127.0.0.1:${address.port}`,
  }
})
