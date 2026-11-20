'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, UserSearch, Users } from 'lucide-react'
import { Pagination } from '@/components/shared/data/Pagination'
import { FilterChip } from '@/components/shared/data/FilterChip'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'
import { ApplicationRow, ApplicationRowSkeleton } from '@/features/applications/components/ApplicationRow'
import { CandidateProfilePanel } from '@/features/applications/components/CandidateProfilePanel'
import { useJobApplications } from '@/features/applications/hooks/useJobApplications'
import { useJobOffer } from '@/features/jobs/hooks/useJobOffers'
import type { ApplicationStatus } from '@/types/global.types'

type Filter = ApplicationStatus | 'ALL'

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'Todas',       value: 'ALL'       },
  { label: 'Pendientes',  value: 'PENDING'   },
  { label: 'Vistas',      value: 'VIEWED'    },
  { label: 'En revisión', value: 'IN_REVIEW' },
  { label: 'Aceptadas',   value: 'ACCEPTED'  },
  { label: 'Rechazadas',  value: 'REJECTED'  },
]

export default function OfferApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const offerId = Number(use(params).id)

  const [page, setPage]             = useState(0)
  const [filter, setFilter]         = useState<Filter>('ALL')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: offer }     = useJobOffer(offerId)
  const { data, isLoading } = useJobApplications(offerId, page)

  const total      = data?.totalElements ?? 0
  const filtered   = data?.content.filter((a) => filter === 'ALL' || a.status === filter) ?? []
  const selected   = filtered.find((a) => a.id === selectedId) ?? null

  function changeFilter(next: Filter) {
    setFilter(next)
    setPage(0)
    setSelectedId(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-1">
        <PageHeader
          title={offer?.title ?? 'Postulaciones'}
          description={`${total} ${total === 1 ? 'postulación recibida' : 'postulaciones recibidas'}`}
          actions={
            <Button asChild variant="outline">
              <Link href={ROUTES.offers}>
                <ArrowLeft />
                Mis ofertas
              </Link>
            </Button>
          }
        />

        <div role="group" aria-label="Filtrar por estado" className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map(({ label, value }) => (
            <FilterChip key={value} active={filter === value} onClick={() => changeFilter(value)}>
              {label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* List. On a phone it gives way to the profile once someone is selected. */}
        <div className={cn('min-h-0 flex-col', selected ? 'hidden lg:flex lg:w-[40%]' : 'flex w-full lg:w-[40%]')}>
          <Card className="min-h-0 flex-1 overflow-y-auto">
            {isLoading && (
              <div className="divide-y divide-border-soft">
                {Array.from({ length: 5 }).map((_, i) => <ApplicationRowSkeleton key={i} />)}
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <EmptyState
                icon={Users}
                title="Sin postulaciones"
                description={filter === 'ALL' ? 'Aún no recibiste postulaciones para esta oferta.' : 'No hay postulaciones con este estado.'}
                action={filter !== 'ALL' ? { label: 'Ver todas', onClick: () => changeFilter('ALL') } : undefined}
              />
            )}

            {filtered.length > 0 && (
              <div className="divide-y divide-border-soft">
                {filtered.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    isSelected={selectedId === app.id}
                    onSelect={() => setSelectedId(selectedId === app.id ? null : app.id)}
                  />
                ))}
              </div>
            )}

            {data && data.totalPages > 1 && (
              <div className="border-t border-border-soft p-4">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  onPageChange={(p) => { setPage(p); setSelectedId(null) }}
                />
              </div>
            )}
          </Card>
        </div>

        {selected ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <Button variant="outline" onClick={() => setSelectedId(null)} className="shrink-0 justify-start rounded-b-none lg:hidden">
              <ArrowLeft />
              Volver al listado
            </Button>
            <div className="min-h-0 flex-1 overflow-hidden rounded-xl rounded-tl-none border border-border lg:rounded-tl-xl">
              <CandidateProfilePanel application={selected} />
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 items-center justify-center rounded-xl border border-border bg-background lg:flex">
            <div className="text-center">
              <div aria-hidden="true" className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-muted">
                <UserSearch className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Seleccioná un postulante para ver su perfil</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
