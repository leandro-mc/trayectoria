'use client'

import { Suspense } from 'react'
import { MessageSquare } from 'lucide-react'
import { DetailPlaceholder, MasterDetail } from '@/components/shared/layout/MasterDetail'
import { Spinner } from '@/components/ui/spinner'
import { AILeftPanel } from '@/features/ai/components/AILeftPanel'
import { useAIParams } from '@/features/ai/hooks/useAIParams'
import { InterviewChat } from '@/features/ai/interviews/components/InterviewChat'
import { useInterview } from '@/features/ai/interviews/hooks/useInterviews'
import { loadFeedback } from '@/features/ai/interviews/utils/feedback-cache'

function InterviewPanel({ id }: { id: number }) {
  const { data: interview, isLoading } = useInterview(id)

  if (isLoading || !interview) {
    return (
      <div className="flex h-full items-center justify-center bg-card">
        <Spinner className="size-6 text-brand-text" />
      </div>
    )
  }

  return <InterviewChat interview={interview} initialFeedback={loadFeedback(id)} />
}

function InterviewsPageContent() {
  const { selectedId, selectItem, clearSelection } = useAIParams()

  return (
    <MasterDetail
      hasSelection={selectedId !== null}
      onBack={clearSelection}
      list={<AILeftPanel section="interviews" selectedId={selectedId} onSelect={selectItem} />}
      detail={selectedId !== null && <InterviewPanel id={selectedId} />}
      placeholder={<DetailPlaceholder icon={MessageSquare}>Seleccioná una entrevista para verla</DetailPlaceholder>}
    />
  )
}

export default function InterviewsPage() {
  return (
    <Suspense>
      <InterviewsPageContent />
    </Suspense>
  )
}
