'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '@/lib/api/auth.api'
import { ApiError, type AdminUser, type LoginPayload } from '@/lib/api/types'
import {
  clearAuthSession,
  getAccessToken,
  getStoredAdmin,
  setAuthSession,
} from '@/lib/auth/storage'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  status: AuthStatus
  admin: AdminUser | null
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [admin, setAdmin] = useState<AdminUser | null>(null)

  const refreshProfile = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setAdmin(null)
      setStatus('unauthenticated')
      return
    }

    try {
      const { admin: profile } = await authApi.me()
      setAuthSession(token, profile)
      setAdmin(profile)
      setStatus('authenticated')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession()
      }
      setAdmin(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    const cached = getStoredAdmin()
    if (cached && getAccessToken()) {
      setAdmin(cached)
      setStatus('authenticated')
    }
    void refreshProfile()
  }, [refreshProfile])

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await authApi.login(payload)
    setAuthSession(data.token, data.admin)
    setAdmin(data.admin)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await authApi.logout()
      }
    } catch {
      // Always clear local session even if the network call fails
    } finally {
      clearAuthSession()
      setAdmin(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo(
    () => ({ status, admin, login, logout, refreshProfile }),
    [status, admin, login, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
