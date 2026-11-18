'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useJobOffers } from '../hooks/useJobOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { JobOfferCard } from './JobOfferCard'
import { SaveButton } from './SaveButton'
import { useAuthStore } from '@/stores/auth.store'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import type { WorkMode, JobType } from '@/types/global.types'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

//  Filter pill 

function FilterPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
        active
          ? 'bg-primary border-brand-500 text-white'
          : 'bg-card border-input text-body hover:border-brand-300 dark:hover:border-brand-700',
      )}
    >
      {label}
    </button>
  )
}

//  Skeleton 

function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-3">
      <Skeleton className="h-4 rounded w-3/4" />
      <Skeleton className="h-3 rounded w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 rounded-full w-16" />
        <Skeleton className="h-5 rounded-full w-20" />
      </div>
    </div>
  )
}

//  Component 

export function JobListPanel() {
  const isCandidate = useAuthStore((s) => s.user?.role === 'CANDIDATE')

  const {
    selectedId,
    filterParams,
    keyword, workMode, jobType,
    page,
    selectJob,
    setFilter,
    setPage,
  } = useJobsParams()

  // filterParams is already typed as ListJobOffersParams — pass it directly
  const { data, isLoading, isFetching } = useJobOffers({
    ...filterParams,
    size: 12,
  })

  const hasFilters = !!(keyword || workMode || jobType)

  function clearFilters() {
    setFilter('q', '')
    setFilter('workMode', '')
    setFilter('jobType', '')
  }

  return (
    <div className="flex flex-col h-full">

      {/*  Search + filters  */}
      <div className="px-3 pt-3 pb-2 space-y-2 border-b border-border-soft shrink-0 bg-card">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder="Buscar por título..." className="h-9 pl-9 pr-8 bg-neutral-50 dark:bg-neutral-800"
          />
          {keyword && (
            <button
              onClick={() => setFilter('q', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter pills — iterate over typed constants */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {(Object.keys(WORK_MODE_LABELS) as WorkMode[]).map((value) => (
            <FilterPill
              key={value}
              label={WORK_MODE_LABELS[value]}
              active={workMode === value}
              onClick={() => setFilter('workMode', workMode === value ? '' : value)}
            />
          ))}

          <span className="w-px bg-neutral-200 dark:bg-neutral-700 shrink-0" />

          {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map((value) => (
            <FilterPill
              key={value}
              label={JOB_TYPE_LABELS[value]}
              active={jobType === value}
              onClick={() => setFilter('jobType', jobType === value ? '' : value)}
            />
          ))}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-danger-500 hover:bg-danger-tint transition-colors whitespace-nowrap border border-danger-200 dark:border-danger-800"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between h-5">
          <p className="text-xs text-neutral-400">
            {data
              ? `${data.totalElements} oferta${data.totalElements !== 1 ? 's' : ''}`
              : ' '
            }
          </p>
          {isFetching && !isLoading && (
            <span className="text-xs text-brand-text">Actualizando...</span>
          )}
        </div>
      </div>

      {/*  List  */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {isLoading && (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        )}

        {!isLoading && data?.content.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <SlidersHorizontal className="w-8 h-8 text-faint mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              Sin resultados
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Probá ajustando los filtros
            </p>
          </div>
        )}

        {!isLoading && data?.content.map((offer) => (
          <JobOfferCard
            key={offer.id}
            offer={offer}
            selected={selectedId === offer.id}
            onClick={() => selectJob(offer.id)}
            actions={isCandidate ? <SaveButton jobOfferId={offer.id} size="sm" /> : undefined}
          />
        ))}
      </div>

      {/*  Pagination  */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-soft shrink-0 bg-card">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-xs text-neutral-400">
            {page + 1} / {data.totalPages}
          </span>
          <button
            disabled={data.last}
            onClick={() => setPage(page + 1)}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
