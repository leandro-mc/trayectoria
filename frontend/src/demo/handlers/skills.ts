import { queryString } from '../http/request'
import { publicRoute } from '../http/router'
import { SKILLS } from '../fixtures/skills'

export function registerSkillRoutes(): void {
  // `?search=` is a case-insensitive "contains", like findByNameContainingIgnoreCase.
  publicRoute('GET', '/skills', (req) => {
    const search = queryString(req, 'search')?.toLowerCase()
    const data = search ? SKILLS.filter((s) => s.name.toLowerCase().includes(search)) : SKILLS
    return { status: 200, data }
  })
}
