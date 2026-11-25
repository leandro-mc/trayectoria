// Persists interview feedback in localStorage so it survives navigation.
// The API only returns feedback on PATCH /complete — not on GET /interviews/:id.

import type { InterviewFeedback } from '../types/interviews.types'

const PREFIX = 'tia-feedback-'
const key = (id: number) => `${PREFIX}${id}`

export function saveFeedback(interviewId: number, feedback: InterviewFeedback): void {
  try {
    localStorage.setItem(key(interviewId), JSON.stringify(feedback))
  } catch {
    // Storage quota or SSR — silently ignore
  }
}

export function loadFeedback(interviewId: number): InterviewFeedback | null {
  try {
    const raw = localStorage.getItem(key(interviewId))
    return raw ? (JSON.parse(raw) as InterviewFeedback) : null
  } catch {
    return null
  }
}

/** Removes every cached feedback (used by the demo mode when its data is reset). */
export function clearFeedback(): void {
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith(PREFIX)) localStorage.removeItem(k)
    }
  } catch {
    // Storage unavailable — nothing to clear
  }
}
