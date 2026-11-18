'use client'
import { Skeleton } from '@/components/ui/skeleton'

/** Generic card-shaped skeleton */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <Skeleton className="h-5 rounded w-3/4 mb-3" />
      <Skeleton className="h-4 rounded w-1/2 mb-4" />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <Skeleton key={i} className="h-3.5 rounded mb-2" style={{ width: `${90 - i * 10}%` }} />
      ))}
    </div>
  )
}

/** Full page loading skeleton with header + cards */
export function PageSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-7 rounded w-48 mb-2" />
        <Skeleton className="h-4 rounded w-72" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}