'use client'

import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import {
  registerCandidateStep1Schema,
  registerCandidateStep2Schema,
  type RegisterCandidateStep1Values,
  type RegisterCandidateStep2Values,
} from '../schemas/auth.schemas'
import { useRegisterCandidate } from '../hooks/useAuth'
import { AccountFields } from './AccountFields'
import { AuthHeader, AuthLink, AuthShell } from './AuthShell'
import { RegisterStepIndicator } from './RegisterStepIndicator'
import { Field } from '@/components/shared/forms/Field'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/config/routes'
import { extractApiError } from '@/lib/utils/format'

const TITLES = {
  1: { title: 'Crear tu cuenta',  description: 'Empezá tu carrera con TrayectorIA' },
  2: { title: '¿Cómo te llamás?', description: 'Solo un paso más y listo'          },
} as const

function AccountStep({ onNext }: { onNext: (data: RegisterCandidateStep1Values) => void }) {
  const form = useForm<RegisterCandidateStep1Values>({ resolver: zodResolver(registerCandidateStep1Schema) })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onNext)} noValidate className="space-y-5">
        <AccountFields />
        <Button type="submit" size="lg" className="w-full">Continuar</Button>
      </form>
    </FormProvider>
  )
}

interface NameStepProps {
  onSubmit:  (data: RegisterCandidateStep2Values) => void
  onBack:    () => void
  isPending: boolean
}

function NameStep({ onSubmit, onBack, isPending }: NameStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterCandidateStep2Values>({
    resolver: zodResolver(registerCandidateStep2Schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Nombre" error={errors.firstName?.message}>
        {(a11y) => (
          <Input autoComplete="given-name" placeholder="Tu nombre" autoFocus disabled={isPending} {...a11y} {...register('firstName')} />
        )}
      </Field>

      <Field label="Apellido" error={errors.lastName?.message}>
        {(a11y) => (
          <Input autoComplete="family-name" placeholder="Tu apellido" disabled={isPending} {...a11y} {...register('lastName')} />
        )}
      </Field>

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isPending}>
          <ArrowLeft />
          Atrás
        </Button>
        <Button type="submit" size="lg" loading={isPending} className="flex-1">
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </div>
    </form>
  )
}

export function RegisterCandidateForm() {
  const [step, setStep]           = useState<1 | 2>(1)
  const [account, setAccount]     = useState<RegisterCandidateStep1Values | null>(null)
  const [apiError, setApiError]   = useState<string | null>(null)
  const { mutate: registerCandidate, isPending } = useRegisterCandidate()

  function handleName(name: RegisterCandidateStep2Values) {
    if (!account) return
    setApiError(null)
    registerCandidate(
      { email: account.email, password: account.password, ...name },
      {
        onError: (err) => {
          setApiError(extractApiError(err))
          // The usual failure is an email that already exists, which lives on step 1.
          setStep(1)
        },
      },
    )
  }

  return (
    <AuthShell footer={<>¿Ya tenés cuenta? <AuthLink href={ROUTES.login}>Iniciá sesión</AuthLink></>}>
      <RegisterStepIndicator current={step} />
      <AuthHeader {...TITLES[step]} />

      {/* Shown above whichever step is current; before, it only rendered on step 2, which the error had just left. */}
      {apiError && <ErrorAlert className="mb-5">{apiError}</ErrorAlert>}

      {step === 1 && <AccountStep onNext={(data) => { setAccount(data); setApiError(null); setStep(2) }} />}
      {step === 2 && <NameStep onSubmit={handleName} onBack={() => { setStep(1); setApiError(null) }} isPending={isPending} />}
    </AuthShell>
  )
}
