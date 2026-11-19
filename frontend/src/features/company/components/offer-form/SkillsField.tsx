'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { SkillPicker } from '@/features/skills/components/SkillPicker'
import { useSkillsCatalog } from '@/features/skills/hooks/useSkillsCatalog'
import type { SkillResponse } from '@/types/api.types'
import type { JobOfferFormValues } from '../../schemas/job-offer.schemas'
import { FormSection } from './FormSection'

/** The form stores skill ids; the picker needs full objects, so they are resolved from the catalog. */
export function SkillsField({ disabled }: { disabled: boolean }) {
  const { control, setValue } = useFormContext<JobOfferFormValues>()
  const skillIds = useWatch({ control, name: 'skillIds' })
  const { data: catalog = [] } = useSkillsCatalog()

  const setIds = (ids: number[]) => setValue('skillIds', ids, { shouldDirty: true })

  return (
    <FormSection title="Skills requeridas">
      <SkillPicker
        selected={catalog.filter((s) => skillIds.includes(s.id))}
        onAdd={(skill: SkillResponse) => { if (!skillIds.includes(skill.id)) setIds([...skillIds, skill.id]) }}
        onRemove={(id) => setIds(skillIds.filter((current) => current !== id))}
        disabled={disabled}
      />
    </FormSection>
  )
}
