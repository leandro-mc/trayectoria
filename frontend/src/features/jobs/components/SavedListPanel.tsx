// Left panel for /saved — list of saved offers.
// No search/filter: the user already curated this list intentionally.
// "Quitar" unsaves without leaving the panel.
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CompactPagination } from '@/components/shared/data/Pagination'
import { Bookmark, BookmarkX } from 'lucide-react'
import { useSavedOffers, useUnsaveOffer } from '@/features/saved-offers/hooks/useSavedOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { JobOfferCard } from './JobOfferCard'
import { ROUTES } from '@/config/routes'
import { JobCardSkeleton } from '@/components/shared/feedback/PageSkeleton'

//  Unsave button 

function UnsaveButton({ jobOfferId, onUnsave }: {
  jobOfferId: number
  onUnsave:   (id: number) => void
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => { e.stopPropagation(); onUnsave(jobOfferId) }}
      className="text-xs text-muted-foreground hover:border-danger-border hover:bg-danger-tint hover:text-danger-text"
    >
      <BookmarkX />
      Quitar
    </Button>
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
          Array.from({ length: 5 }).map((_, i) => <JobCardSkeleton key={i} />)
        )}

        {!isLoading && data?.content.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6 text-faint" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No tenés ofertas guardadas
            </p>
            <Link href={ROUTES.jobs} className="text-xs font-medium text-brand-text hover:underline">
              Explorar ofertas →
            </Link>
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

      {data && <CompactPagination page={page} totalPages={data.totalPages} isLast={data.last} onPageChange={setPage} />}
    </div>
  )
}
