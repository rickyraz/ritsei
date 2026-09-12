import type { JSX } from "@solidjs/web"
import { layout } from "../foundations/layout.ts"
import { surface } from "../recipes/surface.ts"

export interface CommandSurfaceProps {
  readonly label?: string
  readonly children: JSX.Element
  readonly description?: JSX.Element
  readonly class?: JSX.ClassValue
}

export function CommandSurface(props: CommandSurfaceProps) {
  return (
    <section class={[surface(), layout.stack, props.class]} aria-label={props.label ?? "Commands"}>
      {props.description}
      <div class={layout.row}>{props.children}</div>
    </section>
  )
}
