'use client'

import { use } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { JobOfferForm } from '@/features/company/components/JobOfferForm'
import { useJobOffer, useInterviewInstructions } from '@/features/jobs/hooks/useJobOffers'
import { PageSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { ROUTES } from '@/config/routes'
import { Button } from '@/components/ui/button'

interface EditOfferPageProps {
  params: Promise<{ id: string }>
}

export default function EditOfferPage({ params }: EditOfferPageProps) {
  const { id } = use(params)
  const offerId = Number(id)

  const { data: offer, isLoading: offerLoading }                  = useJobOffer(offerId)
  const { data: instructions, isLoading: instructionsLoading }    = useInterviewInstructions(offerId)

  // Wait for both — the form needs offer data before it can render,
  // and instructions before it can pre-populate the AI section.
  if (offerLoading || instructionsLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Editar oferta"
        description={offer?.title ?? ''}
        actions={
          <Button asChild variant="outline"><Link
      href={ROUTES.offerDetail(offerId)}>
            <Eye className="w-4 h-4" />
            Ver oferta
          </Link></Button>
        }
      />
      {offer && (
        <JobOfferForm
          initial={offer}
          initialInstructions={instructions?.interviewInstructions}
        />
      )}
    </div>
  )
}
