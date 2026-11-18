import type { ReactNode } from 'react'
import { AppShell } from '@/components/shared/layout/AppShell'

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return <AppShell role="COMPANY">{children}</AppShell>
}
