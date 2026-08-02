import { env } from '@/lib/env'
import { ApiError, type ApiResponse } from '@/lib/api/types'
import { clearAuthSession, getAccessToken } from '@/lib/auth/storage'

export type UploadImageResult = {
  url: string
  filename: string
  originalName: string
  mimeType: string
  size: number
}

/**
 * Upload an image via multipart/form-data.
 * Returns a public path like `/uploads/….jpg` — use mediaUrl() for absolute URL.
 */
export async function uploadImage(file: File): Promise<UploadImageResult> {
  const form = new FormData()
  form.append('file', file)

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  const token = getAccessToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${env.apiBaseUrl}/api/media/upload`, {
      method: 'POST',
      headers,
      body: form,
    })
  } catch {
    throw new ApiError(
      'Unable to reach the server. Please check your connection.',
      0,
      'NETWORK_ERROR',
    )
  }

  const text = await response.text()
  let payload: ApiResponse<UploadImageResult> | null = null
  try {
    payload = text ? (JSON.parse(text) as ApiResponse<UploadImageResult>) : null
  } catch {
    payload = null
  }

  if (!response.ok) {
    if (response.status === 401) clearAuthSession()
    const message =
      payload && 'message' in payload
        ? payload.message
        : `Upload failed (${response.status})`
    throw new ApiError(message, response.status, 'UPLOAD_ERROR')
  }

  if (!payload || !('success' in payload) || payload.success !== true) {
    throw new ApiError('Invalid upload response', response.status)
  }

  return payload.data
}

/** Resolve API-relative `/uploads/…` paths to a full browser URL. */
export function mediaUrl(url: string | undefined | null): string {
  if (!url) return ''
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url
  }
  if (url.startsWith('/uploads/')) {
    return `${env.apiBaseUrl}${url}`
  }
  return url
}
