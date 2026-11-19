'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { MessageSquare } from 'lucide-react'
import { Field } from '@/components/shared/forms/Field'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import type { JobOfferFormValues } from '../../schemas/job-offer.schemas'
import { FormSection } from './FormSection'

export function InterviewFields({ disabled }: { disabled: boolean }) {
  const { register, control } = useFormContext<JobOfferFormValues>()
  const requiresInterview = useWatch({ control, name: 'requiresInterview' })

  return (
    <FormSection title="Entrevista con IA">
      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox className="mt-0.5" disabled={disabled} {...register('requiresInterview')} />
        <span>
          <span className="block text-sm font-medium text-secondary-foreground">Requerir entrevista simulada con IA</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Los candidatos deberán completar una entrevista antes de postularse
          </span>
        </span>
      </label>

      {requiresInterview && (
        <div className="mt-4 rounded-xl border border-brand-border bg-brand-tint p-4">
          <Field
            label={<span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-text"><MessageSquare className="size-4" aria-hidden="true" />Instrucciones para la IA</span>}
          >
            {(a11y) => (
              <Textarea
                rows={3}
                placeholder="Indicaciones específicas para la entrevista: tono, áreas a evaluar, preguntas obligatorias..."
                disabled={disabled}
                {...a11y}
                {...register('interviewInstructions')}
              />
            )}
          </Field>
        </div>
      )}
    </FormSection>
  )
}
