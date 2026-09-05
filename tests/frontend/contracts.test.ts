import { readFileSync } from "node:fs"
import { assert, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import {
  ApiError,
  UpdateUserAccountInput as BrowserUpdateUserAccountInput,
  UserAccount as BrowserUserAccount,
  userAccountRoutes,
} from "../../apps/web/src/shared/contracts/generated/identity.ts"
import { UpdateUserAccountInput, UserAccount } from "../../modules/identity/mod.ts"
import {
  ApiConflict,
  ApiForbidden,
  ApiNotFound,
  ApiServiceUnavailable,
  ApiUnauthorized,
  RitseiApi,
} from "../../runtime/api/api.ts"
import { source } from "../../tooling/frontend/contracts.ts"

const id = "01900000-0000-7000-8000-000000000001"
const emails = [
  "user@example.com",
  "élève@example.com",
  "σ@example.com",
  "i\u0307@example.com",
  "用户@example.com",
  "a b@example.com",
  "\u200b@example.com",
  "",
  " \t\n",
  "\u00a0\u2003\ufeff",
  " user@example.com",
  "user@example.com\n",
  "\u00a0user@example.com",
  "user@example.com\ufeff",
  "USER@example.com",
  "Élève@example.com",
  "Σ@example.com",
  "İ@example.com",
]
const unknownInputs: readonly unknown[] = [
  undefined,
  null,
  false,
  42,
  "user@example.com",
  [],
  {},
  { id },
  { id, email: null, status: "active" },
  { id, email: 42, status: "active" },
  { id: "invalid", email: "user@example.com", status: "active" },
  { id, email: "user@example.com", status: "unknown" },
  { id, email: "user@example.com", status: "disabled", extra: true },
]

it("generates deterministic browser-only contracts and canonical endpoint paths", () => {
  assert.equal(source(), source())
  assert.equal(
    readFileSync(
      new URL("../../apps/web/src/shared/contracts/generated/identity.ts", import.meta.url),
      "utf8",
    ),
    source(),
  )
  assert.notInclude(source(), "modules/")
  assert.notInclude(source(), "runtime/")
  assert.deepEqual(userAccountRoutes, {
    list: RitseiApi.groups.UserAccounts.endpoints.list.path,
    update: RitseiApi.groups.UserAccounts.endpoints.update.path,
  })
})

it.effect("preserves canonical whitespace, Unicode and case validation in browser decoders", () =>
  Effect.gen(function* () {
    for (const email of emails) {
      const input = { id, email, status: "active" }
      const account = yield* Effect.result(Schema.decodeUnknownEffect(UserAccount)(input))
      assert.equal(
        account._tag === "Success",
        /\S/.test(email) && email === email.trim() && email === email.toLowerCase(),
        JSON.stringify(email),
      )
      const update = yield* Effect.result(Schema.decodeUnknownEffect(UpdateUserAccountInput)(input))
      assert.equal(update._tag === "Success", /\S/.test(email), JSON.stringify(email))
    }
    for (
      const [canonical, browser] of [
        [UserAccount, BrowserUserAccount],
        [UpdateUserAccountInput, BrowserUpdateUserAccountInput],
      ] as const
    ) {
      for (
        const input of [
          ...unknownInputs,
          ...emails.map((email) => ({ id, email, status: "active" })),
        ]
      ) {
        const expected = yield* Effect.result(Schema.decodeUnknownEffect(canonical)(input))
        const actual = yield* Effect.result(Schema.decodeUnknownEffect(browser)(input))
        assert.equal(actual._tag, expected._tag)
        if (actual._tag === "Success" && expected._tag === "Success") {
          assert.deepEqual(actual.success, expected.success)
        }
      }
    }
  }))

it.effect("generates the canonical HTTP error wire union without backend error classes", () =>
  Effect.gen(function* () {
    const canonical = Schema.Union([
      ApiUnauthorized,
      ApiForbidden,
      ApiNotFound,
      ApiConflict,
      ApiServiceUnavailable,
    ])
    for (
      const input of [
        { _tag: "ApiUnauthorized", code: "unauthorized" },
        { _tag: "ApiForbidden", code: "forbidden" },
        { _tag: "ApiNotFound", code: "user_account_not_found" },
        { _tag: "ApiConflict", code: "user_account_already_exists" },
        { _tag: "ApiServiceUnavailable", code: "service_unavailable" },
        { _tag: "ApiUnauthorized", code: "wrong" },
        { _tag: "Unknown", code: "unknown" },
        ...unknownInputs,
      ]
    ) {
      const expected = yield* Effect.result(Schema.decodeUnknownEffect(canonical)(input))
      const actual = yield* Effect.result(Schema.decodeUnknownEffect(ApiError)(input))
      assert.equal(actual._tag, expected._tag)
      if (actual._tag === "Success" && expected._tag === "Success") {
        assert.equal(actual.success._tag, expected.success._tag)
        assert.equal(actual.success.code, expected.success.code)
      }
    }
  }))
