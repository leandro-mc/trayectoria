'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas'
import { useLogin } from '../hooks/useAuth'
import { GoogleIcon } from '@/components/shared/brand/GoogleIcon'
import { Field } from '@/components/shared/forms/Field'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/config/routes'
import { extractApiError } from '@/lib/utils/format'

export function LoginForm() {
  const [apiError, setApiError] = useState<string | null>(null)
  const { mutate: login, isPending } = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver:      zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(data: LoginFormValues) {
    setApiError(null)
    login(data, { onError: (err) => setApiError(extractApiError(err)) })
  }

  return (
    <div className="w-full max-w-[480px]">
      <Card padding="xl">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-semibold text-foreground">Bienvenido de vuelta</h1>
          <p className="text-sm text-muted-foreground">Ingresá a tu cuenta para continuar</p>
        </div>

        {apiError && <ErrorAlert className="mb-5">{apiError}</ErrorAlert>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Field label="Email" error={errors.email?.message}>
            {(a11y) => (
              <Input
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                disabled={isPending}
                {...a11y}
                {...register('email')}
              />
            )}
          </Field>

          <Field label="Contraseña" error={errors.password?.message}>
            {(a11y) => (
              <PasswordInput
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isPending}
                {...a11y}
                {...register('password')}
              />
            )}
          </Field>

          <Button type="submit" size="lg" loading={isPending} className="w-full">
            {isPending ? 'Ingresando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground">o continuá con</span>
          </div>
        </div>

        {/* Google sign-in is planned; the button is disabled until the backend supports it. */}
        <Button type="button" variant="outline" size="lg" disabled className="w-full" title="Próximamente">
          <GoogleIcon className="size-4" />
          Continuar con Google (próximamente)
        </Button>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tenés cuenta?{' '}
        <Link href={ROUTES.register} className="font-medium text-brand-text hover:underline">Registrate</Link>
      </p>
    </div>
  )
}
