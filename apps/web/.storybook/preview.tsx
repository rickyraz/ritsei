import { createJSXDecorator } from "storybook-solidjs-vite"
import type { Preview } from "storybook-solidjs-vite"
import { layout } from "../src/ui/index.ts"

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Semantic UI theme",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    createJSXDecorator((Story, context) => (
      <div data-theme={context.globals.theme ?? "light"} class={layout.page}>
        <Story />
      </div>
    )),
  ],
}

export default preview
