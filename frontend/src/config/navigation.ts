import {
  Briefcase, Building2, Bookmark, FileText, LayoutDashboard, ListChecks,
  MessageSquare, PlusCircle, Search, User,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'
import type { UserRole } from '@/types/global.types'

/**
 * Single source of truth for in-app navigation. The desktop sidebar and the
 * mobile bottom bar both render from this list, so a route is declared once.
 */
export interface NavItem {
  href:         string
  icon:         LucideIcon
  label:        string
  /** Also active on sub-routes (e.g. /company/offers/12). */
  matchPrefix?: boolean
  /** Present = shown in the mobile bottom bar, with its shorter label. */
  mobile?:      { label: string; activePrefix?: string }
}

export const NAV_ITEMS: Record<UserRole, readonly NavItem[]> = {
  CANDIDATE: [
    { href: ROUTES.dashboard,    icon: LayoutDashboard, label: 'Inicio',            mobile: { label: 'Inicio' } },
    { href: ROUTES.jobs,         icon: Search,          label: 'Buscar empleos',    mobile: { label: 'Empleos' } },
    { href: ROUTES.applications, icon: Briefcase,       label: 'Mis postulaciones', mobile: { label: 'Postulaciones' } },
    { href: ROUTES.saved,        icon: Bookmark,        label: 'Guardadas' },
    // On a phone "CV" covers every /ai/* page, since interviews have no tab of their own.
    { href: ROUTES.curricula,    icon: FileText,        label: 'Mis currículums', matchPrefix: true, mobile: { label: 'CV', activePrefix: '/ai' } },
    { href: ROUTES.interviews,   icon: MessageSquare,   label: 'Entrevistas simuladas', matchPrefix: true },
    { href: ROUTES.profile,      icon: User,            label: 'Mi perfil',         mobile: { label: 'Perfil' } },
  ],
  COMPANY: [
    { href: ROUTES.companyDashboard, icon: LayoutDashboard, label: 'Inicio',       mobile: { label: 'Inicio' } },
    { href: ROUTES.offers,           icon: ListChecks,      label: 'Mis ofertas',  matchPrefix: true, mobile: { label: 'Ofertas' } },
    { href: ROUTES.newOffer,         icon: PlusCircle,      label: 'Nueva oferta' },
    { href: ROUTES.jobs,             icon: Search,          label: 'Explorar',     mobile: { label: 'Explorar' } },
    { href: ROUTES.companyProfile,   icon: Building2,       label: 'Mi empresa',   mobile: { label: 'Perfil' } },
  ],
}

/** Where each role lands after login and where the logo points. */
export const HOME_ROUTE: Record<UserRole, string> = {
  CANDIDATE: ROUTES.dashboard,
  COMPANY:   ROUTES.companyDashboard,
}

/**
 * The href of the item that should look active for `pathname`. When several
 * match (/company/offers and /company/offers/new) the most specific one wins,
 * so two entries are never highlighted at once.
 */
export function getActiveHref(
  pathname: string,
  items: readonly NavItem[],
  { mobile = false }: { mobile?: boolean } = {},
): string | undefined {
  let best: { href: string; length: number } | undefined
  for (const item of items) {
    const base   = mobile ? item.mobile?.activePrefix ?? item.href : item.href
    const prefix = mobile || item.matchPrefix
    const hit    = pathname === base || (prefix && pathname.startsWith(`${base}/`))
    if (hit && (!best || base.length > best.length)) best = { href: item.href, length: base.length }
  }
  return best?.href
}
