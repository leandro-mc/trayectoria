import { Badge } from '@/components/ui/badge'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
  INTERVIEW_RECOMMENDATION_LABELS,
  INTERVIEW_RECOMMENDATION_TONE,
  JOB_STATUS_LABELS,
  JOB_STATUS_TONE,
} from '@/config/constants'
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
