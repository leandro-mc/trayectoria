// Left panel when in AI mode - compact job description

'use client'

import { ArrowLeft, MapPin, Briefcase, Wifi } from 'lucide-react'
import { useJobOffer } from '../hooks/useJobOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import { Skeleton } from '@/components/ui/skeleton'

export function JobDescriptionSide() {
  const { selectedId, goBackToDetail } = useJobsParams()
  const { data: offer, isLoading }     = useJobOffer(selectedId)

  if (isLoading) {
    return (
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 rounded w-2/3" />
        <Skeleton className="h-3 rounded w-1/3" />
        <div className="space-y-2 mt-4">
          {[100, 95, 90, 85].map((w, i) => (
            <Skeleton key={i} className="h-3 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!offer) return null

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">

      {/* Header */}
      <div className="px-5 pt-4 pb-4 border-b border-border bg-card shrink-0">
        <button
          onClick={goBackToDetail}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al detalle
        </button>

        <p className="text-xs font-medium text-neutral-400 mb-0.5">
          {offer.companyName ?? 'Empresa'}
        </p>
        <h2 className="text-sm font-bold text-foreground leading-snug">
          {offer.title}
        </h2>

        <div className="flex flex-wrap gap-2 mt-2">
          {offer.location && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
              <MapPin className="w-3 h-3" />
              {offer.location}
            </span>
          )}
          {offer.workMode && (
            <span className="inline-flex items-center gap-1 text-xs text-brand-500 dark:text-brand-400">
              <Wifi className="w-3 h-3" />
              {WORK_MODE_LABELS[offer.workMode]}
            </span>
          )}
          {offer.jobType && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
              <Briefcase className="w-3 h-3" />
              {JOB_TYPE_LABELS[offer.jobType]}
            </span>
          )}
        </div>

        {/* Skills compact */}
        {offer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {offer.skills.slice(0, 6).map((skill) => (
              <span key={skill.id} className="px-2 py-0.5 rounded bg-muted text-xs text-neutral-500">
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {offer.description ? (
          <p className="text-xs text-body leading-relaxed whitespace-pre-wrap">
            {offer.description}
          </p>
        ) : (
          <p className="text-xs text-neutral-400 italic">Sin descripción disponible</p>
        )}

        {offer.requirements && (
          <>
            <p className="text-xs font-semibold text-secondary-foreground mt-5 mb-2">
              Requisitos
            </p>
            <p className="text-xs text-body leading-relaxed whitespace-pre-wrap">
              {offer.requirements}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
