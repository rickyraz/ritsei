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
