'use client'

import { useState } from 'react'
import { Briefcase, ExternalLink, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { CardSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { Pagination } from '@/components/shared/data/Pagination'
import { useMyApplications, useWithdrawApplication } from '@/features/applications/hooks/useApplications'
import { formatDate } from '@/lib/utils/date'
import { ROUTES } from '@/config/routes'
import type { ApplicationStatus } from '@/types/global.types'
import Link from 'next/link'
import { ApplicationStatusBadge } from '@/components/shared/data/StatusBadge'

const STATUS_TABS: { label: string; value: ApplicationStatus | 'ALL' }[] = [
  { label: 'Todas',       value: 'ALL'       },
  { label: 'Pendientes',  value: 'PENDING'   },
  { label: 'En revisión', value: 'IN_REVIEW' },
  { label: 'Aceptadas',   value: 'ACCEPTED'  },
  { label: 'Rechazadas',  value: 'REJECTED'  },
]

export default function ApplicationsPage() {
  const [page, setPage]           = useState(0)
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'ALL'>('ALL')

  const { data, isLoading } = useMyApplications(page)
  const { mutate: withdraw, isPending: withdrawing } = useWithdrawApplication()

  const filtered = data?.content.filter(
    (a) => activeTab === 'ALL' || a.status === activeTab,
  ) ?? []

  return (
    <div>
      <PageHeader title="Mis Postulaciones" description="Seguí el estado de tus aplicaciones" />

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setActiveTab(tab.value); setPage(0) }}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.value
                ? 'bg-brand-tint text-brand-text'
                : 'text-muted-foreground hover:bg-muted',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No hay postulaciones"
          description="Explorá el catálogo de ofertas y postulate a las que más te interesen."
          action={{ label: 'Buscar empleos', href: ROUTES.jobs }}
        />
      )}

      {/* List */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-card border border-border rounded-xl p-5 shadow-card flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {app.jobOfferTitle}
                    </p>
                    {app.companyName && (
                      <p className="text-xs text-muted-foreground">
                        {app.companyName}
                      </p>
                    )}
                  </div>
                  <ApplicationStatusBadge status={app.status} className="shrink-0" />
                </div>
                <p className="text-xs text-neutral-400 mt-2">
                  Postulado el {formatDate(app.appliedAt)}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={ROUTES.publicJob(app.jobOfferId)}
                  className="p-1.5 rounded-lg hover:bg-muted text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  title="Ver oferta"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                {app.status === 'PENDING' && (
                  <button
                    onClick={() => withdraw(app.id)}
                    disabled={withdrawing}
                    className="p-1.5 rounded-lg hover:bg-danger-tint text-neutral-400 hover:text-danger-500 transition-colors disabled:opacity-50"
                    title="Retirar postulación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {data && (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }) }}
            />
          )}
        </div>
      )}
    </div>
  )
}
