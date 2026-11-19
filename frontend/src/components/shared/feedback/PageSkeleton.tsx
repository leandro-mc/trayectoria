import { Card } from '@/components/ui/card'
import { Skeleton, SkeletonLines } from '@/components/ui/skeleton'

/** Generic card-shaped skeleton */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <Card padding="md">
      <Skeleton className="mb-3 h-5 w-3/4 rounded" />
      <Skeleton className="mb-4 h-4 w-1/2 rounded" />
      <SkeletonLines count={Math.max(lines - 2, 0)} lineClassName="h-3.5" className="space-y-2" />
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
