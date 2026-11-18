import type { ReactNode } from 'react'
import { SplitPanelShell } from '@/components/shared/layout/SplitPanelShell'

// Full-height split-panel pages (/jobs, /saved, /ai/*).
// They cannot live under (candidate)/layout.tsx, which wraps content in a scrollable,
// padded container: split panels need overflow-hidden + h-full and scroll internally.
// /jobs is public; /saved and /ai are protected by the middleware.
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <SplitPanelShell>{children}</SplitPanelShell>
}
