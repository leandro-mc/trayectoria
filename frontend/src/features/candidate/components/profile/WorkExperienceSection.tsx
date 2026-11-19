'use client'

import { useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase } from 'lucide-react'
import { useAddExperience, useDeleteExperience, useUpdateExperience, useWorkExperience } from '../../hooks/useCandidate'
import { workExperienceSchema, type WorkExperienceFormValues } from '../../schemas/candidate.schemas'
import type { WorkExperienceResponse } from '../../types/candidate.types'
import { AddButton, ProfileSection, RowActions, SectionEmpty } from './ProfileSection'
import { EntryModal } from './EntryModal'
import { TextareaField, TextField } from '@/components/shared/forms/TextField'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPeriod } from '@/lib/utils/date'

function ExperienceForm({ initial, onClose }: { initial?: WorkExperienceResponse; onClose: () => void }) {
  const { mutate: add,    isPending: adding   } = useAddExperience()
  const { mutate: update, isPending: updating } = useUpdateExperience()
  const isPending = adding || updating

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company:     initial?.company     ?? '',
      position:    initial?.position    ?? '',
      description: initial?.description ?? '',
      startDate:   initial?.startDate   ?? '',
      endDate:     initial?.endDate     ?? '',
      isCurrent:   initial?.isCurrent   ?? false,
    },
  })
  const isCurrent = useWatch({ control: form.control, name: 'isCurrent' })

  function onSubmit(data: WorkExperienceFormValues) {
    const payload = {
      ...data,
      endDate:     data.isCurrent ? undefined : (data.endDate || undefined),
      description: data.description || undefined,
      startDate:   data.startDate || undefined,
    }
    if (initial) update({ id: initial.id, data: payload }, { onSuccess: onClose })
    else         add(payload, { onSuccess: onClose })
  }

  return (
    <FormProvider {...form}>
      <EntryModal
        title={initial ? 'Editar experiencia' : 'Agregar experiencia'}
        submitLabel={initial ? 'Guardar cambios' : 'Agregar'}
        isPending={isPending}
        onClose={onClose}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TextField<WorkExperienceFormValues> name="company" label="Empresa" required placeholder="Nombre de la empresa" disabled={isPending} />
        <TextField<WorkExperienceFormValues> name="position" label="Cargo" required placeholder="Tu cargo o rol" disabled={isPending} />
        <TextareaField<WorkExperienceFormValues> name="description" label="Descripción" rows={3} placeholder="Describí tus responsabilidades y logros..." disabled={isPending} />
        <div className="grid grid-cols-2 gap-3">
          <TextField<WorkExperienceFormValues> name="startDate" type="date" label="Inicio" disabled={isPending} />
          <TextField<WorkExperienceFormValues> name="endDate" type="date" label="Fin" disabled={isPending || isCurrent} />
        </div>
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox disabled={isPending} {...form.register('isCurrent')} />
          <span className="text-sm text-secondary-foreground">Trabajo aquí actualmente</span>
        </label>
      </EntryModal>
    </FormProvider>
  )
}

export function WorkExperienceSection() {
  const { data: experiences = [], isLoading } = useWorkExperience()
  const { mutate: deleteExp, isPending: deleting } = useDeleteExperience()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing]   = useState<WorkExperienceResponse | undefined>()

  const open  = (exp?: WorkExperienceResponse) => { setEditing(exp); setFormOpen(true) }
  const close = () => { setFormOpen(false); setEditing(undefined) }

  return (
    <ProfileSection title="Experiencia laboral" action={<AddButton onClick={() => open()} />}>
      <div className="divide-y divide-border-soft">
        {isLoading && <div className="space-y-3 p-6"><Skeleton className="h-14 rounded-lg" /><Skeleton className="h-14 rounded-lg" /></div>}
        {!isLoading && experiences.length === 0 && <SectionEmpty icon={Briefcase}>Aún no agregaste experiencia laboral</SectionEmpty>}

        {experiences.map((exp) => (
          <div key={exp.id} className="group flex items-start gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{exp.position}</p>
              <p className="text-sm text-body">{exp.company}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatPeriod(exp.startDate, exp.isCurrent ? null : exp.endDate, exp.isCurrent)}
              </p>
              {exp.description && <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{exp.description}</p>}
            </div>
            <RowActions label={`${exp.position} en ${exp.company}`} onEdit={() => open(exp)} onDelete={() => deleteExp(exp.id)} deleting={deleting} />
          </div>
        ))}
      </div>

      {formOpen && <ExperienceForm initial={editing} onClose={close} />}
    </ProfileSection>
  )
}
