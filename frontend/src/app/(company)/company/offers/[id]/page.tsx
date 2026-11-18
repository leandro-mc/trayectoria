'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Pencil, Users, MapPin, Calendar,
  Clock, Briefcase, Sparkles, CheckCircle2, Globe, Wifi,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { PageSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { useJobOffer, useInterviewInstructions } from '@/features/jobs/hooks/useJobOffers'
import { ROUTES } from '@/config/routes'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import {
  WORK_MODE_LABELS,
  JOB_TYPE_LABELS,
} from '@/config/constants'
import type { WorkMode, JobType, JobStatus } from '@/types/global.types'

//  Status badge 

const STATUS_STYLES: Record<JobStatus, string> = {
  ACTIVE: 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400',
  DRAFT:  'bg-muted text-muted-foreground',
  CLOSED: 'bg-danger-tint text-danger-500 dark:text-danger-400',
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
        <button onClick={() => router.push(ROUTES.offers)} className="text-brand-500 text-sm font-medium hover:underline">
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
            <Link
              href={ROUTES.offerApplications(offerId)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-input bg-card hover:bg-hover text-body text-sm font-medium transition-colors"
            >
              <Users className="w-4 h-4" />
              Postulantes
            </Link>
            <Link
              href={ROUTES.editOffer(offerId)}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </Link>
          </div>
        }
      />

      <div className="space-y-5">

        {/*  Hero card  */}
        <div className="bg-card border border-border rounded-xl shadow-card p-6">

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
        </div>

        {/*  Content  */}
        {(offer.description || offer.responsibilities || offer.requirements || offer.benefits) && (
          <div className="bg-card border border-border rounded-xl shadow-card p-6 space-y-6">
            <ContentSection title="Descripción"        content={offer.description}     />
            <ContentSection title="Responsabilidades"  content={offer.responsibilities} />
            <ContentSection title="Requisitos"         content={offer.requirements}    />
            <ContentSection title="Beneficios"         content={offer.benefits}        />
          </div>
        )}

        {/*  Interview section  */}
        <div className="bg-card border border-border rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-foreground">
              Entrevista con IA
            </h3>
          </div>

          {offer.requiresInterview ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-success-600 dark:text-success-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Los candidatos deben completar una entrevista simulada para postularse
              </div>

              {instructions?.interviewInstructions ? (
                <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800">
                  <p className="text-xs font-semibold text-brand-text mb-2">
                    Instrucciones para la IA
                  </p>
                  <p className="text-sm text-secondary-foreground whitespace-pre-line leading-relaxed">
                    {instructions.interviewInstructions}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-400 italic">
                  Sin instrucciones específicas — la IA usará el contexto de la oferta.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">
              Esta oferta no requiere entrevista simulada con IA.
            </p>
          )}
        </div>

        {/*  Footer nav  */}
        <div className="flex justify-start pt-1 pb-6">
          <Link
            href={ROUTES.offers}
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mis ofertas
          </Link>
        </div>

      </div>
    </div>
  )
}
