import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  preflight: true,
  strictTokens: true,
  include: ["./src/ui/**/*.{ts,tsx}"],
  exclude: ["./src/ui/generated/**"],
  outdir: "src/ui/generated",
  outExtension: "js",
  conditions: { dark: "[data-theme=dark] &" },
  theme: {
    extend: {
      tokens: {
        colors: {
          ink: { value: "#151A1E" },
          slate: { value: "#37434B" },
          paper: { value: "#F4F0E6" },
          surface: { value: "#FAF8F2" },
          terrain: { value: "#365A72" },
        },
        fonts: { body: { value: "Arial, Helvetica, sans-serif" } },
      },
      semanticTokens: {
        colors: {
          canvas: { value: { base: "{colors.paper}", _dark: "{colors.ink}" } },
          content: { value: { base: "{colors.surface}", _dark: "#252C32" } },
          text: { value: { base: "{colors.ink}", _dark: "{colors.paper}" } },
          muted: { value: { base: "{colors.slate}", _dark: "#BDC9D0" } },
          action: { value: { base: "{colors.terrain}", _dark: "#A7BBC4" } },
          onAction: {
            value: { base: "{colors.surface}", _dark: "{colors.ink}" },
          },
          boundary: { value: { base: "#738089", _dark: "#8A9AA5" } },
          danger: { value: { base: "#A52C22", _dark: "#FFAEA5" } },
        },
      },
      recipes: {
        control: {
          className: "control",
          base: {
            borderRadius: "sm",
            borderWidth: "1px",
            borderColor: "boundary",
            minHeight: "11",
            px: "3",
            py: "2",
            color: "text",
            bg: "content",
            _focusVisible: {
              outline: "3px solid",
              outlineColor: "action",
              outlineOffset: "2px",
            },
            _disabled: { cursor: "not-allowed" },
          },
          variants: {
            kind: {
              action: {
                bg: "action",
                color: "onAction",
                fontWeight: "bold",
                cursor: "pointer",
              },
              input: { width: "full", maxWidth: "xl" },
            },
          },
        },
        surface: {
          className: "surface",
          base: {
            bg: "content",
            borderWidth: "1px",
            borderColor: "boundary",
            p: "5",
            borderRadius: "sm",
          },
        },
      },
    },
  },
  staticCss: { recipes: { control: ["*"], surface: ["*"] } },
  globalCss: {
    "html": {
      bg: "canvas",
      color: "text",
      fontFamily: "body",
      fontSize: "16px",
      lineHeight: "1.5",
    },
    "body": { margin: "0" },
    "h1": { fontSize: "3xl", fontWeight: "bold", lineHeight: "1.2" },
    "h2": { fontSize: "xl", fontWeight: "bold" },
    "a": {
      color: "action",
      textDecoration: "underline",
      textUnderlineOffset: "3px",
    },
    "a:focus-visible, summary:focus-visible": {
      outline: "3px solid",
      outlineColor: "action",
      outlineOffset: "3px",
    },
    "button:disabled": { opacity: "0.6" },
    "table": {
      width: "full",
      borderCollapse: "collapse",
      fontVariantNumeric: "tabular-nums",
    },
    "th, td": {
      textAlign: "left",
      p: "3",
      borderBottomWidth: "1px",
      borderColor: "boundary",
      verticalAlign: "top",
      overflowWrap: "anywhere",
    },
    "caption": { textAlign: "left", color: "muted", pb: "3" },
    "[role=alert]": { color: "danger" },
    "@media (forced-colors: active)": {
      "button, input": { border: "1px solid ButtonText" },
    },
  },
})
