'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react'
import {
  useWorkExperience,
  useAddExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '../../hooks/useCandidate'
import {
  workExperienceSchema,
  type WorkExperienceFormValues,
} from '../../schemas/candidate.schemas'
import { formatPeriod } from '@/lib/utils/date'
import type { WorkExperienceResponse } from '../../types/candidate.types'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Modal, ModalClose, ModalTitle } from '@/components/shared/overlays/Modal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

//  Form Sheet 

interface ExperienceFormProps {
  initial?:  WorkExperienceResponse
  onClose:   () => void
}


function ExperienceForm({ initial, onClose }: ExperienceFormProps) {
  const { mutate: add,    isPending: adding   } = useAddExperience()
  const { mutate: update, isPending: updating } = useUpdateExperience()
  const isPending = adding || updating

  const { register, handleSubmit, watch, formState: { errors } } = useForm<WorkExperienceFormValues>({
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

  const isCurrent = watch('isCurrent')

  function onSubmit(data: WorkExperienceFormValues) {
    const payload = {
      ...data,
      endDate: data.isCurrent ? undefined : (data.endDate || undefined),
      description: data.description || undefined,
      startDate: data.startDate || undefined,
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
            {initial ? 'Editar experiencia' : 'Agregar experiencia'}
          </ModalTitle>
          <ModalClose />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Empresa *</label>
            <Input {...register('company')} placeholder="Nombre de la empresa" disabled={isPending} />
            {errors.company && <p className="mt-1 text-xs text-danger-text">{errors.company.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Cargo *</label>
            <Input {...register('position')} placeholder="Tu cargo o rol" disabled={isPending} />
            {errors.position && <p className="mt-1 text-xs text-danger-text">{errors.position.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Descripción</label>
            <Textarea {...register('description')} rows={3} placeholder="Describí tus responsabilidades y logros..." disabled={isPending} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Inicio</label>
              <Input type="date" {...register('startDate')} disabled={isPending} />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-1.5">Fin</label>
              <Input type="date" {...register('endDate')} disabled={isPending || isCurrent} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register('isCurrent')} disabled={isPending} className="w-4 h-4 rounded border-neutral-300 text-brand-text focus:ring-ring" />
            <span className="text-sm text-secondary-foreground">Trabajo aquí actualmente</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="lg" type="button" onClick={onClose} disabled={isPending} className="flex-1">
              Cancelar
            </Button>
            <Button size="lg" loading={isPending} type="submit" className="flex-1">
              {initial ? 'Guardar cambios' : 'Agregar'}
            </Button>
          </div>
        </form>
    </Modal>
  )
}

//  Main section 

export function WorkExperienceSection() {
  const { data: experiences = [], isLoading } = useWorkExperience()
  const { mutate: deleteExp, isPending: deleting } = useDeleteExperience()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing]   = useState<WorkExperienceResponse | undefined>()

  function openAdd()                              { setEditing(undefined); setFormOpen(true) }
  function openEdit(exp: WorkExperienceResponse)  { setEditing(exp);       setFormOpen(true) }
  function closeForm()                            { setFormOpen(false);    setEditing(undefined) }

  return (
    <Card>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
        <h3 className="text-sm font-semibold text-foreground">Experiencia laboral</h3>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text hover:underline transition-colors">
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      <div className="divide-y divide-border-soft">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-muted" />)}
          </div>
        )}

        {!isLoading && experiences.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center px-6">
            <Briefcase className="w-8 h-8 text-faint mb-2" />
            <p className="text-sm text-muted-foreground">Aún no agregaste experiencia laboral</p>
          </div>
        )}

        {experiences.map((exp) => (
          <div key={exp.id} className="flex items-start gap-4 px-6 py-4 group">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{exp.position}</p>
              <p className="text-sm text-body">{exp.company}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatPeriod(exp.startDate, exp.isCurrent ? null : exp.endDate, exp.isCurrent)}
              </p>
              {exp.description && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{exp.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deleteExp(exp.id)} disabled={deleting} className="p-1.5 rounded-lg hover:bg-danger-tint text-muted-foreground hover:text-danger-text transition-colors disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && <ExperienceForm initial={editing} onClose={closeForm} />}
    </Card>
  )
}
