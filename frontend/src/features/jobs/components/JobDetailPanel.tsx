'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Briefcase, Wifi, Calendar, MessageSquare, FileText } from 'lucide-react'
import { useJobOffer } from '../hooks/useJobOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { SaveButton } from './SaveButton'
import { ApplyButton } from './ApplyButton'
import { useAuthStore } from '@/stores/auth.store'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

//  Content section tabs 

type TabKey = 'description' | 'responsibilities' | 'requirements' | 'benefits'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'description',      label: 'Descripción'       },
  { key: 'responsibilities', label: 'Responsabilidades' },
  { key: 'requirements',     label: 'Requisitos'        },
  { key: 'benefits',         label: 'Beneficios'        },
]

//  Skeleton 

function DetailSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 rounded w-2/3" />
      <Skeleton className="h-4 rounded w-1/3" />
      <div className="flex gap-2 mt-4">
        {[60, 80, 70].map((w) => (
          <Skeleton key={w} className="h-6 rounded-full" style={{ width: `${w}px` }} />
        ))}
      </div>
      <div className="space-y-2 mt-6">
        {[100, 90, 95, 85, 100].map((w, i) => (
          <Skeleton key={i} className="h-3 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

//  Component 

export function JobDetailPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>('description')
  const { selectedId, setMode, goBackToList } = useJobsParams()
  const isCompany = useAuthStore((s) => s.user?.role === 'COMPANY')
  const isCandidate = useAuthStore((s) => s.user?.role === 'CANDIDATE')


  // selectedId is number | null — useJobOffer handles null via enabled: id !== null
  const { data: offer, isLoading, error } = useJobOffer(selectedId)

  //  Loading 
  if (isLoading) return <DetailSkeleton />

  //  Error / not found 
  if (error || !offer) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-sm font-medium text-muted-foreground">
          No se pudo cargar la oferta
        </p>
        <button
          onClick={goBackToList}
          className="mt-3 text-xs text-brand-text hover:text-brand-text transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    )
  }

  const tabContent: Record<TabKey, string | null> = {
    description:      offer.description,
    responsibilities: offer.responsibilities,
    requirements:     offer.requirements,
    benefits:         offer.benefits,
  }

  // Only show tabs that have content
  const availableTabs = TABS.filter((t) => tabContent[t.key])

  // If current tab lost content after data reload, reset to first available
  const resolvedTab = tabContent[activeTab]
    ? activeTab
    : (availableTabs[0]?.key ?? 'description')

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/*  Sticky header  */}
      <div className="shrink-0 border-b border-border bg-card px-5 pt-4 pb-0">

        {/* Mobile back button */}
        <button
          onClick={goBackToList}
          className="lg:hidden inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la lista
        </button>

        {/* Company + title */}
        <div className="mb-3">
          <p className="text-xs font-medium text-subtle mb-1">
            {offer.companyName ?? 'Empresa'}
          </p>
          <h2 className="text-lg font-bold text-foreground leading-tight">
            {offer.title}
          </h2>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {offer.location && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {offer.location}
            </span>
          )}
          {offer.workMode && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-tint text-brand-text">
              <Wifi className="w-3 h-3" />
              {WORK_MODE_LABELS[offer.workMode]}
            </span>
          )}
          {offer.jobType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              <Briefcase className="w-3 h-3" />
              {JOB_TYPE_LABELS[offer.jobType]}
            </span>
          )}
          {offer.expiresAt && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              Cierra {formatDate(offer.expiresAt)}
            </span>
          )}
        </div>

        {/* Skills */}
        {offer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {offer.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium text-body"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {!isCompany && (
          <>
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <ApplyButton
                jobOfferId={offer.id}
                jobTitle={offer.title}
                companyName={offer.companyName}
                offerStatus={offer.status}
              />

              <SaveButton jobOfferId={offer.id} size="md" showLabel />      
              {isCandidate && (
                <>
                <button
                  onClick={() => setMode('cv')}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-brand-border text-brand-text hover:bg-brand-tint transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  CV personalizado
                </button>
                <button
                  onClick={() => setMode('interview')}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-brand-border text-brand-text hover:bg-brand-tint transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Entrevista IA
                </button>  
              </>
              )}       
          </div>
          </>
        )}
        {/* Content tabs */}
        {availableTabs.length > 1 && (
          <div className="flex -mb-px">
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                  resolvedTab === tab.key
                    ? 'border-primary text-brand-text'
                    : 'border-transparent text-muted-foreground hover:text-secondary-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*  Scrollable content  */}
      <div className="flex-1 overflow-y-auto px-5 py-5 bg-card">
        {availableTabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-8 h-8 text-faint mb-2" />
            <p className="text-sm text-muted-foreground">
              Esta oferta no tiene descripción detallada
            </p>
          </div>
        ) : (
          tabContent[resolvedTab] ? (
            <div className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">
              {tabContent[resolvedTab]}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sin información en esta sección
            </p>
          )
        )}
      </div>
    </div>
  )
}
