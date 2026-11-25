import { getDb, nextId } from '../db/store'
import type { CandidateRecord, IdTable } from '../db/types'
import { badRequest, forbidden } from '../http/errors'
import { jsonBody, pathId } from '../http/request'
import { route } from '../http/router'

interface CollectionSpec<T extends { id: number }> {
  /** Path segment under /candidates/me, e.g. "experience". */
  path: string
  idTable: Extract<IdTable, 'experiences' | 'educations'>
  forbiddenMessage: string
  /** The candidate's own list (the real array, so it can be mutated). */
  list: (candidate: CandidateRecord) => T[]
  /** Throws the backend's validation error for an invalid body. */
  validate: (body: Record<string, unknown>) => void
  /** Builds the full record from a request body. */
  build: (body: Record<string, unknown>, id: number) => T
}

/** Request dates are LocalDate; anything else is Jackson's "Malformed JSON request body". */
export function localDateOrNull(body: object, field: string): string | null {
  const value = (body as Record<string, unknown>)[field]
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw badRequest('Malformed JSON request body')
  return value
}

/**
 * Work experience and education share one REST shape (list / add / replace / delete, owned
 * by the candidate), so both are registered from a spec instead of copy-pasted.
 */
export function registerCollection<T extends { id: number }>(spec: CollectionSpec<T>): void {
  const base = `/candidates/me/${spec.path}`
  const candidateOf = (userId: number) => getDb().candidates.find((c) => c.userId === userId)!

  route('GET', base, 'CANDIDATE', (_req, user) => ({ status: 200, data: spec.list(candidateOf(user.id)) }))

  route('POST', base, 'CANDIDATE', (req, user) => {
    const body = jsonBody<Record<string, unknown>>(req)
    spec.validate(body)
    const entry = spec.build(body, nextId(spec.idTable))
    spec.list(candidateOf(user.id)).push(entry)
    return { status: 201, data: entry }
  })

  route('PUT', `${base}/:id`, 'CANDIDATE', (req, user) => {
    const body = jsonBody<Record<string, unknown>>(req)
    spec.validate(body)
    const list = spec.list(candidateOf(user.id))
    const index = list.findIndex((e) => e.id === pathId(req))
    if (index < 0) throw forbidden(spec.forbiddenMessage)
    const entry = spec.build(body, list[index]!.id)
    list[index] = entry
    return { status: 200, data: entry }
  })

  route('DELETE', `${base}/:id`, 'CANDIDATE', (req, user) => {
    const candidate = candidateOf(user.id)
    const id = pathId(req)
    const list = spec.list(candidate)
    if (!list.some((e) => e.id === id)) throw forbidden(spec.forbiddenMessage)
    list.splice(list.findIndex((e) => e.id === id), 1)
    return { status: 204 }
  })
}
