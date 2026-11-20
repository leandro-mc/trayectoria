'use client'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useCompanyProfile, useUpdateCompanyProfile, useUploadLogo } from '../hooks/useCompany'
import { companyProfileSchema, type CompanyProfileFormValues } from '../schemas/company.schemas'
import { AvatarUpload } from '@/components/shared/data/AvatarUpload'
import { FormSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { TextareaField, TextField } from '@/components/shared/forms/TextField'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { extractApiError } from '@/lib/utils/format'

// The API stores "no value" as null, the form as ''.
const toForm = (v: string | null | undefined) => v ?? ''
const toApi  = (v: string | undefined) => v || null

export function CompanyProfileForm() {
  const { data: profile, isLoading } = useCompanyProfile()
  const { mutate: update, isPending, error } = useUpdateCompanyProfile()
  const { mutate: uploadLogo, isPending: uploading } = useUploadLogo()

  const form = useForm<CompanyProfileFormValues>({ resolver: zodResolver(companyProfileSchema) })
  const { reset, handleSubmit, formState: { isDirty } } = form

  useEffect(() => {
    if (!profile) return
    reset({
      companyName: toForm(profile.companyName),
      industry:    toForm(profile.industry),
      about:       toForm(profile.about),
      website:     toForm(profile.website),
      location:    toForm(profile.location),
    })
  }, [profile, reset])

  function onSubmit(d: CompanyProfileFormValues) {
    update({
      companyName: toApi(d.companyName), industry: toApi(d.industry), about: toApi(d.about),
      website: toApi(d.website), location: toApi(d.location),
    })
  }

  if (isLoading) return <FormSkeleton />

  const displayName = profile?.companyName ?? profile?.email ?? ''

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="flex items-center gap-5 rounded-xl border border-border bg-muted p-5">
          <AvatarUpload name={displayName} imageUrl={profile?.logoUrl} shape="rounded" uploading={uploading} label="Cambiar logo" onSelect={uploadLogo} />
          <div>
            <p className="text-base font-bold text-foreground">{displayName || 'Tu empresa'}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        {error && <ErrorAlert>{extractApiError(error)}</ErrorAlert>}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField<CompanyProfileFormValues> name="companyName" label="Nombre de la empresa" placeholder="Nombre de tu empresa" disabled={isPending} />
          <TextField<CompanyProfileFormValues> name="industry" label="Industria" placeholder="Ej: Tecnología, Finanzas, Salud" disabled={isPending} />
          <TextField<CompanyProfileFormValues> name="website" label="Sitio web" placeholder="https://tuempresa.com" disabled={isPending} />
          <TextField<CompanyProfileFormValues> name="location" label="Ubicación" placeholder="San José, Costa Rica" disabled={isPending} />
        </div>

        <TextareaField<CompanyProfileFormValues>
          name="about"
          label="Sobre la empresa"
          rows={4}
          placeholder="Describí brevemente tu empresa, cultura, misión..."
          disabled={isPending}
        />

        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={isPending} disabled={!isDirty}>
            <Save />
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
