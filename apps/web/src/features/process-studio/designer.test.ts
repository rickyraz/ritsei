import { assert, describe, it } from "@effect/vitest"

import {
  applyDesignerAction,
  makeInitialDesignerModel,
  serializeProcessIr,
  setNodeCapability,
  validateDesignerModel,
} from "./designer-model.ts"

const withCommand = () =>
  applyDesignerAction(makeInitialDesignerModel(), { _tag: "add_node", kind: "DomainCommand" })
const configured = () =>
  setNodeCapability(withCommand(), "node-1", {
    kind: "DomainAction",
    id: "inventory.stock.adjust",
    version: 1,
  })

describe("Process Designer", () => {
  it("makes pointer and keyboard editing produce identical deterministic Process IR", () => {
    const initial = configured()
    const pointer = applyDesignerAction(initial, {
      _tag: "reorder_node",
      nodeId: "node-1",
      direction: "down",
    })
    const keyboard = applyDesignerAction(initial, {
      _tag: "reorder_node",
      nodeId: "node-1",
      direction: "down",
    })
    assert.strictEqual(
      serializeProcessIr({ ...pointer, formatVersion: 1, checksum: "same" }),
      serializeProcessIr({ ...keyboard, formatVersion: 1, checksum: "same" }),
    )
  })

  it("rejects missing capabilities and incompatible typed mappings", () => {
    assert.isTrue(
      validateDesignerModel(withCommand()).some((issue) => issue.code === "missing_capability"),
    )
    const invalid = applyDesignerAction(configured(), {
      _tag: "add_mapping",
      nodeId: "node-1",
      mapping: {
        sourcePath: "order.id",
        targetPath: "stock.quantity",
        sourceType: "uuid",
        targetType: "number",
      },
    })
    assert.isTrue(validateDesignerModel(invalid).some((issue) => issue.code === "invalid_mapping"))
  })

  it("accepts a configured linear draft", () => {
    assert.deepStrictEqual(validateDesignerModel(configured()), [])
  })
})
