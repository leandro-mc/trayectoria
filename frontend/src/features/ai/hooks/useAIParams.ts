'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Selected item of the /ai/* split panels, kept in the URL as ?id= so a reload
 * or a shared link opens the same curriculum or interview.
 */
export function useAIParams() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const selectedId = searchParams.get('id') ? Number(searchParams.get('id')) : null

  const selectItem = useCallback((id: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('id', String(id))
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const clearSelection = useCallback(() => {
    router.replace('?', { scroll: false })
  }, [router])

  return { selectedId, selectItem, clearSelection }
}
