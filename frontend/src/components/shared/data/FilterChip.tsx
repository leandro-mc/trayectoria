import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FilterChipProps {
  active:   boolean
  onClick:  () => void
  children: ReactNode
}

/** Toggle pill for filters and status tabs. aria-pressed tells a screen reader which one is on. */
export function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-input bg-card text-body hover:border-brand-border',
      )}
    >
      {children}
    </button>
  )
}
