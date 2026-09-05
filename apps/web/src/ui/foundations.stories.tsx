import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { control, layout, surface } from "./index.ts"

function FoundationsStory() {
  return (
    <main class={layout.main}>
      <div class={layout.stack}>
        <header class={layout.stack}>
          <p class={layout.notice}>RITSEI shared UI</p>
          <h1>Foundation recipes</h1>
          <p>
            Semantic controls and surfaces stay usable in light and dark themes.
          </p>
        </header>

        <section class={surface()} aria-labelledby="actions-heading">
          <div class={layout.stack}>
            <h2 id="actions-heading">Actions</h2>
            <div class={layout.row}>
              <button class={control({ kind: "action" })} type="button">
                Save changes
              </button>
              <button class={control({ kind: "action" })} type="button" disabled>
                Disabled action
              </button>
            </div>
          </div>
        </section>

        <section class={surface()} aria-labelledby="inputs-heading">
          <div class={layout.stack}>
            <h2 id="inputs-heading">Inputs</h2>
            <label class={layout.stack} for="email">
              <span>Email address</span>
              <input
                class={control({ kind: "input" })}
                id="email"
                name="email"
                type="email"
                value="operator@example.com"
              />
            </label>
          </div>
        </section>
      </div>
    </main>
  )
}

const meta = {
  title: "UI/Foundations",
  component: FoundationsStory,
} satisfies Meta<typeof FoundationsStory>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {}
