'use client'

import { Suspense } from 'react'
import { Search } from 'lucide-react'
import { AILeftPanel, useAIParams } from '@/features/ai/components/AILeftPanel'
import { InterviewChat } from '@/features/ai/interviews/components/InterviewChat'
import { useInterview } from '@/features/ai/interviews/hooks/useInterviews'
import { loadFeedback } from '@/features/ai/interviews/utils/feedback-cache'
import { cn } from '@/lib/utils/cn'

//  Right panel — selected interview 

function InterviewPanel({ id }: { id: number }) {
  const { data: interview, isLoading } = useInterview(id)

  if (isLoading || !interview) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full animate-pulse"
            style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }} />
        </div>
      </div>
    )
  }

  return (
    <InterviewChat
      interview={interview}
      initialFeedback={loadFeedback(id)}
      messagesClassName="flex-1 min-h-0"
    />
  )
}

//  Empty right panel 

function EmptyRight() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
          <Search className="w-7 h-7 text-faint" />
        </div>
        <p className="text-sm font-medium text-subtle">
          Seleccioná una entrevista para verla
        </p>
      </div>
    </div>
  )
}

//  Page 

function InterviewsPageContent() {
  const { selectedId, selectItem, clearSelection } = useAIParams()

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left panel */}
      <div className={cn(
        'flex-col overflow-hidden border-r border-border',
        selectedId !== null
          ? 'hidden lg:flex lg:w-[38%]'
          : 'flex w-full lg:w-[38%]',
      )}>
        <AILeftPanel
          section="interviews"
          selectedId={selectedId}
          onSelect={selectItem}
        />
      </div>

      {/* Right panel */}
      {selectedId !== null ? (
        <div className="flex flex-col flex-1 overflow-hidden bg-card">
          {/* Mobile back */}
          <button
            onClick={clearSelection}
            className="lg:hidden flex items-center gap-2 px-4 py-3 text-xs font-medium text-neutral-500 border-b border-border bg-card shrink-0 hover:text-neutral-800 transition-colors"
          >
            ← Volver al listado
          </button>
          <div className="flex-1 min-h-0 overflow-hidden">
            <InterviewPanel id={selectedId} />
          </div>
        </div>
      ) : (
        <EmptyRight />
      )}
    </div>
  )
}

export default function InterviewsPage() {
  return (
    <Suspense>
      <InterviewsPageContent />
    </Suspense>
  )
}
