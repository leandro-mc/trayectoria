'use client'

import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap } from 'lucide-react'
import { useAddEducation, useDeleteEducation, useEducation, useUpdateEducation } from '../../hooks/useCandidate'
import { educationSchema, type EducationFormValues } from '../../schemas/candidate.schemas'
import type { EducationResponse } from '../../types/candidate.types'
import { AddButton, ProfileSection, RowActions, SectionEmpty } from './ProfileSection'
import { EntryModal } from './EntryModal'
import { TextField } from '@/components/shared/forms/TextField'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPeriod } from '@/lib/utils/date'

function EducationForm({ initial, onClose }: { initial?: EducationResponse; onClose: () => void }) {
  const { mutate: add,    isPending: adding   } = useAddEducation()
  const { mutate: update, isPending: updating } = useUpdateEducation()
  const isPending = adding || updating

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution:  initial?.institution  ?? '',
      degree:       initial?.degree       ?? '',
      fieldOfStudy: initial?.fieldOfStudy ?? '',
      startDate:    initial?.startDate    ?? '',
      endDate:      initial?.endDate      ?? '',
    },
  })

  function onSubmit(data: EducationFormValues) {
    const payload = {
      institution:  data.institution,
      degree:       data.degree       || undefined,
      fieldOfStudy: data.fieldOfStudy || undefined,
      startDate:    data.startDate    || undefined,
      endDate:      data.endDate      || undefined,
    }
    if (initial) update({ id: initial.id, data: payload }, { onSuccess: onClose })
    else         add(payload, { onSuccess: onClose })
  }

  return (
    <FormProvider {...form}>
      <EntryModal
        title={initial ? 'Editar educación' : 'Agregar educación'}
        submitLabel={initial ? 'Guardar cambios' : 'Agregar'}
        isPending={isPending}
        onClose={onClose}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TextField<EducationFormValues> name="institution" label="Institución" required placeholder="Universidad o institución" disabled={isPending} />
        <TextField<EducationFormValues> name="degree" label="Título / Grado" placeholder="Ej: Licenciatura, Bachillerato" disabled={isPending} />
        <TextField<EducationFormValues> name="fieldOfStudy" label="Campo de estudio" placeholder="Ej: Ingeniería en Sistemas" disabled={isPending} />
        <div className="grid grid-cols-2 gap-3">
          <TextField<EducationFormValues> name="startDate" type="date" label="Inicio" disabled={isPending} />
          <TextField<EducationFormValues> name="endDate" type="date" label="Fin" disabled={isPending} />
        </div>
      </EntryModal>
    </FormProvider>
  )
}

export function EducationSection() {
  const { data: educations = [], isLoading } = useEducation()
  const { mutate: deleteEdu, isPending: deleting } = useDeleteEducation()
  // `editing` undefined + `formOpen` = adding a new entry.
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing]   = useState<EducationResponse | undefined>()

  const open  = (edu?: EducationResponse) => { setEditing(edu); setFormOpen(true) }
  const close = () => { setFormOpen(false); setEditing(undefined) }

  return (
    <ProfileSection title="Educación" action={<AddButton onClick={() => open()} />}>
      <div className="divide-y divide-border-soft">
        {isLoading && <div className="space-y-3 p-6"><Skeleton className="h-14 rounded-lg" /><Skeleton className="h-14 rounded-lg" /></div>}
        {!isLoading && educations.length === 0 && <SectionEmpty icon={GraduationCap}>Aún no agregaste educación</SectionEmpty>}

        {educations.map((edu) => (
          <div key={edu.id} className="group flex items-start gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{edu.institution}</p>
              {edu.degree && (
                <p className="text-sm text-body">{edu.degree}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}</p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">{formatPeriod(edu.startDate, edu.endDate, false)}</p>
            </div>
            <RowActions label={edu.institution ?? 'esta educación'} onEdit={() => open(edu)} onDelete={() => deleteEdu(edu.id)} deleting={deleting} />
          </div>
        ))}
      </div>

      {formOpen && <EducationForm initial={editing} onClose={close} />}
    </ProfileSection>
  )
}
