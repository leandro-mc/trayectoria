import type { WorkMode, JobType, ApplicationStatus, LanguageLevel, SkillType, JobStatus, InterviewRecommendation  } from '@/types/global.types'

/** Colour intent of a status. Maps 1:1 to the Badge variants of the same name. */
export type StatusTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

//  Work Mode 

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  REMOTE:  'Remoto',
  HYBRID:  'Híbrido',
  ON_SITE: 'Presencial',
}

//  Job Type 

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME:  'Tiempo completo',
  PART_TIME:  'Medio tiempo',
  INTERNSHIP: 'Pasantía',
}

//  Job Status 

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  ACTIVE: 'Activa',
  CLOSED: 'Cerrada',
  DRAFT:  'Borrador',
}

export const JOB_STATUS_TONE: Record<JobStatus, StatusTone> = {
  ACTIVE: 'success',
  CLOSED: 'danger',
  DRAFT:  'neutral',
}

//  Application Status 

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING:   'Pendiente',
  VIEWED:    'Visto',
  IN_REVIEW: 'En revisión',
  ACCEPTED:  'Aceptado',
  REJECTED:  'Rechazado',
}

export const APPLICATION_STATUS_TONE: Record<ApplicationStatus, StatusTone> = {
  PENDING:   'neutral',
  VIEWED:    'brand',
  IN_REVIEW: 'warning',
  ACCEPTED:  'success',
  REJECTED:  'danger',
}

//  Language Levels 

export const LANGUAGE_LEVELS: readonly LanguageLevel[] = [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native',
]

export const LANGUAGE_LEVEL_LABELS: Record<LanguageLevel, string> = {
  A1:     'A1 — Principiante',
  A2:     'A2 — Elemental',
  B1:     'B1 — Intermedio',
  B2:     'B2 — Intermedio alto',
  C1:     'C1 — Avanzado',
  C2:     'C2 — Dominio',
  Native: 'Nativo',
}

//  Skill Types 

export const SKILL_TYPES: readonly SkillType[] = [
  'TECHNICAL', 'SOFT', 'TOOL', 'LANGUAGE',
]

export const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  TECHNICAL: 'Técnica',
  SOFT:      'Blanda',
  TOOL:      'Herramienta',
  LANGUAGE:  'Idioma',
}

//  Pagination 

export const DEFAULT_PAGE_SIZE = 10


//  Interview Recommendation 

export const INTERVIEW_RECOMMENDATION_LABELS: Record<InterviewRecommendation, string> = {
  STRONG_YES: 'Candidato destacado',
  YES:        'Recomendado',
  MAYBE:      'A considerar',
  NO:         'No recomendado',
}

export const INTERVIEW_RECOMMENDATION_TONE: Record<InterviewRecommendation, StatusTone> = {
  STRONG_YES: 'success',
  YES:        'brand',
  MAYBE:      'warning',
  NO:         'danger',
}
