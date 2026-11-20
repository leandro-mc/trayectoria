// Reusable chat: IN_PROGRESS (active) and COMPLETED (read-only + feedback).
// Used by JobInterviewPanel (split panel) and the /ai/interviews page.
'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { ChatComposer } from './ChatComposer'
import { MessageBubble, TypingIndicator } from './ChatMessages'
import { FeedbackSection } from './FeedbackSection'
import { useCompleteInterview, useSendMessage } from '../hooks/useInterviews'
import type { InterviewFeedback, SimulatedInterviewResponse } from '../types/interviews.types'
import { saveFeedback } from '../utils/feedback-cache'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InterviewChatProps {
  interview:       SimulatedInterviewResponse
  /** Feedback cached in localStorage from an earlier session. */
  initialFeedback: InterviewFeedback | null
  /** Height of the scroll area: "flex-1 min-h-0" in the split panel, "min-h-[calc(100dvh-300px)]" on a full page. */
  messagesClassName?: string
}

export function InterviewChat({ interview, initialFeedback, messagesClassName = 'flex-1 min-h-0' }: InterviewChatProps) {
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(initialFeedback)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isCompleted = interview.status === 'COMPLETED'
  const { mutate: send,     isPending: sending    } = useSendMessage(interview.id)
  const { mutate: complete, isPending: completing } = useCompleteInterview(interview.id)

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [interview.messages.length, sending])

  function handleComplete() {
    if (!confirm('¿Finalizar la entrevista? Recibirás feedback detallado.')) return
    complete(undefined, {
      onSuccess: (data) => {
        saveFeedback(interview.id, data.feedback)
        setFeedback(data.feedback)
      },
    })
  }

  return (
    <div className="flex h-full flex-col">
      {!isCompleted && (
        <div className="flex shrink-0 justify-end px-4 pb-1 pt-3">
          <Button
            variant="outline"
            size="sm"
            loading={completing}
            onClick={handleComplete}
            disabled={interview.messages.length < 2}
            className="text-muted-foreground"
          >
            Finalizar entrevista
          </Button>
        </div>
      )}

      {/* role="log" makes screen readers announce each new message as it arrives. */}
      <div
        ref={scrollRef}
        role="log"
        aria-label="Conversación de la entrevista"
        className={cn('space-y-4 overflow-y-auto bg-background px-4 py-3', messagesClassName)}
      >
        {interview.messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} sentAt={msg.sentAt} />
        ))}

        {sending && <TypingIndicator />}

        {isCompleted && !sending && !feedback && (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="mb-2 size-7 text-success-text" aria-hidden="true" />
            <p className="text-sm font-medium text-body">Entrevista completada</p>
          </div>
        )}

        {feedback && <FeedbackSection feedback={feedback} />}
      </div>

      {!isCompleted && <ChatComposer sending={sending} onSend={(content) => send({ content })} />}
    </div>
  )
}
