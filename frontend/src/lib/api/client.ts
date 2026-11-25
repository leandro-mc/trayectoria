import axios, { type AxiosInstance } from 'axios'
import { apiUrl, isDemoMode } from '@/config/env'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${apiUrl}/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
  // Demo mode answers from an in-browser mock instead of the network (see docs/demo-mode.md).
  // The mock is loaded on the first request rather than at startup: a request that fires before
  // the chunk arrives simply waits for it, so nothing can slip through to a real server.
  adapter: isDemoMode
    ? async (config) => (await import('@/demo')).handleDemoRequest(config)
    : undefined,
})
