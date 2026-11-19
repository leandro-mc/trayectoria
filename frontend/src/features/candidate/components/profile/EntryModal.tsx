'use client'

import type { FormEventHandler, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Modal, ModalClose, ModalTitle } from '@/components/shared/overlays/Modal'

interface EntryModalProps {
  title:       string
  submitLabel: string
  isPending:   boolean
  onClose:     () => void
  onSubmit:    FormEventHandler<HTMLFormElement>
  children:    ReactNode
}

/** Side sheet with a form and Cancelar / submit buttons, for adding or editing one profile entry. */
export function EntryModal({ title, submitLabel, isPending, onClose, onSubmit, children }: EntryModalProps) {
  return (
    <Modal open onClose={onClose} variant="sheet" dismissible={!isPending}>
      <div className="flex items-center justify-between border-b border-border p-5">
        <ModalTitle className="text-base font-semibold text-foreground">{title}</ModalTitle>
        <ModalClose />
      </div>

      <form onSubmit={onSubmit} noValidate className="flex-1 space-y-4 p-5">
        {children}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isPending} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" size="lg" loading={isPending} className="flex-1">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
