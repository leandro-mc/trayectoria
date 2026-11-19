'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { jobOfferSchema, type JobOfferFormValues } from '../schemas/job-offer.schemas'
import { BasicInfoFields } from './offer-form/BasicInfoFields'
import { ContentFields } from './offer-form/ContentFields'
import { InterviewFields } from './offer-form/InterviewFields'
import { SkillsField } from './offer-form/SkillsField'
import { EMPTY_OFFER, formValuesToPayload, offerToFormValues } from './offer-form/mappers'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { ROUTES } from '@/config/routes'
import { useCreateJobOffer, useUpdateJobOffer } from '@/features/jobs/hooks/useJobOffers'
import type { JobOfferResponse } from '@/features/jobs/types/jobs.types'
import { extractApiError } from '@/lib/utils/format'

interface JobOfferFormProps {
  /** Undefined = create mode; defined = edit mode. */
  initial?: JobOfferResponse
  /** Not part of JobOfferResponse (private field): fetched separately and passed in edit mode. */
  initialInstructions?: string | null
}

export function JobOfferForm({ initial, initialInstructions }: JobOfferFormProps) {
  const router = useRouter()

  const { mutate: create, isPending: creating, error: createError } = useCreateJobOffer()
  const { mutate: update, isPending: updating, error: updateError } = useUpdateJobOffer()
  const isPending = creating || updating
  const apiError  = createError ?? updateError

  const form = useForm<JobOfferFormValues>({ resolver: zodResolver(jobOfferSchema), defaultValues: EMPTY_OFFER })
  const { reset, setValue, handleSubmit } = form

  // Edit mode: fill the form once the offer has loaded.
  useEffect(() => {
    if (initial) reset(offerToFormValues(initial))
  }, [initial, reset])

  // setValue rather than reset: the instructions arrive later and must not overwrite what was already typed.
  useEffect(() => {
    if (initialInstructions !== undefined) setValue('interviewInstructions', initialInstructions ?? '')
  }, [initialInstructions, setValue])

  function onSubmit(data: JobOfferFormValues) {
    const payload   = formValuesToPayload(data)
    const onSuccess = () => router.push(ROUTES.offers)

    if (initial) update({ id: initial.id, data: payload }, { onSuccess })
    else         create(payload, { onSuccess })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {apiError && <ErrorAlert>{extractApiError(apiError)}</ErrorAlert>}

        <BasicInfoFields disabled={isPending} />
        <ContentFields   disabled={isPending} />
        <SkillsField     disabled={isPending} />
        <InterviewFields disabled={isPending} />

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="outline" size="lg" onClick={() => router.push(ROUTES.offers)} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" size="lg" loading={isPending}>
            <Save />
            {isPending
              ? (initial ? 'Guardando...' : 'Publicando...')
              : (initial ? 'Guardar cambios' : 'Publicar oferta')}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
