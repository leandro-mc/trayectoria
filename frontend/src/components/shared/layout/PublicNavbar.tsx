'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useAuthStore } from '@/stores/auth.store'
import { HOME_ROUTE } from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { Logo } from '@/components/shared/brand/Logo'
import { Button } from '@/components/ui/button'

interface PublicNavbarProps {
  hideAuthButtons?: boolean
}

export function PublicNavbar({ hideAuthButtons = false }: PublicNavbarProps) {
  const pathname        = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role            = useAuthStore((s) => s.user?.role)

  const dashboardHref   = role ? HOME_ROUTE[role] : ROUTES.dashboard

  return (
    <header className="sticky top-0 z-20 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-border bg-card/80 backdrop-blur-sm">

      {/* Logo */}
      <Logo href={ROUTES.publicJobs} />

      {/* Center nav */}
      {pathname === ROUTES.publicJobs && (
        <nav aria-label="Principal" className="hidden md:flex items-center gap-1">
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-brand-tint text-brand-text">
            Ofertas
          </span>
        </nav>
      )}

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />

        {!hideAuthButtons && (
          isAuthenticated ? (
            <Button asChild size="sm" className="sm:gap-2 sm:h-9 sm:px-4 sm:text-sm">
              <Link href={dashboardHref}>
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Mi panel
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="sm:h-9 sm:px-4 sm:text-sm">
                <Link href={ROUTES.login}>
                  Iniciar sesión
                </Link>
              </Button>
              <Button asChild size="sm" className="sm:h-9 sm:px-4 sm:text-sm">
                <Link href={ROUTES.register}>
                  Registrarse
                </Link>
              </Button>
            </>
          )
        )}
      </div>
    </header>
  )
}
