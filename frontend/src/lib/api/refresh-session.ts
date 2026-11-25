import { apiUrl, isDemoMode } from '@/config/env'
import type { AuthResponse } from '@/types/api.types'

/**
 * Silent token refresh for the app bootstrap.
 *
 * It deliberately does NOT go through `apiClient`: its interceptors react to a 401 by
 * refreshing and, if that fails, by redirecting to /login. During bootstrap there is no
 * session yet to protect, so a failure must simply bubble up to `useBootstrapAuth`.
 */
export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  // Demo mode: same refresh logic as POST /auth/refresh, answered locally.
  if (isDemoMode) return (await import('@/demo')).demoRefresh(refreshToken)

  const res = await fetch(`${apiUrl}/v1/auth/refresh`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ refreshToken }),
  })

  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`)
  return (await res.json()) as AuthResponse
}
