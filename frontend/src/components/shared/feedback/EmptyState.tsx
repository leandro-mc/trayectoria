'use client'

import NextLink from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon:        LucideIcon
  title:       string
  description: string
  action?:     {
    label:   string
    href?:   string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center px-4',
        className,
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-subtle" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {action && (
        action.href
          ? (
            <Button asChild>
              <NextLink href={action.href}>
                {action.label}
              </NextLink>
            </Button>
          ) : (
            <Button
       onClick={action.onClick}>
              {action.label}
            </Button>
          )
      )}
    </div>
  )
}
