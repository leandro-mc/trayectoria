import type { AuthResponse } from '@/types/api.types'
import type { UserRole } from '@/types/global.types'
import { getDb } from './store'
import type { UserRecord } from './types'

export interface SessionUser {
  id: number
  email: string
  role: UserRole
}

const ACCESS_PREFIX  = 'demo-access.'
const REFRESH_PREFIX = 'demo-refresh.'

/**
 * Tokens are opaque strings that carry the email, so the session survives reloads and the
 * 401 -> refresh path of the Axios interceptors runs for real. They are not secrets and do
 * not expire: an expiring demo session would only add confusion.
 */
export function issueTokens(user: UserRecord): AuthResponse {
  const subject = encodeURIComponent(user.email)
  return {
    accessToken:  ACCESS_PREFIX + subject,
    refreshToken: REFRESH_PREFIX + subject,
    email:        user.email,
    role:         user.role,
  }
}

function userFromToken(token: string | null, prefix: string): UserRecord | null {
  if (!token?.startsWith(prefix)) return null
  const email = decodeURIComponent(token.slice(prefix.length))
  return getDb().users.find((u) => u.email === email) ?? null
}

export function resolveSessionUser(accessToken: string | null): SessionUser | null {
  const user = userFromToken(accessToken, ACCESS_PREFIX)
  return user && { id: user.id, email: user.email, role: user.role }
}

export const userFromRefreshToken = (token: string) => userFromToken(token, REFRESH_PREFIX)
