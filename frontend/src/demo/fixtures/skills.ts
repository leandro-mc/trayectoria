import type { SkillResponse } from '@/types/api.types'

/**
 * Skills catalogue. Ported from backend/.../V2__seed_roles_and_skills.sql: the ids are
 * the 1-based insertion order, same as the BIGSERIAL column.
 */
const CATALOG: ReadonlyArray<readonly [string, NonNullable<SkillResponse['type']>]> = [
  ['Java', 'TECHNICAL'], ['Kotlin', 'TECHNICAL'], ['Python', 'TECHNICAL'], ['JavaScript', 'TECHNICAL'],
  ['TypeScript', 'TECHNICAL'], ['C++', 'TECHNICAL'], ['SQL', 'TECHNICAL'], ['Spring Boot', 'TECHNICAL'],
  ['Node.js', 'TECHNICAL'], ['Express.js', 'TECHNICAL'], ['React', 'TECHNICAL'], ['Next.js', 'TECHNICAL'],
  ['Angular', 'TECHNICAL'], ['Vue.js', 'TECHNICAL'], ['Android', 'TECHNICAL'], ['Jetpack Compose', 'TECHNICAL'],
  ['PostgreSQL', 'TECHNICAL'], ['MySQL', 'TECHNICAL'], ['Oracle DB', 'TECHNICAL'], ['MongoDB', 'TECHNICAL'],
  ['Redis', 'TECHNICAL'], ['Clean Architecture', 'TECHNICAL'], ['REST APIs', 'TECHNICAL'],
  ['Microservices', 'TECHNICAL'], ['JWT', 'TECHNICAL'], ['OpenAI API', 'TECHNICAL'],
  ['Prompt Engineering', 'TECHNICAL'], ['JUnit', 'TECHNICAL'], ['Jest', 'TECHNICAL'],
  ['Docker', 'TOOL'], ['Git', 'TOOL'], ['Linux', 'TOOL'], ['Azure DevOps', 'TOOL'],
  ['GitHub Actions', 'TOOL'], ['Postman', 'TOOL'], ['Figma', 'TOOL'], ['Selenium', 'TOOL'],
  ['Scrum', 'SOFT'], ['Trabajo en equipo', 'SOFT'], ['Comunicación efectiva', 'SOFT'],
  ['Resolución de problemas', 'SOFT'], ['Aprendizaje continuo', 'SOFT'],
]

export const SKILLS: readonly SkillResponse[] = CATALOG.map(([name, type], index) => ({
  id: index + 1,
  name,
  type,
}))

const BY_ID = new Map(SKILLS.map((skill) => [skill.id, skill]))
const BY_NAME = new Map(SKILLS.map((skill) => [skill.name, skill]))

export const findSkill = (id: number) => BY_ID.get(id)

/** Skill ids for catalogue names; throws on a typo so a bad fixture fails loudly at seed time. */
export function skillIds(names: readonly string[]): number[] {
  return names.map((name) => {
    const skill = BY_NAME.get(name)
    if (!skill) throw new Error(`[demo] Skill "${name}" is not in the catalogue`)
    return skill.id
  })
}
