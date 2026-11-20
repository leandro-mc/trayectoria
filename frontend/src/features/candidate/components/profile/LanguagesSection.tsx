'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Languages } from 'lucide-react'
import { useAddLanguage, useDeleteLanguage, useLanguages } from '../../hooks/useCandidate'
import { languageSchema, type LanguageFormValues } from '../../schemas/candidate.schemas'
import { AddButton, ProfileSection, RowActions, SectionEmpty } from './ProfileSection'
import { Field } from '@/components/shared/forms/Field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Skeleton } from '@/components/ui/skeleton'
import { LANGUAGE_LEVELS } from '@/config/constants'

export function LanguagesSection() {
  const { data: languages = [], isLoading } = useLanguages()
  const { mutate: addLang,    isPending: adding   } = useAddLanguage()
  const { mutate: deleteLang, isPending: deleting } = useDeleteLanguage()
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { language: '', level: '' },
  })

  function closeForm() {
    reset()
    setShowForm(false)
  }

  function onSubmit(data: LanguageFormValues) {
    addLang({ language: data.language, level: data.level || undefined }, { onSuccess: closeForm })
  }

  return (
    <ProfileSection title="Idiomas" action={!showForm && <AddButton onClick={() => setShowForm(true)} />}>
      <div className="space-y-4 p-6">
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 rounded-xl border border-border bg-muted p-4 sm:flex-row">
            <Field label="Idioma" error={errors.language?.message} className="flex-1">
              {(a11y) => <Input placeholder="Ej: Inglés, Portugués" disabled={adding} {...a11y} {...register('language')} />}
            </Field>
            <Field label="Nivel" className="w-full sm:w-40">
              {(a11y) => (
                <NativeSelect disabled={adding} {...a11y} {...register('level')}>
                  <option value="">Sin especificar</option>
                  {LANGUAGE_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
                </NativeSelect>
              )}
            </Field>
            <div className="flex items-end gap-2">
              <Button type="button" variant="outline" size="lg" onClick={closeForm} disabled={adding}>Cancelar</Button>
              <Button type="submit" size="lg" loading={adding}>Agregar</Button>
            </div>
          </form>
        )}

        {isLoading && <div className="space-y-2"><Skeleton className="h-10 rounded-lg" /><Skeleton className="h-10 rounded-lg" /></div>}
        {!isLoading && languages.length === 0 && !showForm && <SectionEmpty icon={Languages}>Aún no agregaste idiomas</SectionEmpty>}

        {languages.map((lang) => (
          <div key={lang.language} className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-hover">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">{lang.language}</span>
              {lang.level && <Badge>{lang.level}</Badge>}
            </div>
            <RowActions label={lang.language} onDelete={() => deleteLang(lang.language)} deleting={deleting} />
          </div>
        ))}
      </div>
    </ProfileSection>
  )
}
