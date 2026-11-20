import type { ReactNode } from 'react'
import { ArrowLeft, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MasterDetailProps {
  list:     ReactNode
  /** Rendered when something is selected; undefined/null shows `placeholder`. */
  detail:   ReactNode
  placeholder: ReactNode
  hasSelection: boolean
  onBack:   () => void
}

/**
 * List on the left, selected item on the right. Below `lg` only one is visible:
 * the list until something is picked, then the item with a "back to list" button.
 */
export function MasterDetail({ list, detail, placeholder, hasSelection, onBack }: MasterDetailProps) {
  return (
    <div className="flex h-full overflow-hidden">
      <div className={cn('flex-col overflow-hidden border-r border-border', hasSelection ? 'hidden lg:flex lg:w-[38%]' : 'flex w-full lg:w-[38%]')}>
        {list}
      </div>

      {hasSelection ? (
        <div className="flex flex-1 flex-col overflow-hidden bg-card">
          <Button variant="ghost" onClick={onBack} className="shrink-0 justify-start rounded-none border-b border-border text-xs text-muted-foreground lg:hidden">
            <ArrowLeft />
            Volver al listado
          </Button>
          <div className="min-h-0 flex-1 overflow-hidden">{detail}</div>
        </div>
      ) : placeholder}
    </div>
  )
}

/** Shown in the detail area while nothing is selected (desktop only; on phones the list fills the screen). */
export function DetailPlaceholder({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="hidden flex-1 items-center justify-center bg-background lg:flex">
      <div className="text-center">
        <div aria-hidden="true" className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Icon className="size-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{children}</p>
      </div>
    </div>
  )
}
