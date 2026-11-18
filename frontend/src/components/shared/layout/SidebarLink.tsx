import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarLinkProps {
  href:      string
  icon:      LucideIcon
  label:     string
  collapsed: boolean
  isActive:  boolean
}

export function SidebarLink({ href, icon: Icon, label, collapsed, isActive }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      // When collapsed the text is hidden, so the label has to live on the link itself.
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-brand-tint text-brand-text'
          : 'text-body hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}
