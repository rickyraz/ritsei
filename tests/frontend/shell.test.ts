import { assert, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import { builtApp } from "./browser.ts"

it.effect(
  "builds the SPA, navigates, validates connection input, and changes theme",
  () =>
    Effect.gen(function* () {
      const { page, url, errors } = yield* builtApp
      yield* Effect.promise(async () => {
        await page.goto(url)
        await page.getByRole("heading", { name: "Connect a session" })
          .waitFor()
        await page.getByLabel("Tenant ID", { exact: true }).fill("not-a-uuid")
        await page.getByLabel("Session token", { exact: true }).fill(
          "test-session",
        )
        await page.getByRole("button", { name: "Connect", exact: true })
          .click()
        await page.getByRole("alert").filter({ hasText: "valid tenant UUID" })
          .waitFor()
        assert.equal(new URL(page.url()).pathname, "/")
        const before = await page.locator("main").evaluate((node) => getComputedStyle(node).color)
        await page.getByRole("button", { name: "Dark theme" }).click()
        assert.equal(
          await page.getByRole("button", { name: "Dark theme" }).getAttribute(
            "aria-pressed",
          ),
          "true",
        )
        assert.notEqual(
          await page.locator("main").evaluate((node) => getComputedStyle(node).color),
          before,
        )
        await page.getByRole("link", { name: "User accounts", exact: true })
          .click()
        await page.getByRole("heading", { name: "User accounts", exact: true })
          .waitFor()
        await page.goBack()
        await page.getByRole("heading", { name: "Connect a session" })
          .waitFor()
        await page.goto(`${url}/not-a-route`)
        await page.getByRole("heading", { name: "Page not found" }).waitFor()
        assert.deepEqual(errors, [])
        const stored = await page.evaluate(() =>
          JSON.stringify([
            Object.entries(localStorage),
            Object.entries(sessionStorage),
          ])
        )
        assert.notInclude(stored, "test-session")
        assert.notInclude(stored, "not-a-uuid")
      })
    }),
  { timeout: 120_000 },
)
