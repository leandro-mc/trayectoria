// Modal wrapper around CurriculumDisplay — used by the /ai/curricula history page.

'use client'

import { CurriculumDisplay } from './CurriculumDisplay'
import { formatDate } from '@/lib/utils/date'
import type { GeneratedCurriculumResponse } from '../types/curricula.types'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalClose, ModalTitle } from '@/components/shared/overlays/Modal'

interface CurriculumViewerProps {
  curriculum: GeneratedCurriculumResponse
  onClose:    () => void
}

export function CurriculumViewer({ curriculum, onClose }: CurriculumViewerProps) {
  return (
    <Modal open onClose={onClose} variant="responsive" size="lg">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border-soft shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand">Generado con IA</Badge>
            </div>
            <ModalTitle className="text-base font-bold text-foreground">
              {curriculum.jobOfferTitle ?? 'Currículum'}
            </ModalTitle>
            <p className="text-xs text-neutral-400 mt-0.5">
              Generado el {formatDate(curriculum.createdAt)}
            </p>
          </div>
          <ModalClose />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          <CurriculumDisplay content={curriculum.content} />
        </div>
    </Modal>
  )
}
