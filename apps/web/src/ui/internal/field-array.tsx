import type { JSX } from "@solidjs/web"
import { For } from "solid-js"
import { Button } from "../primitives/button.tsx"

export type FieldArrayProps<T> = {
  readonly items: readonly T[]
  readonly onChange: (items: readonly T[]) => void
  readonly createItem: () => T
  readonly renderItem: (item: T, index: number) => JSX.Element
  readonly class?: JSX.ClassValue
}

/** A small, keyboard-operable repeatable-field editor. The caller owns state and rendering. */
export function FieldArray<T>(props: FieldArrayProps<T>) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= props.items.length) return
    const items = props.items.slice()
    const [item] = items.splice(from, 1)
    items.splice(to, 0, item)
    props.onChange(items)
  }

  return (
    <div class={props.class}>
      <For each={props.items}>
        {(item, index) => (
          <div>
            {props.renderItem(item, index())}
            <div role="group" aria-label={`Field ${index() + 1} actions`}>
              <Button
                variant="secondary"
                type="button"
                disabled={index() === 0}
                aria-label={`Move field ${index() + 1} up`}
                onClick={() => move(index(), index() - 1)}
              >
                Move up
              </Button>
              <Button
                variant="secondary"
                type="button"
                disabled={index() === props.items.length - 1}
                aria-label={`Move field ${index() + 1} down`}
                onClick={() => move(index(), index() + 1)}
              >
                Move down
              </Button>
              <Button
                variant="danger"
                type="button"
                aria-label={`Remove field ${index() + 1}`}
                onClick={() => props.onChange(props.items.filter((_, i) => i !== index()))}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </For>
      <Button
        variant="primary"
        type="button"
        onClick={() => props.onChange([...props.items, props.createItem()])}
      >
        Add field
      </Button>
    </div>
  )
}
