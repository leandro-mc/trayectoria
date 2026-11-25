import type { JobApplicationResponse } from '@/features/applications/types/applications.types'
import type { GeneratedCurriculumResponse } from '@/features/ai/curricula/types/curricula.types'
import type { SimulatedInterviewResponse } from '@/features/ai/interviews/types/interviews.types'
import type { CandidateProfileResponse } from '@/features/candidate/types/candidate.types'
import type { CompanyProfileResponse } from '@/features/company/types/company.types'
import type { JobOfferResponse, JobOfferSummaryResponse } from '@/features/jobs/types/jobs.types'
import type { SkillResponse } from '@/types/api.types'
import { getDb } from './db/store'
import type {
  ApplicationRecord, CandidateRecord, CompanyRecord, CurriculumRecord, InterviewRecord, OfferRecord,
} from './db/types'
import { findSkill } from './fixtures/skills'

/** Record -> response DTO. The return types are the UI's own, so contract drift fails tsc. */

export function toSkills(ids: readonly number[]): SkillResponse[] {
  return ids.flatMap((id) => findSkill(id) ?? [])
}

const companyName = (companyId: number) =>
  getDb().companies.find((c) => c.userId === companyId)?.companyName ?? null

export function toOfferSummary(o: OfferRecord): JobOfferSummaryResponse {
  return {
    id: o.id, companyName: companyName(o.companyId), title: o.title, workMode: o.workMode,
    jobType: o.jobType, status: o.status, location: o.location, createdAt: o.createdAt,
    skills: toSkills(o.skillIds),
  }
}

/** Full detail. interviewInstructions is deliberately absent: only the owner's own endpoint returns it. */
export function toOffer(o: OfferRecord): JobOfferResponse {
  return {
    id: o.id, companyId: o.companyId, companyName: companyName(o.companyId), title: o.title,
    description: o.description, responsibilities: o.responsibilities, requirements: o.requirements,
    benefits: o.benefits, workMode: o.workMode, jobType: o.jobType, status: o.status,
    location: o.location, requiresInterview: o.requiresInterview, createdAt: o.createdAt,
    expiresAt: o.expiresAt, skills: toSkills(o.skillIds),
  }
}

export function toApplication(a: ApplicationRecord): JobApplicationResponse {
  const db = getDb()
  const offer = db.offers.find((o) => o.id === a.jobOfferId)
  const candidate = db.candidates.find((c) => c.userId === a.candidateId)
  return {
    id: a.id, status: a.status, appliedAt: a.appliedAt, updatedAt: a.updatedAt,
    jobOfferId: a.jobOfferId, jobOfferTitle: offer?.title ?? null,
    companyName: offer ? companyName(offer.companyId) : null,
    candidateId: a.candidateId, candidateFirstName: candidate?.firstName ?? null,
    candidateLastName: candidate?.lastName ?? null,
    candidateEmail: db.users.find((u) => u.id === a.candidateId)?.email ?? null,
    curriculumId: a.curriculumId,
  }
}

export function toCandidateProfile(c: CandidateRecord): CandidateProfileResponse {
  const db = getDb()
  return {
    userId: c.userId, email: db.users.find((u) => u.id === c.userId)?.email ?? '',
    firstName: c.firstName, lastName: c.lastName, phone: c.phone, location: c.location, bio: c.bio,
    profileImageUrl: c.profileImageUrl, linkedinUrl: c.linkedinUrl, githubUrl: c.githubUrl,
    portfolioUrl: c.portfolioUrl, birthdate: c.birthdate,
    skills: toSkills(c.skillIds),
    workExperiences: c.workExperiences, educations: c.educations, languages: c.languages,
  }
}

export function toCompanyProfile(c: CompanyRecord): CompanyProfileResponse {
  return {
    userId: c.userId, email: getDb().users.find((u) => u.id === c.userId)?.email ?? '',
    companyName: c.companyName, industry: c.industry, about: c.about, website: c.website,
    logoUrl: c.logoUrl, location: c.location,
  }
}

export function toCurriculum(cv: CurriculumRecord): GeneratedCurriculumResponse {
  return {
    id: cv.id, jobOfferId: cv.jobOfferId,
    jobOfferTitle: getDb().offers.find((o) => o.id === cv.jobOfferId)?.title ?? null,
    content: cv.content, isAiGenerated: cv.isAiGenerated, createdAt: cv.createdAt,
  }
}

/** The list endpoint omits messages "for performance"; the detail endpoint includes them. */
export function toInterview(iv: InterviewRecord, withMessages: boolean): SimulatedInterviewResponse {
  return {
    id: iv.id, jobOfferId: iv.jobOfferId,
    jobOfferTitle: getDb().offers.find((o) => o.id === iv.jobOfferId)?.title ?? null,
    status: iv.status, createdAt: iv.createdAt, completedAt: iv.completedAt,
    messages: withMessages ? iv.messages : [],
  }
}
