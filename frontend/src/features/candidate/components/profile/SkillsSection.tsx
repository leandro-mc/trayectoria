'use client'

import { useAddSkills, useCandidateSkills, useDeleteSkill } from '../../hooks/useCandidate'
import { ProfileSection } from './ProfileSection'
import { Skeleton } from '@/components/ui/skeleton'
import { SkillPicker } from '@/features/skills/components/SkillPicker'

// Distinct widths make the placeholder read as a row of chips rather than a block.
const CHIP_WIDTHS = ['w-20', 'w-16', 'w-24', 'w-[70px]', 'w-[90px]']

export function SkillsSection() {
  const { data: skills = [], isLoading } = useCandidateSkills()
  const { mutate: addSkills }   = useAddSkills()
  const { mutate: deleteSkill } = useDeleteSkill()

  return (
    <ProfileSection title="Skills" description="Buscá y agregá tus habilidades técnicas y blandas">
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {CHIP_WIDTHS.map((w) => <Skeleton key={w} className={`h-7 rounded-lg ${w}`} />)}
          </div>
        ) : (
          <SkillPicker selected={skills} onAdd={(skill) => addSkills({ skillIds: [skill.id] })} onRemove={deleteSkill} />
        )}
      </div>
    </ProfileSection>
  )
}
