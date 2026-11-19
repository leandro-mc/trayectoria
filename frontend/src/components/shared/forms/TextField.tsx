'use client'

import type { ComponentProps, ReactNode } from 'react'
import { get, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import { Field } from './Field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface BaseProps<T extends FieldValues> {
  name:       Path<T>
  label:      ReactNode
  hint?:      string
  required?:  boolean
  className?: string
}

/**
 * Field + Input + register in one tag, for forms wrapped in <FormProvider>:
 *   <TextField<ProfileFormValues> name="phone" label="Teléfono" placeholder="+506 8888-8888" />
 * Anything else (select, checkbox, custom controls) uses <Field> directly.
 */
export function TextField<T extends FieldValues>({
  name, label, hint, required, className, ...input
}: BaseProps<T> & Omit<ComponentProps<typeof Input>, 'name'>) {
  const { register, formState: { errors } } = useFormContext<T>()
  return (
    <Field label={label} hint={hint} required={required} className={className} error={get(errors, name)?.message}>
      {(a11y) => <Input {...a11y} {...input} {...register(name)} />}
    </Field>
  )
}

export function TextareaField<T extends FieldValues>({
  name, label, hint, required, className, ...textarea
}: BaseProps<T> & Omit<ComponentProps<typeof Textarea>, 'name'>) {
  const { register, formState: { errors } } = useFormContext<T>()
  return (
    <Field label={label} hint={hint} required={required} className={className} error={get(errors, name)?.message}>
      {(a11y) => <Textarea {...a11y} {...textarea} {...register(name)} />}
    </Field>
  )
}
