import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: [
      "modules/**/tests/**/*.test.{ts,tsx}",
      "foundation/**/tests/**/*.test.{ts,tsx}",
      "platform/**/tests/**/*.test.{ts,tsx}",
      "runtime/**/*.test.{ts,tsx}",
      "tests/architecture/**/*.test.{ts,tsx}",
    ],
    setupFiles: ["./tooling/load-env.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    exclude: ["vendor/**", "node_modules/**", ".auto/**"],
  },
})
