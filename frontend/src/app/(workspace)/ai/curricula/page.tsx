'use client'

import { Suspense } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { AILeftPanel, useAIParams } from '@/features/ai/components/AILeftPanel'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { useCurriculum, useDeleteCurriculum } from '@/features/ai/curricula/hooks/useCurricula'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

//  Right panel — selected curriculum 

function CurriculumPanel({ id, onClear }: { id: number; onClear: () => void }) {
  const { data: cv, isLoading }            = useCurriculum(id)
  const { mutate: remove, isPending: deleting } = useDeleteCurriculum()

  if (isLoading || !cv) {
    return (
      <div className="p-6 space-y-3">
        {[88, 72, 91, 65, 80].map((w, i) => (
          <Skeleton
            key={i} className="h-3 rounded-lg"
            style={{ width: `${w}%` }} />
        ))}
      </div>
    )
  }

  function handleDelete() {
    if (!confirm('¿Eliminar este currículum?')) return
    remove(id, { onSuccess: onClear })
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Panel header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand">Generado con IA</Badge>
          </div>
          <h2 className="text-sm font-bold text-foreground">
            {cv.jobOfferTitle ?? 'Currículum'}
          </h2>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg hover:bg-danger-tint text-muted-foreground hover:text-danger-text disabled:opacity-50 transition-colors"
          title="Eliminar"
        >
          {deleting
            ? <Spinner />
            : <Trash2 className="w-4 h-4" />
          }
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
        <CurriculumDisplay content={cv.content} compact />
      </div>
    </div>
  )
}

//  Empty right panel 

function EmptyRight() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
          <Search className="w-7 h-7 text-faint" />
        </div>
        <p className="text-sm font-medium text-subtle">
          Seleccioná un currículum para verlo
        </p>
      </div>
    </div>
  )
}

//  Page 

function CurriculaPageContent() {
  const { selectedId, selectItem, clearSelection } = useAIParams()

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left panel — hidden on mobile when item selected */}
      <div className={cn(
        'flex-col overflow-hidden border-r border-border',
        selectedId !== null
          ? 'hidden lg:flex lg:w-[38%]'
          : 'flex w-full lg:w-[38%]',
      )}>
        <AILeftPanel
          section="curricula"
          selectedId={selectedId}
          onSelect={selectItem}
        />
      </div>

      {/* Right panel */}
      {selectedId !== null ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile back button */}
          <button
            onClick={clearSelection}
            className="lg:hidden flex items-center gap-2 px-4 py-3 text-xs font-medium text-muted-foreground border-b border-border bg-card shrink-0 hover:text-foreground transition-colors"
          >
            ← Volver al listado
          </button>
          <div className="flex-1 min-h-0 overflow-hidden">
            <CurriculumPanel id={selectedId} onClear={clearSelection} />
          </div>
        </div>
      ) : (
        <EmptyRight />
      )}
    </div>
  )
}

export default function CurriculaPage() {
  return (
    <Suspense>
      <CurriculaPageContent />
    </Suspense>
  )
}
