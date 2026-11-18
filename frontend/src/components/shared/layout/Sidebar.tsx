'use client'

import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/brand/Logo'
import { SidebarLink } from './SidebarLink'
import { ThemeToggle } from './ThemeToggle'
import { HOME_ROUTE, NAV_ITEMS, getActiveHref } from '@/config/navigation'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { getInitials } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { usePathname } from 'next/navigation'
import type { UserRole } from '@/types/global.types'

/** Desktop navigation for both roles; only the nav list differs (config/navigation.ts). */
export function Sidebar({ role }: { role: UserRole }) {
  const pathname      = usePathname()
  const collapsed     = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const user          = useAuthStore((s) => s.user)
  const logout        = useLogout()

  const items       = NAV_ITEMS[role]
  const activeHref  = getActiveHref(pathname, items)
  const displayName = user?.email.split('@')[0] ?? (role === 'COMPANY' ? 'Empresa' : 'Usuario')

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-all duration-300 lg:flex',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className={cn(
        'flex h-16 shrink-0 items-center border-b border-border',
        collapsed ? 'justify-center px-2' : 'px-4',
      )}>
        <Logo href={HOME_ROUTE[role]} collapsed={collapsed} />
      </div>

      <nav aria-label="Principal" className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {items.map(({ href, icon, label }) => (
          <SidebarLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            collapsed={collapsed}
            isActive={href === activeHref}
          />
        ))}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-border p-3">
        <div className={cn('flex items-center', collapsed ? 'flex-col gap-2' : 'justify-between')}>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
            aria-label={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          <div
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-tint-strong text-xs font-bold text-brand-text"
          >
            {getInitials(displayName)}
          </div>

          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Cerrar sesión"
              >
                <LogOut />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
