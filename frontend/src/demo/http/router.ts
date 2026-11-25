import type { UserRole } from '@/types/global.types'
import { forbidden, unauthorized } from './errors'
import type { SessionUser } from '../db/session'
import { resolveSessionUser } from '../db/session'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface DemoRequest {
  method: HttpMethod
  /** Path relative to the API base, without query string: `/job-offers/3`. */
  path: string
  /** Variables captured from the route pattern (`:id`). Raw strings; see request.ts. */
  params: Record<string, string>
  query: Record<string, unknown>
  /** Parsed JSON body, or a FormData for uploads. */
  body: unknown
  bearerToken: string | null
}

export interface RouteResult {
  status: number
  data?: unknown
}

/** Who may call a route, mirroring SecurityConfig: nobody to log in, one role, or either. */
export type Access = 'public' | UserRole | 'authenticated'

type Handler = (req: DemoRequest, user: SessionUser) => RouteResult | Promise<RouteResult>
type PublicHandler = (req: DemoRequest) => RouteResult | Promise<RouteResult>

interface PublicRoute    { method: HttpMethod; segments: string[]; access: 'public'; handler: PublicHandler }
interface ProtectedRoute { method: HttpMethod; segments: string[]; access: Exclude<Access, 'public'>; handler: Handler }
type Route = PublicRoute | ProtectedRoute

const routes: Route[] = []

/** Registers a route that anyone can call (login, public job board, skills catalog). */
export function publicRoute(method: HttpMethod, pattern: string, handler: PublicHandler): void {
  routes.push({ method, segments: split(pattern), access: 'public', handler })
}

/** Registers a route for signed-in users; the handler receives the resolved user. */
export function route(method: HttpMethod, pattern: string, access: Exclude<Access, 'public'>, handler: Handler): void {
  routes.push({ method, segments: split(pattern), access, handler })
}

const split = (path: string) => path.split('/').filter(Boolean)

function match(route: Pick<Route, 'method' | 'segments'>, method: HttpMethod, segments: string[]): Record<string, string> | null {
  if (route.method !== method || route.segments.length !== segments.length) return null

  const params: Record<string, string> = {}
  for (const [i, expected] of route.segments.entries()) {
    const actual = segments[i] ?? ''
    if (expected.startsWith(':')) params[expected.slice(1)] = decodeURIComponent(actual)
    else if (expected !== actual) return null
  }
  return params
}

/**
 * Finds the handler for a request and enforces its access rule.
 * Returns null when no route matches, so the adapter can fail loudly (501).
 */
export function dispatch(req: Omit<DemoRequest, 'params'>): (() => Promise<RouteResult>) | null {
  const segments = split(req.path)

  for (const candidate of routes) {
    const params = match(candidate, req.method, segments)
    if (!params) continue

    return async () => {
      const full: DemoRequest = { ...req, params }
      if (candidate.access === 'public') return candidate.handler(full)

      // Same split as Spring: no/invalid token is 401 (the client then tries a refresh),
      // a valid token with the wrong role is 403.
      const user = resolveSessionUser(req.bearerToken)
      if (!user) throw unauthorized('Authentication required')
      if (candidate.access !== 'authenticated' && user.role !== candidate.access) {
        throw forbidden("You don't have permission to access this resource")
      }
      return candidate.handler(full, user)
    }
  }
  return null
}
