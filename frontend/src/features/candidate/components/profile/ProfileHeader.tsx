'use client'

import { MapPin } from 'lucide-react'
import { useCandidateProfile, useUploadAvatar } from '../../hooks/useCandidate'
import { AvatarUpload } from '@/components/shared/data/AvatarUpload'
import { Card } from '@/components/ui/card'

export function ProfileHeader() {
  const { data: profile } = useCandidateProfile()
  const { mutate: upload, isPending } = useUploadAvatar()

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.email || ''

  return (
    <Card padding="lg" className="mb-6 flex items-center gap-5">
      <AvatarUpload name={displayName} imageUrl={profile?.profileImageUrl} uploading={isPending} label="Cambiar foto" onSelect={upload} />

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-bold text-foreground">{displayName || 'Tu nombre'}</h2>
        <p className="truncate text-sm text-muted-foreground">{profile?.email}</p>
        {profile?.location && (
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {profile.location}
          </p>
        )}
      </div>
    </Card>
  )
}
