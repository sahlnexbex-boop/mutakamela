/** Shared API envelope from the Fastify backend */

export type ApiSuccess<T> = {
  success: true
  message: string
  data: T
}

export type ApiFailure = {
  success: false
  message: string
  code: string
  details?: unknown
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export type AdminUser = {
  id: number
  email: string
  name: string
  role: string
  lastLoginAt: string | null
  createdAt: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginData = {
  token: string
  tokenType: 'Bearer'
  expiresIn: string
  admin: AdminUser
}

export type MeData = {
  admin: AdminUser
}

export type LogoutData = {
  loggedOut: boolean
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(
    message: string,
    status = 500,
    code = 'API_ERROR',
    details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}
