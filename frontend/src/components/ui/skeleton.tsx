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
