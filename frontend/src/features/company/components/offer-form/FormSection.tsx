import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

/** A titled card that groups related fields of a long form. */
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card padding="lg" className="space-y-5">
      <h3 className="border-b border-border-soft pb-3 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </Card>
  )
}
