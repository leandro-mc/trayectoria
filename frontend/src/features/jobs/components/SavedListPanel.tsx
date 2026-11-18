// Left panel for /saved — list of saved offers.
// No search/filter: the user already curated this list intentionally.
// "Quitar" unsaves without leaving the panel.
'use client'

import { Bookmark, BookmarkX } from 'lucide-react'
import { useSavedOffers, useUnsaveOffer } from '@/features/saved-offers/hooks/useSavedOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { JobOfferCard } from './JobOfferCard'
import { ROUTES } from '@/config/routes'
import { Skeleton } from '@/components/ui/skeleton'

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

//  Unsave button 

function UnsaveButton({ jobOfferId, onUnsave }: {
  jobOfferId: number
  onUnsave:   (id: number) => void
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onUnsave(jobOfferId) }}
      title="Quitar de guardadas"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-input hover:border-danger-border hover:bg-danger-tint text-muted-foreground hover:text-danger-text text-xs font-medium transition-colors shrink-0"
    >
      <BookmarkX className="w-3.5 h-3.5" />
      Quitar
    </button>
  )
}

//  Component 

export function SavedListPanel() {
  const { selectedId, page, selectJob, setPage } = useJobsParams('/saved')
  const { data, isLoading }        = useSavedOffers(page)
  const { mutate: unsave } = useUnsaveOffer()

  return (
    <div className="flex flex-col h-full">

      {/*  Header  */}
      <div className="px-3 pt-3 pb-2.5 border-b border-border-soft shrink-0 bg-card">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-4 h-4 text-brand-text shrink-0" />
          <h2 className="text-sm font-semibold text-foreground">
            Ofertas guardadas
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {data
            ? `${data.totalElements} oferta${data.totalElements !== 1 ? 's' : ''} guardada${data.totalElements !== 1 ? 's' : ''}`
            : ' '
          }
        </p>
      </div>

      {/*  List  */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">

        {isLoading && (
          Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
        )}

        {!isLoading && data?.content.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6 text-faint" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No tenés ofertas guardadas
            </p>
            <a
              href={ROUTES.jobs}
              className="text-xs text-brand-text hover:text-brand-text font-medium transition-colors"
            >
              Explorar ofertas →
            </a>
          </div>
        )}

        {!isLoading && data?.content.map((offer) => (
          <JobOfferCard
            key={offer.id}
            offer={offer}
            selected={selectedId === offer.id}
            onClick={() => selectJob(offer.id)}
            actions={
              <UnsaveButton
                jobOfferId={offer.id}
                onUnsave={(id) => {
                  unsave(id, {
                    onSuccess: () => {
                      // If the unsaved offer was selected, deselect it
                      if (selectedId === id) selectJob(-1)
                    },
                  })
                }}
              />
            }
          />
        ))}
      </div>

      {/*  Pagination  */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-soft shrink-0 bg-card">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-xs text-muted-foreground">
            {page + 1} / {data.totalPages}
          </span>
          <button
            disabled={data.last}
            onClick={() => setPage(page + 1)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
