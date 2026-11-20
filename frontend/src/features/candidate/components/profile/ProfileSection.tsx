import type { ReactNode } from 'react'
import { Pencil, Plus, Trash2, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ProfileSectionProps {
  title:        string
  description?: string
  /** Header slot, usually <AddButton>. */
  action?:      ReactNode
  children:     ReactNode
}

/** Card with a titled header; the four profile sections (skills, education, experience, languages) share it. */
export function ProfileSection({ title, description, action, children }: ProfileSectionProps) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}

export function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="link" size="sm" onClick={onClick}>
      <Plus />
      Agregar
    </Button>
  )
}

export function SectionEmpty({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <Icon className="mb-2 size-8 text-faint" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

interface RowActionsProps {
  /** What the row is, so the buttons read "Editar Universidad X" to a screen reader. */
  label:     string
  onEdit?:   () => void
  onDelete:  () => void
  deleting?: boolean
}

/**
 * Edit / delete icon buttons for a list row. On wide screens they appear on hover or
 * keyboard focus; on touch there is no hover, so they stay visible.
 */
export function RowActions({ label, onEdit, onDelete, deleting }: RowActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 transition-opacity lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100">
      {onEdit && (
        <Button type="button" variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Editar ${label}`} className="text-muted-foreground hover:text-foreground">
          <Pencil />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        disabled={deleting}
        aria-label={`Eliminar ${label}`}
        className="text-muted-foreground hover:bg-danger-tint hover:text-danger-text"
      >
        <Trash2 />
      </Button>
    </div>
  )
}
