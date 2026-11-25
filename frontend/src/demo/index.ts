/**
 * Entry point of the demo layer, and the ONLY module the rest of the app may load from
 * src/demo (always through `import('@/demo')`, enforced by ESLint). Keeping one entry is
 * what lets next.config.ts swap the whole layer for an empty stub when the demo is off.
 */
import { registerAllRoutes } from './handlers'

registerAllRoutes()

export { handleDemoRequest } from './http/adapter'
export { refreshTokens as demoRefresh } from './handlers/auth'
export { resetDemoData } from './db/store'
export { DemoBanner } from './ui/DemoBanner'
export { DemoLoginShortcuts } from './ui/DemoLoginShortcuts'
export { SimulatedAiNote } from './ui/SimulatedAiNote'
