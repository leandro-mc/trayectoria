'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/stores/auth.store'
import { useIsSaved, useSaveOffer, useUnsaveOffer } from '@/features/saved-offers/hooks/useSavedOffers'
import { AuthGateModal } from './AuthGateModal'
import { cn } from '@/lib/utils/cn'

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

  const isSmall = size === 'sm'

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending || isLoading}
        title={isSaved ? 'Quitar de guardados' : 'Guardar oferta'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors disabled:opacity-50',
          isSmall ? 'h-7 px-2 text-xs' : 'h-9 px-3 text-xs',
          isSaved
            ? 'border-brand-300 dark:border-brand-700 bg-brand-tint text-brand-text hover:border-danger-300 hover:bg-danger-50 hover:text-danger-500 dark:hover:text-danger-400'
            : 'border-input bg-card text-muted-foreground hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-text',
        )}
      >
        {isPending ? (
          <Spinner className={isSmall ? 'size-3' : 'size-3.5'} />
        ) : isSaved ? (
          <BookmarkCheck className={cn(isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
        ) : (
          <Bookmark className={cn(isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
        )}
        {showLabel && (
          <span>{isSaved ? 'Guardada' : 'Guardar'}</span>
        )}
      </button>

      {showGate && (
        <AuthGateModal
          action="guardar esta oferta"
          onClose={() => setShowGate(false)}
        />
      )}
    </>
  )
}
