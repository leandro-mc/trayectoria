import { getDb } from '../db/store'
import { conflict, notFound } from '../http/errors'
import { pageParams, paginate, pathId } from '../http/request'
import { route } from '../http/router'
import { toOfferSummary } from '../mappers'
import { findOffer, requireOffer } from './ownership'

export function registerSavedOfferRoutes(): void {
  route('GET', '/saved-offers', 'CANDIDATE', (req, user) => {
    // Backend sorts by job offer id, newest first.
    const saved = getDb().savedOffers
      .filter((s) => s.candidateId === user.id)
      .sort((a, b) => b.jobOfferId - a.jobOfferId)
      .flatMap((s) => findOffer(s.jobOfferId) ?? [])
    return { status: 200, data: paginate(saved.map(toOfferSummary), pageParams(req)) }
  })

  route('POST', '/saved-offers/:id', 'CANDIDATE', (req, user) => {
    const db = getDb()
    const offer = requireOffer(pathId(req))
    if (db.savedOffers.some((s) => s.candidateId === user.id && s.jobOfferId === offer.id)) {
      throw conflict('Job offer already saved')
    }
    db.savedOffers.push({ candidateId: user.id, jobOfferId: offer.id })
    return { status: 201 }
  })

  route('DELETE', '/saved-offers/:id', 'CANDIDATE', (req, user) => {
    const db = getDb()
    const id = pathId(req)
    if (!db.savedOffers.some((s) => s.candidateId === user.id && s.jobOfferId === id)) {
      throw notFound('Saved offer not found')
    }
    db.savedOffers = db.savedOffers.filter((s) => !(s.candidateId === user.id && s.jobOfferId === id))
    return { status: 204 }
  })

  route('GET', '/saved-offers/:id/check', 'CANDIDATE', (req, user) => {
    const id = pathId(req)
    return { status: 200, data: { saved: getDb().savedOffers.some((s) => s.candidateId === user.id && s.jobOfferId === id) } }
  })
}
