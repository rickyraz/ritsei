import { assert, describe, it } from "@effect/vitest"

import { analyzeDependencyDirection } from "../../tooling/dependency-direction/check.ts"

describe("dependency direction", () => {
  it("rejects modules importing concrete platform code", () => {
    const failures = analyzeDependencyDirection([{
      path: "modules/example/src/service.ts",
      source: 'import { PostgresDatabaseLive } from "../../../platform/postgres/mod.ts"',
    }])

    assert.isTrue(failures.some((failure) => failure.includes("modules/example/src/service.ts")))
  })

  it("allows platform adapters to consume public module contracts", () => {
    const failures = analyzeDependencyDirection([{
      path: "platform/example/adapter.ts",
      source: 'import { AccountingService } from "../../modules/accounting/mod.ts"',
    }])

    assert.deepStrictEqual(failures, [])
  })

  it("rejects private cross-module imports", () => {
    const failures = analyzeDependencyDirection([{
      path: "runtime/example.ts",
      source: 'import { makeAccountingService } from "../modules/accounting/src/service.ts"',
    }])

    assert.isTrue(failures.some((failure) => failure.includes("modules/accounting/mod.ts")))
  })
})
