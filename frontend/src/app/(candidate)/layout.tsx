import type { ReactNode } from 'react'
import { AppShell } from '@/components/shared/layout/AppShell'

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return <AppShell role="CANDIDATE">{children}</AppShell>
}
