import { cn } from '@/lib/utils'

const NOTES = {
  cv:        'Demo: este currículum se arma con una plantilla a partir de tu perfil y la oferta; no usa un modelo de IA.',
  interview: 'Demo: las respuestas del entrevistador son simuladas, sin un modelo de IA real.',
  feedback:  'Demo: este feedback se calcula con reglas fijas a partir de tus respuestas.',
} as const

export type SimulatedAiNoteKind = keyof typeof NOTES

/** Discreet reminder that the "AI" output is simulated. */
export function SimulatedAiNote({ kind, className }: { kind: SimulatedAiNoteKind; className?: string }) {
  return <p className={cn('text-xs text-muted-foreground', className)}>{NOTES[kind]}</p>
}
