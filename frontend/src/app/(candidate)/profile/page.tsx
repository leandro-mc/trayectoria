import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { ProfileHeader } from '@/features/candidate/components/profile/ProfileHeader'
import { ProfileForm } from '@/features/candidate/components/profile/ProfileForm'
import { WorkExperienceSection } from '@/features/candidate/components/profile/WorkExperienceSection'
import { EducationSection } from '@/features/candidate/components/profile/EducationSection'
import { SkillsSection } from '@/features/candidate/components/profile/SkillsSection'
import { LanguagesSection } from '@/features/candidate/components/profile/LanguagesSection'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Mi Perfil' }

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        description="Completá tu perfil para mejorar tus chances de ser encontrado"
      />

      {/* Avatar + name header */}
      <ProfileHeader />

      {/* Basic info form */}
      <Card padding="lg" className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-5">
          Información personal
        </h3>
        <ProfileForm />
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        <WorkExperienceSection />
        <EducationSection />
        <SkillsSection />
        <LanguagesSection />
      </div>
    </div>
  )
}
