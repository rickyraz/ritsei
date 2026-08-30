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
  serializeProcessIr,
  toProcessIr,
  type TypedMapping,
  validateDesignerModel,
} from "./designer-model.ts"

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
.ritsei-process-designer aside,.ritsei-process-designer main{padding:20px}.ritsei-process-designer aside{border-right:1px solid #d6cfc1}.ritsei-process-designer aside:last-child{border-left:1px solid #d6cfc1;border-right:0}.ritsei-process-designer .palette,.ritsei-process-designer .nodes,.ritsei-process-designer .inspector{display:grid;gap:9px}.ritsei-process-designer .palette{margin-top:14px}.ritsei-process-designer .palette button{border-left:4px solid #5b3cc4}
.ritsei-process-designer .toolbar{align-items:center;display:flex;gap:10px;justify-content:space-between;margin-bottom:16px}.ritsei-process-designer .toolbar p{color:#596273;font-size:13px}.ritsei-process-designer .validate{background:#5b3cc4;border-color:#5b3cc4;color:#fff;font-weight:700}
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
  readonly label: (id: string, value: string) => void
  readonly capability: (id: string, value: CatalogReference) => void
  readonly mapping: (id: string, value: TypedMapping) => void
  readonly validate: () => void
}

const nodeView = (node: DesignerNode, selected: boolean, handlers: Handlers): HTMLLIElement => {
  const item = tag("li")
  if (node.kind !== "Start" && node.kind !== "End") {
    item.draggable = true
    item.addEventListener(
      "dragstart",
      (event) => event.dataTransfer?.setData("text/plain", node.id),
    )
    item.addEventListener("dragover", (event) => event.preventDefault())
    item.addEventListener("drop", (event) => {
      event.preventDefault()
      const source = event.dataTransfer?.getData("text/plain")
      if (source) handlers.move(source, "down")
    })
  }
  const card = tag("div")
  card.className = `node${selected ? " selected" : ""}`
  const select = button(node.label, () => handlers.select(node.id))
  select.setAttribute("aria-pressed", String(selected))
  select.setAttribute("aria-label", `Select ${node.label}`)
  card.append(select)
  const meta = label(`${node.kind} · ${node.id}`)
  meta.className = "meta"
  card.append(meta)
  if (node.capability !== undefined) {
    const ref = label(
      `${node.capability.kind}: ${node.capability.id || "unassigned"} v${node.capability.version}`,
    )
    ref.className = "capability"
    card.append(ref)
  }
  item.append(card)
  return item
}

const inspector = (node: DesignerNode | undefined, handlers: Handlers): HTMLElement => {
  const panel = tag("aside")
  panel.append(label("Inspector"))
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
  if (node.kind === "DomainCommand") {
    const capability = node.capability ?? { kind: "DomainAction" as const, id: "", version: 1 }
    const action = tag("label")
    action.append(label("Catalog action ID"))
    const actionInput = tag("input")
    actionInput.value = capability.id
    actionInput.addEventListener(
      "change",
      () => handlers.capability(node.id, { ...capability, id: actionInput.value.trim() }),
    )
    action.append(actionInput)
    form.append(action)
    const version = tag("label")
    version.append(label("Catalog version"))
    const versionInput = tag("input")
    versionInput.type = "number"
    versionInput.value = String(capability.version)
    versionInput.addEventListener(
      "change",
      () => handlers.capability(node.id, { ...capability, version: Number(versionInput.value) }),
    )
    version.append(versionInput)
    form.append(version)
    for (const mapping of node.mappings) {
      const row = label(
        `${mapping.sourcePath} (${mapping.sourceType}) → ${mapping.targetPath} (${mapping.targetType})`,
      )
      row.className = "mapping"
      form.append(row)
    }
    const addMapping = button("Add typed mapping", () =>
      handlers.mapping(node.id, {
        sourcePath: "input.value",
        targetPath: "command.value",
        sourceType: "string",
        targetType: "string",
      }))
    form.append(addMapping)
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

const view = (
  model: DesignerModel,
  selected: string,
  issues: readonly ReturnType<typeof validateDesignerModel>[number][],
  handlers: Handlers,
): HTMLElement => {
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
  const grid = tag("div")
  grid.className = "grid"
  const palette = tag("aside")
  palette.append((() => {
    const h = tag("h2")
    h.textContent = "Node palette"
    return h
  })())
  const buttons = tag("div")
  buttons.className = "palette"
  for (const kind of ProcessDesignerNodeKinds) {
    buttons.append(button(`＋ ${labelForNodeKind(kind)}`, () => handlers.add(kind)))
  }
  palette.append(buttons)
  grid.append(palette)
  const canvas = tag("main")
  const toolbar = tag("div")
  toolbar.className = "toolbar"
  toolbar.append(
    label("Drag to reorder. Keyboard buttons provide the same transition."),
    button("Validate draft", handlers.validate, "validate"),
  )
  canvas.append(toolbar)
  const nodes = tag("ol")
  nodes.className = "nodes"
  model.nodes.forEach((node, index) => {
    nodes.append(nodeView(node, node.id === selected, handlers))
    if (index < model.nodes.length - 1) {
      const arrow = label("↓")
      arrow.className = "arrow"
      nodes.append(arrow)
    }
  })
  canvas.append(nodes)
  const validation = tag("div")
  validation.className = `validation${issues.length === 0 ? " valid" : ""}`
  validation.setAttribute("aria-live", "polite")
  if (issues.length === 0) {
    validation.textContent = "Draft is structurally valid. Publish remains a backend concern."
  } else {
    validation.append(label(`${issues.length} validation issue${issues.length === 1 ? "" : "s"}`))
    const list = tag("ul")
    for (const issue of issues) {
      const item = tag("li")
      item.textContent = issue.message
      list.append(item)
    }
    validation.append(list)
  }
  canvas.append(validation)
  grid.append(canvas, inspector(model.nodes.find((node) => node.id === selected), handlers))
  shell.append(grid)
  return shell
}

export type ProcessDesignerMount = { readonly dispose: () => void; readonly readIr: () => string }

export const mountProcessDesigner = (
  root: HTMLElement,
  initialModel: DesignerModel = makeInitialDesignerModel(),
): ProcessDesignerMount => {
  ensureStyle()
  let currentIr = serializeProcessIr(toProcessIr(initialModel))
  const dispose = createRoot((rootDispose) => {
    const [model, setModel] = createSignal(initialModel)
    const [selected, setSelected] = createSignal(initialModel.nodes[0]?.id ?? "")
    const [issues, setIssues] = createSignal(validateDesignerModel(initialModel))
    const update = (next: DesignerModel) => {
      setModel(next)
      setIssues(validateDesignerModel(next))
      currentIr = serializeProcessIr(toProcessIr(next))
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
      label: (id, value) =>
        update(applyDesignerAction(model(), { _tag: "set_label", nodeId: id, label: value })),
      capability: (id, value) =>
        update(
          applyDesignerAction(model(), { _tag: "set_capability", nodeId: id, capability: value }),
        ),
      mapping: (id, value) =>
        update(applyDesignerAction(model(), { _tag: "add_mapping", nodeId: id, mapping: value })),
      validate: () => setIssues(validateDesignerModel(model())),
    }
    createEffect(
      () => ({ model: model(), selected: selected(), issues: issues() }),
      (current) =>
        root.replaceChildren(view(current.model, current.selected, current.issues, handlers)),
    )
    return rootDispose
  })
  return {
    dispose: () => {
      dispose()
      root.replaceChildren()
    },
    readIr: () => currentIr,
  }
}
