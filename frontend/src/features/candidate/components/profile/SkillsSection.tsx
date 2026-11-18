'use client'

import { useCandidateSkills, useAddSkills, useDeleteSkill } from '../../hooks/useCandidate'
import { SkillPicker } from '@/features/skills/components/SkillPicker'
import type { SkillResponse } from '../../types/candidate.types'

export function SkillsSection() {
  const { data: skills = [], isLoading } = useCandidateSkills()
  const { mutate: addSkills   } = useAddSkills()
  const { mutate: deleteSkill } = useDeleteSkill()

  function handleAdd(skill: SkillResponse) {
    addSkills({ skillIds: [skill.id] })
  }

  function handleRemove(skillId: number) {
    deleteSkill(skillId)
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-card">
      <div className="px-6 py-4 border-b border-border-soft">
        <h3 className="text-sm font-semibold text-foreground">Skills</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Buscá y agregá tus habilidades técnicas y blandas
        </p>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {[80, 60, 100, 70, 90].map((w) => (
              <div
                key={w}
                className="h-7 rounded-lg bg-muted"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
        ) : (
          <SkillPicker
            selected={skills}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        )}
      </div>
    </div>
  )
}
