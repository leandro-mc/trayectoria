import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Tailwind classes instead of computed widths: a skeleton paragraph gets a ragged right edge.
const LINE_WIDTHS = ['w-11/12', 'w-5/6', 'w-3/4', 'w-2/3'] as const

/** Generic card-shaped skeleton */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <Card padding="md">
      <Skeleton className="mb-3 h-5 w-3/4 rounded" />
      <Skeleton className="mb-4 h-4 w-1/2 rounded" />
      {Array.from({ length: Math.max(lines - 2, 0) }).map((_, i) => (
        <Skeleton key={i} className={`mb-2 h-3.5 rounded ${LINE_WIDTHS[i % LINE_WIDTHS.length]}`} />
      ))}
    </Card>
  )
}

/** Placeholder for a form while its data loads. */
export function FormSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
    </div>
  )
}

/** Full page loading skeleton with header + cards */
export function PageSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="mb-2 h-7 w-48 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}
