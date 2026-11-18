'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarLinkProps {
  href:        string
  icon:        LucideIcon
  label:       string
  collapsed:   boolean
  // Optional numeric badge (e.g. unread notifications)
  badge?:      number
  // Match sub-routes too (e.g. /ai matches /ai/curricula)
  matchPrefix?: boolean
}

export function SidebarLink({
  href,
  icon: Icon,
  label,
  collapsed,
  badge,
  matchPrefix = false,
}: SidebarLinkProps) {
  const pathname  = usePathname()
  const isActive  = matchPrefix
    ? pathname.startsWith(href)
    : pathname === href

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group',
        isActive
          ? 'bg-brand-tint text-brand-text'
          : 'text-body hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon className={cn(
        'shrink-0 transition-colors',
        isActive ? 'w-5 h-5' : 'w-5 h-5',
      )} />

      {!collapsed && (
        <span className="truncate">{label}</span>
      )}

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          'inline-flex items-center justify-center rounded-full text-xs font-bold bg-primary text-white min-w-[18px] h-[18px] px-1',
          collapsed ? 'absolute -top-1 -right-1' : 'ml-auto',
        )}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}
