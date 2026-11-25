import type { CreateJobOfferRequest, UpdateJobOfferStatusRequest } from '@/features/jobs/types/jobs.types'
import type { JobStatus } from '@/types/global.types'
import { getDb, nextId } from '../db/store'
import { nowString } from '../db/time'
import type { OfferRecord } from '../db/types'
import { findSkill } from '../fixtures/skills'
import { jsonBody, pageParams, paginate, pathId, queryNumber, queryString } from '../http/request'
import { publicRoute, route } from '../http/router'
import { Validator } from '../http/validation'
import { toOffer, toOfferSummary } from '../mappers'
import { requireOffer, requireOwnOffer } from './ownership'

const STATUSES: readonly JobStatus[] = ['ACTIVE', 'CLOSED', 'DRAFT']
const newestFirst = (a: OfferRecord, b: OfferRecord) => b.createdAt.localeCompare(a.createdAt)

/** Unknown skill ids are dropped silently, like `findAllByIdIn` does. */
const knownSkillIds = (ids: readonly number[] = []) => ids.filter((id) => findSkill(id))

function validateOffer(body: CreateJobOfferRequest): void {
  new Validator(body).notBlank('title').check()
}

/** Fields shared by create and update; PUT replaces them all, as the backend does. */
function offerFields(body: CreateJobOfferRequest) {
  return {
    title: body.title, description: body.description ?? null, responsibilities: body.responsibilities ?? null,
    requirements: body.requirements ?? null, benefits: body.benefits ?? null, workMode: body.workMode ?? null,
    jobType: body.jobType ?? null, location: body.location ?? null,
    interviewInstructions: body.interviewInstructions ?? null,
    requiresInterview: body.requiresInterview ?? false, expiresAt: body.expiresAt ?? null,
  }
}

export function registerJobRoutes(): void {
  // Public board: only ACTIVE offers, newest first. Filters are optional and combine with AND.
  publicRoute('GET', '/job-offers', (req) => {
    const workMode = queryString(req, 'workMode')
    const jobType = queryString(req, 'jobType')
    const skillId = queryNumber(req, 'skillId')
    const keyword = queryString(req, 'keyword')?.toLowerCase()

    const matches = getDb().offers
      .filter((o) => o.status === 'ACTIVE')
      .filter((o) => !workMode || o.workMode === workMode)
      .filter((o) => !jobType || o.jobType === jobType)
      .filter((o) => skillId === undefined || o.skillIds.includes(skillId))
      .filter((o) => !keyword || o.title.toLowerCase().includes(keyword))
      .sort(newestFirst)

    return { status: 200, data: paginate(matches.map(toOfferSummary), pageParams(req)) }
  })

  // Registered before '/job-offers/:id' so "mine" is not read as an id.
  route('GET', '/job-offers/mine', 'COMPANY', (req, user) => {
    const own = getDb().offers.filter((o) => o.companyId === user.id).sort(newestFirst)
    return { status: 200, data: paginate(own.map(toOfferSummary), pageParams(req)) }
  })

  publicRoute('GET', '/job-offers/:id', (req) => ({ status: 200, data: toOffer(requireOffer(pathId(req))) }))

  route('POST', '/job-offers', 'COMPANY', (req, user) => {
    const body = jsonBody<CreateJobOfferRequest>(req)
    validateOffer(body)

    const offer: OfferRecord = {
      id: nextId('offers'), companyId: user.id, ...offerFields(body), status: 'ACTIVE',
      createdAt: nowString(), skillIds: knownSkillIds(body.skillIds),
    }
    getDb().offers.push(offer)
    return { status: 201, data: toOffer(offer) }
  })

  route('PUT', '/job-offers/:id', 'COMPANY', (req, user) => {
    const body = jsonBody<CreateJobOfferRequest>(req)
    validateOffer(body)

    const offer = requireOwnOffer(pathId(req), user.id)
    Object.assign(offer, offerFields(body))
    // Only replaced when sent: an empty list leaves the skills untouched (UpdateJobOffer in the backend).
    if (body.skillIds?.length) offer.skillIds = knownSkillIds(body.skillIds)
    return { status: 200, data: toOffer(offer) }
  })

  route('PATCH', '/job-offers/:id/status', 'COMPANY', (req, user) => {
    const body = jsonBody<UpdateJobOfferStatusRequest>(req)
    new Validator(body)
      .notBlank('status').oneOf('status', STATUSES, 'Status must be one of: ACTIVE, CLOSED, DRAFT').check()

    const offer = requireOwnOffer(pathId(req), user.id)
    offer.status = body.status
    return { status: 200, data: toOffer(offer) }
  })

  // Mirrors the schema's cascades: applications, saved offers and interviews go with the
  // offer; CVs survive with a null offer (ON DELETE SET NULL).
  route('DELETE', '/job-offers/:id', 'COMPANY', (req, user) => {
    const id = requireOwnOffer(pathId(req), user.id).id
    const db = getDb()
    db.offers = db.offers.filter((o) => o.id !== id)
    db.applications = db.applications.filter((a) => a.jobOfferId !== id)
    db.savedOffers = db.savedOffers.filter((s) => s.jobOfferId !== id)
    db.interviews = db.interviews.filter((i) => i.jobOfferId !== id)
    db.curricula.forEach((cv) => { if (cv.jobOfferId === id) cv.jobOfferId = null })
    return { status: 204 }
  })

  route('GET', '/job-offers/:id/interview-instructions', 'COMPANY', (req, user) => {
    const offer = requireOwnOffer(pathId(req), user.id)
    return {
      status: 200,
      data: {
        jobOfferId: offer.id, jobOfferTitle: offer.title,
        interviewInstructions: offer.interviewInstructions, requiresInterview: offer.requiresInterview,
      },
    }
  })
}
