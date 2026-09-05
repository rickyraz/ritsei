import { existsSync } from "node:fs"
import process from "node:process"

const envFile = existsSync(".env.local") ? ".env.local" : existsSync(".env") ? ".env" : undefined

if (envFile) {
  const loadEnvFile = (process as unknown as { loadEnvFile?: (path: string) => void }).loadEnvFile
  loadEnvFile?.call(process, envFile)
}
