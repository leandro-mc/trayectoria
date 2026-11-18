'use client'

import Link from 'next/link'
import { ListChecks, Users, Clock, PlusCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { useCompanyStats } from '@/features/company/hooks/useCompany'
import { ROUTES } from '@/config/routes'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function MetricCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon:  React.ComponentType<{ className?: string }>
  label: string
  value:   number | undefined
  href?:   string
  accent?: 'brand' | 'warning' | 'success'
}) {
  const iconBg =
    accent === 'brand'   ? 'bg-brand-tint' :
    accent === 'warning' ? 'bg-warning-tint' :
    accent === 'success' ? 'bg-success-tint' :
    'bg-muted'

  const iconColor =
    accent === 'brand'   ? 'text-brand-text' :
    accent === 'warning' ? 'text-warning-text' :
    accent === 'success' ? 'text-success-text' :
    'text-muted-foreground'

  const card = (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-medium">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {value === undefined ? (
        // Skeleton while loading
        <Skeleton className="h-8 w-16 rounded-lg" />
      ) : (
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {value.toLocaleString()}
        </p>
      )}
    </Card>
  )

  if (href) {
    return <Link href={href}>{card}</Link>
  }
  return card
}

//  Page 

export default function CompanyDashboardPage() {
  const { data: stats } = useCompanyStats()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de tu actividad"
        actions={
          <Button asChild><Link
      href={ROUTES.newOffer}>
            <PlusCircle className="w-4 h-4" />
            Nueva oferta
          </Link></Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={ListChecks}
          label="Ofertas activas"
          value={stats?.activeOffers}
          href={ROUTES.offers}
          accent="success"
        />
        <MetricCard
          icon={Users}
          label="Total postulaciones"
          value={stats?.totalApplications}
          href={ROUTES.offers}
          accent="brand"
        />
        <MetricCard
          icon={Clock}
          label="Sin revisar"
          value={stats?.pendingApplications}
          href={ROUTES.offers}
          accent="warning"
        />
      </div>
    </div>
  )
}
