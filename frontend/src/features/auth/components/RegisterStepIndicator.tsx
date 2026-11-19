import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Tu cuenta', 'Tu nombre'] as const

export function RegisterStepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="mb-8">
      <div aria-hidden="true" className="mb-4 h-1 w-full overflow-hidden rounded-full bg-border">
        <div className={cn('h-full rounded-full bg-primary transition-all duration-500 ease-out', current === 1 ? 'w-1/2' : 'w-full')} />
      </div>

      <ol className="flex justify-between">
        {STEPS.map((label, i) => {
          const step     = i + 1
          const isActive = step === current
          const isDone   = step < current
          return (
            <li key={label} aria-current={isActive ? 'step' : undefined} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isActive || isDone ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground',
                )}
              >
                {isDone ? <Check className="size-3" aria-label="completado" /> : step}
              </span>
              <span className={cn('text-xs font-medium transition-colors', isActive || isDone ? 'text-secondary-foreground' : 'text-muted-foreground')}>
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
