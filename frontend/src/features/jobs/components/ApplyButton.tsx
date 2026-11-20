'use client'

import { useState } from 'react'
import { Check, CheckCircle2, FileText, Send } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useApply, useHasApplied } from '@/features/applications/hooks/useApplications'
import { useCurricula } from '@/features/ai/curricula/hooks/useCurricula'
import { AuthGateModal } from './AuthGateModal'
import { Field } from '@/components/shared/forms/Field'
import { NativeSelect } from '@/components/ui/native-select'
import { Modal, ModalClose } from '@/components/shared/overlays/Modal'
import { Button } from '@/components/ui/button'

interface ApplyButtonProps {
  jobOfferId:  number
  jobTitle:    string
  companyName: string | null
  offerStatus: string
}

export function ApplyButton({
  jobOfferId,
  jobTitle,
  companyName,
  offerStatus,
}: ApplyButtonProps) {
  const [showGate,     setShowGate]     = useState(false)
  const [showModal,    setShowModal]    = useState(false)
  const [applied,      setApplied]      = useState(false)
  const [selectedCvId, setSelectedCvId] = useState<number | ''>('')

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isCandidate     = useAuthStore((s) => s.user?.role === 'CANDIDATE')

  // Only active for candidates — query is disabled for company/public
  const { hasApplied }         = useHasApplied(isCandidate ? jobOfferId : null)
  const { mutate: apply, isPending } = useApply()
  const { data: curricula = [] }     = useCurricula()

  const matchingCurricula = curricula.filter((cv) => cv.jobOfferId === jobOfferId)

  const isClosed = offerStatus === 'CLOSED'
  const isDisabled = isClosed || hasApplied

  function handleClick() {
    if (!isAuthenticated || !isCandidate) { setShowGate(true); return }
    if (isDisabled) return
    setSelectedCvId(matchingCurricula[0]?.id ?? '')
    setApplied(false)
    setShowModal(true)
  }

  function handleConfirm() {
    apply(
      {
        jobOfferId,
        data: selectedCvId ? { curriculumId: Number(selectedCvId) } : undefined,
      },
      {
        onSuccess: () => {
          setApplied(true)
          setTimeout(() => setShowModal(false), 1500)
        },
      },
    )
  }

  function handleClose() {
    if (isPending) return
    setShowModal(false)
  }

  const buttonLabel = isClosed ? 'Cerrada' : hasApplied ? 'Ya postulado' : 'Postularme'

  return (
    <>
      <Button
        variant={isDisabled ? 'secondary' : 'default'}
        onClick={handleClick}
        disabled={isDisabled}
        title={hasApplied ? 'Ya te postulaste a esta oferta' : undefined}
        className="text-xs font-semibold"
      >
        {hasApplied ? <Check /> : !isDisabled && <Send />}
        {buttonLabel}
      </Button>

      {/* Auth gate */}
      {showGate && (
        <AuthGateModal
          action="postularte a esta oferta"
          onClose={() => setShowGate(false)}
        />
      )}

      {/* Confirm modal */}
      <Modal open={showModal} onClose={handleClose} dismissible={!isPending} size="sm" label="Postularme a esta oferta" className="p-6">
            <ModalClose disabled={isPending} className="absolute right-4 top-4" />

            {applied ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-success-text mx-auto mb-3" />
                <p className="text-base font-bold text-foreground">
                  ¡Postulación enviada!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCvId
                    ? 'Se adjuntó tu currículum personalizado'
                    : 'La empresa recibirá tu perfil completo'
                  }
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-foreground mb-1">
                  Confirmar postulación
                </h3>
                <p className="text-sm text-body">{jobTitle}</p>
                {companyName && (
                  <p className="text-xs text-muted-foreground mt-0.5 mb-4">{companyName}</p>
                )}

                {matchingCurricula.length > 0 ? (
                  <Field
                    className="mt-4 mb-5"
                    label={<span className="flex items-center gap-1.5 text-xs font-semibold"><FileText className="size-3.5 text-brand-text" aria-hidden="true" />Adjuntar currículum con IA</span>}
                  >
                    {(a11y) => (
                      <NativeSelect
                        value={selectedCvId}
                        onChange={(e) => setSelectedCvId(e.target.value ? Number(e.target.value) : '')}
                        className="h-9 text-xs"
                        {...a11y}
                      >
                        <option value="">Solo mi perfil (sin CV adjunto)</option>
                        {matchingCurricula.map((cv) => (
                          <option key={cv.id} value={cv.id}>
                            CV para esta oferta — {new Date(cv.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                          </option>
                        ))}
                      </NativeSelect>
                    )}
                  </Field>
                ) : (
                  <div className="mt-4 mb-5 p-3 rounded-xl bg-muted border border-border">
                    <p className="text-xs text-muted-foreground">
                      Se enviará tu perfil completo. Podés generar un{' '}
                      <span className="text-brand-text font-medium">CV personalizado</span>{' '}
                      para esta oferta desde el panel de la oferta.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleClose}
                    disabled={isPending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="lg"
                    loading={isPending}
                    onClick={handleConfirm}
                    className="flex-1"
                  >
                    {isPending ? 'Enviando...' : 'Confirmar'}
                  </Button>
                </div>
              </>
            )}
          </Modal>
    </>
  )
}
