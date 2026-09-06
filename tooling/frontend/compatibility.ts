import { build } from "vite"
import solid from "@solidjs/vite-plugin"

// A real bundler probe: package metadata alone does not prove Solid 2 compatibility.
const probeSolidPackage = async (entry: string) => {
  try {
    await build({
      configFile: false,
      logLevel: "silent",
      plugins: [solid()],
      build: {
        write: false,
        lib: { entry, formats: ["es"] },
      },
    })
    return { build: "passed" as const, behavior: "unreviewed" as const }
  } catch (cause) {
    return { build: "blocked" as const, diagnostic: String(cause) }
  }
}

export const probeKobalteCompatibility = () =>
  probeSolidPackage("apps/web/src/ui/compatibility/kobalte.tsx")

export const probeDndCompatibility = () =>
  probeSolidPackage("apps/web/src/ui/compatibility/dnd.tsx")

if (import.meta.main) {
  const result = await probeKobalteCompatibility()
  console.log(JSON.stringify(result, null, 2))
  // A successful bundle still needs the dialog's browser/accessibility evidence.
  if (result.build === "blocked") Deno.exit(1)
}
