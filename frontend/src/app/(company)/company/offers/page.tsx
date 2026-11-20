'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ListChecks, Plus } from 'lucide-react'
import { Pagination } from '@/components/shared/data/Pagination'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/config/routes'
import { OfferRow, OfferRowSkeleton } from '@/features/company/components/OfferRow'
import { useMyJobOffers } from '@/features/jobs/hooks/useJobOffers'

export default function CompanyOffersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useMyJobOffers(page)
  const offers = data?.content ?? []

  return (
    <div>
      <PageHeader
        title="Mis ofertas"
        description="Gestioná tus publicaciones de trabajo"
        actions={
          <Button asChild>
            <Link href={ROUTES.newOffer}>
              <Plus />
              Nueva oferta
            </Link>
          </Button>
        }
      />

      {/* No overflow-hidden: it would clip the rows' dropdown menus' focus rings. */}
      <Card>
        {isLoading && (
          <div className="divide-y divide-border-soft">
            {Array.from({ length: 4 }).map((_, i) => <OfferRowSkeleton key={i} />)}
          </div>
        )}

        {!isLoading && offers.length === 0 && (
          <EmptyState
            icon={ListChecks}
            title="No publicaste ofertas aún"
            description="Creá tu primera oferta y empezá a recibir postulaciones."
            action={{ label: 'Crear oferta', href: ROUTES.newOffer }}
          />
        )}

        {offers.length > 0 && (
          <div className="divide-y divide-border-soft">
            {offers.map((offer) => <OfferRow key={offer.id} offer={offer} />)}
          </div>
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }) }}
          />
        </div>
      )}
    </div>
  )
}
