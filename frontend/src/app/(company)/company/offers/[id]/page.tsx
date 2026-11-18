'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Users, MapPin, Calendar, Clock, Briefcase, CheckCircle2, Globe, Wifi, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { PageSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { useJobOffer, useInterviewInstructions } from '@/features/jobs/hooks/useJobOffers'
import { ROUTES } from '@/config/routes'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import {
  WORK_MODE_LABELS,
  JOB_TYPE_LABELS,
} from '@/config/constants'
import type { WorkMode, JobType, JobStatus } from '@/types/global.types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

//  Status badge 

const STATUS_STYLES: Record<JobStatus, string> = {
  ACTIVE: 'bg-success-tint text-success-text',
  DRAFT:  'bg-muted text-muted-foreground',
  CLOSED: 'bg-danger-tint text-danger-text',
}
const STATUS_LABELS: Record<JobStatus, string> = {
  ACTIVE: 'Activa',
  DRAFT:  'Borrador',
  CLOSED: 'Cerrada',
}

//  Meta pill 

function MetaPill({
  icon: Icon,
  label,
}: {
  icon:  React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-body">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

//  Content section 

function ContentSection({ title, content }: { title: string; content: string | null }) {
  if (!content) return null
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-body whitespace-pre-line leading-relaxed">
        {content}
      </p>
    </div>
  )
}

//  Page 

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OfferDetailPage({ params }: PageProps) {
  const { id }  = use(params)
  const offerId = Number(id)
  const router  = useRouter()

  const { data: offer,        isLoading: offerLoading }        = useJobOffer(offerId)
  const { data: instructions, isLoading: instructionsLoading } = useInterviewInstructions(offerId)

  if (offerLoading || instructionsLoading) return <PageSkeleton />
  if (!offer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground mb-4">Oferta no encontrada.</p>
        <button onClick={() => router.push(ROUTES.offers)} className="text-brand-text text-sm font-medium hover:underline">
          Volver a mis ofertas
        </button>
      </div>
    )
  }

  const workModeIcon =
    offer.workMode === 'REMOTE'  ? Wifi    :
    offer.workMode === 'HYBRID'  ? Globe   :
    Briefcase

  return (
    <div>
      <PageHeader
        title={offer.title}
        description={`Publicada ${formatDate(offer.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline"><Link
       href={ROUTES.offerApplications(offerId)}>
              <Users className="w-4 h-4" />
              Postulantes
            </Link></Button>
            <Button asChild><Link
       href={ROUTES.editOffer(offerId)}>
              <Pencil className="w-4 h-4" />
              Editar
            </Link></Button>
          </div>
        }
      />

      <div className="space-y-5">

        {/*  Hero card  */}
        <Card padding="lg">

          {/* Status + meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
              STATUS_STYLES[offer.status],
            )}>
              {STATUS_LABELS[offer.status]}
            </span>

            {offer.workMode && (
              <MetaPill
                icon={workModeIcon}
                label={WORK_MODE_LABELS[offer.workMode as WorkMode] ?? offer.workMode}
              />
            )}
            {offer.jobType && (
              <MetaPill
                icon={Clock}
                label={JOB_TYPE_LABELS[offer.jobType as JobType] ?? offer.jobType}
              />
            )}
            {offer.location && (
              <MetaPill icon={MapPin} label={offer.location} />
            )}
            {offer.expiresAt && (
              <MetaPill icon={Calendar} label={`Cierra ${formatDate(offer.expiresAt)}`} />
            )}
          </div>

          {/* Skills */}
          {offer.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {offer.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 rounded-lg bg-brand-tint text-xs font-medium text-brand-text"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/*  Content  */}
        {(offer.description || offer.responsibilities || offer.requirements || offer.benefits) && (
          <Card padding="lg" className="space-y-6">
            <ContentSection title="Descripción"        content={offer.description}     />
            <ContentSection title="Responsabilidades"  content={offer.responsibilities} />
            <ContentSection title="Requisitos"         content={offer.requirements}    />
            <ContentSection title="Beneficios"         content={offer.benefits}        />
          </Card>
        )}

        {/*  Interview section  */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-brand-text" />
            <h3 className="text-sm font-semibold text-foreground">
              Entrevista con IA
            </h3>
          </div>

          {offer.requiresInterview ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-success-text">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Los candidatos deben completar una entrevista simulada para postularse
              </div>

              {instructions?.interviewInstructions ? (
                <div className="p-4 rounded-xl bg-brand-tint border border-brand-border">
                  <p className="text-xs font-semibold text-brand-text mb-2">
                    Instrucciones para la IA
                  </p>
                  <p className="text-sm text-secondary-foreground whitespace-pre-line leading-relaxed">
                    {instructions.interviewInstructions}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Sin instrucciones específicas — la IA usará el contexto de la oferta.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Esta oferta no requiere entrevista simulada con IA.
            </p>
          )}
        </Card>

        {/*  Footer nav  */}
        <div className="flex justify-start pt-1 pb-6">
          <Link
            href={ROUTES.offers}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mis ofertas
          </Link>
        </div>

      </div>
    </div>
  )
}
