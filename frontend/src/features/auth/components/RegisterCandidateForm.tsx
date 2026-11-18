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
import { Input } from '@/components/ui/input'
import { FormLabel, FieldError } from '@/components/shared/forms/FormField'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

//  Step indicator 

interface StepIndicatorProps {
  current: 1 | 2
}

function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full h-1 bg-border rounded-full overflow-hidden mb-4">
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
                  !isDone && !isActive ? 'bg-border text-muted-foreground' : '',
                ].join(' ')}
              >
                {isDone ? '✓' : step}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive || isDone
                    ? 'text-secondary-foreground'
                    : 'text-muted-foreground'
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <FieldError error={errors.confirmPassword} />
      </div>

      <Button
        size="lg"
        type="submit"
        className="w-full"
      >
        Continuar
      </Button>

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
        <ErrorAlert>
          {apiError}
        </ErrorAlert>
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
        <Button
     variant="outline"
     size="lg"
     type="button"
     onClick={onBack}
     disabled={isPending}>
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>

        <Button
          size="lg"
          loading={isPending}
          type="submit"
          className="flex-1"
        >
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
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
      <Card padding="xl">

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

      </Card>

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
