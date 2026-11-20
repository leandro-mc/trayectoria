import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/** Native checkbox, so keyboard and screen-reader behaviour come for free; accent-primary tints it with the brand. */
export function Checkbox({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn("size-4 rounded border-input accent-primary disabled:opacity-50", className)}
      {...props}
    />
  )
}
