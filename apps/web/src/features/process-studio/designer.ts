/// <reference lib="dom" />

import { createEffect, createRoot, createSignal } from "solid-js"

import {
  applyDesignerAction,
  type CatalogReference,
  type DesignerModel,
  type DesignerNode,
  labelForNodeKind,
  makeInitialDesignerModel,
  ProcessDesignerNodeKinds,
  type ProcessNodeKind,
  type TypedMapping,
  validateDesignerModel,
} from "./designer-model.ts"
import {
  getProcessStudioTemplate,
  makeProcessStudioDraft,
  type ProcessDraftSource,
  type ProcessStudioDraft,
  type ProcessStudioLane,
  ProcessStudioLaneDescriptions,
  ProcessStudioLaneLabels,
  ProcessStudioLanes,
  ProcessStudioTemplates,
  serializeProcessStudioDraft,
} from "./product-surface.ts"

const tag = <K extends keyof HTMLElementTagNameMap>(name: K): HTMLElementTagNameMap[K] =>
  document.createElement(name)
const label = (value: string): HTMLSpanElement => {
  const node = tag("span")
  node.textContent = value
  return node
}
const button = (value: string, action: () => void, className = ""): HTMLButtonElement => {
  const node = tag("button")
  node.type = "button"
  node.className = className
  node.textContent = value
  node.addEventListener("click", action)
  return node
}

const styleId = "ritsei-process-designer-style"
const ensureStyle = (): void => {
  if (document.getElementById(styleId) !== null) return
  const style = tag("style")
  style.id = styleId
  style.textContent = `
.ritsei-process-designer{background:#f4f0e6;color:#172033;font:15px/1.45 ui-sans-serif,system-ui,sans-serif;min-height:520px}
.ritsei-process-designer *{box-sizing:border-box}.ritsei-process-designer button,.ritsei-process-designer input,.ritsei-process-designer select{font:inherit}
.ritsei-process-designer button{background:#fffdf8;border:1px solid #c9c2b5;border-radius:8px;color:#172033;cursor:pointer;padding:8px 10px;text-align:left}
.ritsei-process-designer button:focus-visible,.ritsei-process-designer input:focus-visible,.ritsei-process-designer select:focus-visible{outline:3px solid #d8f34f;outline-offset:2px}
.ritsei-process-designer input,.ritsei-process-designer select{background:#fffdf8;border:1px solid #c9c2b5;border-radius:7px;padding:8px;width:100%}
.ritsei-process-designer header{align-items:end;background:#172033;color:#fffdf8;display:flex;justify-content:space-between;padding:24px 28px}.ritsei-process-designer h1,.ritsei-process-designer h2,.ritsei-process-designer p{margin:0}
.ritsei-process-designer h1{font-size:clamp(24px,4vw,38px);letter-spacing:-.04em}.ritsei-process-designer h2{font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.ritsei-process-designer .eyebrow{color:#d8f34f;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}.ritsei-process-designer .subtitle{color:#cad3df;margin-top:5px}
.ritsei-process-designer .badge{background:#d8f34f;border-radius:999px;color:#172033;font-size:11px;font-weight:800;padding:5px 9px}.ritsei-process-designer .grid{display:grid;grid-template-columns:190px minmax(280px,1fr) 280px;min-height:450px}
.ritsei-process-designer aside,.ritsei-process-designer main{padding:20px}.ritsei-process-designer aside{border-right:1px solid #d6cfc1}.ritsei-process-designer aside:last-child{border-left:1px solid #d6cfc1;border-right:0}.ritsei-process-designer .palette,.ritsei-process-designer .nodes,.ritsei-process-designer .inspector,.ritsei-process-designer .inspector-fields{display:grid;gap:9px}.ritsei-process-designer .palette{margin-top:14px}.ritsei-process-designer .palette button{border-left:4px solid #5b3cc4}
.ritsei-process-designer nav{background:#fffdf8;border-bottom:1px solid #d6cfc1;display:flex;flex-wrap:wrap;gap:8px;padding:12px 20px}.ritsei-process-designer nav button[aria-pressed="true"]{background:#172033;color:#fffdf8}.ritsei-process-designer .lane-status{color:#596273;font-size:13px;padding:0 20px 12px}.ritsei-process-designer .template-list{display:grid;gap:8px;margin:0 20px 16px}.ritsei-process-designer .template-option{background:#fffdf8;border:1px solid #d6cfc1;border-radius:8px;padding:8px}.ritsei-process-designer .template-option button{border-left:4px solid #d8f34f;width:100%}.ritsei-process-designer .template-option p{color:#596273;font-size:13px;margin:6px 4px 0}.ritsei-process-designer .toolbar{align-items:center;display:flex;gap:10px;justify-content:space-between;margin-bottom:16px}.ritsei-process-designer .toolbar p{color:#596273;font-size:13px}.ritsei-process-designer .validate{background:#5b3cc4;border-color:#5b3cc4;color:#fff;font-weight:700}
.ritsei-process-designer .nodes{list-style:none;margin:0;padding:0}.ritsei-process-designer .node{background:#fffdf8;border:1px solid #c9c2b5;border-radius:10px;box-shadow:4px 4px 0 #ded6c8;padding:12px}.ritsei-process-designer .node.selected{border-color:#5b3cc4;box-shadow:4px 4px 0 #d8f34f}.ritsei-process-designer .node button{border:0;padding:0;width:100%}.ritsei-process-designer .meta,.ritsei-process-designer .capability{display:block;font-size:12px;margin-top:5px}.ritsei-process-designer .meta{color:#697181}.ritsei-process-designer .capability{color:#5b3cc4;overflow-wrap:anywhere}.ritsei-process-designer .arrow{color:#8d8578;text-align:center}.ritsei-process-designer label{display:grid;font-size:12px;font-weight:700;gap:5px}.ritsei-process-designer .move{display:flex;gap:8px}.ritsei-process-designer .move button{flex:1;text-align:center}.ritsei-process-designer .mapping{border-top:1px solid #d6cfc1;font:11px ui-monospace,SFMono-Regular,monospace;padding-top:10px;overflow-wrap:anywhere}.ritsei-process-designer .validation{background:#fff6d7;border-left:4px solid #d58c13;color:#5b461c;margin-top:18px;padding:10px 12px}.ritsei-process-designer .valid{background:#eaf6d6;border-left-color:#4d8d45;color:#285124}.ritsei-process-designer .validation ul{margin:5px 0 0;padding-left:20px}
@media(max-width:900px){.ritsei-process-designer .grid{grid-template-columns:150px minmax(220px,1fr)}.ritsei-process-designer aside:last-child{border-top:1px solid #d6cfc1;grid-column:1/-1}}@media(max-width:620px){.ritsei-process-designer header{align-items:start;flex-direction:column;gap:14px}.ritsei-process-designer .grid{display:block}.ritsei-process-designer aside{border-bottom:1px solid #d6cfc1;border-right:0}}
@media(prefers-reduced-motion:reduce){.ritsei-process-designer *{scroll-behavior:auto!important;transition:none!important}}
`
  document.head.append(style)
}

type Handlers = {
  readonly add: (kind: ProcessNodeKind) => void
  readonly select: (id: string) => void
  readonly move: (id: string, direction: "up" | "down") => void
  readonly drop: (sourceId: string, targetId: string) => void
  readonly label: (id: string, value: string) => void
  readonly capability: (id: string, value: CatalogReference) => void
  readonly mapping: (id: string, value: TypedMapping) => void
  readonly validate: () => void
  readonly lane: (lane: ProcessStudioLane) => void
  readonly template: (id: string) => void
}

const enableDrag = (item: HTMLLIElement, node: DesignerNode, handlers: Handlers): void => {
  if (node.kind === "Start" || node.kind === "End") return
  item.draggable = true
  item.addEventListener(
    "dragstart",
    (event) => event.dataTransfer?.setData("text/plain", node.id),
  )
  item.addEventListener("dragover", (event) => event.preventDefault())
  item.addEventListener("drop", (event) => {
    event.preventDefault()
    const source = event.dataTransfer?.getData("text/plain")
    if (source) handlers.drop(source, node.id)
  })
}

const appendCapability = (card: HTMLDivElement, node: DesignerNode): void => {
  if (node.capability === undefined) return
  const ref = label(
    `${node.capability.kind}: ${node.capability.id || "unassigned"} v${node.capability.version}`,
  )
  ref.className = "capability"
  card.append(ref)
}

const nodeView = (node: DesignerNode, selected: boolean, handlers: Handlers): HTMLLIElement => {
  const item = tag("li")
  enableDrag(item, node, handlers)
  const card = tag("div")
  card.className = `node${selected ? " selected" : ""}`
  const select = button(node.label, () => handlers.select(node.id))
  select.setAttribute("aria-pressed", String(selected))
  select.setAttribute("aria-label", `Select ${node.label}`)
  card.append(select)
  const meta = label(`${node.kind} · ${node.id}`)
  meta.className = "meta"
  card.append(meta)
  appendCapability(card, node)
  item.append(card)
  return item
}

const catalogKind = (node: DesignerNode): CatalogReference["kind"] =>
  node.kind === "WaitForEvent" ? "DomainEvent" : "DomainAction"

const catalogKindLabel = (kind: CatalogReference["kind"]): string =>
  kind === "DomainEvent" ? "event" : "action"

const appendMappings = (fields: HTMLElement, node: DesignerNode): void => {
  for (const mapping of node.mappings) {
    const row = label(
      `${mapping.sourcePath} (${mapping.sourceType}) → ${mapping.targetPath} (${mapping.targetType})`,
    )
    row.className = "mapping"
    fields.append(row)
  }
}

const catalogEditor = (node: DesignerNode, handlers: Handlers): HTMLElement => {
  const fields = tag("div")
  fields.className = "inspector-fields"
  const capabilityKind = catalogKind(node)
  const capability = node.capability ?? { kind: capabilityKind, id: "", version: 1 }
  const action = tag("label")
  action.append(label(`Catalog ${catalogKindLabel(capabilityKind)} ID`))
  const actionInput = tag("input")
  actionInput.value = capability.id
  actionInput.addEventListener(
    "change",
    () =>
      handlers.capability(node.id, {
        ...capability,
        kind: capabilityKind,
        id: actionInput.value.trim(),
      }),
  )
  action.append(actionInput)
  fields.append(action)
  const version = tag("label")
  version.append(label("Catalog version"))
  const versionInput = tag("input")
  versionInput.type = "number"
  versionInput.min = "1"
  versionInput.step = "1"
  versionInput.value = String(capability.version)
  versionInput.addEventListener(
    "change",
    () => handlers.capability(node.id, { ...capability, version: Number(versionInput.value) }),
  )
  version.append(versionInput)
  fields.append(version)
  appendMappings(fields, node)
  fields.append(
    button("Add typed mapping", () =>
      handlers.mapping(node.id, {
        sourcePath: "input.value",
        targetPath: "command.value",
        sourceType: "string",
        targetType: "string",
      })),
  )
  return fields
}

const inspector = (node: DesignerNode | undefined, handlers: Handlers): HTMLElement => {
  const panel = tag("aside")
  panel.setAttribute("aria-label", "Inspector")
  const heading = tag("h2")
  heading.textContent = "Inspector"
  panel.append(heading)
  if (node === undefined) {
    panel.append(label("Select a node to edit the structured definition."))
    return panel
  }
  const form = tag("form")
  form.className = "inspector"
  const name = tag("label")
  name.append(label("Node label"))
  const nameInput = tag("input")
  nameInput.value = node.label
  nameInput.addEventListener("change", () => handlers.label(node.id, nameInput.value))
  name.append(nameInput)
  form.append(name)
  form.append(label(`Kind: ${node.kind}`))
  if (node.kind === "DomainCommand" || node.kind === "WaitForEvent") {
    form.append(catalogEditor(node, handlers))
  }
  const move = tag("div")
  move.className = "move"
  move.append(
    button("Move up", () => handlers.move(node.id, "up")),
    button("Move down", () => handlers.move(node.id, "down")),
  )
  form.append(move)
  panel.append(form)
  return panel
}

const laneStatus = (lane: ProcessStudioLane): string =>
  lane === "bounded_execution"
    ? `${ProcessStudioLaneDescriptions[lane]} Commands are never executed in the designer.`
    : ProcessStudioLaneDescriptions[lane]

const laneNavigation = (draft: ProcessStudioDraft, handlers: Handlers): HTMLElement => {
  const lanes = tag("nav")
  lanes.setAttribute("aria-label", "Process Studio lanes")
  for (const lane of ProcessStudioLanes) {
    const laneButton = button(ProcessStudioLaneLabels[lane], () => handlers.lane(lane))
    laneButton.setAttribute("aria-pressed", String(draft.lane === lane))
    lanes.append(laneButton)
  }
  return lanes
}

const templateList = (handlers: Handlers): HTMLElement => {
  const templates = tag("div")
  templates.className = "template-list"
  for (const template of ProcessStudioTemplates) {
    const option = tag("div")
    option.className = "template-option"
    const load = button(
      `Load ${template.name} · v${template.version}`,
      () => handlers.template(template.id),
    )
    load.setAttribute(
      "aria-label",
      `Load ${template.name} version ${template.version}: ${template.description}`,
    )
    option.append(load)
    const description = tag("p")
    description.textContent = template.description
    option.append(description)
    templates.append(option)
  }
  return templates
}

const nodePalette = (handlers: Handlers): HTMLElement => {
  const palette = tag("aside")
  const heading = tag("h2")
  heading.textContent = "Node palette"
  palette.append(heading)
  const buttons = tag("div")
  buttons.className = "palette"
  for (const kind of ProcessDesignerNodeKinds) {
    buttons.append(button(`＋ ${labelForNodeKind(kind)}`, () => handlers.add(kind)))
  }
  palette.append(buttons)
  return palette
}

const nodeList = (
  model: DesignerModel,
  selected: string,
  handlers: Handlers,
): HTMLOListElement => {
  const nodes = tag("ol")
  nodes.className = "nodes"
  model.nodes.forEach((node, index) => {
    nodes.append(nodeView(node, node.id === selected, handlers))
    if (index < model.nodes.length - 1) {
      const arrow = tag("li")
      arrow.className = "arrow"
      arrow.setAttribute("aria-hidden", "true")
      arrow.textContent = "↓"
      nodes.append(arrow)
    }
  })
  return nodes
}

const validationList = (
  issues: readonly ReturnType<typeof validateDesignerModel>[number][],
): HTMLUListElement => {
  const list = tag("ul")
  for (const issue of issues) {
    const item = tag("li")
    item.textContent = issue.message
    list.append(item)
  }
  return list
}

const validationPanel = (
  issues: readonly ReturnType<typeof validateDesignerModel>[number][],
): HTMLElement => {
  const validation = tag("div")
  validation.className = "validation"
  validation.setAttribute("aria-live", "polite")
  if (issues.length === 0) {
    validation.classList.add("valid")
    validation.textContent = "Draft is structurally valid. Publish remains a backend concern."
  } else {
    validation.append(label(`${issues.length} validation issue${issues.length === 1 ? "" : "s"}`))
    validation.append(validationList(issues))
  }
  return validation
}

const view = (
  draft: ProcessStudioDraft,
  selected: string,
  issues: readonly ReturnType<typeof validateDesignerModel>[number][],
  handlers: Handlers,
): HTMLElement => {
  const { model } = draft
  const shell = tag("div")
  shell.className = "ritsei-process-designer"
  const header = tag("header")
  const title = tag("div")
  const eyebrow = label("Process Studio / Design time")
  eyebrow.className = "eyebrow"
  title.append(
    eyebrow,
    (() => {
      const h = tag("h1")
      h.textContent = "Order path"
      return h
    })(),
  )
  const subtitle = label("Compose a typed process without executing business semantics.")
  subtitle.className = "subtitle"
  title.append(subtitle)
  const badge = label(`${model.environment} · v${model.version}`)
  badge.className = "badge"
  header.append(title, badge)
  shell.append(header)
  shell.append(laneNavigation(draft, handlers))
  const status = label(laneStatus(draft.lane))
  status.className = "lane-status"
  status.setAttribute("role", "status")
  status.setAttribute("aria-live", "polite")
  shell.append(status)
  if (draft.lane === "templates") shell.append(templateList(handlers))
  const grid = tag("div")
  grid.className = "grid"
  grid.append(nodePalette(handlers))
  const canvas = tag("main")
  const toolbar = tag("div")
  toolbar.className = "toolbar"
  toolbar.append(
    label("Drag to reorder. Keyboard buttons provide the same transition."),
    button("Validate draft", handlers.validate, "validate"),
  )
  canvas.append(toolbar)
  canvas.append(nodeList(model, selected, handlers), validationPanel(issues))
  grid.append(canvas, inspector(model.nodes.find((node) => node.id === selected), handlers))
  shell.append(grid)
  return shell
}

export type ProcessDesignerMount = {
  readonly dispose: () => void
  readonly readIr: () => string
  readonly readDraft: () => ProcessStudioDraft
}

export const mountProcessDesigner = (
  root: HTMLElement,
  initialModel: DesignerModel = makeInitialDesignerModel(),
): ProcessDesignerMount => {
  ensureStyle()
  let currentDraft = makeProcessStudioDraft(initialModel)
  let currentIr = serializeProcessStudioDraft(currentDraft)
  const dispose = createRoot((rootDispose) => {
    const [model, setModel] = createSignal(initialModel)
    const [lane, setLane] = createSignal<ProcessStudioLane>(currentDraft.lane)
    const [source, setSource] = createSignal(currentDraft.metadata.source)
    const [selected, setSelected] = createSignal(initialModel.nodes[0]?.id ?? "")
    const [issues, setIssues] = createSignal(validateDesignerModel(initialModel))
    const update = (
      next: DesignerModel,
      nextLane: ProcessStudioLane = lane(),
      nextSource: ProcessDraftSource = source(),
    ) => {
      setModel(next)
      setIssues(validateDesignerModel(next))
      currentDraft = {
        ...currentDraft,
        model: next,
        lane: nextLane,
        metadata: { status: "DRAFT", source: nextSource },
      }
      currentIr = serializeProcessStudioDraft(currentDraft)
    }
    const handlers: Handlers = {
      add: (kind) => {
        const next = applyDesignerAction(model(), { _tag: "add_node", kind })
        update(next)
        setSelected(next.nodes.at(-2)?.id ?? "")
      },
      select: setSelected,
      move: (id, direction) =>
        update(applyDesignerAction(model(), { _tag: "reorder_node", nodeId: id, direction })),
      drop: (sourceId, targetId) =>
        update(applyDesignerAction(model(), { _tag: "move_node", sourceId, targetId })),
      label: (id, value) =>
        update(applyDesignerAction(model(), { _tag: "set_label", nodeId: id, label: value })),
      capability: (id, value) =>
        update(
          applyDesignerAction(model(), { _tag: "set_capability", nodeId: id, capability: value }),
        ),
      mapping: (id, value) =>
        update(applyDesignerAction(model(), { _tag: "add_mapping", nodeId: id, mapping: value })),
      validate: () => setIssues(validateDesignerModel(model())),
      lane: (next) => {
        setLane(next)
        currentDraft = { ...currentDraft, lane: next }
      },
      template: (id) => {
        const next = getProcessStudioTemplate(id)
        if (next === undefined) return
        setLane("templates")
        setSource("template")
        update(next, "templates", "template")
        setSelected(next.nodes[0]?.id ?? "")
      },
    }
    createEffect(
      () => ({
        draft: {
          model: model(),
          lane: lane(),
          metadata: { status: "DRAFT" as const, source: source() },
        },
        selected: selected(),
        issues: issues(),
      }),
      (current) =>
        root.replaceChildren(view(current.draft, current.selected, current.issues, handlers)),
    )
    return rootDispose
  })
  return {
    dispose: () => {
      dispose()
      root.replaceChildren()
    },
    readIr: () => currentIr,
    readDraft: () => currentDraft,
  }
}
