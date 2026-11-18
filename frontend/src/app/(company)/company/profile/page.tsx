import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { CompanyProfileForm } from '@/features/company/components/CompanyProfileForm'

export const metadata: Metadata = { title: 'Perfil de empresa' }

export default function CompanyProfilePage() {
  return (
    <div>
      <PageHeader
        title="Perfil de empresa"
        description="Esta información aparece en todas tus ofertas de trabajo"
      />
      <div className="bg-card border border-border rounded-xl shadow-card p-6">
        <CompanyProfileForm />
      </div>
    </div>
  )
}
