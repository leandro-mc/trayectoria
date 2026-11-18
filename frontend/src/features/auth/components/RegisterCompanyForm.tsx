'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Building2 } from 'lucide-react'
import Link from 'next/link'
import { registerCompanySchema, type RegisterCompanyFormValues } from '../schemas/auth.schemas'
import { useRegisterCompany } from '../hooks/useAuth'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { FormLabel, FieldError } from '@/components/shared/forms/FormField'

export function RegisterCompanyForm() {
  const [showPassword, setShowPassword]       = useState(false)
  const [showConfirmPassword, setShowConfirm] = useState(false)
  const [apiError, setApiError]               = useState<string | null>(null)

  const { mutate: registerCompany, isPending } = useRegisterCompany()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCompanyFormValues>({
    resolver: zodResolver(registerCompanySchema),
  })

  function onSubmit(data: RegisterCompanyFormValues) {
    setApiError(null)
    registerCompany(
      {
        email:       data.email,
        password:    data.password,
        companyName: data.companyName,
      },
      {
        onError: (err) => setApiError(extractApiError(err)),
      },
    )
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-card">

        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-brand-text" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Registrá tu empresa
          </h1>
          <p className="text-sm text-muted-foreground">
            Publicá ofertas y encontrá el talento que necesitás
          </p>
        </div>

        {/* API error */}
        {apiError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-danger-tint border border-danger-200 dark:border-danger-800 text-sm text-danger-600 dark:text-danger-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Company name */}
          <div>
            <FormLabel htmlFor="companyName">
              Nombre de la empresa
            </FormLabel>
            <Input
              id="companyName"
              type="text"
              autoComplete="organization"
              placeholder="Ej: TechCorp S.A."
              disabled={isPending}
              {...register('companyName')}
            />
            <FieldError error={errors.companyName} />
          </div>

          {/* Email */}
          <div>
            <FormLabel htmlFor="email">
              Email corporativo
            </FormLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="contacto@empresa.com"
              disabled={isPending}
              {...register('email')}
            />
            <FieldError error={errors.email} />
          </div>

          {/* Password */}
          <div>
            <FormLabel htmlFor="password">
              Contraseña
            </FormLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                disabled={isPending}
                {...register('password')} className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError error={errors.password} />
          </div>

          {/* Confirm password */}
          <div>
            <FormLabel htmlFor="confirmPassword">
              Confirmar contraseña
            </FormLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repetí tu contraseña"
                disabled={isPending}
                {...register('confirmPassword')} className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError error={errors.confirmPassword} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isPending && <Spinner />}
            {isPending ? 'Creando cuenta...' : 'Crear cuenta de empresa'}
          </button>

        </form>

        {/* Register type switcher */}
        <div className="mt-5 pt-5 border-t border-border-soft">
          <p className="text-xs text-subtle text-center">
            ¿Buscás trabajo?{' '}
            <Link
              href={ROUTES.registerCandidate}
              className="text-brand-text font-medium hover:underline"
            >
              Registrate como candidato
            </Link>
          </p>
        </div>

      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link
          href={ROUTES.login}
          className="text-brand-text font-medium hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
