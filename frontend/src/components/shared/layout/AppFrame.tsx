'use client'

import { lazy, Suspense, type ReactNode } from 'react'
import { isDemoMode } from '@/config/env'

// React.lazy (not next/dynamic): Turbopack lists a chunk in next/dynamic's SSR preload manifest
// that it never emits, which shows up as a 404 in the console. Loading through import() keeps the
// banner (and the rest of the demo layer) out of the bundle when the demo is off.
const DemoBanner = isDemoMode ? lazy(() => import('@/demo').then((m) => ({ default: m.DemoBanner }))) : null

/**
 * Page frame. Normally it adds nothing. In demo mode it stacks the notice above the app in a
 * column that is exactly one viewport tall; the app scrolls in the area under the banner, so
 * the banner is never scrolled away and never creates a second scrollbar. The full-height
 * shells (AppShell, SplitPanelShell) shrink to that area with `max-h-full`.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  if (!DemoBanner) return <>{children}</>

  return (
    <div className="flex h-dvh flex-col">
      <Suspense fallback={null}>
        <DemoBanner />
      </Suspense>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </div>
  )
}
