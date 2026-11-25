'use client'

import { useRef, useState } from 'react'
import { Mic, Send } from 'lucide-react'
import { SimulatedAiNote } from '@/components/shared/feedback/SimulatedAiNote'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'

interface ChatComposerProps {
  sending: boolean
  onSend:  (content: string) => void
}

/** Message box: Enter sends, Shift+Enter adds a line, and the box grows with its content up to 8rem. */
export function ChatComposer({ sending, onSend }: ChatComposerProps) {
  const [input, setInput] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  function resize() {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`   // keep in step with max-h-32
  }

  function send() {
    const content = input.trim()
    if (!content || sending) return
    onSend(content)
    setInput('')
    requestAnimationFrame(resize)
  }

  return (
    <div className="shrink-0 border-t border-border bg-card px-4 py-3">
      <div className="flex items-end gap-2">
        <Textarea
          ref={ref}
          value={input}
          rows={1}
          disabled={sending}
          aria-label="Tu respuesta"
          placeholder="Escribí tu respuesta… (Enter para enviar)"
          className="max-h-32 min-h-[42px] flex-1 resize-none overflow-y-auto rounded-xl bg-muted px-3.5"
          onChange={(e) => { setInput(e.target.value); resize() }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
          }}
        />
        <Button size="icon-lg" onClick={send} disabled={sending || !input.trim()} aria-label="Enviar respuesta">
          {sending ? <Spinner /> : <Send />}
        </Button>
        {/* Voice interviews are planned for a later phase. */}
        <Button size="icon-lg" variant="outline" disabled title="Próximamente: entrevista por voz" aria-label="Entrevista por voz (próximamente)">
          <Mic />
        </Button>
      </div>
      <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">Shift+Enter para nueva línea · Enter para enviar</p>
      <SimulatedAiNote kind="interview" className="mt-1 px-1" />
    </div>
  )
}
