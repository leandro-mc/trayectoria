'use client'

import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Props the control must receive so the label, hint and error are announced with it. */
interface FieldControlProps {
  id:                 string
  'aria-invalid'?:    true
  'aria-describedby'?: string
  'aria-required'?:   true
}

interface FieldProps {
  label:      ReactNode
  /** Message from react-hook-form (`errors.email?.message`). */
  error?:     string
  hint?:      string
  required?:  boolean
  className?: string
  children:   (control: FieldControlProps) => ReactNode
}

/**
 * Label + control + hint/error, wired together:
 *
 *   <Field label="Email" error={errors.email?.message}>
 *     {(a11y) => <Input type="email" {...a11y} {...register('email')} />}
 *   </Field>
 *
 * The render prop hands the control its id (so the <label> really labels it),
 * aria-invalid and aria-describedby (so a screen reader reads the error with the field).
 */
export function Field({ label, error, hint, required, className, children }: FieldProps) {
  const id      = useId()
  const hintId  = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-secondary-foreground">
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-danger-text">*</span>}
      </label>

      {children({
        id,
        'aria-invalid':     error ? true : undefined,
        'aria-describedby': error ? errorId : hint ? hintId : undefined,
        'aria-required':    required ? true : undefined,
      })}

      {hint && !error && <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={errorId} role="alert" className={cn('mt-1.5 text-xs text-danger-text')}>{error}</p>}
    </div>
  )
}
