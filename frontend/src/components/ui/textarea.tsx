import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { fieldBase } from './input'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn(fieldBase, 'px-3 py-2.5', className)} {...props} />
}
