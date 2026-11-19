import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils'

type Role = 'USER' | 'ASSISTANT'

/** Chat avatar: "Tú" for the candidate, "E" for the interviewer. Text only, no icons. */
function ChatAvatar({ role }: { role: Role }) {
  const isUser = role === 'USER'
  return (
    <div
      aria-hidden="true"
      className={cn(
        'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
        isUser ? 'bg-brand-tint-strong text-brand-text' : 'bg-primary text-primary-foreground',
      )}
    >
      {isUser ? 'Tú' : 'E'}
    </div>
  )
}

export function MessageBubble({ role, content, sentAt }: { role: Role; content: string; sentAt: string }) {
  const isUser = role === 'USER'
  return (
    <div className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
      <ChatAvatar role={role} />
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm border border-border bg-raised text-foreground',
        )}
      >
        <p className="sr-only">{isUser ? 'Tú:' : 'Entrevistador:'}</p>
        <p className="whitespace-pre-wrap">{content}</p>
        <p className={cn('mt-1.5 text-[10px]', isUser ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{formatDate(sentAt)}</p>
      </div>
    </div>
  )
}

// Staggered delays make the three dots bounce in sequence instead of together.
const DOT_DELAYS = ['[animation-delay:0ms]', '[animation-delay:150ms]', '[animation-delay:300ms]'] as const

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <ChatAvatar role="ASSISTANT" />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-raised px-4 py-3">
        <span className="sr-only">El entrevistador está escribiendo…</span>
        {DOT_DELAYS.map((delay) => (
          <span key={delay} aria-hidden="true" className={cn('size-1.5 animate-bounce rounded-full bg-subtle', delay)} />
        ))}
      </div>
    </div>
  )
}
