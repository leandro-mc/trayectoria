import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Shared look of every text-like control, so Input / Textarea / NativeSelect never drift apart. */
export const fieldBase =
  'w-full rounded-lg border border-input bg-raised text-sm text-foreground placeholder:text-subtle ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input data-slot="input" className={cn(fieldBase, 'h-10 px-3', className)} {...props} />
}
