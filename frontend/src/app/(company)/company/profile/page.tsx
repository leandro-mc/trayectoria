import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { CompanyProfileForm } from '@/features/company/components/CompanyProfileForm'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Perfil de empresa' }

export default function CompanyProfilePage() {
  return (
    <div>
      <PageHeader
        title="Perfil de empresa"
        description="Esta información aparece en todas tus ofertas de trabajo"
      />
      <Card padding="lg">
        <CompanyProfileForm />
      </Card>
    </div>
  )
}
