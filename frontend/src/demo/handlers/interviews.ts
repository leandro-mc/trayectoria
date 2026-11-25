import type { CompletedInterviewResponse, SendMessageRequest, StartInterviewRequest } from '@/features/ai/interviews/types/interviews.types'
import { getDb, nextId } from '../db/store'
import { nowString } from '../db/time'
import type { InterviewRecord } from '../db/types'
import { buildFeedback, interviewGreeting, interviewerReply, type InterviewContext } from '../ai/interview'
import { notFound, unprocessable } from '../http/errors'
import { jsonBody, pathId } from '../http/request'
import { route } from '../http/router'
import { Validator } from '../http/validation'
import { toInterview, toSkills } from '../mappers'
import { requireOffer } from './ownership'

const newestFirst = (a: InterviewRecord, b: InterviewRecord) => b.createdAt.localeCompare(a.createdAt)

/** The offer facts the scripted interviewer needs. */
function contextFor(interview: InterviewRecord): InterviewContext {
  const db = getDb()
  const offer = requireOffer(interview.jobOfferId)
  return {
    title: offer.title,
    company: db.companies.find((c) => c.userId === offer.companyId)?.companyName ?? null,
    skills: toSkills(offer.skillIds).map((s) => s.name),
  }
}

/** Another candidate's interview is a 404, as in the backend (lookup is by id AND owner). */
function ownInterview(id: number, userId: number): InterviewRecord {
  const interview = getDb().interviews.find((i) => i.id === id && i.candidateId === userId)
  if (!interview) throw notFound(`Interview not found: ${id}`)
  return interview
}

const addMessage = (interview: InterviewRecord, role: 'USER' | 'ASSISTANT', content: string) => {
  const message = { id: nextId('messages'), role, content, sentAt: nowString() }
  interview.messages.push(message)
  return message
}

export function registerInterviewRoutes(): void {
  route('POST', '/interviews', 'CANDIDATE', (req, user) => {
    const body = jsonBody<StartInterviewRequest>(req)
    new Validator(body).notNull('jobOfferId', 'jobOfferId is required').check()

    const offer = requireOffer(body.jobOfferId)
    const interview: InterviewRecord = {
      id: nextId('interviews'), candidateId: user.id, jobOfferId: offer.id, status: 'IN_PROGRESS',
      createdAt: nowString(), completedAt: null, messages: [], feedback: null,
    }
    const firstName = getDb().candidates.find((c) => c.userId === user.id)?.firstName ?? null
    addMessage(interview, 'ASSISTANT', interviewGreeting(firstName, contextFor(interview)))
    getDb().interviews.push(interview)
    return { status: 201, data: toInterview(interview, true) }
  })

  route('GET', '/interviews', 'CANDIDATE', (_req, user) => ({
    status: 200,
    data: getDb().interviews.filter((i) => i.candidateId === user.id).sort(newestFirst).map((i) => toInterview(i, false)),
  }))

  route('GET', '/interviews/:id', 'CANDIDATE', (req, user) => ({
    status: 200, data: toInterview(ownInterview(pathId(req), user.id), true),
  }))

  // Responds with the interviewer's reply only; the client appends the candidate's own message.
  route('POST', '/interviews/:id/messages', 'CANDIDATE', (req, user) => {
    const body = jsonBody<SendMessageRequest>(req)
    new Validator(body)
      .notBlank('content', 'Message content is required')
      .maxLength('content', 2000, 'Message cannot exceed 2000 characters').check()

    const interview = ownInterview(pathId(req), user.id)
    if (interview.status === 'COMPLETED') throw unprocessable('This interview is already completed')

    addMessage(interview, 'USER', body.content)
    const userMessages = interview.messages.filter((m) => m.role === 'USER').length
    return { status: 201, data: addMessage(interview, 'ASSISTANT', interviewerReply(contextFor(interview), userMessages)) }
  })

  route('PATCH', '/interviews/:id/complete', 'CANDIDATE', (req, user) => {
    const interview = ownInterview(pathId(req), user.id)
    const answers = interview.messages.filter((m) => m.role === 'USER').map((m) => m.content)

    interview.feedback = buildFeedback(contextFor(interview), answers)
    interview.status = 'COMPLETED'
    interview.completedAt = nowString()

    const data: CompletedInterviewResponse = { interview: toInterview(interview, true), feedback: interview.feedback }
    return { status: 200, data }
  })
}
