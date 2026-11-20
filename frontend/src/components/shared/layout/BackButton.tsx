import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Small "← Volver…" button for the top of a detail panel. */
export function BackButton({ onClick, children, className }: { onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className={cn('-ml-2 mb-3 text-xs text-muted-foreground', className)}>
      <ArrowLeft />
      {children}
    </Button>
  )
}
