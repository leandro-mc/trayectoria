import { lazy, Suspense } from 'react'
import { isDemoMode } from '@/config/env'

// The text lives in the demo layer, so it is not shipped unless the demo is on.
const Note = isDemoMode ? lazy(() => import('@/demo').then((m) => ({ default: m.SimulatedAiNote }))) : null

/** Reminder, shown only in demo mode, that the "AI" output is simulated. */
export function SimulatedAiNote({ kind, className }: { kind: 'cv' | 'interview' | 'feedback'; className?: string }) {
  if (!Note) return null
  return (
    <Suspense fallback={null}>
      <Note kind={kind} className={className} />
    </Suspense>
  )
}
