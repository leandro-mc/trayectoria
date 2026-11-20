'use client'

import Link from 'next/link'
import { Eye, MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react'
import { StatusMenu } from '@/components/shared/data/StatusMenu'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { JOB_STATUS_LABELS, JOB_STATUS_TONE } from '@/config/constants'
import { ROUTES } from '@/config/routes'
import { useOfferApplicationCount } from '@/features/applications/hooks/useJobApplications'
import { useDeleteJobOffer, useUpdateJobOfferStatus } from '@/features/jobs/hooks/useJobOffers'
import type { JobOfferSummaryResponse } from '@/features/jobs/types/jobs.types'
import { formatDate } from '@/lib/utils/date'
import type { JobStatus } from '@/types/global.types'

const STATUSES: readonly JobStatus[] = ['ACTIVE', 'DRAFT', 'CLOSED']

function ApplicantCount({ offerId }: { offerId: number }) {
  const { data, isLoading } = useOfferApplicationCount(offerId)

  if (isLoading) return <Skeleton className="h-6 w-8 rounded-lg" />

  return (
    <Link
      href={ROUTES.offerApplications(offerId)}
      aria-label={`Ver postulantes (${data?.totalElements ?? 0})`}
      className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-body transition-colors hover:bg-brand-tint hover:text-brand-text"
    >
      <Users className="size-3.5" aria-hidden="true" />
      {data?.totalElements ?? 0}
    </Link>
  )
}

export function OfferRow({ offer }: { offer: JobOfferSummaryResponse }) {
  const { mutate: deleteOffer,  isPending: deleting } = useDeleteJobOffer()
  const { mutate: updateStatus, isPending: updating } = useUpdateJobOfferStatus()

  function handleDelete() {
    if (confirm(`¿Eliminar "${offer.title}"? Esta acción no se puede deshacer.`)) deleteOffer(offer.id)
  }

  return (
    <div className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-hover">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{offer.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Publicada {formatDate(offer.createdAt)}
          {offer.location && ` · ${offer.location}`}
        </p>
      </div>

      <ApplicantCount offerId={offer.id} />

      <StatusMenu
        label="Estado de la oferta"
        value={offer.status}
        options={STATUSES.filter((s) => s !== offer.status)}
        labels={JOB_STATUS_LABELS}
        tones={JOB_STATUS_TONE}
        pending={updating}
        onSelect={(status) => updateStatus({ id: offer.id, status })}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Hidden until the row is hovered or focused, so the list stays calm. */}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Más acciones para ${offer.title}`}
            className="text-muted-foreground opacity-0 focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={ROUTES.offerApplications(offer.id)}><Users />Ver postulantes</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.offerDetail(offer.id)}><Eye />Ver oferta</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.editOffer(offer.id)}><Pencil />Editar oferta</Link>
          </DropdownMenuItem>
          <DropdownMenuItem destructive disabled={deleting} onSelect={handleDelete}>
            {deleting ? <Spinner className="size-3.5" /> : <Trash2 />}
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/** Placeholder with the same layout as OfferRow, shown while the list loads. */
export function OfferRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-3 w-1/4 rounded" />
      </div>
      <Skeleton className="h-6 w-8 rounded-lg" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-7 w-6 rounded-lg" />
    </div>
  )
}
