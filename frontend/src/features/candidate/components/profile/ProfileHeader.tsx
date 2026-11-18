'use client'

import { useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useCandidateProfile, useUploadAvatar } from '../../hooks/useCandidate'
import { getInitials } from '@/lib/utils/format'

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
    <div className="flex items-center gap-5 p-6 bg-card border border-border rounded-xl shadow-card mb-6">

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
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white flex items-center justify-center shadow-md transition-colors"
          aria-label="Cambiar foto"
        >
          {isPending
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Camera className="w-3.5 h-3.5" />
          }
        </button>

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

    </div>
  )
}
