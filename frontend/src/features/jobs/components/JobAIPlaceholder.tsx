// Right panel for AI mode - placeholder until feat/ai is implemented.
// Shows a clear "coming soon" state that will be replaced with real functionality.

'use client'

import { FileText, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useJobsParams, type JobsMode } from '../hooks/useJobsParams'
import { ROUTES } from '@/config/routes'
import { IconTile } from '@/components/shared/brand/IconTile'
import { buttonVariants } from '@/components/ui/button'

const AI_CONFIG: Record<JobsMode, {
  icon:        React.ComponentType<{ className?: string }>
  title:       string
  description: string
  cta:         string
  href:        string
}> = {
  cv: {
    icon:        FileText,
    title:       'CV personalizado con IA',
    description: 'La IA analizará esta oferta y tu perfil para generar un currículum optimizado que resalte tus habilidades más relevantes.',
    cta:         'Ir a Mis Currículums',
    href:        ROUTES.curricula,
  },
  interview: {
    icon:        MessageSquare,
    title:       'Entrevista simulada con IA',
    description: 'Practicá una entrevista real para este puesto. La IA te hará preguntas específicas basadas en la oferta y te dará feedback detallado.',
    cta:         'Ir a Entrevistas IA',
    href:        ROUTES.interviews,
  },
}

export function JobAIPlaceholder() {
  const { mode } = useJobsParams()

  if (mode !== 'cv' && mode !== 'interview') return null

  const config = AI_CONFIG[mode]
  const Icon   = config.icon

  return (
    <div className="flex flex-col items-center justify-center h-full bg-card p-8">
      <IconTile icon={Icon} size="xl" />

      {/* Content */}
      <div className="max-w-sm text-center">

        <h3 className="text-lg font-bold text-foreground mb-3">
          {config.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {config.description}
        </p>

        <Link href={config.href} className={buttonVariants({ size: 'lg' })}>
          {config.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
