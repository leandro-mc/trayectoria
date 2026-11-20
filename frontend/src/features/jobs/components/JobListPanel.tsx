'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useJobOffers } from '../hooks/useJobOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { JobOfferCard } from './JobOfferCard'
import { SaveButton } from './SaveButton'
import { useAuthStore } from '@/stores/auth.store'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import type { WorkMode, JobType } from '@/types/global.types'
import { JobCardSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { FilterChip } from '@/components/shared/data/FilterChip'
import { CompactPagination } from '@/components/shared/data/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

//  Skeleton 


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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder="Buscar por título..." className="h-9 pl-9 pr-8 bg-muted"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setFilter('q', '')}
              aria-label="Borrar búsqueda"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filter pills — iterate over typed constants */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {(Object.keys(WORK_MODE_LABELS) as WorkMode[]).map((value) => (
            <FilterChip key={value} active={workMode === value} onClick={() => setFilter('workMode', workMode === value ? '' : value)}>
              {WORK_MODE_LABELS[value]}
              </FilterChip>
          ))}

          <span className="w-px bg-border shrink-0" />

          {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map((value) => (
            <FilterChip key={value} active={jobType === value} onClick={() => setFilter('jobType', jobType === value ? '' : value)}>
              {JOB_TYPE_LABELS[value]}
              </FilterChip>
          ))}

          {hasFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFilters}
              className="rounded-full border border-danger-border text-danger-text hover:bg-danger-tint hover:text-danger-text"
            >
              <X />
              Limpiar
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between h-5">
          <p className="text-xs text-muted-foreground">
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
          Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
        )}

        {!isLoading && data?.content.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <SlidersHorizontal className="w-8 h-8 text-faint mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              Sin resultados
            </p>
            <p className="text-xs text-muted-foreground mt-1">
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

      {data && <CompactPagination page={page} totalPages={data.totalPages} isLast={data.last} onPageChange={setPage} />}
    </div>
  )
}
