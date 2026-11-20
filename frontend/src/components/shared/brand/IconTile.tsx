import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'size-6  rounded-md  [&>svg]:size-3.5',
  md: 'size-8  rounded-lg  [&>svg]:size-4',
  lg: 'size-12 rounded-xl  [&>svg]:size-6',
  xl: 'size-16 rounded-2xl [&>svg]:size-8',
} as const

interface IconTileProps {
  icon:       ComponentType<{ className?: string }>
  size?:      keyof typeof SIZES
  className?: string
}

/** Decorative icon on a soft brand-tinted square. Always flat: no gradients. */
export function IconTile({ icon: Icon, size = 'md', className }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center bg-brand-tint-strong text-brand-text',
        SIZES[size],
        className,
      )}
    >
      <Icon />
    </span>
  )
}
