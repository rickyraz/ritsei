import { type Gate, type GateCommand, type GateRequirement, gates } from "./registry.ts"

type FinancialManifest = {
  readonly gates?: ReadonlyArray<{
    readonly id?: string
    readonly observed?: string
    readonly evidenceClass?: string
    readonly acceptedEvidenceClasses?: readonly string[]
  }>
}

type GateResult = {
  readonly gate: Gate
  readonly passed: boolean
  readonly reason: string
}

const readText = async (path: string): Promise<string | undefined> => {
  try {
    return await Deno.readTextFile(path)
  } catch {
    return undefined
  }
}

const readRequirement = async (requirement: GateRequirement): Promise<string | undefined> => {
  try {
    const info = await Deno.stat(requirement.path)
    if (info.isFile) return await Deno.readTextFile(requirement.path)
    if (!info.isDirectory) return undefined

    const chunks: string[] = []
    const visit = async (path: string): Promise<void> => {
      for await (const entry of Deno.readDir(path)) {
        const child = `${path}/${entry.name}`
        if (entry.isDirectory) await visit(child)
        else if (entry.isFile) {
          const text = await readText(child)
          if (text !== undefined) chunks.push(text)
        }
      }
    }
    await visit(requirement.path)
    return chunks.join("\n")
  } catch {
    return undefined
  }
}

const markersPass = async (requirements: readonly GateRequirement[]): Promise<boolean> => {
  for (const requirement of requirements) {
    const text = await readRequirement(requirement)
    if (text === undefined) return false
    if (!(requirement.markers ?? []).every((marker) => text.includes(marker))) return false
  }
  return true
}

const commandsPass = async (commands: readonly GateCommand[]): Promise<boolean> => {
  for (const command of commands) {
    const result = await new Deno.Command("deno", {
      args: [...command.args],
      stdout: "null",
      stderr: "piped",
    }).output()
    if (result.code !== 0) return false
  }
  return true
}

const runDomainMeasure = async (): Promise<Map<string, boolean>> => {
  const output = await new Deno.Command("deno", {
    args: ["run", "--allow-read", "--allow-run", "tooling/domain-maturity/measure.ts"],
    stdout: "piped",
    stderr: "piped",
  }).output()
  const stdout = new TextDecoder().decode(output.stdout)
  const stderr = new TextDecoder().decode(output.stderr)
  if (output.code !== 0) console.error(stderr)
  const results = new Map<string, boolean>()
  for (const gate of gates) {
    if (gate.kind !== "domain" || gate.domain === undefined) continue
    results.set(
      gate.domain,
      output.code === 0 && new RegExp(`^PASS ${gate.domain} `, "m").test(stdout),
    )
  }
  return results
}

const readFinancialResults = async (): Promise<Map<string, boolean>> => {
  const manifestText = await readText(
    "docs/operations/financial-readiness-evidence-2026-08-18.json",
  )
  const manifest = manifestText === undefined
    ? undefined
    : JSON.parse(manifestText) as FinancialManifest
  const byId = new Map((manifest?.gates ?? []).map((gate) => [gate.id, gate]))
  const results = new Map<string, boolean>()
  for (const gate of gates) {
    if (gate.kind !== "financial" || gate.financialId === undefined) continue
    const evidence = byId.get(gate.financialId)
    results.set(
      gate.financialId,
      evidence?.observed === "PASS" &&
        evidence.evidenceClass !== undefined &&
        evidence.acceptedEvidenceClasses?.includes(evidence.evidenceClass) === true,
    )
  }
  return results
}

const domainResults = await runDomainMeasure()
const financialResults = await readFinancialResults()
const results = new Map<string, GateResult>()

for (const gate of gates) {
  const dependencies = gate.dependencies ?? []
  const dependenciesPassed = dependencies.every((id) => results.get(id)?.passed === true)
  if (gate.kind === "domain") {
    const passed = dependenciesPassed && domainResults.get(gate.domain!) === true
    results.set(gate.id, {
      gate,
      passed,
      reason: passed ? "domain-maturity measure passed" : "domain-maturity measure failed",
    })
    continue
  }
  if (gate.kind === "financial") {
    const passed = dependenciesPassed && financialResults.get(gate.financialId!) === true
    results.set(gate.id, {
      gate,
      passed,
      reason: passed ? "financial evidence accepted" : "financial evidence is incomplete",
    })
    continue
  }
  if (gate.kind === "markers") {
    const markers = dependenciesPassed && await markersPass(gate.requirements ?? [])
    const commands = markers && await commandsPass(gate.commands ?? [])
    const passed = markers && commands
    results.set(gate.id, {
      gate,
      passed,
      reason: !dependenciesPassed
        ? "dependent gates remain incomplete"
        : !markers
        ? "required evidence is missing"
        : !commands
        ? "required executable checks failed"
        : "required evidence and executable checks passed",
    })
    continue
  }
  const passed = dependencies.length > 0 && dependenciesPassed
  results.set(gate.id, {
    gate,
    passed,
    reason: passed ? "all dependent gates passed" : "dependent gates remain incomplete",
  })
}

for (const result of results.values()) {
  console.log(`${result.passed ? "PASS" : "OPEN"} ${result.gate.id} — ${result.gate.title}`)
  if (!result.passed) console.log(`  ${result.reason}`)
}

const completed = [...results.values()].filter((result) => result.passed).length
const remaining = gates.length - completed
const level3 = gates.filter((gate) => gate.kind === "domain" && results.get(gate.id)?.passed).length
const processGates = gates.filter((gate) => gate.id.startsWith("process."))
const integrationGates = gates.filter((gate) => gate.id.startsWith("integration."))
const partialText = await readText("docs/roadmap/domain-maturity.md") ?? ""
const partialCommittedPackages = [...partialText.matchAll(/^\| `[^`]+`[^\n]*\bPARTIAL\b/gm)].length
const unknownText = await readText("docs/roadmap/erp-primitives.md") ?? ""
const openUnknownDecisions = [...unknownText.matchAll(/^\|[^\n]*\b`UNKNOWN`\b/gm)].length
const financialRemaining =
  gates.filter((gate) => gate.kind === "financial" && results.get(gate.id)?.passed !== true).length
const processRemaining = processGates.filter((gate) => results.get(gate.id)?.passed !== true).length
const integrationRemaining =
  integrationGates.filter((gate) => results.get(gate.id)?.passed !== true).length

console.log(`METRIC roadmap_exit_gates_completed=${completed}`)
console.log(`METRIC remaining_roadmap_exit_gates=${remaining}`)
console.log(`METRIC level3_capabilities=${level3}`)
console.log(`METRIC partial_committed_packages=${partialCommittedPackages}`)
console.log(`METRIC open_unknown_decisions=${openUnknownDecisions}`)
console.log(`METRIC financial_activation_gates_remaining=${financialRemaining}`)
console.log(`METRIC process_studio_gates_remaining=${processRemaining}`)
console.log(`METRIC integration_gates_remaining=${integrationRemaining}`)
