import type { ReactNode } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

/** Centred card every auth page sits in, with an optional "switch page" line underneath. */
export function AuthShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="w-full max-w-[480px]">
      <Card padding="xl">{children}</Card>
      {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
    </div>
  )
}

export function AuthHeader({ title, description, icon }: { title: string; description: string; icon?: ReactNode }) {
  return (
    <div className="mb-8">
      {icon && <div className="mb-4">{icon}</div>}
      <h1 className="mb-1 text-2xl font-semibold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="font-medium text-brand-text hover:underline">{children}</Link>
}
