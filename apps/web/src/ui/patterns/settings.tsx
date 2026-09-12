import type { JSX } from "@solidjs/web"
import { layout } from "../foundations/layout.ts"
import { surface } from "../recipes/surface.ts"

export interface SettingsProps {
  readonly title: string
  readonly description?: JSX.Element
  readonly children: JSX.Element
  readonly actions?: JSX.Element
  readonly class?: JSX.ClassValue
}

export function Settings(props: SettingsProps) {
  return (
    <section class={[layout.stack, props.class]} aria-label={props.title}>
      <header class={layout.stack}>
        <h1>{props.title}</h1>
        {props.description}
      </header>
      <div class={surface()}>
        <div class={layout.stack}>{props.children}</div>
        {props.actions && <div class={layout.row}>{props.actions}</div>}
      </div>
    </section>
  )
}
