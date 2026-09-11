import { assert, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import { AxeBuilder } from "@axe-core/playwright"
import { builtApp } from "../../../../tests/frontend/browser.ts"

it.effect(
  "keeps the shell keyboard-accessible, labeled, responsive, and free of automated axe violations",
  () =>
    Effect.gen(function* () {
      const { page, url, errors } = yield* builtApp
      yield* Effect.promise(async () => {
        await page.setViewportSize({ width: 390, height: 844 })
        await page.emulateMedia({ reducedMotion: "reduce" })
        await page.goto(url)

        const results = await new AxeBuilder({ page }).withTags([
          "wcag2a",
          "wcag2aa",
        ]).analyze()
        assert.deepEqual(results.violations, [])
        await page.emulateMedia({
          reducedMotion: "reduce",
          forcedColors: "active",
        })
        assert.isTrue(
          await page.getByRole("button", { name: "Connect", exact: true })
            .isVisible(),
        )
        assert.isNotNull(
          await page.getByLabel("Tenant ID", { exact: true }).getAttribute(
            "id",
          ),
        )
        assert.isNotNull(
          await page.getByLabel("Session token", { exact: true }).getAttribute(
            "id",
          ),
        )
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= globalThis.innerWidth),
          true,
        )

        await page.keyboard.press("Tab")
        assert.equal(
          await page.evaluate(() => document.activeElement?.getAttribute("href")),
          "#main",
        )
        await page.keyboard.press("Tab")
        assert.equal(
          await page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
          "RITSEI home",
        )
        await page.getByLabel("Tenant ID", { exact: true }).focus()
        await page.keyboard.press("Tab")
        assert.equal(
          await page.evaluate(() => document.activeElement?.id),
          "token",
        )
        assert.deepEqual(errors, [])
      })
    }),
  { timeout: 120_000 },
)

const collectFiles = async (
  directory: string,
): Promise<readonly { readonly path: string; readonly size: number }[]> => {
  const files: { path: string; size: number }[] = []
  for await (const entry of Deno.readDir(directory)) {
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory) {
      files.push(...await collectFiles(path))
    } else if (entry.isFile) {
      files.push({ path, size: (await Deno.stat(path)).size ?? 0 })
    }
  }
  return files
}

it.effect(
  "keeps the built workflow semantic, split, bounded, and stable under repeated use",
  () =>
    Effect.gen(function* () {
      const { page, url, errors, outDir } = yield* builtApp
      yield* Effect.promise(async () => {
        await page.goto(url)
        assert.equal(await page.locator("html").getAttribute("lang"), "en")
        assert.isTrue(await page.getByRole("main").isVisible())
        assert.equal(
          await page.getByRole("heading", { name: "Connect a session" }).count(),
          1,
        )
        assert.equal(
          await page.getByLabel("Tenant ID", { exact: true }).getAttribute("aria-describedby"),
          "connection-help connection-error",
        )

        const tenant = page.getByLabel("Tenant ID", { exact: true })
        await tenant.fill("not-a-uuid")
        await page.getByLabel("Session token", { exact: true }).fill("token")
        await page.getByRole("button", { name: "Connect", exact: true }).click()
        assert.equal(await tenant.getAttribute("aria-invalid"), "true")
        assert.equal(await page.evaluate(() => document.activeElement?.id), "tenant")
        assert.isTrue(await page.getByRole("alert").isVisible())

        const start = performance.now()
        await page.getByRole("button", { name: "Dark theme", exact: true }).click()
        const interactionMs = performance.now() - start
        assert.isTrue(interactionMs < 200, `theme interaction took ${interactionMs}ms`)

        await page.setViewportSize({ width: 390, height: 844 })
        await page.evaluate(() => {
          document.documentElement.style.zoom = "2"
        })
        assert.isTrue(await tenant.isVisible())
        assert.isTrue(await page.getByRole("button", { name: "Connect", exact: true }).isVisible())
        await page.evaluate(() => {
          document.documentElement.style.zoom = ""
        })

        for (let index = 0; index < 12; index++) {
          await page.getByRole("button", { name: "Dark theme", exact: true }).click()
          await page.getByRole("button", { name: "Dark theme", exact: true }).click()
        }
        assert.equal(await page.getByRole("main").count(), 1)
        assert.deepEqual(errors, [])

        const files = await collectFiles(outDir)
        const javascript = files.filter(({ path }) => path.endsWith(".js"))
        const stylesheets = files.filter(({ path }) => path.endsWith(".css"))
        assert.isTrue(javascript.length >= 2, "route code should remain split")
        assert.isTrue(
          javascript.every(({ size }) => size <= 200_000),
          "every JavaScript chunk must stay below 200 KiB",
        )
        assert.isTrue(stylesheets.every(({ size }) => size <= 50_000))
      })
    }),
  { timeout: 120_000 },
)
