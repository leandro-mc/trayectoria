'use client'

import type { ReactNode } from 'react'
import { AppShell } from './AppShell'
import { PublicNavbar } from './PublicNavbar'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Shell for the full-height split-panel pages. /jobs is open to everyone:
 * - signed in (either role) -> app shell with sidebar; the panels scroll on their own
 * - anonymous               -> public navbar; actions ask for login when needed
 */
export function SplitPanelShell({ children }: { children: ReactNode }) {
  const role = useAuthStore((s) => s.user?.role)

  if (role) return <AppShell role={role} layout="panels">{children}</AppShell>

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <PublicNavbar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
