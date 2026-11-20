import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Inline error banner (form submit failed, page could not load). role="alert"
 * makes screen readers announce it as soon as it appears, and the icon means
 * the message does not depend on colour alone.
 */
export function ErrorAlert({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-danger-border bg-danger-tint px-4 py-3 text-sm text-danger-text",
        className,
      )}
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
