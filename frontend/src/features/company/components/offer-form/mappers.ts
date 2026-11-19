import type { JobOfferResponse } from '@/features/jobs/types/jobs.types'
import type { JobOfferFormValues } from '../../schemas/job-offer.schemas'

export const EMPTY_OFFER: JobOfferFormValues = {
  title: '', description: '', responsibilities: '', requirements: '', benefits: '',
  workMode: undefined, jobType: undefined, location: '',
  requiresInterview: false, interviewInstructions: '', expiresAt: '', skillIds: [],
}

/** API response -> form values. interviewInstructions is private, so it arrives separately. */
export function offerToFormValues(offer: JobOfferResponse): JobOfferFormValues {
  return {
    title:                 offer.title,
    description:           offer.description      ?? '',
    responsibilities:      offer.responsibilities ?? '',
    requirements:          offer.requirements     ?? '',
    benefits:              offer.benefits         ?? '',
    workMode:              offer.workMode         ?? undefined,
    jobType:               offer.jobType          ?? undefined,
    location:              offer.location         ?? '',
    requiresInterview:     offer.requiresInterview,
    interviewInstructions: '',
    expiresAt:             offer.expiresAt ? offer.expiresAt.split('T')[0] : '',   // ISO -> YYYY-MM-DD for <input type="date">
    skillIds:              offer.skills.map((s) => s.id),
  }
}

/** Form values -> API payload: empty strings become undefined so the backend treats them as "not set". */
export function formValuesToPayload(data: JobOfferFormValues) {
  return {
    title:                 data.title,
    description:           data.description           || undefined,
    responsibilities:      data.responsibilities      || undefined,
    requirements:          data.requirements          || undefined,
    benefits:              data.benefits              || undefined,
    workMode:              data.workMode,
    jobType:               data.jobType,
    location:              data.location              || undefined,
    requiresInterview:     data.requiresInterview,
    interviewInstructions: data.interviewInstructions || undefined,
    expiresAt:             data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
    skillIds:              data.skillIds,
  }
}
