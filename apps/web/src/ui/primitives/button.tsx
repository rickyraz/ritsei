import { omit } from "solid-js"
import type { JSX } from "@solidjs/web"
import { control } from "../generated/recipes/index.js"

type ButtonProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class"> & {
  variant?: "primary" | "secondary"
  class?: JSX.ClassValue
}

export function Button(props: ButtonProps) {
  const buttonProps = omit(props, "variant", "class", "children")
  return (
    <button
      {...buttonProps}
      class={[control(props.variant === "primary" ? { kind: "action" } : {}), props.class]}
    >
      {props.children}
    </button>
  )
}
