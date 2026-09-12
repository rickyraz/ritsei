import type { JSX } from "@solidjs/web"
import { Approval } from "./approval.tsx"

export interface ApprovalCompositionProps {
  readonly title: string
  readonly description?: JSX.Element
  readonly content: JSX.Element
  readonly actions: JSX.Element
  readonly status?: JSX.Element
  readonly class?: JSX.ClassValue
}

export function ApprovalComposition(props: ApprovalCompositionProps) {
  return (
    <Approval
      title={props.title}
      description={props.description}
      actions={props.actions}
      class={props.class}
      status={props.status}
    >
      {props.content}
    </Approval>
  )
}
