'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/stores/auth.store'
import { useIsSaved, useSaveOffer, useUnsaveOffer } from '@/features/saved-offers/hooks/useSavedOffers'
import { AuthGateModal } from './AuthGateModal'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  jobOfferId: number
  size?:      'sm' | 'md'
  showLabel?: boolean
}

export function SaveButton({ jobOfferId, size = 'md', showLabel = false }: SaveButtonProps) {
  const [showGate, setShowGate]   = useState(false)
  const isAuthenticated           = useAuthStore((s) => s.isAuthenticated)

  const { data, isLoading }       = useIsSaved(jobOfferId)
  const { mutate: save,   isPending: saving   } = useSaveOffer()
  const { mutate: unsave, isPending: unsaving } = useUnsaveOffer()

  const isSaved   = data?.saved ?? false
  const isPending = saving || unsaving

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isAuthenticated) { setShowGate(true); return }
    if (isSaved) unsave(jobOfferId)
    else         save(jobOfferId)
  }


  return (
    <>
      <Button
        variant={isSaved ? 'brand' : 'outline'}
        size={size === 'sm' ? 'xs' : 'sm'}
        onClick={handleClick}
        disabled={isPending || isLoading}
        aria-pressed={isSaved}
        aria-label={isSaved ? 'Quitar de guardadas' : 'Guardar oferta'}
        title={isSaved ? 'Quitar de guardadas' : 'Guardar oferta'}
        className={cn(
          'text-xs',
          isSaved
            ? 'hover:border-danger-border hover:bg-danger-tint hover:text-danger-text'
            : 'text-muted-foreground hover:border-brand-border hover:text-brand-text',
        )}
      >
        {isPending ? <Spinner className="size-3" /> : isSaved ? <BookmarkCheck /> : <Bookmark />}
        {showLabel && <span>{isSaved ? 'Guardada' : 'Guardar'}</span>}
      </Button>

      {showGate && (
        <AuthGateModal
          action="guardar esta oferta"
          onClose={() => setShowGate(false)}
        />
      )}
    </>
  )
}
