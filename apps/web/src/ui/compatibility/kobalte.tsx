// Compatibility probe only: never imported by the application.
import { Dialog, useDialogContext } from "@kobalte/core/dialog"

function KobalteDialogContent() {
  const dialog = useDialogContext()
  return (
    <Dialog.Content
      onEscapeKeyDown={() => dialog.close()}
      onKeyDown={(event) => {
        if (event.key === "Escape") dialog.close()
      }}
    >
      <Dialog.Title>Compatibility check</Dialog.Title>
      <Dialog.Description>Verify keyboard focus and dismissal.</Dialog.Description>
      <Dialog.CloseButton>Close</Dialog.CloseButton>
    </Dialog.Content>
  )
}

export function KobalteDialogProbe() {
  return (
    <Dialog>
      <Dialog.Trigger>Open compatibility dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <KobalteDialogContent />
      </Dialog.Portal>
    </Dialog>
  )
}
