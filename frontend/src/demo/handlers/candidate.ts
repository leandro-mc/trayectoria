import type { EducationResponse, WorkExperienceResponse } from '@/types/api.types'
import type { LanguageRequest, SkillsRequest, UpdateCandidateProfileRequest } from '@/features/candidate/types/candidate.types'
import { getDb } from '../db/store'
import type { CandidateRecord } from '../db/types'
import { conflict, notFound } from '../http/errors'
import { jsonBody, pathId } from '../http/request'
import { route } from '../http/router'
import { Validator } from '../http/validation'
import { findSkill } from '../fixtures/skills'
import { toCandidateProfile, toSkills } from '../mappers'
import { localDateOrNull, registerCollection } from './candidate-collections'
import { imageToDataUrl } from './uploads'

const own = (userId: number): CandidateRecord => getDb().candidates.find((c) => c.userId === userId)!
const text = (value: unknown): string | null => (typeof value === 'string' ? value : null)

/** Profile fields a PUT may change; null/absent ones are ignored, like the backend's `?.let`. */
const PROFILE_FIELDS = ['firstName', 'lastName', 'phone', 'location', 'bio', 'linkedinUrl', 'githubUrl', 'portfolioUrl'] as const

function registerProfileRoutes(): void {
  route('GET', '/candidates/me', 'CANDIDATE', (_req, user) => ({ status: 200, data: toCandidateProfile(own(user.id)) }))

  route('PUT', '/candidates/me', 'CANDIDATE', (req, user) => {
    const body = jsonBody<UpdateCandidateProfileRequest>(req)
    new Validator(body)
      .maxLength('firstName', 100).maxLength('lastName', 100).maxLength('phone', 20)
      .maxLength('location', 255).maxLength('linkedinUrl', 255).maxLength('githubUrl', 255)
      .maxLength('portfolioUrl', 255).check()
    const birthdate = localDateOrNull(body, 'birthdate')

    const candidate = own(user.id)
    for (const field of PROFILE_FIELDS) {
      const value = body[field]
      if (value !== undefined && value !== null) candidate[field] = value
    }
    if (birthdate) candidate.birthdate = birthdate
    return { status: 200, data: toCandidateProfile(candidate) }
  })

  route('PATCH', '/candidates/me/avatar', 'CANDIDATE', async (req, user) => {
    const profileImageUrl = await imageToDataUrl(req.body)
    own(user.id).profileImageUrl = profileImageUrl
    return { status: 200, data: { profileImageUrl } }
  })
}

function registerSkillAndLanguageRoutes(): void {
  route('GET', '/candidates/me/skills', 'CANDIDATE', (_req, user) => ({ status: 200, data: toSkills(own(user.id).skillIds) }))

  route('POST', '/candidates/me/skills', 'CANDIDATE', (req, user) => {
    const body = jsonBody<SkillsRequest>(req)
    new Validator(body).notEmpty('skillIds').check()
    if (!body.skillIds.every((id) => findSkill(id))) throw notFound('One or more skills not found')

    const candidate = own(user.id)
    candidate.skillIds = [...new Set([...candidate.skillIds, ...body.skillIds])]
    return { status: 201, data: toSkills(candidate.skillIds) }
  })

  route('DELETE', '/candidates/me/skills/:id', 'CANDIDATE', (req, user) => {
    const candidate = own(user.id)
    const id = pathId(req)
    candidate.skillIds = candidate.skillIds.filter((s) => s !== id)
    return { status: 204 }
  })

  route('GET', '/candidates/me/languages', 'CANDIDATE', (_req, user) => ({ status: 200, data: own(user.id).languages }))

  route('POST', '/candidates/me/languages', 'CANDIDATE', (req, user) => {
    const body = jsonBody<LanguageRequest>(req)
    new Validator(body).notBlank('language').check()

    const candidate = own(user.id)
    if (candidate.languages.some((l) => l.language.toLowerCase() === body.language.toLowerCase())) {
      throw conflict(`Language already added: ${body.language}`)
    }
    const entry = { language: body.language, level: (body.level ?? null) as CandidateRecord['languages'][number]['level'] }
    candidate.languages.push(entry)
    return { status: 201, data: entry }
  })

  route('DELETE', '/candidates/me/languages/:language', 'CANDIDATE', (req, user) => {
    const candidate = own(user.id)
    const language = req.params.language ?? ''
    const before = candidate.languages.length
    candidate.languages = candidate.languages.filter((l) => l.language.toLowerCase() !== language.toLowerCase())
    if (candidate.languages.length === before) throw notFound(`Language not found: ${language}`)
    return { status: 204 }
  })
}

export function registerCandidateRoutes(): void {
  registerProfileRoutes()
  registerSkillAndLanguageRoutes()

  registerCollection<WorkExperienceResponse>({
    path: 'experience', idTable: 'experiences', forbiddenMessage: "You don't own this work experience",
    list: (c) => c.workExperiences,
    validate: (body) => new Validator(body).notBlank('company').notBlank('position').check(),
    build: (body, id) => ({
      id, company: text(body.company), position: text(body.position), description: text(body.description),
      startDate: localDateOrNull(body, 'startDate'), endDate: localDateOrNull(body, 'endDate'),
      isCurrent: body.isCurrent === true,
    }),
  })

  registerCollection<EducationResponse>({
    path: 'education', idTable: 'educations', forbiddenMessage: "You don't own this education entry",
    list: (c) => c.educations,
    validate: (body) => new Validator(body).notBlank('institution').check(),
    build: (body, id) => ({
      id, institution: text(body.institution), degree: text(body.degree), fieldOfStudy: text(body.fieldOfStudy),
      startDate: localDateOrNull(body, 'startDate'), endDate: localDateOrNull(body, 'endDate'),
    }),
  })
}
