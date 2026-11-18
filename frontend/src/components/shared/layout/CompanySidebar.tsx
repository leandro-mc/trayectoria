'use client'

import { LayoutDashboard, Building2, ListChecks, PlusCircle, ChevronLeft, ChevronRight, LogOut, Search } from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { SidebarLink } from './SidebarLink'
import { ThemeToggle } from './ThemeToggle'
import { getInitials } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils/cn'
import { Logo } from '@/components/shared/brand/Logo'

const NAV_ITEMS = [
  { href: ROUTES.companyDashboard, icon: LayoutDashboard, label: 'Dashboard'       },
  { href: ROUTES.jobs,             icon: Search,          label: 'Explorar'      },
  { href: ROUTES.companyProfile,   icon: Building2,       label: 'Mi Empresa'      },
  { href: ROUTES.offers,           icon: ListChecks,      label: 'Mis Ofertas', matchPrefix: true },
  { href: ROUTES.newOffer,         icon: PlusCircle,      label: 'Nueva Oferta'    },
] as const

export function CompanySidebar() {
  const collapsed     = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const user          = useAuthStore((s) => s.user)
  const logout        = useLogout()

  const displayName = user?.email.split('@')[0] ?? 'Empresa'
  const initials    = getInitials(displayName)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 border-r border-border bg-card transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/*  Logo  */}
      <div className={cn(
        'h-16 flex items-center border-b border-border shrink-0',
        collapsed ? 'justify-center px-2' : 'px-4 gap-2.5',
      )}>
        <Logo href={ROUTES.companyDashboard} collapsed={collapsed} />
      </div>

      {/*  Nav  */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon, label, ...rest }) => (
          <SidebarLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            collapsed={collapsed}
            {...rest}
          />
        ))}

        {/* <div className="pt-2 mt-2 border-t border-border-soft">
          <SidebarLink
            href={ROUTES.settings}
            icon={Settings}
            label="Configuración"
            collapsed={collapsed}
          />
        </div> */}
      </nav>

      {/*  User + actions  */}
      <div className="border-t border-border p-3 space-y-2 shrink-0">
        <div className={cn(
          'flex items-center',
          collapsed ? 'flex-col gap-2' : 'justify-between',
        )}>
          <ThemeToggle />
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-muted transition-colors"
            aria-label={collapsed ? 'Expandir' : 'Colapsar'}
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft  className="w-4 h-4" />
            }
          </button>
        </div>

        <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-brand-tint-strong flex items-center justify-center text-xs font-bold text-brand-text shrink-0">
            {initials}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-500 dark:hover:text-danger-400 hover:bg-muted transition-colors shrink-0"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
