import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'

interface SelectableRowProps {
  selected: boolean
  onSelect: () => void
  leading:  ReactNode
  title:    string
  /** Second line; pass a className for a coloured status text. */
  subtitle: ReactNode
  subtitleClassName?: string
}

/** One row of the left-hand list; the selected one is tinted and marked aria-current. */
export function SelectableRow({ selected, onSelect, leading, title, subtitle, subtitleClassName = 'text-muted-foreground' }: SelectableRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
      className={cn('flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors', selected ? 'bg-brand-tint' : 'hover:bg-hover')}
    >
      {leading}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className={cn('mt-0.5 text-xs', subtitleClassName)}>{subtitle}</p>
      </div>
      <ChevronRight className={cn('size-3.5 shrink-0 transition-colors', selected ? 'text-brand-text' : 'text-faint')} aria-hidden="true" />
    </button>
  )
}

export function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
    </div>
  )
}

/** Empty list that tells the person where the first item comes from (always the Jobs page). */
export function ListEmpty({ icon: Icon, title, action }: { icon: LucideIcon; title: string; action: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div aria-hidden="true" className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <p className="mb-1 text-sm font-medium text-secondary-foreground">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Desde <Link href={ROUTES.jobs} className="text-brand-text underline">Empleos</Link>, elegí una oferta y presioná “{action}”.
      </p>
    </div>
  )
}
