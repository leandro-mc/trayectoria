'use client'

import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2 } from 'lucide-react'
import { registerCompanySchema, type RegisterCompanyFormValues } from '../schemas/auth.schemas'
import { useRegisterCompany } from '../hooks/useAuth'
import { AccountFields } from './AccountFields'
import { AuthHeader, AuthLink, AuthShell } from './AuthShell'
import { IconTile } from '@/components/shared/brand/IconTile'
import { Field } from '@/components/shared/forms/Field'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/config/routes'
import { extractApiError } from '@/lib/utils/format'

export function RegisterCompanyForm() {
  const [apiError, setApiError] = useState<string | null>(null)
  const { mutate: registerCompany, isPending } = useRegisterCompany()

  const form = useForm<RegisterCompanyFormValues>({ resolver: zodResolver(registerCompanySchema) })
  const { register, handleSubmit, formState: { errors } } = form

  function onSubmit({ email, password, companyName }: RegisterCompanyFormValues) {
    setApiError(null)
    registerCompany({ email, password, companyName }, { onError: (err) => setApiError(extractApiError(err)) })
  }

  return (
    <AuthShell footer={<>¿Ya tenés cuenta? <AuthLink href={ROUTES.login}>Iniciá sesión</AuthLink></>}>
      <AuthHeader
        icon={<IconTile icon={Building2} size="lg" />}
        title="Registrá tu empresa"
        description="Publicá ofertas y encontrá el talento que necesitás"
      />

      {apiError && <ErrorAlert className="mb-5">{apiError}</ErrorAlert>}

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Field label="Nombre de la empresa" error={errors.companyName?.message}>
            {(a11y) => (
              <Input autoComplete="organization" placeholder="Ej: TechCorp S.A." disabled={isPending} {...a11y} {...register('companyName')} />
            )}
          </Field>

          <AccountFields emailLabel="Email corporativo" emailPlaceholder="contacto@empresa.com" disabled={isPending} />

          <Button type="submit" size="lg" loading={isPending} className="w-full">
            {isPending ? 'Creando cuenta...' : 'Crear cuenta de empresa'}
          </Button>
        </form>
      </FormProvider>

      <div className="mt-5 border-t border-border-soft pt-5 text-center text-xs text-muted-foreground">
        ¿Buscás trabajo? <AuthLink href={ROUTES.registerCandidate}>Registrate como candidato</AuthLink>
      </div>
    </AuthShell>
  )
}
