import type { JSX } from "@solidjs/web"
import { layout } from "../foundations/layout.ts"
import { Button } from "../primitives/button.tsx"
import { surface } from "../recipes/surface.ts"

export interface ApprovalProps {
  readonly title: string
  readonly description?: JSX.Element
  readonly children: JSX.Element
  readonly approveLabel?: string
  readonly rejectLabel?: string
  readonly onApprove?: () => void
  readonly onReject?: () => void
  readonly actions?: JSX.Element
  readonly status?: JSX.Element
  readonly class?: JSX.ClassValue
}

export function Approval(props: ApprovalProps) {
  return (
    <section class={[surface(), layout.stack, props.class]} aria-label={props.title}>
      <header class={layout.stack}>
        <h1>{props.title}</h1>
        {props.description}
      </header>
      <div>{props.children}</div>
      {props.status && <p role="status">{props.status}</p>}
      {(props.actions || props.approveLabel) && (
        <div class={layout.row}>
          {props.actions}
          {props.approveLabel && props.onApprove && (
            <Button variant="primary" type="button" onClick={props.onApprove}>
              {props.approveLabel}
            </Button>
          )}
          {props.rejectLabel && props.onReject && (
            <Button variant="danger" type="button" onClick={props.onReject}>
              {props.rejectLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
