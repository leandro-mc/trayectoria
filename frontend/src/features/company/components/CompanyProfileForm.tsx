'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Camera } from 'lucide-react'
import { useCompanyProfile, useUpdateCompanyProfile, useUploadLogo } from '../hooks/useCompany'
import { companyProfileSchema, type CompanyProfileFormValues } from '../schemas/company.schemas'
import { extractApiError } from '@/lib/utils/format'
import { getInitials } from '@/lib/utils/format'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'


function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-foreground mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger-text">{error}</p>}
    </div>
  )
}

export function CompanyProfileForm() {
  const { data: profile, isLoading }             = useCompanyProfile()
  const { mutate: update, isPending, error }      = useUpdateCompanyProfile()
  const { mutate: uploadLogo, isPending: uploading } = useUploadLogo()
  const logoInputRef = useRef<HTMLInputElement>(null)

  const {
    register, handleSubmit, reset,
    formState: { errors, isDirty },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        companyName: profile.companyName ?? '',
        industry:    profile.industry    ?? '',
        about:       profile.about       ?? '',
        website:     profile.website     ?? '',
        location:    profile.location    ?? '',
      })
    }
  }, [profile, reset])

  function onSubmit(data: CompanyProfileFormValues) {
    update({
      companyName: data.companyName || null,
      industry:    data.industry    || null,
      about:       data.about       || null,
      website:     data.website     || null,
      location:    data.location    || null,
    })
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadLogo(file)
    e.target.value = ''
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

  const displayName = profile?.companyName ?? profile?.email ?? ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/*  Logo + company name header  */}
      <div className="flex items-center gap-5 p-5 rounded-xl bg-muted border border-border">
        {/* Logo */}
        <div className="relative shrink-0">
          {profile?.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={displayName}
              className="w-20 h-20 rounded-xl object-cover border-2 border-input"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-brand-tint-strong flex items-center justify-center text-2xl font-bold text-brand-text border-2 border-input">
              {getInitials(displayName)}
            </div>
          )}
          <Button
            size="sm"
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 shadow-md"
            aria-label="Cambiar logo"
          >
            {uploading
              ? <Spinner className="size-3.5" />
              : <Camera className="w-3.5 h-3.5" />
            }
          </Button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        <div>
          <p className="text-base font-bold text-foreground">
            {displayName || 'Tu empresa'}
          </p>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </div>
      </div>

      {/*  API error  */}
      {error && (
        <ErrorAlert>
          {extractApiError(error)}
        </ErrorAlert>
      )}

      {/*  Fields  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nombre de la empresa" error={errors.companyName?.message}>
          <Input
            {...register('companyName')}
            placeholder="Nombre de tu empresa"
            disabled={isPending}
          />
        </Field>
        <Field label="Industria" error={errors.industry?.message}>
          <Input
            {...register('industry')}
            placeholder="Ej: Tecnología, Finanzas, Salud"
            disabled={isPending}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Sitio web" error={errors.website?.message}>
          <Input
            {...register('website')}
            placeholder="https://tuempresa.com"
            disabled={isPending}
          />
        </Field>
        <Field label="Ubicación" error={errors.location?.message}>
          <Input
            {...register('location')}
            placeholder="San José, Costa Rica"
            disabled={isPending}
          />
        </Field>
      </div>

      <Field label="Sobre la empresa" error={errors.about?.message}>
        <Textarea
          {...register('about')}
          rows={4}
          placeholder="Describí brevemente tu empresa, cultura, misión..."
          disabled={isPending}
        />
      </Field>

      <div className="flex justify-end">
        <Button
     size="lg"
     loading={isPending}
     type="submit"
     disabled={isPending || !isDirty}>
          <Save className="w-4 h-4" />
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>

    </form>
  )
}
