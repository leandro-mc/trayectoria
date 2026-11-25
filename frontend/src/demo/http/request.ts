import type { PageResponse } from '@/types/api.types'
import { badRequest } from './errors'
import type { DemoRequest } from './router'

/** `/job-offers/abc` -> 400, like Spring's MethodArgumentTypeMismatchException. */
export function pathId(req: DemoRequest, name = 'id'): number {
  const raw = req.params[name]
  const value = Number(raw)
  if (!Number.isInteger(value)) throw badRequest(`Invalid value '${raw}' for parameter '${name}'`)
  return value
}

/** Optional numeric query param (`?skillId=3`); missing/blank is undefined, junk is a 400. */
export function queryNumber(req: DemoRequest, name: string): number | undefined {
  const raw = req.query[name]
  if (raw === undefined || raw === null || raw === '') return undefined
  const value = Number(raw)
  if (!Number.isInteger(value)) throw badRequest(`Invalid value '${String(raw)}' for parameter '${name}'`)
  return value
}

/** Optional string query param; blank counts as absent. */
export function queryString(req: DemoRequest, name: string): string | undefined {
  const raw = req.query[name]
  return typeof raw === 'string' && raw !== '' ? raw : undefined
}

/** A required `?name=` param, like `@RequestParam` without a default. */
export function requiredQueryNumber(req: DemoRequest, name: string): number {
  const value = queryNumber(req, name)
  if (value === undefined) throw badRequest(`Required parameter missing: ${name}`)
  return value
}

/** JSON object body; anything else is the "Malformed JSON request body" 400. */
export function jsonBody<T>(req: DemoRequest): T {
  if (typeof req.body !== 'object' || req.body === null || req.body instanceof FormData) {
    throw badRequest('Malformed JSON request body')
  }
  return req.body as T
}

/** Same defaults as the controllers' `@RequestParam(defaultValue = ...)`. */
export function pageParams(req: DemoRequest): { page: number; size: number } {
  const page = queryNumber(req, 'page') ?? 0
  const size = queryNumber(req, 'size') ?? 10
  if (page < 0 || size < 1) throw badRequest('Page index must not be less than zero and page size must be greater than zero')
  return { page, size }
}

/** Slices a full list into Spring's Page shape (PageResponse). */
export function paginate<T>(items: readonly T[], { page, size }: { page: number; size: number }): PageResponse<T> {
  const totalPages = Math.ceil(items.length / size)
  return {
    content:       items.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: items.length,
    totalPages,
    last:          page + 1 >= totalPages,
  }
}
