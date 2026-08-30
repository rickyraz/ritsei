import { assert, describe, it } from "@effect/vitest"

import {
  getProcessStudioTemplate,
  makeProcessStudioDraft,
  ProcessStudioTemplates,
  serializeProcessStudioDraft,
} from "./product-surface.ts"
import { toProcessIr, validateDesignerModel } from "./designer-model.ts"

describe("Process Studio product surface", () => {
  it("provides structurally valid editable templates", () => {
    assert.strictEqual(ProcessStudioTemplates.length, 3)
    assert.strictEqual(
      new Set(ProcessStudioTemplates.map((template) => template.model.definitionId)).size,
      ProcessStudioTemplates.length,
    )
    for (const template of ProcessStudioTemplates) {
      assert.deepStrictEqual(validateDesignerModel(template.model), [])
      assert.isDefined(getProcessStudioTemplate(template.id))
    }
    const orderConfirmation = getProcessStudioTemplate("order-confirmation")!
    assert.deepStrictEqual(
      orderConfirmation.nodes
        .filter((node) => node.kind === "DomainCommand")
        .map((node) => node.capability?.id),
      ["sales.order.confirm", "accounting.revenue.post"],
    )
  })

  it("preserves draft lane and source metadata", () => {
    const model = getProcessStudioTemplate("order-confirmation")!
    const draft = makeProcessStudioDraft(model, "templates", "template")

    assert.strictEqual(draft.lane, "templates")
    assert.deepStrictEqual(draft.metadata, { status: "DRAFT", source: "template" })
  })

  it("keeps product-surface metadata out of serialized Process IR", () => {
    const model = getProcessStudioTemplate("order-confirmation")!
    const draft = makeProcessStudioDraft(model, "copilot_draft", "copilot")
    const serialized = serializeProcessStudioDraft(draft)
    const ir = toProcessIr(model)

    assert.strictEqual(
      serialized,
      JSON.stringify({
        formatVersion: 1,
        definitionId: ir.definitionId,
        version: ir.version,
        catalogVersion: ir.catalogVersion,
        environment: ir.environment,
        nodes: [...ir.nodes].sort((a, b) => a.id.localeCompare(b.id)),
        edges: [...ir.edges].sort((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`)),
        checksum: ir.checksum,
      }),
    )
    assert.isFalse(serialized.includes("copilot_draft"))
    assert.isFalse(serialized.includes("template"))
  })
})
