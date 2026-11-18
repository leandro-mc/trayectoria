'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  registerCandidateStep1Schema,
  registerCandidateStep2Schema,
  type RegisterCandidateStep1Values,
  type RegisterCandidateStep2Values,
} from '../schemas/auth.schemas'
import { useRegisterCandidate } from '../hooks/useAuth'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { FormLabel, FieldError } from '@/components/shared/forms/FormField'

//  Step indicator 

interface StepIndicatorProps {
  current: 1 | 2
}

function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: current === 1 ? '50%' : '100%' }}
        />
      </div>
      {/* Step labels */}
      <div className="flex justify-between">
        {(['Tu cuenta', 'Tu nombre'] as const).map((label, i) => {
          const step = (i + 1) as 1 | 2
          const isActive = step === current
          const isDone   = step < current
          return (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={[
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  isDone   ? 'bg-primary text-white' : '',
                  isActive ? 'bg-primary text-white' : '',
                  !isDone && !isActive ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400' : '',
                ].join(' ')}
              >
                {isDone ? '✓' : step}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive || isDone
                    ? 'text-secondary-foreground'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

//  Step 1 

interface Step1Props {
  onNext: (data: RegisterCandidateStep1Values) => void
}

function Step1({ onNext }: Step1Props) {
  const [showPassword, setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirm]  = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCandidateStep1Values>({
    resolver: zodResolver(registerCandidateStep1Schema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">

      {/* Email */}
      <div>
        <FormLabel htmlFor="email">
          Email
        </FormLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
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

      <button
        type="submit"
        className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors"
      >
        Continuar
      </button>

    </form>
  )
}

//  Step 2 

interface Step2Props {
  onSubmit:  (data: RegisterCandidateStep2Values) => void
  onBack:    () => void
  isPending: boolean
  apiError:  string | null
}

function Step2({ onSubmit, onBack, isPending, apiError }: Step2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCandidateStep2Values>({
    resolver: zodResolver(registerCandidateStep2Schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-danger-tint border border-danger-200 dark:border-danger-800 text-sm text-danger-600 dark:text-danger-400">
          {apiError}
        </div>
      )}

      {/* First name */}
      <div>
        <FormLabel htmlFor="firstName">
          Nombre
        </FormLabel>
        <Input
          id="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="Tu nombre"
          autoFocus
          disabled={isPending}
          {...register('firstName')}
        />
        <FieldError error={errors.firstName} />
      </div>

      {/* Last name */}
      <div>
        <FormLabel htmlFor="lastName">
          Apellido
        </FormLabel>
        <Input
          id="lastName"
          type="text"
          autoComplete="family-name"
          placeholder="Tu apellido"
          disabled={isPending}
          {...register('lastName')}
        />
        <FieldError error={errors.lastName} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="h-10 px-4 rounded-lg border border-input bg-card hover:bg-hover text-body text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isPending && <Spinner />}
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </div>

    </form>
  )
}

//  Main component 

export function RegisterCandidateForm() {
  const [step, setStep]                 = useState<1 | 2>(1)
  const [step1Data, setStep1Data]       = useState<RegisterCandidateStep1Values | null>(null)
  const [apiError, setApiError]         = useState<string | null>(null)

  const { mutate: register, isPending } = useRegisterCandidate()

  function handleStep1Next(data: RegisterCandidateStep1Values) {
    setStep1Data(data)
    setStep(2)
  }

  function handleStep2Submit(data: RegisterCandidateStep2Values) {
    if (!step1Data) return
    setApiError(null)

    register(
      {
        email:     step1Data.email,
        password:  step1Data.password,
        firstName: data.firstName,
        lastName:  data.lastName,
      },
      {
        onError: (err) => {
          setApiError(extractApiError(err))
          // If it's an email conflict, go back to step 1
          setStep(1)
        },
      },
    )
  }

  const titles = {
    1: { heading: 'Crear tu cuenta',    sub: 'Empezá tu carrera con TrayectorIA' },
    2: { heading: '¿Cómo te llamás?',   sub: 'Solo un paso más y listo'          },
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-card">

        <StepIndicator current={step} />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {titles[step].heading}
          </h1>
          <p className="text-sm text-muted-foreground">
            {titles[step].sub}
          </p>
        </div>

        {step === 1 && (
          <Step1 onNext={handleStep1Next} />
        )}

        {step === 2 && (
          <Step2
            onSubmit={handleStep2Submit}
            onBack={() => { setStep(1); setApiError(null) }}
            isPending={isPending}
            apiError={apiError}
          />
        )}

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
