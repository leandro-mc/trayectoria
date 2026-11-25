import { APPLICATIONS, SAVED_OFFERS } from '../fixtures/applications'
import { CANDIDATES, COMPANIES, DEMO_PASSWORD } from '../fixtures/accounts'
import { CURRICULA, INTERVIEWS } from '../fixtures/ai-content'
import { OFFERS } from '../fixtures/offers'
import { skillIds } from '../fixtures/skills'
import { hashPassword } from './password'
import { daysFromNow } from './time'
import type { DemoDb } from './types'

/**
 * Builds the initial state from the fixtures, in the same order the real seed creates things
 * (companies, offers, candidates, applications...) so the ids match a seeded backend.
 * Dates are relative to "now": the board always looks recently active.
 */
export function buildSeedDb(): DemoDb {
  const passwordHash = hashPassword(DEMO_PASSWORD)
  let userId = 1
  let experienceId = 1
  let educationId = 1
  let applicationId = 1

  const db: DemoDb = {
    users: [], candidates: [], companies: [],
    offers: [], applications: [], savedOffers: [], curricula: [], interviews: [],
    nextIds: { users: 1, offers: 1, applications: 1, experiences: 1, educations: 1, curricula: 1, interviews: 1, messages: 1 },
  }

  const companyId = new Map<string, number>()
  for (const c of COMPANIES) {
    const id = userId++
    companyId.set(c.key, id)
    db.users.push({ id, email: c.email, passwordHash, role: 'COMPANY' })
    db.companies.push({ userId: id, companyName: c.companyName, industry: c.industry, about: c.about, website: c.website, logoUrl: null, location: c.location })
  }

  const offerId = new Map<string, number>()
  OFFERS.forEach((o, index) => {
    const id = index + 1
    offerId.set(o.key, id)
    db.offers.push({
      id, companyId: companyId.get(o.company)!, title: o.title, description: o.description,
      responsibilities: o.responsibilities, requirements: o.requirements, benefits: o.benefits,
      workMode: o.workMode, jobType: o.jobType, status: o.status, location: o.location,
      interviewInstructions: o.interviewInstructions ?? null, requiresInterview: o.requiresInterview,
      createdAt: daysFromNow(-o.postedDaysAgo), expiresAt: daysFromNow(o.expiresInDays),
      skillIds: skillIds(o.skills),
    })
  })

  const candidateId = new Map<string, number>()
  for (const c of CANDIDATES) {
    const id = userId++
    candidateId.set(c.key, id)
    db.users.push({ id, email: c.email, passwordHash, role: 'CANDIDATE' })
    db.candidates.push({
      userId: id, firstName: c.firstName, lastName: c.lastName, phone: c.phone, location: c.location,
      bio: c.bio, profileImageUrl: null, linkedinUrl: c.linkedinUrl, githubUrl: c.githubUrl,
      portfolioUrl: c.portfolioUrl, birthdate: c.birthdate, skillIds: skillIds(c.skills), languages: c.languages,
      workExperiences: c.experience.map((e) => ({ ...e, id: experienceId++ })),
      educations: c.education.map((e) => ({ ...e, id: educationId++ })),
    })
    for (const key of SAVED_OFFERS[c.key]) db.savedOffers.push({ candidateId: id, jobOfferId: offerId.get(key)! })
  }

  // CVs first: some applications point at them.
  const curriculumByPair = new Map<string, number>()
  CURRICULA.forEach((cv, index) => {
    const id = index + 1
    const pair = `${candidateId.get(cv.candidate)}:${offerId.get(cv.offer)}`
    curriculumByPair.set(pair, id)
    db.curricula.push({
      id, candidateId: candidateId.get(cv.candidate)!, jobOfferId: offerId.get(cv.offer)!,
      content: cv.content, isAiGenerated: true, createdAt: daysFromNow(-cv.daysAgo),
    })
  })

  for (const c of CANDIDATES) {
    for (const a of APPLICATIONS[c.key]) {
      const cId = candidateId.get(c.key)!
      const oId = offerId.get(a.offer)!
      db.applications.push({
        id: applicationId++, candidateId: cId, jobOfferId: oId,
        curriculumId: curriculumByPair.get(`${cId}:${oId}`) ?? null,
        status: a.status, appliedAt: daysFromNow(-a.appliedDaysAgo),
        updatedAt: a.reviewedDaysAgo === undefined ? null : daysFromNow(-a.reviewedDaysAgo),
      })
    }
  }

  let messageId = 1
  INTERVIEWS.forEach((iv, index) => {
    db.interviews.push({
      id: index + 1, candidateId: candidateId.get(iv.candidate)!, jobOfferId: offerId.get(iv.offer)!,
      status: iv.status, createdAt: daysFromNow(-iv.daysAgo),
      completedAt: iv.durationMinutes ? daysFromNow(-iv.daysAgo, iv.durationMinutes) : null,
      messages: iv.messages.map((m) => ({ id: messageId++, role: m.role, content: m.content, sentAt: daysFromNow(-iv.daysAgo, m.at / 60) })),
      feedback: iv.feedback ?? null,
    })
  })

  db.nextIds = {
    users: userId, offers: OFFERS.length + 1, applications: applicationId, experiences: experienceId,
    educations: educationId, curricula: CURRICULA.length + 1, interviews: INTERVIEWS.length + 1, messages: messageId,
  }
  return db
}
