'use client'

import { useState } from 'react'
import { MapPin, Briefcase, Wifi, Calendar, MessageSquare, FileText } from 'lucide-react'
import { useJobOffer } from '../hooks/useJobOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { SaveButton } from './SaveButton'
import { ApplyButton } from './ApplyButton'
import { useAuthStore } from '@/stores/auth.store'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/utils/date'
import { BackButton } from '@/components/shared/layout/BackButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Skeleton, SkeletonLines } from '@/components/ui/skeleton'

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
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-[70px] rounded-full" />
      </div>
      <SkeletonLines count={5} className="mt-6" />
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
        <Button variant="link" size="sm" onClick={goBackToList} className="mt-3 text-xs">
          Volver a la lista
        </Button>
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

        <BackButton onClick={goBackToList} className="lg:hidden">Volver a la lista</BackButton>

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
                <Button variant="brand" onClick={() => setMode('cv')} className="text-xs">
                  <FileText />
                  CV personalizado
                </Button>
                <Button variant="brand" onClick={() => setMode('interview')} className="text-xs">
                  <MessageSquare />
                  Entrevista IA
                </Button>
                </>
              )}       
          </div>
          </>
        )}
        {/* Content tabs */}
        {availableTabs.length > 1 && (
          <div role="group" aria-label="Contenido de la oferta" className="-mb-px flex">
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={resolvedTab === tab.key}
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
