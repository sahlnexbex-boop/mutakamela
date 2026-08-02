import { env } from '@/lib/env'
import type { AdminUser } from '@/lib/api/types'

const isBrowser = () => typeof window !== 'undefined'

export function getAccessToken(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(env.authTokenKey)
}

export function setAccessToken(token: string): void {
  if (!isBrowser()) return
  window.localStorage.setItem(env.authTokenKey, token)
}

export function getStoredAdmin(): AdminUser | null {
  if (!isBrowser()) return null
  const raw = window.localStorage.getItem(env.authUserKey)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function setStoredAdmin(admin: AdminUser): void {
  if (!isBrowser()) return
  window.localStorage.setItem(env.authUserKey, JSON.stringify(admin))
}

export function setAuthSession(token: string, admin: AdminUser): void {
  setAccessToken(token)
  setStoredAdmin(admin)
}

export function clearAuthSession(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(env.authTokenKey)
  window.localStorage.removeItem(env.authUserKey)
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}
