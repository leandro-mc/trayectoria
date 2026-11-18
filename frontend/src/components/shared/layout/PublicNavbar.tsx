'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/config/routes'
import { Logo } from '@/components/shared/brand/Logo'

interface PublicNavbarProps {
  hideAuthButtons?: boolean
}

export function PublicNavbar({ hideAuthButtons = false }: PublicNavbarProps) {
  const pathname        = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role            = useAuthStore((s) => s.user?.role)

  const dashboardHref   = role === 'COMPANY' ? ROUTES.companyDashboard : ROUTES.dashboard

  return (
    <header className="sticky top-0 z-20 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-border bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">

      {/* Logo */}
      <Logo href={ROUTES.publicJobs} />

      {/* Center nav */}
      {pathname === ROUTES.publicJobs && (
        <nav className="hidden md:flex items-center gap-1">          
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
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-3 sm:px-4 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Mi panel
            </Link>          
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="inline-flex h-8 sm:h-9 px-2.5 sm:px-4 items-center rounded-lg border border-input bg-card hover:bg-hover text-secondary-foreground text-xs sm:text-sm font-medium transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href={ROUTES.register}
                className="inline-flex h-8 sm:h-9 px-2.5 sm:px-4 items-center rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium transition-colors"
              >
                Registrarse
              </Link>
            </>
          )
        )}
      </div>
    </header>
  )
}
