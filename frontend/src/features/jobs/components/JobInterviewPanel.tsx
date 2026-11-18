// Right panel for AI mode = 'interview'.
// Resumes an existing IN_PROGRESS interview for this job, or auto-starts a new one.

'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { useInterviews, useStartInterview, useInterview } from '@/features/ai/interviews/hooks/useInterviews'
import { loadFeedback } from '@/features/ai/interviews/utils/feedback-cache'
import { InterviewChat } from '@/features/ai/interviews/components/InterviewChat'
import { useJobsParams } from '../hooks/useJobsParams'
import { IconTile } from '@/components/shared/brand/IconTile'
import { Skeleton } from '@/components/ui/skeleton'

//  Starting skeleton 

function StartingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <IconTile icon={MessageSquare} className="size-10 animate-pulse rounded-full" />
      <p className="text-sm text-brand-text font-medium animate-pulse">
        Preparando tu entrevista…
      </p>
      <div className="w-full max-w-xs space-y-2">
        {[80, 65, 75].map((w, i) => (
          <Skeleton key={i} className="h-3 rounded-lg" style={{ width: `${w}%`, marginLeft: 'auto', marginRight: 'auto' }} />
        ))}
      </div>
    </div>
  )
}

//  Inner chat — loads detail once we have an interviewId 

function InterviewChatLoader({ interviewId }: { interviewId: number }) {
  const { data: interview, isLoading } = useInterview(interviewId)

  if (isLoading || !interview) return <StartingSkeleton />

  return (
    <InterviewChat
      interview={interview}
      initialFeedback={loadFeedback(interviewId)}
      messagesClassName="flex-1 min-h-0"
    />
  )
}

//  Panel 

export function JobInterviewPanel() {
  const { selectedId } = useJobsParams()
  const jobOfferId     = selectedId!

  const { data: interviews = [], isLoading: loadingList } = useInterviews()
  const { mutate: start, isPending: starting }            = useStartInterview()

  const [activeInterviewId, setActiveInterviewId] = useState<number | null>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (loadingList) return
    if (triggered.current) return

    // Resume existing IN_PROGRESS interview for this job
    const existing = interviews.find(
      (iv) => iv.jobOfferId === jobOfferId && iv.status === 'IN_PROGRESS',
    )

    if (existing) {
      setActiveInterviewId(existing.id)
    } else {
      triggered.current = true
      start(
        { jobOfferId },
        { onSuccess: (iv) => setActiveInterviewId(iv.id) },
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingList])

  // Reset when job changes
  useEffect(() => {
    triggered.current = false
    setActiveInterviewId(null)
  }, [jobOfferId])

  const isLoading = loadingList || (starting && !activeInterviewId)

  return (
    <div className="flex flex-col h-full bg-card">

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border shrink-0">
        <IconTile icon={MessageSquare} size="sm" />
        <span className="text-sm font-semibold text-foreground">
          Entrevista simulada con IA
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {isLoading || !activeInterviewId
          ? <StartingSkeleton />
          : <InterviewChatLoader interviewId={activeInterviewId} />
        }
      </div>
    </div>
  )
}
