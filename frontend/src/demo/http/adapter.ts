import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { commit } from '../db/store'
import { badRequest, HttpError, notImplemented } from './errors'
import { dispatch, type HttpMethod, type RouteResult } from './router'

/**
 * Axios adapter that answers every request from the in-memory handlers instead of the
 * network. It runs *under* the interceptors, so token attachment and the 401 -> refresh
 * flow behave exactly as against the real backend.
 */
export async function handleDemoRequest(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const method = (config.method ?? 'get').toUpperCase() as HttpMethod
  const path = new URL(config.url ?? '/', 'http://demo.local').pathname

  await sleep(latencyFor(method, path))

  try {
    const run = dispatch({
      method, path,
      query: (config.params as Record<string, unknown> | undefined) ?? {},
      body: parseBody(config.data),
      bearerToken: bearerToken(config),
    })

    // Loud on purpose: an empty 200 would hide a missing handler behind a blank screen.
    if (!run) {
      console.warn(`[demo] No mock handler for ${method} ${path}`)
      throw notImplemented(`The demo has no mock for ${method} ${path}`)
    }

    const result = await run()
    if (method !== 'GET') commit()
    return settle(config, result)
  } catch (error) {
    if (error instanceof HttpError) return settle(config, { status: error.status, data: error.toBody() })

    console.error('[demo] Unexpected error in a mock handler', error)
    const fallback = new HttpError(500, 'Internal Server Error', 'An unexpected error occurred')
    return settle(config, { status: 500, data: fallback.toBody() })
  }
}

/** Same contract as Axios' own `settle`: 2xx resolves, anything else rejects with an AxiosError. */
function settle(config: InternalAxiosRequestConfig, { status, data }: RouteResult): AxiosResponse {
  // Cloned so a component mutating a response cannot corrupt the shared state.
  const response: AxiosResponse = {
    data: data === undefined ? undefined : structuredClone(data),
    status,
    statusText: String(status),
    headers: {},
    config,
  }

  if (!config.validateStatus || config.validateStatus(status)) return response

  throw new AxiosError(
    `Request failed with status code ${status}`,
    status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    config,
    null,
    response,
  )
}

/** Axios has already JSON-stringified plain objects; FormData (uploads) arrives untouched. */
function parseBody(data: unknown): unknown {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    throw badRequest('Malformed JSON request body')
  }
}

function bearerToken(config: InternalAxiosRequestConfig): string | null {
  const header = config.headers.get('Authorization')
  return typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : null
}

/**
 * 150-400 ms so loading states are visible and the app feels networked. Derived from the
 * request instead of Math.random(): the same request always takes the same time, which keeps
 * automated runs reproducible.
 */
function latencyFor(method: string, path: string): number {
  let hash = 0
  for (const char of `${method} ${path}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return 150 + (hash % 251)
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
