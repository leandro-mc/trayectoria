'use client'

import { Button } from '@/components/ui/button'
import { resetDemoData } from '../db/store'
import { REPOSITORY_URL } from './constants'

/** Notice shown on every page while the demo is active. Colours come from the warning tokens. */
export function DemoBanner() {
  function reset() {
    resetDemoData()
    // A reload drops every cached query; a stale list would otherwise still show the old data.
    window.location.reload()
  }

  return (
    <div
      role="status"
      className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-warning-tint px-4 py-2 text-xs text-warning-text sm:text-sm"
    >
      <p className="min-w-0 flex-1 basis-72">
        <strong className="font-semibold">Modo demo:</strong> estás viendo datos ficticios porque este
        despliegue no tiene un backend conectado (proyecto de portafolio, sin costos de hosting). Tus
        cambios se guardan solo en tu navegador.
      </p>

      <div className="flex shrink-0 items-center gap-3">
        <Button type="button" variant="outline" size="xs" onClick={reset}>
          Restablecer datos de demo
        </Button>
        <a
          href={REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm font-medium underline underline-offset-2 outline-none hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Ver repositorio
        </a>
      </div>
    </div>
  )
}
