import type { JSX } from "@solidjs/web"
import { layout } from "../foundations/layout.ts"
import { surface } from "../recipes/surface.ts"

export interface FilterBarProps {
  readonly label?: string
  readonly children: JSX.Element
  readonly actions?: JSX.Element
  readonly onSubmit?: (event: SubmitEvent) => void
  readonly class?: JSX.ClassValue
}

export function FilterBar(props: FilterBarProps) {
  return (
    <form
      class={[surface(), layout.row, props.class]}
      aria-label={props.label ?? "Filters"}
      onSubmit={(event) => {
        event.preventDefault()
        props.onSubmit?.(event)
      }}
    >
      {props.children}
      {props.actions && <div class={layout.row}>{props.actions}</div>}
    </form>
  )
}
