'use client'

import { useFormContext } from 'react-hook-form'
import { Field } from '@/components/shared/forms/Field'
import { Textarea } from '@/components/ui/textarea'
import type { JobOfferFormValues } from '../../schemas/job-offer.schemas'
import { FormSection } from './FormSection'

type TextField = 'description' | 'responsibilities' | 'requirements' | 'benefits'

const FIELDS: { name: TextField; label: string; rows: number; placeholder: string }[] = [
  { name: 'description',      label: 'Descripción',        rows: 4, placeholder: 'Descripción general del puesto y la empresa...' },
  { name: 'responsibilities', label: 'Responsabilidades',  rows: 4, placeholder: '¿Qué hará la persona en este rol? Podés usar viñetas (- item)' },
  { name: 'requirements',     label: 'Requisitos',         rows: 4, placeholder: 'Experiencia, tecnologías, educación requeridos...' },
  { name: 'benefits',         label: 'Beneficios',         rows: 3, placeholder: 'Salario, seguro, horario flexible, home office...' },
]

export function ContentFields({ disabled }: { disabled: boolean }) {
  const { register, formState: { errors } } = useFormContext<JobOfferFormValues>()

  return (
    <FormSection title="Contenido de la oferta">
      {FIELDS.map(({ name, label, rows, placeholder }) => (
        <Field key={name} label={label} error={errors[name]?.message}>
          {(a11y) => <Textarea rows={rows} placeholder={placeholder} disabled={disabled} {...a11y} {...register(name)} />}
        </Field>
      ))}
    </FormSection>
  )
}
