// Compatibility probe only: never imported by the application.
import { Dialog } from "@kobalte/core/dialog"

export function KobalteDialogProbe() {
  return (
    <Dialog>
      <Dialog.Trigger>Open compatibility dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Compatibility check</Dialog.Title>
          <Dialog.Description>Verify keyboard focus and dismissal.</Dialog.Description>
          <Dialog.CloseButton>Close</Dialog.CloseButton>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
