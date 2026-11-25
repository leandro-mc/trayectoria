import type { CompanyStatsResponse, UpdateCompanyProfileRequest } from '@/features/company/types/company.types'
import { getDb } from '../db/store'
import type { CompanyRecord } from '../db/types'
import { jsonBody } from '../http/request'
import { route } from '../http/router'
import { Validator } from '../http/validation'
import { toCompanyProfile } from '../mappers'
import { imageToDataUrl } from './uploads'

const own = (userId: number): CompanyRecord => getDb().companies.find((c) => c.userId === userId)!

const PROFILE_FIELDS = ['companyName', 'industry', 'about', 'website', 'location'] as const

export function registerCompanyRoutes(): void {
  route('GET', '/companies/me', 'COMPANY', (_req, user) => ({ status: 200, data: toCompanyProfile(own(user.id)) }))

  route('PUT', '/companies/me', 'COMPANY', (req, user) => {
    const body = jsonBody<UpdateCompanyProfileRequest>(req)
    new Validator(body)
      .maxLength('companyName', 255).maxLength('industry', 150).maxLength('website', 255).maxLength('location', 255).check()

    const company = own(user.id)
    for (const field of PROFILE_FIELDS) {
      const value = body[field]
      if (value !== undefined && value !== null) company[field] = value
    }
    return { status: 200, data: toCompanyProfile(company) }
  })

  route('PATCH', '/companies/me/logo', 'COMPANY', async (req, user) => {
    const logoUrl = await imageToDataUrl(req.body)
    own(user.id).logoUrl = logoUrl
    return { status: 200, data: { logoUrl } }
  })

  route('GET', '/companies/me/stats', 'COMPANY', (_req, user) => {
    const db = getDb()
    const ownOffers = new Set(db.offers.filter((o) => o.companyId === user.id).map((o) => o.id))
    const received = db.applications.filter((a) => ownOffers.has(a.jobOfferId))
    const stats: CompanyStatsResponse = {
      activeOffers: db.offers.filter((o) => o.companyId === user.id && o.status === 'ACTIVE').length,
      totalApplications: received.length,
      pendingApplications: received.filter((a) => a.status === 'PENDING').length,
    }
    return { status: 200, data: stats }
  })
}
