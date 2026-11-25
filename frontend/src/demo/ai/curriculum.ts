import type { CurriculumContent } from '@/features/ai/curricula/types/curricula.types'
import type { CandidateProfileResponse } from '@/features/candidate/types/candidate.types'
import type { JobOfferResponse } from '@/features/jobs/types/jobs.types'
import { formatDate } from '@/lib/utils/date'
import { joinList, overlap, without } from './text'

/**
 * Stand-in for the real AI CV generator: a deterministic template filled from the candidate's
 * profile and the offer. Same input, same output; nothing leaves the browser.
 */

const MAX_SKILLS = 10
const YEAR_MS = 365.25 * 86_400_000

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const month = (date: string) => capitalize(formatDate(date, 'MMM yyyy'))

function period(start: string | null, end: string | null, current: boolean): string {
  if (!start) return ''
  return `${month(start)} – ${current || !end ? 'Presente' : month(end)}`
}

function educationPeriod(start: string | null, end: string | null): string {
  const years = [start, end].filter(Boolean).map((d) => String(d).slice(0, 4))
  return [...new Set(years)].join(' – ')
}

/** Declared level, in the CV's wording ("Native" is shown as "Nativo"). */
const level = (value: string | null) => (value === 'Native' ? 'Nativo' : (value ?? ''))

/** "Degree en Field", unless the degree already says it ("Ingeniería en Sistemas" + "Ingeniería de Software"). */
function degreeLabel(degree: string | null, field: string | null): string {
  if (!degree) return field ?? ''
  return field && !degree.toLowerCase().includes(' en ') ? `${degree} en ${field}` : degree
}

/** The profile as a CV, with no tailoring. It is also what a company sees when no CV was attached. */
export function buildBaseContent(profile: CandidateProfileResponse): CurriculumContent {
  return {
    summary: profile.bio ?? '',
    experience: profile.workExperiences.map((e) => ({
      company: e.company ?? '', position: e.position ?? '', description: e.description ?? '',
      period: period(e.startDate, e.endDate, e.isCurrent),
    })),
    education: profile.educations.map((e) => ({
      institution: e.institution ?? '',
      degree: degreeLabel(e.degree, e.fieldOfStudy),
      period: educationPeriod(e.startDate, e.endDate),
    })),
    skills: profile.skills.map((s) => s.name).sort((a, b) => a.localeCompare(b)),
    languages: profile.languages.map((l) => ({ language: l.language, level: level(l.level) })),
    highlights: [],
  }
}

function yearsOfExperience(profile: CandidateProfileResponse): number {
  const starts = profile.workExperiences.flatMap((e) => (e.startDate ? [new Date(e.startDate).getTime()] : []))
  return starts.length === 0 ? 0 : Math.max(0, Math.floor((Date.now() - Math.min(...starts)) / YEAR_MS))
}

export function generateCurriculumContent(profile: CandidateProfileResponse, offer: JobOfferResponse): CurriculumContent {
  const base = buildBaseContent(profile)
  const mine = profile.skills.map((s) => s.name)
  const required = offer.skills.map((s) => s.name)
  const matched = overlap(mine, required)
  const missing = without(required, mine)

  const latest = profile.workExperiences.find((e) => e.isCurrent) ?? profile.workExperiences[0]
  const role = latest?.position ?? 'Profesional'
  const years = yearsOfExperience(profile)
  const seniority = years > 0 ? ` con ${years} ${years === 1 ? 'año' : 'años'} de experiencia` : ''
  const fit = matched.length > 0
    ? `experiencia directa en ${joinList(matched)}`
    : 'una base sólida y muchas ganas de aprender'
  const growth = missing.length > 0 ? ` y disposición para reforzar ${joinList(missing.slice(0, 2))}` : ''

  const highlights = [
    matched.length > 0 && `Coincide con ${matched.length} de ${required.length} habilidades de la oferta: ${joinList(matched)}`,
    latest && `${latest.position} en ${latest.company}`,
    profile.languages.length > 0 && `Idiomas: ${joinList(profile.languages.map((l) => `${l.language} (${level(l.level)})`))}`,
  ].filter((h): h is string => typeof h === 'string')

  return {
    ...base,
    summary: `${role}${seniority}. Postula a ${offer.title}${offer.companyName ? ` en ${offer.companyName}` : ''} aportando ${fit}${growth}.`,
    // Skills the offer asks for first, so the match is visible at a glance.
    skills: [...matched, ...without(mine, matched)].slice(0, MAX_SKILLS),
    highlights: highlights.slice(0, 3),
  }
}
