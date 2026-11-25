import type { LanguageResponse, EducationResponse, WorkExperienceResponse } from '@/types/api.types'
import type { InterviewStatus, JobStatus, JobType, MessageRole, UserRole, WorkMode, ApplicationStatus } from '@/types/global.types'
import type { CurriculumContent } from '@/features/ai/curricula/types/curricula.types'
import type { InterviewFeedback } from '@/features/ai/interviews/types/interviews.types'

/**
 * In-memory "tables". They are normalised like the real database (ids instead of nested
 * objects) and the handlers map them to the backend's response DTOs, so a response can
 * never drift from what the UI's types describe.
 */

export interface UserRecord {
  id: number
  email: string
  passwordHash: string
  role: UserRole
}

export interface CandidateRecord {
  userId: number
  firstName: string | null
  lastName: string | null
  phone: string | null
  location: string | null
  bio: string | null
  profileImageUrl: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  portfolioUrl: string | null
  birthdate: string | null
  skillIds: number[]
  languages: LanguageResponse[]
  workExperiences: WorkExperienceResponse[]
  educations: EducationResponse[]
}

export interface CompanyRecord {
  userId: number
  companyName: string | null
  industry: string | null
  about: string | null
  website: string | null
  logoUrl: string | null
  location: string | null
}

export interface OfferRecord {
  id: number
  companyId: number
  title: string
  description: string | null
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
  workMode: WorkMode | null
  jobType: JobType | null
  status: JobStatus
  location: string | null
  interviewInstructions: string | null
  requiresInterview: boolean
  createdAt: string
  expiresAt: string | null
  skillIds: number[]
}

export interface ApplicationRecord {
  id: number
  candidateId: number
  jobOfferId: number
  curriculumId: number | null
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string | null
}

export interface SavedOfferRecord {
  candidateId: number
  jobOfferId: number
}

export interface CurriculumRecord {
  id: number
  candidateId: number
  jobOfferId: number | null
  content: CurriculumContent
  isAiGenerated: boolean
  createdAt: string
}

export interface InterviewMessageRecord {
  id: number
  role: MessageRole
  content: string
  sentAt: string
}

export interface InterviewRecord {
  id: number
  candidateId: number
  jobOfferId: number
  status: InterviewStatus
  createdAt: string
  completedAt: string | null
  messages: InterviewMessageRecord[]
  /** The real API returns it only from PATCH /complete; the demo keeps it to seed the UI's feedback cache. */
  feedback: InterviewFeedback | null
}

/** Tables whose ids are generated on insert (users share one sequence, like the real `users` table). */
export type IdTable =
  | 'users' | 'offers' | 'applications' | 'experiences' | 'educations'
  | 'curricula' | 'interviews' | 'messages'

export interface DemoDb {
  users: UserRecord[]
  candidates: CandidateRecord[]
  companies: CompanyRecord[]
  offers: OfferRecord[]
  applications: ApplicationRecord[]
  savedOffers: SavedOfferRecord[]
  curricula: CurriculumRecord[]
  interviews: InterviewRecord[]
  nextIds: Record<IdTable, number>
}
