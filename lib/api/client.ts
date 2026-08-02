import { env } from '@/lib/env'
import { ApiError, type ApiResponse } from '@/lib/api/types'
import { getAccessToken, clearAuthSession } from '@/lib/auth/storage'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  /** When true, attach Authorization: Bearer <token> */
  auth?: boolean
  headers?: Record<string, string>
  signal?: AbortSignal
}

/**
 * Reusable HTTP client for all API integrations.
 * Domain modules (auth.api.ts, …) should call this — not raw fetch.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, auth = false, headers = {}, signal } = options

  const url = path.startsWith('http')
    ? path
    : `${env.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getAccessToken()
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }
  }

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch {
    throw new ApiError(
      'Unable to reach the server. Please check your connection.',
      0,
      'NETWORK_ERROR',
    )
  }

  const payload = (await parseJsonSafe(response)) as ApiResponse<T> | null

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearAuthSession()
    }

    const message =
      payload && 'message' in payload
        ? payload.message
        : `Request failed with status ${response.status}`

    const code =
      payload && 'success' in payload && payload.success === false
        ? payload.code
        : 'HTTP_ERROR'

    const details =
      payload && 'success' in payload && payload.success === false
        ? payload.details
        : undefined

    throw new ApiError(message, response.status, code, details)
  }

  if (!payload || typeof payload !== 'object') {
    throw new ApiError('Invalid response from server', response.status)
  }

  if ('success' in payload && payload.success === false) {
    throw new ApiError(payload.message, response.status, payload.code, payload.details)
  }

  if ('success' in payload && payload.success === true) {
    return payload.data
  }

  // Non-envelope responses (e.g. /health)
  return payload as T
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}
