import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href:           string
  /** Hide the name and show only the monogram (collapsed sidebar). */
  collapsed?:     boolean
  className?:     string
}

/** TrayectorIA wordmark: a serif "T" monogram plus the name, with "IA" picked out in the brand colour. */
export function Logo({ href, collapsed = false, className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="TrayectorIA"
      className={cn('group flex items-center gap-2.5', className)}
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-md bg-primary font-display text-lg font-semibold leading-none text-primary-foreground transition-colors group-hover:bg-primary/90"
      >
        T
      </span>
      {!collapsed && (
        <span className="truncate font-display text-lg font-semibold tracking-tight text-foreground">
          Trayector<span className="text-brand-text">IA</span>
        </span>
      )}
    </Link>
  )
}
