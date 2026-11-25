import type { GenerateCurriculumRequest } from '@/features/ai/curricula/types/curricula.types'
import { getDb, nextId } from '../db/store'
import { nowString } from '../db/time'
import type { CurriculumRecord } from '../db/types'
import { buildBaseContent, generateCurriculumContent } from '../ai/curriculum'
import { forbidden, notFound } from '../http/errors'
import { jsonBody, pathId, requiredQueryNumber } from '../http/request'
import { route } from '../http/router'
import { Validator } from '../http/validation'
import { toCandidateProfile, toCurriculum, toOffer } from '../mappers'
import { requireOffer } from './ownership'

const newestFirst = (a: CurriculumRecord, b: CurriculumRecord) => b.createdAt.localeCompare(a.createdAt)

const candidateProfile = (id: number) => {
  const candidate = getDb().candidates.find((c) => c.userId === id)
  if (!candidate) throw notFound(`Candidate profile not found: ${id}`)
  return toCandidateProfile(candidate)
}

export function registerCurriculumRoutes(): void {
  route('POST', '/curricula/generate', 'CANDIDATE', (req, user) => {
    const body = jsonBody<GenerateCurriculumRequest>(req)
    new Validator(body).notNull('jobOfferId', 'jobOfferId is required').check()

    const offer = requireOffer(body.jobOfferId)
    const cv: CurriculumRecord = {
      id: nextId('curricula'), candidateId: user.id, jobOfferId: offer.id, isAiGenerated: true,
      content: generateCurriculumContent(candidateProfile(user.id), toOffer(offer)), createdAt: nowString(),
    }
    getDb().curricula.push(cv)
    return { status: 201, data: toCurriculum(cv) }
  })

  route('GET', '/curricula', 'CANDIDATE', (_req, user) => ({
    status: 200,
    data: getDb().curricula.filter((c) => c.candidateId === user.id).sort(newestFirst).map(toCurriculum),
  }))

  // Both literal paths come before '/curricula/:id'.
  route('GET', '/curricula/latest', 'authenticated', (req, user) => {
    const candidateId = requiredQueryNumber(req, 'candidateId')
    const offerId = requiredQueryNumber(req, 'offerId')
    if (user.role === 'CANDIDATE' && user.id !== candidateId) throw forbidden('You can only access your own curricula')

    const latest = getDb().curricula
      .filter((c) => c.candidateId === candidateId && c.jobOfferId === offerId)
      .sort(newestFirst)[0]
    if (!latest) throw notFound(`No curriculum found for candidateId=${candidateId} and offerId=${offerId}`)
    return { status: 200, data: toCurriculum(latest) }
  })

  // Virtual CV built from the profile: id 0, not stored. Companies use it when no CV was attached.
  route('GET', '/curricula/base/:candidateId', 'COMPANY', (req) => ({
    status: 200,
    data: {
      id: 0, jobOfferId: null, jobOfferTitle: null, isAiGenerated: false, createdAt: nowString(),
      content: buildBaseContent(candidateProfile(pathId(req, 'candidateId'))),
    },
  }))

  route('GET', '/curricula/:id', 'authenticated', (req, user) => {
    const id = pathId(req)
    const cv = getDb().curricula.find((c) => c.id === id)
    if (!cv) throw notFound(`Curriculum not found: ${id}`)
    if (user.role === 'CANDIDATE' && cv.candidateId !== user.id) throw forbidden('Curriculum does not belong to you')
    return { status: 200, data: toCurriculum(cv) }
  })

  route('DELETE', '/curricula/:id', 'CANDIDATE', (req, user) => {
    const db = getDb()
    const id = pathId(req)
    const cv = db.curricula.find((c) => c.id === id)
    if (!cv) throw notFound(`Curriculum not found: ${id}`)
    if (cv.candidateId !== user.id) throw forbidden("You don't own this curriculum")

    db.curricula = db.curricula.filter((c) => c.id !== id)
    db.applications.forEach((a) => { if (a.curriculumId === id) a.curriculumId = null }) // ON DELETE SET NULL
    return { status: 204 }
  })
}
