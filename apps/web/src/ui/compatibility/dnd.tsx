// fallow-ignore-file unused-file
// Compatibility probe only: the application does not activate this adapter yet.
// Explicitly skipped: pointer/keyboard DnD integration waits for a Solid 2-compatible build.
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/solid"
import { createSignal } from "solid-js"

type DndProbeContentProps = {
  readonly dropped: () => boolean
}

function DndProbeContent(props: DndProbeContentProps) {
  const source = useDraggable({ id: "probe-source", type: "probe.item" })
  const target = useDroppable({ id: "probe-target", accept: "probe.item" })

  return (
    <main>
      <button ref={source.handleRef} type="button" aria-label="Drag probe">
        Drag probe
      </button>
      <div
        ref={source.ref}
        data-dragging={source.isDragging() ? "true" : "false"}
        style="min-height:40px;width:120px;padding:8px;border:1px solid currentColor"
      >
        Source
      </div>
      <div
        ref={target.ref}
        data-drop-target={target.isDropTarget() ? "true" : "false"}
        style="min-height:120px;width:240px;border:1px dashed currentColor"
      >
        Target
      </div>
      <output aria-live="polite">{props.dropped() ? "Dropped" : "Ready"}</output>
    </main>
  )
}

export function DndCompatibilityProbe() {
  const [dropped, setDropped] = createSignal(false)

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (!event.canceled && event.operation.target?.id === "probe-target") {
          setDropped(true)
        }
      }}
    >
      <DndProbeContent dropped={dropped} />
      <output aria-live="polite">{dropped() ? "Accepted" : "Waiting"}</output>
    </DragDropProvider>
  )
}
