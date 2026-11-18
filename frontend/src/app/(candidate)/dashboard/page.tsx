'use client'

import Link from 'next/link'
import { Briefcase, Bookmark, MessageSquare, FileText } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { ROUTES } from '@/config/routes'

// Quick action card
function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  highlight,
}: {
  icon:        React.ComponentType<{ className?: string }>
  title:       string
  description: string
  href:       string
  highlight?:   boolean
}) {
  return (
    <Link
      href={href}
      className={[
        'rounded-xl p-5 border transition-shadow hover:shadow-card-hover',
        highlight
          ? 'border-brand-200 dark:border-brand-800 bg-brand-tint'
          : 'border-border bg-card shadow-card',
      ].join(' ')}
    >
      <div className={[
        'w-9 h-9 rounded-lg flex items-center justify-center mb-3',
        highlight
          ? 'bg-primary'
          : 'bg-muted',
      ].join(' ')}>
        <Icon className={['w-5 h-5', highlight ? 'text-white' : 'text-muted-foreground'].join(' ')} />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Link>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Bienvenido a TrayectorIA"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={FileText}
          title="Generar CV con IA"
          description="Creá un currículum personalizado para cada oferta"
          href={ROUTES.curricula}
          highlight
        />
        <QuickAction
          icon={MessageSquare}
          title="Practicar entrevista"
          description="Simulá entrevistas laborales con IA"
          href={ROUTES.interviews}
          highlight
        />
        <QuickAction
          icon={Briefcase}
          title="Mis postulaciones"
          description="Seguí el estado de tus aplicaciones"
          href={ROUTES.applications}
        />
        <QuickAction
          icon={Bookmark}
          title="Ofertas guardadas"
          description="Revisá las ofertas que bookmarkeaste"
          href={ROUTES.saved}
        />
      </div>
    </div>
  )
}

