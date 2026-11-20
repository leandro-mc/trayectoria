import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Placeholder block shown while content loads. Shape it with width/height/rounded classes. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-border', className)}
      {...props}
    />
  )
}

// Fixed Tailwind widths, cycled, so a block of lines has a ragged right edge like real text.
// (Widths are classes rather than computed inline styles, so they stay design-system values.)
const LINE_WIDTHS = ['w-11/12', 'w-3/4', 'w-5/6', 'w-2/3', 'w-4/5', 'w-full'] as const

/** A paragraph-shaped placeholder: `count` text lines of varying width. */
export function SkeletonLines({ count = 4, className, lineClassName }: { count?: number; className?: string; lineClassName?: string }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3 rounded-lg', LINE_WIDTHS[i % LINE_WIDTHS.length], lineClassName)} />
      ))}
    </div>
  )
}
