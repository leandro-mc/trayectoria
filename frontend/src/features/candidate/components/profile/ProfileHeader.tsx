'use client'

import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { useCandidateProfile, useUploadAvatar } from '../../hooks/useCandidate'
import { getInitials } from '@/lib/utils/format'
import { Spinner } from '@/components/ui/spinner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ProfileHeader() {
  const { data: profile } = useCandidateProfile()
  const { mutate: upload, isPending } = useUploadAvatar()
  const inputRef = useRef<HTMLInputElement>(null)

  const displayName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(' ') || profile?.email || ''

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  return (
    <Card padding="lg" className="flex items-center gap-5 mb-6">

      {/* Avatar */}
      <div className="relative shrink-0">
        {profile?.profileImageUrl ? (
          <img
            src={profile.profileImageUrl}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover border-2 border-input"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-brand-tint-strong flex items-center justify-center text-2xl font-bold text-brand-text border-2 border-input">
            {getInitials(displayName)}
          </div>
        )}

        {/* Upload button */}
        <Button
          size="sm"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="absolute -bottom-1 -right-1 w-7 shadow-md"
          aria-label="Cambiar foto"
        >
          {isPending
            ? <Spinner className="size-3.5" />
            : <Camera className="w-3.5 h-3.5" />
          }
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-foreground truncate">
          {displayName || 'Tu nombre'}
        </h2>
        <p className="text-sm text-muted-foreground truncate">
          {profile?.email}
        </p>
        {profile?.location && (
          <p className="text-sm text-muted-foreground mt-0.5">
            📍 {profile.location}
          </p>
        )}
      </div>

    </Card>
  )
}
