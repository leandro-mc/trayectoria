import { registerApplicationRoutes } from './applications'
import { registerAuthRoutes } from './auth'
import { registerCandidateRoutes } from './candidate'
import { registerCompanyRoutes } from './company'
import { registerCurriculumRoutes } from './curricula'
import { registerInterviewRoutes } from './interviews'
import { registerJobRoutes } from './jobs'
import { registerSavedOfferRoutes } from './saved-offers'
import { registerSkillRoutes } from './skills'

/**
 * One call wires every endpoint the frontend uses. A request with no route here is answered
 * with 501 (see adapter.ts): the demo never invents an empty success.
 */
export function registerAllRoutes(): void {
  registerAuthRoutes()
  registerSkillRoutes()
  registerJobRoutes()
  registerApplicationRoutes()
  registerSavedOfferRoutes()
  registerCandidateRoutes()
  registerCompanyRoutes()
  registerCurriculumRoutes()
  registerInterviewRoutes()
}
