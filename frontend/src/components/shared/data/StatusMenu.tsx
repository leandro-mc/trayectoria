'use client'

import { ChevronDown } from 'lucide-react'
import { badgeVariants } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { StatusDot } from '@/components/shared/data/StatusBadge'
import type { StatusTone } from '@/config/constants'
import { cn } from '@/lib/utils'

/** `O` is the subset of statuses a person may switch to (e.g. a company cannot set PENDING). */
interface StatusMenuProps<S extends string, O extends S> {
  value:    S
  /** Statuses the person may switch to (usually everything except `value`). */
  options:  readonly O[]
  labels:   Record<S, string>
  tones:    Record<S, StatusTone>
  onSelect: (status: O) => void
  pending?: boolean
  /** What is being changed, for the accessible name ("Estado de la oferta"). */
  label:    string
}

/** A status badge that opens a menu to change it: one component for offers and applications. */
export function StatusMenu<S extends string, O extends S>({ value, options, labels, tones, onSelect, pending, label }: StatusMenuProps<S, O>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label}: ${labels[value]}. Cambiar`}
        className={cn(badgeVariants({ variant: tones[value] }), 'cursor-pointer gap-1.5 px-2.5 py-1')}
      >
        {labels[value]}
        {pending ? <Spinner className="size-3" /> : <ChevronDown aria-hidden="true" />}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {options.map((status) => (
          <DropdownMenuItem key={status} disabled={pending} onSelect={() => onSelect(status)}>
            <StatusDot tone={tones[status]} />
            {labels[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
