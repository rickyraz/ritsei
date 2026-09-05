import { assert, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import type { Page, Route } from "playwright"
import { builtApp } from "./browser.ts"

const tenantId = "01900000-0000-7000-8000-000000000010"
const accountId = "01900000-0000-7000-8000-000000000001"
const originalEmail = "operator@example.com"
const updatedEmail = "operator.renamed@example.com"

const account = (email: string) => ({
  id: accountId,
  email,
  status: "active" as const,
})

const fulfillJson = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  })

const connect = async (page: Page, url: string) => {
  await page.goto(url)
  await page.getByLabel("Tenant ID", { exact: true }).fill(tenantId)
  await page.getByLabel("Session token", { exact: true }).fill("test-session")
  await page.getByRole("button", { name: "Connect", exact: true }).click()
  await page.getByRole("heading", { name: "User accounts", exact: true })
    .waitFor()
}

it.effect(
  "lists accounts, updates an email, refreshes the query, and restores focus",
  () =>
    Effect.gen(function* () {
      const { page, url, errors } = yield* builtApp
      let currentEmail = originalEmail
      let patchBody: unknown
      let requestHeaders: Record<string, string> | undefined
      let getCount = 0

      yield* Effect.promise(async () => {
        await page.route("**/api/user-accounts", (route) => {
          getCount += 1
          requestHeaders = route.request().headers()
          return fulfillJson(route, 200, [account(currentEmail)])
        })
        await page.route("**/api/user-accounts/*", (route) => {
          patchBody = route.request().postDataJSON()
          requestHeaders = route.request().headers()
          currentEmail = updatedEmail
          return fulfillJson(route, 200, account(currentEmail))
        })

        await connect(page, url)
        await page.getByRole("cell", { name: originalEmail, exact: true })
          .waitFor()
        assert.equal(requestHeaders?.authorization, "Bearer test-session")
        assert.equal(requestHeaders?.["x-tenant-id"], tenantId)
        assert.equal(getCount, 1)

        const edit = page.getByRole("button", {
          name: `Edit email for ${originalEmail}`,
          exact: true,
        })
        await edit.click()
        const email = page.getByRole("textbox", { name: "Email", exact: true })
        await email.waitFor()
        await email.fill(updatedEmail)
        await page.getByRole("button", { name: "Save email", exact: true })
          .click()
        await page.getByRole("status").filter({ hasText: "Email saved" })
          .waitFor()
        await page.getByRole("cell", { name: updatedEmail, exact: true })
          .waitFor()
        assert.deepEqual(patchBody, { email: updatedEmail })
        assert.isTrue(getCount >= 2)

        await page.getByRole("button", {
          name: `Edit email for ${updatedEmail}`,
          exact: true,
        }).click()
        await page.getByRole("button", { name: "Close editor", exact: true })
          .click()
        const restored = await page.getByRole("button", {
          name: `Edit email for ${updatedEmail}`,
          exact: true,
        }).evaluate((node) => document.activeElement === node)
        assert.isTrue(restored)
        assert.deepEqual(errors, [])
      })
    }),
  { timeout: 120_000 },
)

it.effect(
  "does not convert authorization, malformed responses, or unknown outcomes into success",
  () =>
    Effect.gen(function* () {
      const { page, url, errors } = yield* builtApp
      let mode: "forbidden" | "malformed" | "unknown-outcome" = "forbidden"

      yield* Effect.promise(async () => {
        await page.route("**/api/user-accounts", (route) => {
          if (mode === "forbidden") {
            return fulfillJson(route, 403, {
              _tag: "ApiForbidden",
              code: "forbidden",
            })
          } else if (mode === "malformed") {
            return fulfillJson(route, 200, { account: "not-an-array" })
          }
          return fulfillJson(route, 200, [account(originalEmail)])
        })
        await page.route("**/api/user-accounts/*", async (route) => {
          if (mode === "unknown-outcome") {
            await route.abort("connectionreset")
          } else {
            fulfillJson(route, 503, {
              _tag: "ApiServiceUnavailable",
              code: "service_unavailable",
            })
          }
        })

        await connect(page, url)
        await page.getByRole("alert").filter({ hasText: "permission" })
          .waitFor()
        assert.equal(
          await page.getByRole("button", { name: "Save email", exact: true })
            .count(),
          0,
        )

        mode = "malformed"
        await page.getByRole("button", {
          name: "Try loading again",
          exact: true,
        }).click()
        await page.getByRole("alert").filter({
          hasText: "invalid or oversized response",
        }).waitFor()

        mode = "unknown-outcome"
        await page.getByRole("button", {
          name: "Try loading again",
          exact: true,
        }).click()
        await page.getByRole("cell", { name: originalEmail, exact: true })
          .waitFor()
        await page.getByRole("button", {
          name: `Edit email for ${originalEmail}`,
          exact: true,
        }).click()
        await page.getByRole("textbox", { name: "Email", exact: true }).fill(
          updatedEmail,
        )
        await page.getByRole("button", { name: "Save email", exact: true })
          .click()
        await page.getByRole("alert").filter({ hasText: "may have saved" })
          .waitFor()
        assert.isFalse(
          await page.getByRole("button", { name: "Save email", exact: true })
            .isEnabled(),
        )
        await page.getByRole("button", {
          name: "Reload before retrying",
          exact: true,
        }).waitFor()
        assert.deepEqual(errors, [])
      })
    }),
  { timeout: 120_000 },
)
