import type { AuthResponse } from '@/types/api.types'
import type {
  LoginRequest, RefreshTokenRequest, RegisterCandidateRequest, RegisterCompanyRequest,
} from '@/features/auth/types/auth.types'
import { getDb, nextId } from '../db/store'
import { hashPassword } from '../db/password'
import { issueTokens, userFromRefreshToken } from '../db/session'
import type { UserRecord } from '../db/types'
import { conflict, unauthorized } from '../http/errors'
import { jsonBody } from '../http/request'
import { publicRoute } from '../http/router'
import { Validator } from '../http/validation'

/** Validation messages are the backend's own (RegisterCandidateRequest & co.). */
function accountValidator(body: object): Validator {
  return new Validator(body)
    .notBlank('email', 'Email is required').email('email', 'Invalid email format')
    .notBlank('password', 'Password is required')
    .minLength('password', 8, 'Password must be at least 8 characters')
}

function createUser(email: string, password: string, role: UserRecord['role']): UserRecord {
  const db = getDb()
  if (db.users.some((u) => u.email === email)) throw conflict(`Email already in use: ${email}`)
  const user: UserRecord = { id: nextId('users'), email, passwordHash: hashPassword(password), role }
  db.users.push(user)
  return user
}

/** Shared by POST /auth/refresh and the app bootstrap (see demoRefresh in index.ts). */
export function refreshTokens(refreshToken: string): AuthResponse {
  const user = userFromRefreshToken(refreshToken)
  if (!user) throw unauthorized('Invalid refresh token')
  return issueTokens(user)
}

export function registerAuthRoutes(): void {
  publicRoute('POST', '/auth/login', (req) => {
    const body = jsonBody<LoginRequest>(req)
    new Validator(body)
      .notBlank('email').email('email').notBlank('password').check()

    const user = getDb().users.find((u) => u.email === body.email)
    // One message for both "no such user" and "wrong password", like the backend.
    if (!user || user.passwordHash !== hashPassword(body.password)) throw unauthorized('Invalid credentials')
    return { status: 200, data: issueTokens(user) }
  })

  publicRoute('POST', '/auth/register/candidate', (req) => {
    const body = jsonBody<RegisterCandidateRequest>(req)
    accountValidator(body)
      .notBlank('firstName', 'First name is required').notBlank('lastName', 'Last name is required').check()

    const user = createUser(body.email, body.password, 'CANDIDATE')
    getDb().candidates.push({
      userId: user.id, firstName: body.firstName, lastName: body.lastName, phone: null, location: null,
      bio: null, profileImageUrl: null, linkedinUrl: null, githubUrl: null, portfolioUrl: null,
      birthdate: null, skillIds: [], languages: [], workExperiences: [], educations: [],
    })
    return { status: 201, data: issueTokens(user) }
  })

  publicRoute('POST', '/auth/register/company', (req) => {
    const body = jsonBody<RegisterCompanyRequest>(req)
    accountValidator(body)
      .notBlank('companyName', 'Company name is required').check()

    const user = createUser(body.email, body.password, 'COMPANY')
    getDb().companies.push({
      userId: user.id, companyName: body.companyName, industry: null, about: null,
      website: null, logoUrl: null, location: null,
    })
    return { status: 201, data: issueTokens(user) }
  })

  publicRoute('POST', '/auth/refresh', (req) => {
    const body = jsonBody<RefreshTokenRequest>(req)
    new Validator(body).notBlank('refreshToken', 'Refresh token is required').check()
    return { status: 200, data: refreshTokens(body.refreshToken) }
  })
}
