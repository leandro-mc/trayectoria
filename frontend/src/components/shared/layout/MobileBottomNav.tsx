'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, MoreHorizontal, Moon, Monitor, Sun } from 'lucide-react'
import { Modal, ModalClose, ModalTitle } from '@/components/shared/overlays/Modal'
import { NAV_ITEMS, getActiveHref } from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore, type Theme } from '@/stores/ui.store'

// Tapping the appearance row cycles through the three themes.
const THEMES: Record<Theme, { next: Theme; icon: typeof Sun; label: string }> = {
  light:  { next: 'dark',   icon: Sun,     label: 'Claro'   },
  dark:   { next: 'system', icon: Moon,    label: 'Oscuro'  },
  system: { next: 'light',  icon: Monitor, label: 'Sistema' },
}

const TAB = 'flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors'

function MoreSheet({ onClose }: { onClose: () => void }) {
  const router   = useRouter()
  const user     = useAuthStore((s) => s.user)
  const logout   = useAuthStore((s) => s.logout)
  const theme    = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const { next, icon: ThemeIcon, label } = THEMES[theme]

  function handleLogout() {
    logout()
    onClose()
    router.replace(ROUTES.login)
  }

  return (
    <Modal open onClose={onClose} variant="bottom">
      <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
      <ModalClose className="absolute right-4 top-3" />

      <div className="border-b border-border-soft px-5 py-4">
        <p className="text-xs text-muted-foreground">
          {user?.role === 'CANDIDATE' ? 'Candidato' : 'Empresa'}
        </p>
        <ModalTitle className="mt-0.5 truncate font-sans text-sm font-semibold text-foreground">
          {user?.email}
        </ModalTitle>
      </div>

      <div className="space-y-1 px-3 py-3">
        <button
          onClick={() => setTheme(next)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-hover"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
            <ThemeIcon className="size-4 text-body" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-medium text-foreground">Apariencia</span>
            <span className="block text-xs text-muted-foreground">{label}: tocá para cambiar</span>
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-danger-tint"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-danger-tint">
            <LogOut className="size-4 text-destructive" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-destructive">Cerrar sesión</span>
        </button>
      </div>
    </Modal>
  )
}

export function MobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const pathname = usePathname()
  const role     = useAuthStore((s) => s.user?.role)

  const items      = NAV_ITEMS[role === 'COMPANY' ? 'COMPANY' : 'CANDIDATE'].filter((i) => i.mobile)
  const activeHref = getActiveHref(pathname, items, { mobile: true })

  return (
    <>
      <nav aria-label="Principal" className="shrink-0 border-t border-border bg-card pb-safe lg:hidden">
        <div className="flex h-16 items-center">
          {items.map(({ href, icon: Icon, mobile }) => {
            const isActive = href === activeHref
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(TAB, isActive ? 'text-brand-text' : 'text-body hover:text-foreground')}
              >
                <Icon className="size-5" aria-hidden="true" />
                {mobile?.label}
              </Link>
            )
          })}

          <button
            onClick={() => setSheetOpen(true)}
            className={cn(TAB, 'text-body hover:text-foreground')}
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
            Más
          </button>
        </div>
      </nav>

      {sheetOpen && <MoreSheet onClose={() => setSheetOpen(false)} />}
    </>
  )
}
