import { assert, it } from "@effect/vitest"
import { iconRegistry } from "../../apps/web/src/ui/icons/registry.ts"
import { defaultIconVariant } from "../../apps/web/src/ui/icons/semantics.ts"

it("keeps semantic icon names stable across provider mappings", () => {
  assert.equal(iconRegistry["action.delete"], "trash")
  assert.equal(iconRegistry["object.purchase-order"], "clipboard-text")
  assert.equal(defaultIconVariant("status.warning"), "regular")
  assert.equal(defaultIconVariant("empty.purchase-order"), "duotone")
})
