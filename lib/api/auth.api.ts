import { apiRequest } from '@/lib/api/client'
import type {
  LoginData,
  LoginPayload,
  LogoutData,
  MeData,
} from '@/lib/api/types'

/**
 * Auth API integration — isolated from other domain APIs.
 * All CMS auth endpoints live here.
 */
export const authApi = {
  login(payload: LoginPayload): Promise<LoginData> {
    return apiRequest<LoginData>('/api/auth/login', {
      method: 'POST',
      body: payload,
    })
  },

  me(): Promise<MeData> {
    return apiRequest<MeData>('/api/auth/me', {
      method: 'GET',
      auth: true,
    })
  },

  logout(): Promise<LogoutData> {
    return apiRequest<LogoutData>('/api/auth/logout', {
      method: 'POST',
      auth: true,
    })
  },
}
