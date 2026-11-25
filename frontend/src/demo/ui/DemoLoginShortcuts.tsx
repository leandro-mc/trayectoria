'use client'

import { Button } from '@/components/ui/button'
import { DEMO_PASSWORD, SHORTCUT_EMAILS } from '../fixtures/accounts'

interface Credentials {
  email: string
  password: string
}

interface DemoLoginShortcutsProps {
  /** Signs in through the app's normal login flow (store, cookie and redirect included). */
  onLogin: (credentials: Credentials) => void
  disabled: boolean
}

/** One-click sample accounts for the login page, with the credentials in plain sight. */
export function DemoLoginShortcuts({ onLogin, disabled }: DemoLoginShortcutsProps) {
  return (
    <section aria-labelledby="demo-accounts-title" className="mb-6 rounded-xl border border-brand-border bg-brand-tint p-4">
      <h2 id="demo-accounts-title" className="mb-1 text-sm font-semibold text-foreground">
        Probá la demo con una cuenta de ejemplo
      </h2>
      <p className="mb-3 text-xs text-secondary-foreground">
        Todas las cuentas ficticias usan la contraseña <strong className="font-semibold">{DEMO_PASSWORD}</strong>.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button" variant="outline" size="sm" className="flex-1" disabled={disabled}
          onClick={() => onLogin({ email: SHORTCUT_EMAILS.candidate, password: DEMO_PASSWORD })}
        >
          Entrar como candidata (Sofía)
        </Button>
        <Button
          type="button" variant="outline" size="sm" className="flex-1" disabled={disabled}
          onClick={() => onLogin({ email: SHORTCUT_EMAILS.company, password: DEMO_PASSWORD })}
        >
          Entrar como empresa (Nimbus)
        </Button>
      </div>

      <p className="mt-3 text-xs text-secondary-foreground">
        {SHORTCUT_EMAILS.candidate} · {SHORTCUT_EMAILS.company}
      </p>
    </section>
  )
}
