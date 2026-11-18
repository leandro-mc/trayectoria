'use client'


import { use, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, ChevronDown, Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { Pagination } from '@/components/shared/data/Pagination'
import {
  useJobApplications,
  useUpdateApplicationStatus,
} from '@/features/applications/hooks/useJobApplications'
import { CandidateProfilePanel } from '@/features/applications/components/CandidateProfilePanel'
import { useJobOffer } from '@/features/jobs/hooks/useJobOffers'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
} from '@/config/constants'
import { formatDate } from '@/lib/utils/date'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils/cn'
import type { JobApplicationResponse } from '@/features/applications/types/applications.types'
import type { ApplicationStatus } from '@/types/global.types'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { badgeVariants } from '@/components/ui/badge'

//  Status filter tabs 

const FILTER_TABS: { label: string; value: ApplicationStatus | 'ALL' }[] = [
  { label: 'Todas',       value: 'ALL'       },
  { label: 'Pendientes',  value: 'PENDING'   },
  { label: 'Vistas',      value: 'VIEWED'    },
  { label: 'En revisión', value: 'IN_REVIEW' },
  { label: 'Aceptadas',   value: 'ACCEPTED'  },
  { label: 'Rechazadas',  value: 'REJECTED'  },
]

// Status transitions available to company
const NEXT_STATUSES: Exclude<ApplicationStatus, 'PENDING'>[] = [
  'VIEWED', 'IN_REVIEW', 'ACCEPTED', 'REJECTED',
]

//  Application row 

function ApplicationRow({
  application,
  isSelected,
  onSelect,
}: {
  application: JobApplicationResponse
  isSelected:  boolean
  onSelect:    () => void
}) {
  const [statusOpen, setStatusOpen] = useState(false)
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus()

  const candidateName = [
    application.candidateFirstName,
    application.candidateLastName,
  ].filter(Boolean).join(' ') || application.candidateEmail || `Candidato #${application.candidateId}`

  const availableStatuses = NEXT_STATUSES.filter((s) => s !== application.status)

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 transition-colors cursor-pointer',
        isSelected
          ? 'bg-brand-tint'
          : 'hover:bg-hover',
      )}
      onClick={onSelect}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-brand-tint-strong flex items-center justify-center text-xs font-bold text-brand-text shrink-0">
        {(application.candidateFirstName?.[0] ?? application.candidateEmail?.[0] ?? '?').toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {candidateName}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {formatDate(application.appliedAt)}
          {application.curriculumId && (
            <span className="ml-1.5 text-brand-text font-medium">· CV ✨</span>
          )}
        </p>
      </div>

      {/* Status dropdown — stopPropagation so click doesn't also select the row */}
      <div
        className="relative shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setStatusOpen((o) => !o)}
          className={cn(badgeVariants({ variant: APPLICATION_STATUS_TONE[application.status] }), 'cursor-pointer gap-1 py-1')}
        >
          {APPLICATION_STATUS_LABELS[application.status]}
          <ChevronDown className="w-3 h-3" />
        </button>

        {statusOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setStatusOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-40 bg-card border border-border rounded-xl shadow-modal py-1 min-w-[150px]">
              {availableStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    updateStatus({ id: application.id, data: { status: s } })
                    setStatusOpen(false)
                  }}
                  disabled={isPending}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-hover text-secondary-foreground flex items-center gap-2.5 disabled:opacity-50"
                >
                  {isPending
                    ? <Spinner className="size-3 shrink-0" />
                    : <span className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        s === 'ACCEPTED'  ? 'bg-success-500'  :
                        s === 'REJECTED'  ? 'bg-danger-500'   :
                        s === 'IN_REVIEW' ? 'bg-warning-500'  :
                        s === 'VIEWED'    ? 'bg-brand-400'    :
                        'bg-neutral-400',
                      )}
                    />
                  }
                  {APPLICATION_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

//  Page 

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OfferApplicationsPage({ params }: PageProps) {
  const { id }  = use(params)
  const offerId = Number(id)

  const [page, setPage]           = useState(0)
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'ALL'>('ALL')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: offer }     = useJobOffer(offerId)
  const { data, isLoading } = useJobApplications(offerId, page)

  const filtered = data?.content.filter(
    (a) => activeTab === 'ALL' || a.status === activeTab,
  ) ?? []

  const selectedApp = filtered.find((a) => a.id === selectedId) ?? null

  const handleSelect = useCallback((id: number) => {
    setSelectedId((prev) => prev === id ? null : id)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-1">
        <PageHeader
          title={offer?.title ?? 'Postulaciones'}
          description={`${data?.totalElements ?? 0} postulación${(data?.totalElements ?? 0) !== 1 ? 'es' : ''} recibida${(data?.totalElements ?? 0) !== 1 ? 's' : ''}`}
          actions={
            <Link
              href={ROUTES.offers}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-input bg-card hover:bg-hover text-body text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Mis ofertas
            </Link>
          }
        />

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(0); setSelectedId(null) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.value
                  ? 'bg-brand-tint text-brand-text'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split panel */}
      <div className="flex flex-1 min-h-0 gap-4">

        {/* Left — applicant list */}
        <div className={cn(
          'flex flex-col min-h-0',
          selectedApp ? 'hidden lg:flex lg:w-[40%]' : 'flex w-full lg:w-[40%]',
        )}>
          <div className="flex-1 min-h-0 overflow-y-auto bg-card border border-border rounded-xl">

            {isLoading && (
              <div className="divide-y divide-border-soft">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 rounded w-1/2" />
                      <Skeleton className="h-3 rounded w-1/3" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <EmptyState
                icon={Users}
                title="Sin postulaciones"
                description={
                  activeTab === 'ALL'
                    ? 'Aún no recibiste postulaciones para esta oferta.'
                    : 'No hay postulaciones con este estado.'
                }
                action={activeTab !== 'ALL' ? {
                  label:   'Ver todas',
                  onClick: () => setActiveTab('ALL'),
                } : undefined}
              />
            )}

            {!isLoading && filtered.length > 0 && (
              <div className="divide-y divide-border-soft">
                {filtered.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    isSelected={selectedId === app.id}
                    onSelect={() => handleSelect(app.id)}
                  />
                ))}
              </div>
            )}

            {data && data.totalPages > 1 && (
              <div className="p-4 border-t border-border-soft">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  onPageChange={(p) => { setPage(p); setSelectedId(null) }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right — candidate profile */}
        {selectedApp ? (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Mobile back */}
            <button
              onClick={() => setSelectedId(null)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 text-xs font-medium text-neutral-500 border border-input bg-card rounded-t-xl hover:text-neutral-800 transition-colors shrink-0"
            >
              ← Volver al listado
            </button>
            <div className="flex-1 min-h-0 overflow-hidden border border-border rounded-xl lg:rounded-xl rounded-tl-none lg:rounded-tl-xl">
              <CandidateProfilePanel application={selectedApp} />
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-background rounded-xl border border-border">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7 text-faint" />
              </div>
              <p className="text-sm font-medium text-subtle">
                Seleccioná un postulante para ver su perfil
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
