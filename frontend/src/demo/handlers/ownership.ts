import { getDb } from '../db/store'
import type { OfferRecord } from '../db/types'
import { forbidden, notFound } from '../http/errors'

export const findOffer = (id: number) => getDb().offers.find((o) => o.id === id)

export function requireOffer(id: number): OfferRecord {
  const offer = findOffer(id)
  if (!offer) throw notFound(`Job offer not found: ${id}`)
  return offer
}

/**
 * The offer if it exists AND belongs to the company. The backend answers 403 in both cases
 * (existsByIdAndCompanyUserId), so a missing offer is deliberately not a 404 here.
 */
export function requireOwnOffer(id: number, companyId: number, message = "You don't own this job offer"): OfferRecord {
  const offer = findOffer(id)
  if (!offer || offer.companyId !== companyId) throw forbidden(message)
  return offer
}
