import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * The one card surface of the app: page-level blocks, list rows, form panels.
 * Padding is a prop so a card can also wrap a list that supplies its own
 * (padding="none" + divided rows).
 *
 *   <Card padding="lg">…</Card>
 *   <Card asChild padding="lg" interactive><Link href="…">…</Link></Card>
 */
const cardVariants = cva("border border-border bg-card shadow-card", {
  variants: {
    padding: {
      none: "rounded-xl",
      sm:   "rounded-xl p-4",
      md:   "rounded-xl p-5",
      lg:   "rounded-xl p-6",
      xl:   "rounded-2xl p-8",   // auth forms: more room, softer corners
    },
    /** Lifts on hover; only for cards that are themselves a link or button. */
    interactive: {
      true:  "transition-shadow hover:shadow-card-hover",
      false: "",
    },
  },
  defaultVariants: { padding: "none", interactive: false },
})

function Card({
  className,
  padding,
  interactive,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return <Comp data-slot="card" className={cn(cardVariants({ padding, interactive }), className)} {...props} />
}

export { Card }
