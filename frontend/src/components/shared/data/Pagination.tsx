'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page:         number          // 0-based
  totalPages:   number
  totalElements: number
  onPageChange: (page: number) => void
  className?:   string
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const isFirst = page === 0
  const isLast  = page === totalPages - 1

  // Generate visible page numbers with ellipsis logic
  function getPages(): Array<number | 'ellipsis'> {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    const pages: Array<number | 'ellipsis'> = [0]

    if (page > 2)             pages.push('ellipsis')

    const start = Math.max(1, page - 1)
    const end   = Math.min(totalPages - 2, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    
    if (page < totalPages - 3) pages.push('ellipsis')

    pages.push(totalPages - 1)
    return pages
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className="text-sm text-muted-foreground">
        {totalElements} resultado{totalElements !== 1 ? 's' : ''}
      </p>

      <nav aria-label="Paginación" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirst}
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </Button>

        {getPages().map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="icon-sm"
              onClick={() => onPageChange(p)}
              aria-label={`Página ${p + 1}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p + 1}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          aria-label="Página siguiente"
        >
          <ChevronRight />
        </Button>
      </nav>
    </div>
  )
}

interface CompactPaginationProps {
  page:         number   // 0-based
  totalPages:   number
  isLast:       boolean
  onPageChange: (page: number) => void
}

/** Previous / next with a page counter, for the narrow list panels where numbered pages do not fit. */
export function CompactPagination({ page, totalPages, isLast, onPageChange }: CompactPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginación" className="flex shrink-0 items-center justify-between border-t border-border-soft bg-card px-4 py-3">
      <Button variant="ghost" size="xs" disabled={page === 0} onClick={() => onPageChange(page - 1)} className="text-muted-foreground">
        <ChevronLeft />
        Anterior
      </Button>
      <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
      <Button variant="ghost" size="xs" disabled={isLast} onClick={() => onPageChange(page + 1)} className="text-muted-foreground">
        Siguiente
        <ChevronRight />
      </Button>
    </nav>
  )
}
