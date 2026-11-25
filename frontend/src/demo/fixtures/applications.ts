import type { ApplicationStatus } from '@/types/global.types'
import type { CandidateKey } from './accounts'
import type { OfferKey } from './offers'

export interface ApplicationFixture {
  offer: OfferKey
  status: ApplicationStatus
  appliedDaysAgo: number
  /** Days since the company last moved it; irrelevant while PENDING. */
  reviewedDaysAgo?: number
}

/**
 * Every status is represented. Ported from APPLICATIONS in seed/seed.mjs; the day offsets are
 * chosen so each application is newer than its offer and not older than its attached CV.
 */
export const APPLICATIONS: Record<CandidateKey, readonly ApplicationFixture[]> = {
  sofia: [
    { offer: 'frontend-react', status: 'IN_REVIEW', appliedDaysAgo: 7, reviewedDaysAgo: 4 },
    { offer: 'backend-kotlin', status: 'ACCEPTED',  appliedDaysAgo: 9, reviewedDaysAgo: 2 },
    { offer: 'ai-dev',         status: 'VIEWED',    appliedDaysAgo: 3, reviewedDaysAgo: 1 },
    { offer: 'qa-auto',        status: 'PENDING',   appliedDaysAgo: 1 },
  ],
  mateo: [
    { offer: 'backend-kotlin', status: 'REJECTED',  appliedDaysAgo: 8, reviewedDaysAgo: 3 },
    { offer: 'java-senior',    status: 'IN_REVIEW', appliedDaysAgo: 6, reviewedDaysAgo: 2 },
    { offer: 'devops-intern',  status: 'PENDING',   appliedDaysAgo: 2 },
  ],
  camila: [
    { offer: 'data-eng', status: 'VIEWED',   appliedDaysAgo: 5, reviewedDaysAgo: 2 },
    { offer: 'qa-auto',  status: 'ACCEPTED', appliedDaysAgo: 1, reviewedDaysAgo: 0 },
    { offer: 'ai-dev',   status: 'PENDING',  appliedDaysAgo: 2 },
  ],
}

export const SAVED_OFFERS: Record<CandidateKey, readonly OfferKey[]> = {
  sofia:  ['devops-intern', 'data-eng', 'ux-ui'],
  mateo:  ['backend-kotlin', 'ai-dev'],
  camila: ['data-eng'],
}
