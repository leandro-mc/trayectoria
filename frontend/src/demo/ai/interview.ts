import type { InterviewFeedback } from '@/features/ai/interviews/types/interviews.types'
import type { InterviewRecommendation } from '@/types/global.types'
import { joinList, overlap, without } from './text'

/**
 * Stand-in for the interviewer model. The questions are scripted and rotate in a fixed
 * order, and the feedback is computed from what the candidate actually wrote, so it stays
 * consistent with the conversation without any model behind it.
 */

export interface InterviewContext {
  title: string
  company: string | null
  /** Catalogue names of the offer's skills. */
  skills: string[]
}

/** Same cap as the backend (SendInterviewMessageUseCase.maxUserMessages). */
export const MAX_USER_MESSAGES = 8

const skillAt = (ctx: InterviewContext, index: number) =>
  ctx.skills.length > 0 ? ctx.skills[index % ctx.skills.length] : 'las tecnologías del puesto'

const ACKNOWLEDGEMENTS = ['Gracias por compartirlo.', 'Entiendo.', 'Buen punto.', 'Muy bien.']

const QUESTIONS: ReadonlyArray<(ctx: InterviewContext) => string> = [
  (ctx) => `Cuéntame sobre un proyecto reciente donde hayas usado ${skillAt(ctx, 0)}. ¿Cuál fue tu papel y qué resultado obtuviste?`,
  () => '¿Cómo abordas una tarea compleja cuando tienes poco tiempo? Dame un ejemplo concreto.',
  (ctx) => `Háblame de una vez en la que tuviste que aprender ${skillAt(ctx, 1)} desde cero. ¿Cómo lo hiciste?`,
  () => '¿Cómo manejas el feedback o una discusión técnica con un compañero de equipo?',
  (ctx) => `Pensando en ${skillAt(ctx, 2)}, ¿qué buenas prácticas aplicas para mantener la calidad de tu trabajo?`,
  (ctx) => `¿Qué harías en tus primeras semanas${ctx.company ? ` en ${ctx.company}` : ''} para aportar valor al equipo?`,
  () => 'Última pregunta: ¿qué dudas tienes sobre el puesto o sobre el equipo?',
]

export function interviewGreeting(firstName: string | null, ctx: InterviewContext): string {
  const name = firstName ? `, ${firstName}` : ''
  const company = ctx.company ? ` en ${ctx.company}` : ''
  return `¡Hola${name}! Gracias por tu interés en el puesto de ${ctx.title}${company}. Para empezar, cuéntame brevemente sobre ti y por qué te interesa esta posición.`
}

/** Reply to the candidate's `userMessageCount`-th message (1-based). */
export function interviewerReply(ctx: InterviewContext, userMessageCount: number): string {
  if (userMessageCount >= MAX_USER_MESSAGES) {
    return 'Gracias, eso es todo por mi parte. Si quieres, finaliza la entrevista para ver tu feedback. ¡Mucho éxito en tu proceso!'
  }
  const index = userMessageCount - 1
  const ack = ACKNOWLEDGEMENTS[index % ACKNOWLEDGEMENTS.length]
  const question = QUESTIONS[index % QUESTIONS.length]
  return `${ack} ${question?.(ctx) ?? ''}`.trim()
}

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

function recommendationFor(score: number): InterviewRecommendation {
  if (score >= 9) return 'STRONG_YES'
  if (score >= 7) return 'YES'
  return score >= 5 ? 'MAYBE' : 'NO'
}

export function buildFeedback(ctx: InterviewContext, answers: readonly string[]): InterviewFeedback {
  const count = answers.length
  const avgWords = count === 0 ? 0 : Math.round(answers.reduce((sum, a) => sum + wordCount(a), 0) / count)
  const mentioned = overlap(ctx.skills, ctx.skills.filter((s) => answers.some((a) => a.toLowerCase().includes(s.toLowerCase()))))
  const missing = without(ctx.skills, mentioned)
  const usesNumbers = answers.some((a) => /\d/.test(a))

  const score = Math.min(
    10,
    4 + (count >= 4 ? 2 : 0) + (count >= 6 ? 1 : 0) + (avgWords >= 20 ? 1 : 0) + (avgWords >= 40 ? 1 : 0) + Math.min(2, mentioned.length),
  )

  const strengths = [
    avgWords >= 25 && 'Desarrollaste tus respuestas con detalle suficiente para entender tu razonamiento.',
    mentioned.length > 0 && `Mencionaste tecnologías clave del puesto: ${joinList(mentioned)}.`,
    usesNumbers && 'Respaldaste tus respuestas con cifras o datos concretos.',
    count >= 5 && `Mantuviste la conversación durante ${count} intercambios sin perder el hilo.`,
  ].filter((s): s is string => typeof s === 'string')

  const improvements = [
    avgWords < 20 && 'Desarrolla más tus respuestas: apunta a contexto, acción y resultado en cada una.',
    missing.length > 0 && `Menciona tu experiencia con ${joinList(missing.slice(0, 3))}, que la oferta pide expresamente.`,
    !usesNumbers && 'Añade resultados medibles (métricas, plazos o impacto) para hacer tus ejemplos más convincentes.',
    count < 4 && 'Responde más preguntas para obtener una valoración más completa.',
  ].filter((s): s is string => typeof s === 'string')

  return {
    overallScore: score,
    summary: `Entrevista simulada para ${ctx.title}: ${count} ${count === 1 ? 'respuesta' : 'respuestas'}, con un promedio de ${avgWords} palabras cada una.`,
    strengths: strengths.length > 0 ? strengths : ['Participaste en la entrevista de principio a fin.'],
    areasForImprovement: improvements.length > 0 ? improvements : ['Sigue practicando: pide a otra persona que te haga preguntas distintas a las de esta simulación.'],
    recommendation: recommendationFor(score),
    details: `Este feedback se genera con reglas fijas a partir de tus respuestas (longitud, tecnologías mencionadas y uso de datos), no con un modelo de IA real. ${
      mentioned.length > 0
        ? `Tus respuestas tocaron ${joinList(mentioned)}, algo valioso para ${ctx.title}.`
        : 'Intenta conectar tus ejemplos con las tecnologías que menciona la oferta.'
    } Antes de una entrevista real, ensaya historias breves con la estructura contexto, acción y resultado.`,
  }
}
