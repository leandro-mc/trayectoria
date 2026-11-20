'use client'

import { useFormContext } from 'react-hook-form'
import { Field } from '@/components/shared/forms/Field'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'
import { Input } from '@/components/ui/input'

interface AccountValues {
  email:           string
  password:        string
  confirmPassword: string
}

interface AccountFieldsProps {
  emailLabel?:       string
  emailPlaceholder?: string
  disabled?:         boolean
}

/**
 * Email + new password + confirmation, shared by candidate and company sign-up.
 * Reads the form from a surrounding <FormProvider>, so each sign-up form can add
 * its own extra fields to its own values type.
 */
export function AccountFields({ emailLabel = 'Email', emailPlaceholder = 'tu@email.com', disabled }: AccountFieldsProps) {
  const { register, formState: { errors } } = useFormContext<AccountValues>()

  return (
    <>
      <Field label={emailLabel} error={errors.email?.message}>
        {(a11y) => (
          <Input type="email" autoComplete="email" placeholder={emailPlaceholder} disabled={disabled} {...a11y} {...register('email')} />
        )}
      </Field>

      <Field label="Contraseña" error={errors.password?.message}>
        {(a11y) => (
          <PasswordInput autoComplete="new-password" placeholder="Mínimo 8 caracteres" disabled={disabled} {...a11y} {...register('password')} />
        )}
      </Field>

      <Field label="Confirmar contraseña" error={errors.confirmPassword?.message}>
        {(a11y) => (
          <PasswordInput autoComplete="new-password" placeholder="Repetí tu contraseña" disabled={disabled} {...a11y} {...register('confirmPassword')} />
        )}
      </Field>
    </>
  )
}
