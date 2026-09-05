import { build } from "vite"
import solid from "@solidjs/vite-plugin"

// A real bundler probe: package metadata alone does not prove Solid 2 compatibility.
export const probeKobalteCompatibility = async () => {
  try {
    await build({
      configFile: false,
      logLevel: "silent",
      plugins: [solid()],
      build: {
        write: false,
        lib: { entry: "apps/web/src/ui/compatibility/kobalte.tsx", formats: ["es"] },
      },
    })
    return { build: "passed" as const, behavior: "unreviewed" as const }
  } catch (cause) {
    return { build: "blocked" as const, diagnostic: String(cause) }
  }
}

if (import.meta.main) {
  const result = await probeKobalteCompatibility()
  console.log(JSON.stringify(result, null, 2))
  // A successful bundle still needs the dialog's browser/accessibility evidence.
  if (result.build === "blocked") Deno.exit(1)
}
