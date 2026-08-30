import { extractModuleSpecifiers } from "../public-contract/check.ts"
import { collectSourceFiles, type SourceFile } from "../source-files.ts"

const roots = ["apps", "packages", "tests"] as const
// ponytail: closed provider list; extend when a new SDK is approved.
const providerSpecifiers = [
  /^@ai-sdk(?:\/|$)/,
  /^@anthropic-ai(?:\/|$)/,
  /^@google\/generative-ai(?:\/|$)/,
  /^@mistralai(?:\/|$)/,
  /^@cohere-ai(?:\/|$)/,
  /^@langchain(?:\/|$)/,
  /^langchain(?:\/|$)/,
  /^openai(?:\/|$)/,
  /^anthropic(?:\/|$)/,
  /^ollama(?:\/|$)/,
  /^groq-sdk(?:\/|$)/,
  /^effect\/unstable\/ai(?:\/|$)/,
] as const
const privateSpecifier =
  /(?:^|\/)(?:db\/schema|migrations?|repositories?|repository|tables?|table|postgres)(?:\/|\.|$)/i
const privatePackageSource = /^@ritsei\/[^/]+\/src\//
const privateKernelSource = /^@ritsei\/kernel(?:\/|$)/
const databaseSpecifier = /^(?:drizzle-orm|postgres|@effect\/sql-pg)(?:\/|$)/
const directMutation =
  /\b(?:db|database|tx|transaction|store|repository)\s*\.\s*(?:insert|update|delete|execute|query|save|write|create)\s*\(/i

const normalizePath = (path: string) => path.replaceAll("\\", "/")
const isProviderImport = (specifier: string) =>
  providerSpecifiers.some((pattern) => pattern.test(specifier))
const isAiSurface = (path: string) =>
  path.startsWith("packages/integrations/") ||
  /(?:^|\/)(?:ai|agent|agents|recommendation|recommendations)(?:\/|[-_.]|$)/i.test(path)
const isApprovedProviderPath = (path: string) => path.startsWith("packages/integrations/")

const isPrivateSpecifier = (specifier: string) =>
  privateSpecifier.test(specifier) ||
  privatePackageSource.test(specifier) ||
  privateKernelSource.test(specifier) ||
  databaseSpecifier.test(specifier)

const providerBoundaryFailures = (path: string, providerImports: readonly string[]) =>
  isApprovedProviderPath(path) ? [] : providerImports.map(
    (specifier) =>
      `${path}: model/provider import ${
        JSON.stringify(specifier)
      } must stay under packages/integrations/`,
  )

const privateBoundaryFailures = (path: string, specifiers: readonly string[]) =>
  specifiers.filter(isPrivateSpecifier).map(
    (specifier) =>
      `${path}: AI/provider code cannot import private persistence ${JSON.stringify(specifier)}`,
  )

const analyzeAiFile = (file: SourceFile): readonly string[] => {
  const path = normalizePath(file.path)
  const specifiers = extractModuleSpecifiers(file.source)
  const providerImports = specifiers.filter(isProviderImport)
  const aiSurface = isAiSurface(path) || providerImports.length > 0
  if (!aiSurface) return providerBoundaryFailures(path, providerImports)

  return [
    ...providerBoundaryFailures(path, providerImports),
    ...privateBoundaryFailures(path, specifiers),
    ...(directMutation.test(file.source)
      ? [`${path}: AI/provider code cannot issue direct business-fact mutations`]
      : []),
  ]
}

export const analyzeAiBoundary = (files: readonly SourceFile[]): readonly string[] =>
  files.flatMap(analyzeAiFile).toSorted()

export const checkAiBoundary = async (): Promise<readonly string[]> => {
  const files = (await Promise.all(roots.map((root) => collectSourceFiles(root, [".ts", ".tsx"]))))
    .flat()
  return analyzeAiBoundary(files)
}

if (import.meta.main) {
  const failures = await checkAiBoundary()
  if (failures.length > 0) {
    console.error(failures.join("\n"))
    Deno.exit(1)
  }
  console.log("AI/provider boundary valid")
}
