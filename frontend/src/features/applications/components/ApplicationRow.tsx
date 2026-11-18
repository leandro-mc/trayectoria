'use client'

import { StatusMenu } from '@/components/shared/data/StatusMenu'
import { Skeleton } from '@/components/ui/skeleton'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONE } from '@/config/constants'
import { useUpdateApplicationStatus } from '@/features/applications/hooks/useJobApplications'
import type { JobApplicationResponse } from '@/features/applications/types/applications.types'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types/global.types'

/** Statuses a company can move an application to (PENDING is only the starting state). */
const NEXT_STATUSES: readonly Exclude<ApplicationStatus, 'PENDING'>[] = ['VIEWED', 'IN_REVIEW', 'ACCEPTED', 'REJECTED']

export function candidateName(a: JobApplicationResponse): string {
  return [a.candidateFirstName, a.candidateLastName].filter(Boolean).join(' ')
    || a.candidateEmail
    || `Candidato #${a.candidateId}`
}

interface ApplicationRowProps {
  application: JobApplicationResponse
  isSelected:  boolean
  onSelect:    () => void
}

export function ApplicationRow({ application, isSelected, onSelect }: ApplicationRowProps) {
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus()
  const initial = (application.candidateFirstName?.[0] ?? application.candidateEmail?.[0] ?? '?').toUpperCase()

  return (
    // The select button and the status menu are siblings: nesting one interactive
    // control inside another breaks keyboard and screen-reader use.
    <div className={cn('flex items-center gap-3 px-4 py-3.5 transition-colors', isSelected ? 'bg-brand-tint' : 'hover:bg-hover')}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-tint-strong text-xs font-bold text-brand-text"
        >
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">{candidateName(application)}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {formatDate(application.appliedAt)}
            {application.curriculumId && <span className="ml-1.5 font-medium text-brand-text">· Con CV adjunto</span>}
          </span>
        </span>
      </button>

      <StatusMenu
        label="Estado de la postulación"
        value={application.status}
        options={NEXT_STATUSES.filter((s) => s !== application.status)}
        labels={APPLICATION_STATUS_LABELS}
        tones={APPLICATION_STATUS_TONE}
        pending={isPending}
        onSelect={(status) => updateStatus({ id: application.id, data: { status } })}
      />
    </div>
  )
}

export function ApplicationRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-1/2 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
      <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
    </div>
  )
}
