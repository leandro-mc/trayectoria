import { getInitials } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

const SIZES = { sm: 'size-8 text-xs', lg: 'size-20 text-2xl' } as const
const SHAPES = { circle: 'rounded-full', rounded: 'rounded-xl' } as const

interface AvatarProps {
  name:      string
  imageUrl?: string | null
  size?:     keyof typeof SIZES
  shape?:    keyof typeof SHAPES
  className?: string
}

/** Profile photo, or the person's initials on a brand tint when there is none. */
export function Avatar({ name, imageUrl, size = 'sm', shape = 'circle', className }: AvatarProps) {
  const box = cn('shrink-0', SIZES[size], SHAPES[shape], size === 'lg' && 'border-2 border-border', className)

  if (imageUrl) {
    // Plain <img>: photos come from the backend's storage host, which next/image would need configured per environment.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={name} className={cn(box, 'object-cover')} />
  }

  return (
    <span aria-hidden="true" className={cn(box, 'flex items-center justify-center bg-brand-tint-strong font-bold text-brand-text')}>
      {getInitials(name)}
    </span>
  )
}
