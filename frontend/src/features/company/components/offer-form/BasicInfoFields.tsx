'use client'

import { useFormContext } from 'react-hook-form'
import { Field } from '@/components/shared/forms/Field'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from '@/config/constants'
import type { JobOfferFormValues } from '../../schemas/job-offer.schemas'
import { FormSection } from './FormSection'

export function BasicInfoFields({ disabled }: { disabled: boolean }) {
  const { register, formState: { errors } } = useFormContext<JobOfferFormValues>()

  return (
    <FormSection title="Información básica">
      <Field label="Título del puesto" required error={errors.title?.message}>
        {(a11y) => <Input placeholder="Ej: Desarrollador Backend Senior" disabled={disabled} {...a11y} {...register('title')} />}
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Modalidad" error={errors.workMode?.message}>
          {(a11y) => (
            <NativeSelect disabled={disabled} {...a11y} {...register('workMode')}>
              <option value="">Sin especificar</option>
              {Object.entries(WORK_MODE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </NativeSelect>
          )}
        </Field>
        <Field label="Tipo de jornada" error={errors.jobType?.message}>
          {(a11y) => (
            <NativeSelect disabled={disabled} {...a11y} {...register('jobType')}>
              <option value="">Sin especificar</option>
              {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </NativeSelect>
          )}
        </Field>
        <Field label="Ubicación" error={errors.location?.message}>
          {(a11y) => <Input placeholder="San José, Costa Rica" disabled={disabled} {...a11y} {...register('location')} />}
        </Field>
      </div>

      <Field label="Fecha de cierre" hint="Dejar vacío si no tiene fecha límite">
        {(a11y) => <Input type="date" disabled={disabled} {...a11y} {...register('expiresAt')} />}
      </Field>
    </FormSection>
  )
}
