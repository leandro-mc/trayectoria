import type { ApplyRequest, UpdateApplicationStatusRequest } from '@/features/applications/types/applications.types'
import type { ApplicationRecord } from '../db/types'
import { getDb, nextId } from '../db/store'
import { nowString } from '../db/time'
import { conflict, forbidden, notFound, unprocessable } from '../http/errors'
import { jsonBody, pageParams, paginate, pathId } from '../http/request'
import { route } from '../http/router'
import { Validator } from '../http/validation'
import { toApplication } from '../mappers'
import { requireOffer, requireOwnOffer } from './ownership'

const REVIEW_STATUSES = ['VIEWED', 'IN_REVIEW', 'ACCEPTED', 'REJECTED']
const newestFirst = (a: ApplicationRecord, b: ApplicationRecord) => b.appliedAt.localeCompare(a.appliedAt)

export function registerApplicationRoutes(): void {
  route('POST', '/job-offers/:id/apply', 'CANDIDATE', (req, user) => {
    // The client sends `{}` when there is no CV to attach; a missing body is also fine.
    const body = req.body === undefined ? {} : jsonBody<ApplyRequest>(req)
    const db = getDb()
    const offer = requireOffer(pathId(req))

    if (offer.status !== 'ACTIVE') throw unprocessable(`Cannot apply to a ${offer.status.toLowerCase()} job offer`)
    if (db.applications.some((a) => a.candidateId === user.id && a.jobOfferId === offer.id)) {
      throw conflict('You have already applied to this job offer')
    }
    // A candidate may only attach their own CV.
    if (body.curriculumId !== undefined && !db.curricula.some((c) => c.id === body.curriculumId && c.candidateId === user.id)) {
      throw notFound('Curriculum not found or does not belong to you')
    }

    const application: ApplicationRecord = {
      id: nextId('applications'), candidateId: user.id, jobOfferId: offer.id,
      curriculumId: body.curriculumId ?? null, status: 'PENDING', appliedAt: nowString(), updatedAt: null,
    }
    db.applications.push(application)
    return { status: 201, data: toApplication(application) }
  })

  route('GET', '/applications/mine', 'CANDIDATE', (req, user) => {
    const mine = getDb().applications.filter((a) => a.candidateId === user.id).sort(newestFirst)
    return { status: 200, data: paginate(mine.map(toApplication), pageParams(req)) }
  })

  route('DELETE', '/applications/:id', 'CANDIDATE', (req, user) => {
    const db = getDb()
    const id = pathId(req)
    const application = db.applications.find((a) => a.id === id && a.candidateId === user.id)
    if (!application) throw forbidden("Application not found or you don't own it")

    // Once the company has decided, the application can no longer be withdrawn.
    if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
      throw unprocessable(`Cannot withdraw a ${application.status.toLowerCase()} application`)
    }
    db.applications = db.applications.filter((a) => a.id !== id)
    return { status: 204 }
  })

  route('GET', '/job-offers/:id/applications', 'COMPANY', (req, user) => {
    const offer = requireOwnOffer(pathId(req), user.id, "Job offer not found or you don't own it")
    const received = getDb().applications.filter((a) => a.jobOfferId === offer.id).sort(newestFirst)
    return { status: 200, data: paginate(received.map(toApplication), pageParams(req)) }
  })

  route('PATCH', '/applications/:id/status', 'COMPANY', (req, user) => {
    const body = jsonBody<UpdateApplicationStatusRequest>(req)
    new Validator(body)
      .notBlank('status', 'Status is required')
      .oneOf('status', REVIEW_STATUSES, 'Status must be one of: VIEWED, IN_REVIEW, ACCEPTED, REJECTED')
      .check()

    const db = getDb()
    const id = pathId(req)
    const application = db.applications.find((a) => a.id === id)
    if (!application) throw notFound(`Application not found: ${id}`)
    if (db.offers.find((o) => o.id === application.jobOfferId)?.companyId !== user.id) {
      throw forbidden("You don't own the job offer of this application")
    }

    application.status = body.status
    application.updatedAt = nowString()
    return { status: 200, data: toApplication(application) }
  })
}
