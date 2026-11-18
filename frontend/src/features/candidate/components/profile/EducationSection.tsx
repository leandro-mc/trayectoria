'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react'
import {
  useEducation,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '../../hooks/useCandidate'
import { educationSchema, type EducationFormValues } from '../../schemas/candidate.schemas'
import { formatPeriod } from '@/lib/utils/date'
import type { EducationResponse } from '../../types/candidate.types'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Modal, ModalClose, ModalTitle } from '@/components/shared/overlays/Modal'


function EducationForm({ initial, onClose }: { initial?: EducationResponse; onClose: () => void }) {
  const { mutate: add,    isPending: adding   } = useAddEducation()
  const { mutate: update, isPending: updating } = useUpdateEducation()
  const isPending = adding || updating

  const { register, handleSubmit, formState: { errors } } = useForm<EducationFormValues>({
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
    if (initial) {
      update({ id: initial.id, data: payload }, { onSuccess: onClose })
    } else {
      add(payload, { onSuccess: onClose })
    }
  }

  return (
    <Modal open onClose={onClose} variant="sheet">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <ModalTitle className="text-base font-semibold text-foreground">
            {initial ? 'Editar educación' : 'Agregar educación'}
          </ModalTitle>
          <ModalClose />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Institución *</label>
            <Input {...register('institution')} placeholder="Universidad o institución" disabled={isPending} />
            {errors.institution && <p className="mt-1 text-xs text-danger-500">{errors.institution.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Título / Grado</label>
            <Input {...register('degree')} placeholder="Ej: Licenciatura, Bachillerato" disabled={isPending} />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Campo de estudio</label>
            <Input {...register('fieldOfStudy')} placeholder="Ej: Ingeniería en Sistemas" disabled={isPending} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Inicio</label>
              <Input type="date" {...register('startDate')} disabled={isPending} />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Fin</label>
              <Input type="date" {...register('endDate')} disabled={isPending} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="flex-1 h-10 rounded-lg border border-input text-body text-sm font-medium hover:bg-hover disabled:opacity-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {isPending && <Spinner />}
              {initial ? 'Guardar cambios' : 'Agregar'}
            </button>
          </div>
        </form>
    </Modal>
  )
}

export function EducationSection() {
  const { data: educations = [], isLoading } = useEducation()
  const { mutate: deleteEdu, isPending: deleting } = useDeleteEducation()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing]   = useState<EducationResponse | undefined>()

  function openAdd()                             { setEditing(undefined); setFormOpen(true) }
  function openEdit(edu: EducationResponse)      { setEditing(edu);       setFormOpen(true) }
  function closeForm()                           { setFormOpen(false);    setEditing(undefined) }

  return (
    <div className="bg-card border border-border rounded-xl shadow-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
        <h3 className="text-sm font-semibold text-foreground">Educación</h3>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>
      <div className="divide-y divide-border-soft">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-muted" />)}
          </div>
        )}
        {!isLoading && educations.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center px-6">
            <GraduationCap className="w-8 h-8 text-faint mb-2" />
            <p className="text-sm text-muted-foreground">Aún no agregaste educación</p>
          </div>
        )}
        {educations.map((edu) => (
          <div key={edu.id} className="flex items-start gap-4 px-6 py-4 group">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{edu.institution}</p>
              {edu.degree && (
                <p className="text-sm text-body">
                  {edu.degree}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}
                </p>
              )}
              <p className="text-xs text-neutral-400 mt-0.5">{formatPeriod(edu.startDate, edu.endDate, false)}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => openEdit(edu)} className="p-1.5 rounded-lg hover:bg-muted text-neutral-400 hover:text-neutral-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deleteEdu(edu.id)} disabled={deleting} className="p-1.5 rounded-lg hover:bg-danger-tint text-neutral-400 hover:text-danger-500 transition-colors disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {formOpen && <EducationForm initial={editing} onClose={closeForm} />}
    </div>
  )
}
