import { Dialog, useDialogContext } from "@kobalte/core/dialog"
import { css } from "../generated/css/index.js"
import { Button } from "../primitives/button.tsx"

interface ConfirmDialogProps {
  readonly triggerLabel: string
  readonly triggerVariant?: "primary" | "secondary"
  readonly title: string
  readonly description: string
  readonly confirmLabel: string
  readonly onConfirm: () => void
}

const styles = {
  overlay: css({
    position: "fixed",
    inset: "0",
    zIndex: "modal",
    bg: "backdrop",
  }),
  content: css({
    position: "fixed",
    top: "[50%]",
    left: "[50%]",
    zIndex: "modal",
    width: "dialog",
    transform: "translate(-50%, -50%)",
    bg: "content",
    color: "text",
    borderWidth: "1px",
    borderColor: "boundary",
    borderRadius: "md",
    p: "6",
    boxShadow: "lg",
  }),
  actions: css({
    display: "flex",
    justifyContent: "flex-end",
    gap: "3",
    mt: "6",
  }),
}

function ConfirmDialogContent(props: ConfirmDialogProps) {
  const dialog = useDialogContext()
  return (
    <Dialog.Content
      class={styles.content}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault()
          dialog.close()
        }
      }}
    >
      <Dialog.Title>{props.title}</Dialog.Title>
      <Dialog.Description>{props.description}</Dialog.Description>
      <div class={styles.actions}>
        <Dialog.CloseButton as={Button} type="button" aria-label="Cancel">
          Cancel
        </Dialog.CloseButton>
        <Dialog.CloseButton
          as={Button}
          variant="primary"
          type="button"
          aria-label={props.confirmLabel}
          onClick={props.onConfirm}
        >
          {props.confirmLabel}
        </Dialog.CloseButton>
      </div>
    </Dialog.Content>
  )
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <Dialog modal>
      <Dialog.Trigger as={Button} type="button" variant={props.triggerVariant}>
        {props.triggerLabel}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={styles.overlay} />
        <ConfirmDialogContent {...props} />
      </Dialog.Portal>
    </Dialog>
  )
}
