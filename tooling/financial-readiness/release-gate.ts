import { evaluateFinancialManifest } from "./evaluate.ts"

const manifestPath = Deno.args[0] ?? "docs/operations/financial-readiness-evidence-2026-08-18.json"

const failClosed = (message: string): never => {
  console.error(message)
  console.error("NO-GO — PostgreSQL remains the default financial engine.")
  Deno.exit(1)
}

const evaluation = await (async () => {
  try {
    return evaluateFinancialManifest(JSON.parse(await Deno.readTextFile(manifestPath)))
  } catch (error) {
    return failClosed(`Unable to validate evidence manifest ${manifestPath}: ${String(error)}`)
  }
})()

for (const { gate, passes } of evaluation.gates) {
  console.log(
    `${passes ? "PASS" : "FAIL"} ${gate.id} ` +
      `[observed=${gate.observed}, evidence=${gate.evidenceClass}, accepted=${
        gate.acceptedEvidenceClasses.join("|")
      }] ${gate.title}`,
  )
  console.log(`  ${gate.reason}`)
  if (!passes) {
    console.log(`  required: ${gate.requiredEvidence}`)
    console.log(`  remediation: ${gate.remediation}`)
  }
}

console.log(
  `SUMMARY ${evaluation.passed} PASS / ${evaluation.failed} FAIL / ${evaluation.gates.length} TOTAL`,
)

if (evaluation.failed > 0) {
  failClosed(`${evaluation.failed} final production-readiness gate(s) remain unresolved.`)
}

console.log("GO — TigerBeetle is approved for controlled production activation.")
