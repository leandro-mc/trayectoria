'use client'

import { X, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { IconTile } from '@/components/shared/brand/IconTile'

interface AuthGateModalProps {
  action:  string   // e.g. "postularte" | "guardar esta oferta"
  onClose: () => void
}

export function AuthGateModal({ action, onClose }: AuthGateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl shadow-modal p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-neutral-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <IconTile icon={LogIn} size="lg" />

        <h3 className="text-base font-bold text-foreground mb-2">
          Necesitás una cuenta
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Para {action} en TrayectorIA, creá tu cuenta gratis o iniciá sesión.
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href={ROUTES.register}
            className="flex items-center justify-center gap-2 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors"
            onClick={onClose}
          >
            <UserPlus className="w-4 h-4" />
            Crear cuenta gratis
          </Link>
          <Link
            href={ROUTES.login}
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-input bg-card hover:bg-hover text-secondary-foreground text-sm font-medium transition-colors"
            onClick={onClose}
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
