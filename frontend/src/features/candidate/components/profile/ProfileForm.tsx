'use client'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useCandidateProfile, useUpdateCandidateProfile } from '../../hooks/useCandidate'
import { profileSchema, type ProfileFormValues } from '../../schemas/candidate.schemas'
import { FormSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { TextareaField, TextField } from '@/components/shared/forms/TextField'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { extractApiError } from '@/lib/utils/format'

type Name = keyof ProfileFormValues

// The API stores "no value" as null, the form as ''.
const toForm = (v: string | null | undefined) => v ?? ''
const toApi  = (v: string | undefined) => v || null

export function ProfileForm() {
  const { data: profile, isLoading } = useCandidateProfile()
  const { mutate: update, isPending, error } = useUpdateCandidateProfile()

  const form = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) })
  const { reset, handleSubmit, formState: { isDirty } } = form

  useEffect(() => {
    if (!profile) return
    reset({
      firstName:    toForm(profile.firstName),
      lastName:     toForm(profile.lastName),
      phone:        toForm(profile.phone),
      location:     toForm(profile.location),
      bio:          toForm(profile.bio),
      linkedinUrl:  toForm(profile.linkedinUrl),
      githubUrl:    toForm(profile.githubUrl),
      portfolioUrl: toForm(profile.portfolioUrl),
      birthdate:    toForm(profile.birthdate),
    })
  }, [profile, reset])

  function onSubmit(d: ProfileFormValues) {
    update({
      firstName: toApi(d.firstName), lastName: toApi(d.lastName), phone: toApi(d.phone),
      location: toApi(d.location), bio: toApi(d.bio), linkedinUrl: toApi(d.linkedinUrl),
      githubUrl: toApi(d.githubUrl), portfolioUrl: toApi(d.portfolioUrl), birthdate: toApi(d.birthdate),
    })
  }

  if (isLoading) return <FormSkeleton />

  const f = (name: Name) => ({ name, disabled: isPending })

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {error && <ErrorAlert>{extractApiError(error)}</ErrorAlert>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField<ProfileFormValues> {...f('firstName')} label="Nombre" placeholder="Tu nombre" />
          <TextField<ProfileFormValues> {...f('lastName')} label="Apellido" placeholder="Tu apellido" />
          <TextField<ProfileFormValues> {...f('phone')} label="Teléfono" placeholder="+506 8888-8888" />
          <TextField<ProfileFormValues> {...f('location')} label="Ubicación" placeholder="San José, Costa Rica" />
        </div>

        <TextField<ProfileFormValues> {...f('birthdate')} type="date" label="Fecha de nacimiento" />
        <TextareaField<ProfileFormValues>
          {...f('bio')}
          label="Biografía"
          rows={3}
          placeholder="Contá brevemente sobre vos, tu experiencia y objetivos profesionales..."
        />

        <fieldset className="space-y-4 border-t border-border-soft pt-4">
          <legend className="mb-4 text-xs font-semibold text-muted-foreground">Links</legend>
          <TextField<ProfileFormValues> {...f('linkedinUrl')} label="LinkedIn" placeholder="https://linkedin.com/in/tu-perfil" />
          <TextField<ProfileFormValues> {...f('githubUrl')} label="GitHub" placeholder="https://github.com/tu-usuario" />
          <TextField<ProfileFormValues> {...f('portfolioUrl')} label="Portfolio" placeholder="https://tu-portfolio.com" />
        </fieldset>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" loading={isPending} disabled={!isDirty}>
            <Save />
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
