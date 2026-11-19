'use client'

import type { ComponentProps, ReactNode } from 'react'
import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

/**
 * The one modal of the app. Built on Radix Dialog, so every modal gets
 * role="dialog" + aria-modal, a focus trap, Esc to close, scroll locking and
 * focus restoration for free: none of that exists in hand-rolled overlays.
 *
 *   <Modal open onClose={close} size="sm">
 *     <ModalTitle>…</ModalTitle>
 *     …body…
 *     <ModalClose className="absolute right-4 top-4" />
 *   </Modal>
 *
 * variant="dialog"     centred card (default)
 * variant="sheet"      full-height panel docked to the right
 * variant="responsive" bottom sheet on phones, centred card from `sm` up
 * variant="bottom"     bottom sheet at every width (mobile "more" menu)
 */
const SIZES = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-2xl' } as const

const CONTENT = {
  dialog:
    'left-1/2 top-1/2 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl',
  sheet:
    'inset-y-0 right-0 flex h-full w-full max-w-md flex-col overflow-y-auto',
  responsive:
    'inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-2xl ' +
    'sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85dvh] sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl',
  bottom:
    'inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-2xl pb-safe',
} as const

interface ModalProps {
  open:         boolean
  onClose:      () => void
  /** Set to false while an async action runs, so the dialog cannot be dismissed. */
  dismissible?: boolean
  variant?:     keyof typeof CONTENT
  size?:        keyof typeof SIZES
  /** Accessible name when the body has no visible <ModalTitle>. */
  label?:       string
  className?:   string
  children:     ReactNode
}

export function Modal({
  open, onClose, dismissible = true, variant = 'dialog', size = 'md', label, className, children,
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!next && dismissible) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed z-50 bg-card shadow-modal outline-none',
            CONTENT[variant],
            (variant === 'dialog' || variant === 'responsive') && SIZES[size],
            className,
          )}
        >
          {label && <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function ModalTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={className} {...props} />
}

export function ModalClose({ className, ...props }: Omit<ComponentProps<typeof DialogPrimitive.Close>, 'children'>) {
  return (
    <DialogPrimitive.Close
      aria-label="Cerrar"
      className={cn(
        'shrink-0 rounded-lg p-1.5 text-subtle transition-colors hover:bg-muted disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <X className="size-4" aria-hidden="true" />
    </DialogPrimitive.Close>
  )
}
