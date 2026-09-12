import { Tabs as KobalteTabs } from "@kobalte/core/tabs"
import type { JSX } from "@solidjs/web"
import { css } from "../generated/css/index.js"

export interface TabItem {
  readonly value: string
  readonly label: string
  readonly content: JSX.Element
  readonly disabled?: boolean
}

export interface TabsProps {
  readonly items: readonly TabItem[]
  readonly value?: string
  readonly defaultValue?: string
  readonly onChange?: (value: string) => void
}

const styles = {
  root: css({ display: "flex", flexDirection: "column", gap: "3" }),
  list: css({ display: "flex", gap: "1", borderBottomWidth: "1px", borderColor: "boundary" }),
  trigger: css({
    border: "[0]",
    borderBottomWidth: "[2px]",
    borderColor: "transparent",
    bg: "transparent",
    color: "muted",
    px: "3",
    py: "2",
    cursor: "pointer",
    _focusVisible: { outline: "[3px solid]", outlineColor: "action", outlineOffset: "[2px]" },
    _selected: { color: "text", borderColor: "action" },
  }),
  content: css({ color: "text" }),
}

export function Tabs(props: TabsProps) {
  return (
    <KobalteTabs
      class={styles.root}
      value={props.value}
      defaultValue={props.defaultValue ?? props.items[0]?.value}
      onChange={props.onChange}
    >
      <KobalteTabs.List class={styles.list}>
        {props.items.map((item) => (
          <KobalteTabs.Trigger class={styles.trigger} value={item.value} disabled={item.disabled}>
            {item.label}
          </KobalteTabs.Trigger>
        ))}
        <KobalteTabs.Indicator />
      </KobalteTabs.List>
      {props.items.map((item) => (
        <KobalteTabs.Content class={styles.content} value={item.value}>
          {item.content}
        </KobalteTabs.Content>
      ))}
    </KobalteTabs>
  )
}
