import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileBottomNav } from './MobileBottomNav'
import type { UserRole } from '@/types/global.types'

interface AppShellProps {
  role:     UserRole
  children: ReactNode
  /**
   * `scroll` (default): padded, scrollable column for ordinary pages.
   * `panels`: children manage their own height and scrolling (split-panel pages).
   */
  layout?:  'scroll' | 'panels'
}

/** Sidebar + content column + mobile bottom bar, shared by every signed-in layout. */
export function AppShell({ role, children, layout = 'scroll' }: AppShellProps) {
  return (
    // h-dvh, not h-screen: 100vh includes the mobile address bar and pushes the bottom nav off-screen.
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar role={role} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {layout === 'scroll' ? (
          // min-h-0 is required on a flex child with overflow; without it the column
          // grows past its container and squashes the bottom nav to 0px.
          <div className="min-h-0 flex-1 overflow-y-auto">
            <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </main>
          </div>
        ) : (
          <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
        )}
        <MobileBottomNav />
      </div>
    </div>
  )
}
