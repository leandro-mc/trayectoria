import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function FormLabel({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-secondary-foreground', className)}
      {...props}
    />
  )
}

/** Validation message under a field. Pass the react-hook-form error object (or undefined). */
export function FieldError({ error, className }: { error?: { message?: string }; className?: string }) {
  if (!error?.message) return null
  return (
    <p role="alert" className={cn('mt-1.5 text-xs text-danger-500', className)}>
      {error.message}
    </p>
  )
}
