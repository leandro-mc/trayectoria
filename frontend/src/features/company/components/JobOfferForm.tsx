'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, MessageSquare } from 'lucide-react'
import { jobOfferSchema, type JobOfferFormValues } from '../schemas/job-offer.schemas'
import { useCreateJobOffer, useUpdateJobOffer } from '@/features/jobs/hooks/useJobOffers'
import { SkillPicker } from '@/features/skills/components/SkillPicker'
import { useSkillsCatalog } from '@/features/skills/hooks/useSkillsCatalog'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'
import type { JobOfferResponse } from '@/features/jobs/types/jobs.types'
import type { SkillResponse } from '@/types/api.types'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

//  Reusable field wrapper 

function Field({
  label, hint, error, required, children,
}: {
  label:    string
  hint?:    string
  error?:   string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-foreground mb-1.5">
        {label}
        {required && <span className="text-danger-text ml-0.5">*</span>}
      </label>
      {children}
      {hint  && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-danger-text">{error}</p>}
    </div>
  )
}


//  Section wrapper 

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card padding="lg" className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground pb-3 border-b border-border-soft">
        {title}
      </h3>
      {children}
    </Card>
  )
}

//  Props 

interface JobOfferFormProps {
  // Undefined = create mode, defined = edit mode
  initial?: JobOfferResponse
  // interviewInstructions is not included in JobOfferResponse (private field),
  // so it must be fetched separately and passed here in edit mode.
  initialInstructions?: string | null
}

//  Component 

export function JobOfferForm({ initial, initialInstructions }: JobOfferFormProps) {
  const router  = useRouter()
  const isEdit  = !!initial

  const { mutate: create, isPending: creating, error: createError } = useCreateJobOffer()
  const { mutate: update, isPending: updating, error: updateError } = useUpdateJobOffer()
  const isPending = creating || updating
  const apiError  = createError ?? updateError

  // Needed to resolve skill objects from initial skillIds for the SkillPicker
  const { data: catalog = [] } = useSkillsCatalog()

  const {
    register, handleSubmit, watch, reset, setValue,
    formState: { errors },
  } = useForm<JobOfferFormValues>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      title:                 '',
      description:           '',
      responsibilities:      '',
      requirements:          '',
      benefits:              '',
      workMode:              undefined,
      jobType:               undefined,
      location:              '',
      requiresInterview:     false,
      interviewInstructions: '',
      expiresAt:             '',
      skillIds:              [],
    },
  })

  
  
  // Populate form in edit mode
  useEffect(() => {
    if (!initial) return
    reset({
      title:                 initial.title,
      description:           initial.description           ?? '',
      responsibilities:      initial.responsibilities      ?? '',
      requirements:          initial.requirements          ?? '',
      benefits:              initial.benefits              ?? '',
      workMode:              initial.workMode              ?? undefined,
      jobType:               initial.jobType               ?? undefined,
      location:              initial.location              ?? '',
      requiresInterview:     initial.requiresInterview,
      interviewInstructions: '',
      expiresAt:             initial.expiresAt
        ? initial.expiresAt.split('T')[0]   // ISO -> YYYY-MM-DD for date input
        : '',
      skillIds:              initial.skills.map((s) => s.id),
    })    
  }, [initial, reset])

  // Populate interviewInstructions once it arrives from the separate endpoint.
  // Using setValue instead of reset so it doesn't overwrite other fields.
  useEffect(() => {
    if (initialInstructions !== undefined) {
      setValue('interviewInstructions', initialInstructions ?? '')
    }
  }, [initialInstructions, setValue])

  const skillIds        = watch('skillIds')
  const requiresInterview = watch('requiresInterview')

  // Resolve full SkillResponse objects from IDs for the SkillPicker
  const selectedSkills: SkillResponse[] = catalog.filter((s) => skillIds.includes(s.id))

  function handleAddSkill(skill: SkillResponse) {
    if (!skillIds.includes(skill.id)) {
      setValue('skillIds', [...skillIds, skill.id], { shouldDirty: true })
    }
  }

  function handleRemoveSkill(skillId: number) {
    setValue('skillIds', skillIds.filter((id) => id !== skillId), { shouldDirty: true })
  }

  function onSubmit(data: JobOfferFormValues) {
    const payload = {
      title:                 data.title,
      description:           data.description           || undefined,
      responsibilities:      data.responsibilities      || undefined,
      requirements:          data.requirements          || undefined,
      benefits:              data.benefits              || undefined,
      workMode:              data.workMode,
      jobType:               data.jobType,
      location:              data.location              || undefined,
      requiresInterview:     data.requiresInterview,
      interviewInstructions: data.interviewInstructions || undefined,
      expiresAt:             data.expiresAt
        ? new Date(data.expiresAt).toISOString()
        : undefined,
      skillIds: data.skillIds,
    }

    if (isEdit) {
      update(
        { id: initial.id, data: payload },
        { onSuccess: () => router.push(ROUTES.offers) },
      )
    } else {
      create(
        payload,
        { onSuccess: () => router.push(ROUTES.offers) },
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/*  API error  */}
      {apiError && (
        <ErrorAlert>
          {extractApiError(apiError)}
        </ErrorAlert>
      )}

      {/*  Basic info  */}
      <Section title="Información básica">
        <Field label="Título del puesto" required error={errors.title?.message}>
          <Input
            {...register('title')}
            placeholder="Ej: Desarrollador Backend Senior"
            disabled={isPending}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Modalidad" error={errors.workMode?.message}>
            <NativeSelect {...register('workMode')} disabled={isPending}>
              <option value="">Sin especificar</option>
              <option value="REMOTE">Remoto</option>
              <option value="HYBRID">Híbrido</option>
              <option value="ON_SITE">Presencial</option>
            </NativeSelect>
          </Field>
          <Field label="Tipo de jornada" error={errors.jobType?.message}>
            <NativeSelect {...register('jobType')} disabled={isPending}>
              <option value="">Sin especificar</option>
              <option value="FULL_TIME">Tiempo completo</option>
              <option value="PART_TIME">Medio tiempo</option>
              <option value="INTERNSHIP">Pasantía</option>
            </NativeSelect>
          </Field>
          <Field label="Ubicación" error={errors.location?.message}>
            <Input
              {...register('location')}
              placeholder="San José, Costa Rica"
              disabled={isPending}
            />
          </Field>
        </div>

        <Field label="Fecha de cierre" hint="Dejar vacío si no tiene fecha límite">
          <Input
            type="date"
            {...register('expiresAt')}
            disabled={isPending}
          />
        </Field>
      </Section>

      {/*  Content sections  */}
      <Section title="Contenido de la oferta">
        <Field label="Descripción">
          <Textarea
            {...register('description')}
            rows={4}
            placeholder="Descripción general del puesto y la empresa..."
            disabled={isPending}
          />
        </Field>
        <Field label="Responsabilidades">
          <Textarea
            {...register('responsibilities')}
            rows={4}
            placeholder="¿Qué hará la persona en este rol? Podés usar viñetas (- item)"
            disabled={isPending}
          />
        </Field>
        <Field label="Requisitos">
          <Textarea
            {...register('requirements')}
            rows={4}
            placeholder="Experiencia, tecnologías, educación requeridos..."
            disabled={isPending}
          />
        </Field>
        <Field label="Beneficios">
          <Textarea
            {...register('benefits')}
            rows={3}
            placeholder="Salario, seguro, horario flexible, home office..."
            disabled={isPending}
          />
        </Field>
      </Section>

      {/*  Skills  */}
      <Section title="Skills requeridas">
        <SkillPicker
          selected={selectedSkills}
          onAdd={handleAddSkill}
          onRemove={handleRemoveSkill}
          disabled={isPending}
        />
      </Section>

      {/*  Interview  */}
      <Section title="Entrevista con IA">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('requiresInterview')}
            disabled={isPending}
            className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-text focus:ring-ring"
          />
          <div>
            <p className="text-sm font-medium text-secondary-foreground">
              Requerir entrevista simulada con IA
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Los candidatos deberán completar una entrevista antes de postularse
            </p>
          </div>
        </label>

        {requiresInterview && (
          <div className="mt-4 p-4 rounded-xl bg-brand-tint border border-brand-border">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-brand-text" />
              <span className="text-xs font-semibold text-brand-text">
                Instrucciones para la IA
              </span>
            </div>
            <Textarea
              {...register('interviewInstructions')}
              rows={3}
              placeholder="Indicaciones específicas para la entrevista: tono, áreas a evaluar, preguntas obligatorias..."
              disabled={isPending}
            />
          </div>
        )}
      </Section>

      {/*  Submit  */}
      <div className="flex items-center justify-between pt-2">
        <Button
     variant="outline"
     size="lg"
     type="button"
     onClick={() => router.push(ROUTES.offers)}
     disabled={isPending}>
          Cancelar
        </Button>

        <Button
     size="lg"
     loading={isPending}
     type="submit">
          <Save className="w-4 h-4" />
          {isPending
            ? (isEdit ? 'Guardando...' : 'Publicando...')
            : (isEdit ? 'Guardar cambios' : 'Publicar oferta')
          }
        </Button>
      </div>

    </form>
  )
}
