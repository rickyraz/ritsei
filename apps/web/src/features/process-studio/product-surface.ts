import {
  applyDesignerAction,
  type DesignerModel,
  makeInitialDesignerModel,
  serializeProcessIr,
  setNodeCapability,
  toProcessIr,
} from "./designer-model.ts"

export const ProcessStudioLanes = [
  "copilot_draft",
  "bounded_execution",
  "templates",
] as const
export type ProcessStudioLane = (typeof ProcessStudioLanes)[number]

export const ProcessStudioLaneLabels: Readonly<Record<ProcessStudioLane, string>> = {
  copilot_draft: "Copilot draft",
  bounded_execution: "Bounded execution",
  templates: "Templates",
}

export const ProcessStudioLaneDescriptions: Readonly<Record<ProcessStudioLane, string>> = {
  copilot_draft: "Draft-only assistance; no provider execution.",
  bounded_execution: "Allowlisted actions with review and runtime gates.",
  templates: "Curated business patterns remain editable drafts.",
}

export const ProcessDraftSources = ["human", "copilot", "template"] as const
export type ProcessDraftSource = (typeof ProcessDraftSources)[number]

export type ProcessDraftMetadata = {
  readonly status: "DRAFT"
  readonly source: ProcessDraftSource
}

export type ProcessStudioDraft = {
  readonly lane: ProcessStudioLane
  readonly metadata: ProcessDraftMetadata
  readonly model: DesignerModel
}

export type ProcessStudioCapabilityId =
  | "sales.order.confirm"
  | "inventory.stock.adjust"
  | "accounting.revenue.post"

export type ProcessStudioTemplate = {
  readonly id: string
  readonly version: number
  readonly name: string
  readonly description: string
  readonly model: DesignerModel
}

const withCapability = (
  model: DesignerModel,
  id: ProcessStudioCapabilityId,
): DesignerModel => {
  const next = applyDesignerAction(model, { _tag: "add_node", kind: "DomainCommand" })
  const node = [...next.nodes].reverse().find((candidate) => candidate.kind === "DomainCommand")
  return node === undefined
    ? next
    : setNodeCapability(next, node.id, { kind: "DomainAction", id, version: 1 })
}

const templateModel = (
  definitionId: string,
  capabilities: readonly ProcessStudioCapabilityId[],
): DesignerModel => {
  let model = { ...makeInitialDesignerModel(), definitionId }
  for (const capability of capabilities) model = withCapability(model, capability)
  return model
}

export const ProcessStudioTemplates: readonly ProcessStudioTemplate[] = [
  {
    id: "order-confirmation",
    version: 1,
    name: "Order confirmation",
    description: "Confirm an order and post its owner-derived revenue.",
    model: templateModel("018f3f77-0c5a-7cc0-8b62-6a163d214124", [
      "sales.order.confirm",
      "accounting.revenue.post",
    ]),
  },
  {
    id: "stock-correction",
    version: 1,
    name: "Stock correction",
    description: "Start with an idempotent inventory correction draft.",
    model: templateModel("018f3f77-0c5a-7cc0-8b62-6a163d214125", ["inventory.stock.adjust"]),
  },
  {
    id: "revenue-posting",
    version: 1,
    name: "Revenue posting",
    description: "Prepare a confirmed-order revenue posting draft.",
    model: templateModel("018f3f77-0c5a-7cc0-8b62-6a163d214126", ["accounting.revenue.post"]),
  },
]

export const getProcessStudioTemplate = (id: string): DesignerModel | undefined =>
  ProcessStudioTemplates.find((template) => template.id === id)?.model

export const makeProcessStudioDraft = (
  model: DesignerModel,
  lane: ProcessStudioLane = "copilot_draft",
  source: ProcessDraftSource = "human",
): ProcessStudioDraft => ({
  lane,
  metadata: { status: "DRAFT", source },
  model,
})

export const serializeProcessStudioDraft = (draft: ProcessStudioDraft): string =>
  serializeProcessIr(toProcessIr(draft.model))
