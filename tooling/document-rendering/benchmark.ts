import * as Effect from "effect/Effect"

import {
  hashJson,
  makeDocumentAst,
  makeDocumentRenderJobPayload,
  makeDocumentRenderRequest,
} from "../../foundation/mod.ts"
import { documentBenchmarkCorpus } from "./corpus.ts"

const tenantId = "018f0000-0000-7000-8000-000000000001"
const snapshotId = "018f0000-0000-7000-8000-000000000014"
const astId = "018f0000-0000-7000-8000-000000000015"
const parsedIterations = Number(Deno.args[0] ?? "250")
const iterations = Number.isInteger(parsedIterations) && parsedIterations > 0
  ? parsedIterations
  : 250

const preparation = Effect.gen(function* () {
  const results: Array<{ name: string; iterations: number; elapsedMs: number }> = []
  for (const fixture of documentBenchmarkCorpus) {
    const startedAt = performance.now()
    const snapshotChecksum = yield* hashJson({ fixture: fixture.name, version: 1 })
    for (let index = 0; index < iterations; index += 1) {
      const ast = yield* makeDocumentAst({
        astId,
        snapshotId,
        documentType: fixture.name,
        astVersion: 1,
        nodes: fixture.nodes,
      })
      const request = yield* makeDocumentRenderRequest({
        tenantId,
        snapshotId,
        snapshotChecksum,
        astId: ast.astId,
        astChecksum: ast.checksum,
        templateId: "benchmark-default",
        templateVersion: 1,
        documentSchemaVersion: 1,
        rendererFamily: fixture.capabilities.includes("paged-media")
          ? "publishing"
          : "native-transactional",
        rendererVersion: "contract-test",
        assetVersions: [],
        capabilities: fixture.capabilities,
        astNodeCount: ast.nodes.length,
        pageCount: fixture.pageCount,
        assetBytes: fixture.assetBytes,
        correlationId: `document-benchmark:${fixture.name}:${index}`,
      })
      yield* makeDocumentRenderJobPayload(request)
    }
    results.push({
      name: fixture.name,
      iterations,
      elapsedMs: Number((performance.now() - startedAt).toFixed(3)),
    })
  }
  return results
})

if (import.meta.main) {
  const results = await Effect.runPromise(preparation)
  console.log(JSON.stringify({
    benchmark: "document-preparation",
    fixtures: results,
    rendererActivated: false,
    note: "This measures AST, fingerprint, and job-payload preparation only.",
  }))
}
