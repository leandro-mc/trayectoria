'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Languages } from 'lucide-react'
import { useLanguages, useAddLanguage, useDeleteLanguage } from '../../hooks/useCandidate'
import { languageSchema, type LanguageFormValues } from '../../schemas/candidate.schemas'
import { LANGUAGE_LEVELS } from '@/config/constants'
import { NativeSelect } from '@/components/ui/native-select'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'


export function LanguagesSection() {
  const { data: languages = [], isLoading } = useLanguages()
  const { mutate: addLang,    isPending: adding   } = useAddLanguage()
  const { mutate: deleteLang, isPending: deleting } = useDeleteLanguage()
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { language: '', level: '' },
  })

  function onSubmit(data: LanguageFormValues) {
    addLang(
      { language: data.language, level: data.level || undefined },
      {
        onSuccess: () => {
          reset()
          setShowForm(false)
        },
      },
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
        <h3 className="text-sm font-semibold text-foreground">Idiomas</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text hover:underline transition-colors"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Add form */}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-muted border border-border">
            <div className="flex-1">
              <Input
                {...register('language')}
                placeholder="Ej: Inglés, Portugués"
                disabled={adding}
              />
              {errors.language && <p className="mt-1 text-xs text-danger-text">{errors.language.message}</p>}
            </div>
            <div className="w-full sm:w-40">
              <NativeSelect {...register('level')} disabled={adding}>
                <option value="">Nivel</option>
                {LANGUAGE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); reset() }}
                disabled={adding}
                className="h-10 px-4 rounded-lg border border-input text-body text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <Button
        size="lg"
        loading={adding}
        type="submit">
                Agregar
              </Button>
            </div>
          </form>
        )}

        {/* List */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-10 rounded-lg bg-muted" />)}
          </div>
        )}

        {!isLoading && languages.length === 0 && !showForm && (
          <div className="flex flex-col items-center py-6 text-center">
            <Languages className="w-8 h-8 text-faint mb-2" />
            <p className="text-sm text-muted-foreground">Aún no agregaste idiomas</p>
          </div>
        )}

        {languages.map((lang) => (
          <div
            key={lang.language}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-hover group transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {lang.language}
              </span>
              {lang.level && (
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                  {lang.level}
                </span>
              )}
            </div>
            <button
              onClick={() => deleteLang(lang.language)}
              disabled={deleting}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-danger-tint text-muted-foreground hover:text-danger-text transition-all disabled:opacity-50"
              aria-label={`Eliminar ${lang.language}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
