'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useCandidateProfile, useUpdateCandidateProfile } from '../../hooks/useCandidate'
import { profileSchema, type ProfileFormValues } from '../../schemas/candidate.schemas'
import { extractApiError } from '@/lib/utils/format'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

//  Reusable field wrapper 

function Field({
  label, error, children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-foreground mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
    </div>
  )
}


//  Component 

export function ProfileForm() {
  const { data: profile, isLoading } = useCandidateProfile()
  const { mutate: update, isPending, error } = useUpdateCandidateProfile()

  const {
    register, handleSubmit, reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName:    profile.firstName    ?? '',
        lastName:     profile.lastName     ?? '',
        phone:        profile.phone        ?? '',
        location:     profile.location     ?? '',
        bio:          profile.bio          ?? '',
        linkedinUrl:  profile.linkedinUrl  ?? '',
        githubUrl:    profile.githubUrl    ?? '',
        portfolioUrl: profile.portfolioUrl ?? '',
        birthdate:    profile.birthdate    ?? '',
      })
    }
  }, [profile, reset])

  function onSubmit(data: ProfileFormValues) {
    update({
      firstName:    data.firstName    || null,
      lastName:     data.lastName     || null,
      phone:        data.phone        || null,
      location:     data.location     || null,
      bio:          data.bio          || null,
      linkedinUrl:  data.linkedinUrl  || null,
      githubUrl:    data.githubUrl    || null,
      portfolioUrl: data.portfolioUrl || null,
      birthdate:    data.birthdate    || null,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* API error */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-danger-tint border border-danger-200 dark:border-danger-800 text-sm text-danger-600 dark:text-danger-400">
          {extractApiError(error)}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre" error={errors.firstName?.message}>
          <Input {...register('firstName')} placeholder="Tu nombre" disabled={isPending} />
        </Field>
        <Field label="Apellido" error={errors.lastName?.message}>
          <Input {...register('lastName')} placeholder="Tu apellido" disabled={isPending} />
        </Field>
      </div>

      {/* Phone + location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Teléfono" error={errors.phone?.message}>
          <Input {...register('phone')} placeholder="+506 8888-8888" disabled={isPending} />
        </Field>
        <Field label="Ubicación" error={errors.location?.message}>
          <Input {...register('location')} placeholder="San José, Costa Rica" disabled={isPending} />
        </Field>
      </div>

      {/* Birthdate */}
      <Field label="Fecha de nacimiento" error={errors.birthdate?.message}>
        <Input type="date" {...register('birthdate')} disabled={isPending} />
      </Field>

      {/* Bio */}
      <Field label="Biografía" error={errors.bio?.message}>
        <Textarea
          {...register('bio')}
          rows={3}
          placeholder="Contá brevemente sobre vos, tu experiencia y objetivos profesionales..."
          disabled={isPending}
        />
      </Field>

      {/* Links */}
      <div className="pt-2 border-t border-border-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Links</p>
        <div className="space-y-4">
          <Field label="LinkedIn" error={errors.linkedinUrl?.message}>
            <Input {...register('linkedinUrl')} placeholder="https://linkedin.com/in/tu-perfil" disabled={isPending} />
          </Field>
          <Field label="GitHub" error={errors.githubUrl?.message}>
            <Input {...register('githubUrl')} placeholder="https://github.com/tu-usuario" disabled={isPending} />
          </Field>
          <Field label="Portfolio" error={errors.portfolioUrl?.message}>
            <Input {...register('portfolioUrl')} placeholder="https://tu-portfolio.com" disabled={isPending} />
          </Field>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {isPending && <Spinner />}
          <Save className="w-4 h-4" />
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

    </form>
  )
}
