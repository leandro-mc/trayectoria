'use client'

import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { Avatar } from './Avatar'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface AvatarUploadProps {
  name:       string
  imageUrl?:  string | null
  shape?:     'circle' | 'rounded'
  uploading:  boolean
  /** Accessible name of the camera button ("Cambiar foto", "Cambiar logo"). */
  label:      string
  onSelect:   (file: File) => void
}

/** Large avatar with a camera button that opens the file picker. */
export function AvatarUpload({ name, imageUrl, shape, uploading, label, onSelect }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative shrink-0">
      <Avatar name={name} imageUrl={imageUrl} size="lg" shape={shape} />

      <Button
        type="button"
        size="icon-sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label={label}
        className="absolute -bottom-1 -right-1 size-7 rounded-full shadow-md"
      >
        {uploading ? <Spinner className="size-3.5" /> : <Camera className="size-3.5" />}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onSelect(file)
          e.target.value = ''   // lets the same file be picked again
        }}
      />
    </div>
  )
}
