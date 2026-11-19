import Link from 'next/link'
import { ArrowRight, Building2, UserRound, type LucideIcon } from 'lucide-react'
import { IconTile } from '@/components/shared/brand/IconTile'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/config/routes'

interface RoleCardProps {
  href:        string
  icon:        LucideIcon
  title:       string
  description: string
  cta:         string
}

function RoleCard({ href, icon, title, description, cta }: RoleCardProps) {
  return (
    <Card asChild padding="lg" interactive className="rounded-2xl hover:border-brand-border">
      <Link href={href} className="group flex flex-col">
        <IconTile icon={icon} size="lg" className="mb-4" />
        <h2 className="mb-1.5 text-base font-semibold text-foreground">{title}</h2>
        <p className="mb-5 flex-1 text-sm text-muted-foreground">{description}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text transition-all group-hover:gap-2.5">
          {cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </Card>
  )
}

export function RegisterRoleSelector() {
  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">¿Cómo querés usar TrayectorIA?</h1>
        <p className="text-sm text-muted-foreground">Elegí el tipo de cuenta que mejor se adapta a vos</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RoleCard
          href={ROUTES.registerCandidate}
          icon={UserRound}
          title="Soy candidato"
          description="Buscás trabajo, querés mejorar tu CV con IA o practicar entrevistas."
          cta="Crear cuenta"
        />
        <RoleCard
          href={ROUTES.registerCompany}
          icon={Building2}
          title="Soy empresa"
          description="Publicás ofertas laborales y buscás talento para tu equipo."
          cta="Crear cuenta"
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta? <Link href={ROUTES.login} className="font-medium text-brand-text hover:underline">Iniciá sesión</Link>
      </p>
    </div>
  )
}
