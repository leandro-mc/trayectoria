import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Inline loading indicator. Sized with `size-*` (defaults to 16px); inherits the text colour. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden="true" className={cn('size-4 animate-spin', className)} />
}
