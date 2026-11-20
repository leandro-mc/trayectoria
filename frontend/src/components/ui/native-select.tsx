import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { fieldBase } from './input'

/** Native <select> with the shared field look (the Radix `select` in this folder is the custom dropdown). */
export function NativeSelect({ className, ...props }: ComponentProps<'select'>) {
  return <select data-slot="native-select" className={cn(fieldBase, 'h-10 px-3', className)} {...props} />
}
