'use client'

import { LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { IconTile } from '@/components/shared/brand/IconTile'
import { Modal, ModalClose, ModalTitle } from '@/components/shared/overlays/Modal'
import { Button } from '@/components/ui/button'

interface AuthGateModalProps {
  action:  string   // e.g. "postularte" | "guardar esta oferta"
  onClose: () => void
}

export function AuthGateModal({ action, onClose }: AuthGateModalProps) {
  return (
    <Modal open onClose={onClose} size="sm" className="p-6">
        <ModalClose className="absolute right-4 top-4" />

        {/* Icon */}
        <IconTile icon={LogIn} size="lg" />

        <ModalTitle className="mb-2 text-base font-bold text-foreground">
          Necesitás una cuenta
        </ModalTitle>
        <p className="text-sm text-muted-foreground mb-6">
          Para {action} en TrayectorIA, creá tu cuenta gratis o iniciá sesión.
        </p>

        <div className="flex flex-col gap-2">
          <Button asChild size="lg"><Link
      href={ROUTES.register} onClick={onClose}
     >
            <UserPlus className="w-4 h-4" />
            Crear cuenta gratis
          </Link></Button>
          <Button asChild variant="outline" size="lg"><Link
      href={ROUTES.login} onClick={onClose}
     >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </Link></Button>
        </div>
    </Modal>
  )
}
