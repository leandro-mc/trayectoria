'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

/**
 * Route-level error boundary (Next.js convention). Catches render errors in any
 * page below the root layout and lets the person retry without a full reload.
 */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Hook for a monitoring service (Sentry, etc.) once the project has one.
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <ErrorAlert>No pudimos mostrar esta pantalla. Reintentá; si el problema sigue, recargá la página.</ErrorAlert>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}
