'use client'

import { Suspense } from 'react'
import { FileText, Trash2 } from 'lucide-react'
import { DetailPlaceholder, MasterDetail } from '@/components/shared/layout/MasterDetail'
import { Button } from '@/components/ui/button'
import { SkeletonLines } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { AILeftPanel } from '@/features/ai/components/AILeftPanel'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { useCurriculum, useDeleteCurriculum } from '@/features/ai/curricula/hooks/useCurricula'
import { useAIParams } from '@/features/ai/hooks/useAIParams'

function CurriculumPanel({ id, onClear }: { id: number; onClear: () => void }) {
  const { data: cv, isLoading } = useCurriculum(id)
  const { mutate: remove, isPending: deleting } = useDeleteCurriculum()

  if (isLoading || !cv) {
    return (
      <SkeletonLines count={5} className="p-6" />
    )
  }

  function handleDelete() {
    if (!confirm('¿Eliminar este currículum?')) return
    remove(id, { onSuccess: onClear })
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-bold text-foreground">{cv.jobOfferTitle ?? 'Currículum'}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Eliminar currículum"
          className="text-muted-foreground hover:bg-danger-tint hover:text-danger-text"
        >
          {deleting ? <Spinner /> : <Trash2 />}
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <CurriculumDisplay content={cv.content} compact />
      </div>
    </div>
  )
}

function CurriculaPageContent() {
  const { selectedId, selectItem, clearSelection } = useAIParams()

  return (
    <MasterDetail
      hasSelection={selectedId !== null}
      onBack={clearSelection}
      list={<AILeftPanel section="curricula" selectedId={selectedId} onSelect={selectItem} />}
      detail={selectedId !== null && <CurriculumPanel id={selectedId} onClear={clearSelection} />}
      placeholder={<DetailPlaceholder icon={FileText}>Seleccioná un currículum para verlo</DetailPlaceholder>}
    />
  )
}

export default function CurriculaPage() {
  return (
    <Suspense>
      <CurriculaPageContent />
    </Suspense>
  )
}
