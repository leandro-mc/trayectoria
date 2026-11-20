import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
  INTERVIEW_RECOMMENDATION_LABELS,
  INTERVIEW_RECOMMENDATION_TONE,
  JOB_STATUS_LABELS,
  JOB_STATUS_TONE,
} from '@/config/constants'
import type { StatusTone } from '@/config/constants'
import type { ApplicationStatus, InterviewRecommendation, JobStatus } from '@/types/global.types'

interface BadgeProps { className?: string }

export function ApplicationStatusBadge({ status, className }: BadgeProps & { status: ApplicationStatus }) {
  return <Badge variant={APPLICATION_STATUS_TONE[status]} className={className}>{APPLICATION_STATUS_LABELS[status]}</Badge>
}

export function JobStatusBadge({ status, className }: BadgeProps & { status: JobStatus }) {
  return <Badge variant={JOB_STATUS_TONE[status]} className={className}>{JOB_STATUS_LABELS[status]}</Badge>
}

export function RecommendationBadge({ recommendation, className }: BadgeProps & { recommendation: InterviewRecommendation }) {
  return (
    <Badge variant={INTERVIEW_RECOMMENDATION_TONE[recommendation]} className={className}>
      {INTERVIEW_RECOMMENDATION_LABELS[recommendation]}
    </Badge>
  )
}

const TONE_DOT: Record<StatusTone, string> = {
  neutral: 'bg-subtle',
  brand:   'bg-brand-text',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-destructive',
}

/** Small coloured dot for dense lists; the status text next to it carries the meaning. */
export function StatusDot({ tone, className }: { tone: StatusTone; className?: string }) {
  return <span aria-hidden="true" className={cn('inline-block size-2 shrink-0 rounded-full', TONE_DOT[tone], className)} />
}
