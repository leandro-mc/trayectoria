import type { LucideIcon } from 'lucide-react'
import { AlertCircle, CheckCircle2, ThumbsUp, TrendingUp } from 'lucide-react'
import { RecommendationBadge } from '@/components/shared/data/StatusBadge'
import { SimulatedAiNote } from '@/components/shared/feedback/SimulatedAiNote'
import type { InterviewFeedback } from '../types/interviews.types'

function Note({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-xl border border-border bg-raised p-4">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{title}</p>
      <p className="text-sm leading-relaxed text-secondary-foreground">{children}</p>
    </div>
  )
}

interface PointListProps {
  title:    string
  items:    string[]
  headIcon: LucideIcon
  itemIcon: LucideIcon
  tone:     'success' | 'warning'
}

const TONE = { success: 'text-success-text', warning: 'text-warning-text' } as const

function PointList({ title, items, headIcon: Head, itemIcon: Item, tone }: PointListProps) {
  if (items.length === 0) return null
  return (
    <div>
      <div className={`mb-2 flex items-center gap-2 ${TONE[tone]}`}>
        <Head className="size-3.5" aria-hidden="true" />
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <ul className="space-y-2">
        {items.map((text, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
            <Item className={`mt-0.5 size-3.5 shrink-0 ${TONE[tone]}`} aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FeedbackSection({ feedback }: { feedback: InterviewFeedback }) {
  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <div className="rounded-2xl border border-brand-border bg-brand-tint py-5 text-center">
        <p className="mb-2 text-xs font-semibold text-brand-text">Feedback de la IA</p>
        <p className="text-4xl font-bold text-foreground">
          {feedback.overallScore}
          <span className="text-xl font-normal text-muted-foreground">/10</span>
        </p>
        <RecommendationBadge recommendation={feedback.recommendation} className="mt-2" />
      </div>

      <Note title="Resumen">{feedback.summary}</Note>
      <PointList title="Fortalezas" items={feedback.strengths} headIcon={ThumbsUp} itemIcon={CheckCircle2} tone="success" />
      <PointList title="Áreas a mejorar" items={feedback.areasForImprovement} headIcon={TrendingUp} itemIcon={AlertCircle} tone="warning" />
      <Note title="Feedback detallado">{feedback.details}</Note>
      <SimulatedAiNote kind="feedback" />
    </div>
  )
}
