import { redirect } from 'next/navigation'
import { ROUTES } from '@/config/routes'

// The product has no marketing landing: the job board is the entry point.
export default function RootPage() {
  redirect(ROUTES.jobs)
}
