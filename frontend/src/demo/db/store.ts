import { clearFeedback, saveFeedback } from '@/features/ai/interviews/utils/feedback-cache'
import { buildSeedDb } from './seed'
import type { DemoDb, IdTable } from './types'

/**
 * The visitor's whole backend: one object in memory, mirrored to sessionStorage after every
 * write. sessionStorage (not localStorage) on purpose: state is per tab, nothing is shared
 * between visitors, and closing the tab starts again from the fixtures.
 */

const STORAGE_KEY = 'trayectoria-demo-state'
/** Bump when DemoDb changes shape: stale state from an older build is then discarded. */
const STATE_VERSION = 1

let current: DemoDb | null = null

function load(): DemoDb | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as { version: number; db: DemoDb }
    return saved.version === STATE_VERSION ? saved.db : null
  } catch {
    return null
  }
}

/** Interview feedback lives in the app's own localStorage cache: keep it in step with the state. */
function syncFeedbackCache(db: DemoDb): void {
  clearFeedback()
  for (const interview of db.interviews) {
    if (interview.feedback) saveFeedback(interview.id, interview.feedback)
  }
}

function freshState(): DemoDb {
  const db = buildSeedDb()
  syncFeedbackCache(db)
  return db
}

export function getDb(): DemoDb {
  current ??= load() ?? freshState()
  return current
}

/** Writes the state to sessionStorage; the adapter calls it after every mutating request. */
export function commit(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, db: getDb() }))
  } catch {
    // Quota exceeded or storage blocked: the demo keeps working from memory, it just won't survive a reload.
    console.warn('[demo] Could not persist the demo state to sessionStorage.')
  }
}

/** Throws the visitor's changes away and starts again from the fixtures. */
export function resetDemoData(): void {
  current = freshState()
  commit()
}

export function nextId(table: IdTable): number {
  return getDb().nextIds[table]++
}
