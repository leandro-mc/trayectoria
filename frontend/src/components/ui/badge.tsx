import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      // One variant per StatusTone (config/constants.ts); all colours are semantic tokens.
      variant: {
        neutral: "bg-muted text-muted-foreground",
        brand:   "bg-brand-tint text-brand-text",
        success: "bg-success-tint text-success-text",
        warning: "bg-warning-tint text-warning-text",
        danger:  "bg-danger-tint text-danger-text",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
