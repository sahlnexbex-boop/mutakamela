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
import { env } from '@/lib/env'

/** User preference stored in localStorage */
export type AdminTheme = 'light' | 'dark' | 'auto'

/** Actual light/dark applied to the UI */
export type ResolvedAdminTheme = 'light' | 'dark'

const STORAGE_KEY = () => env.adminThemeKey

type AdminThemeContextValue = {
  /** Preference: light | dark | auto */
  theme: AdminTheme
  /** Resolved surface: light | dark (auto follows system) */
  resolvedTheme: ResolvedAdminTheme
  setTheme: (theme: AdminTheme) => void
  toggleTheme: () => void
  ready: boolean
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null)

function isAdminTheme(value: string | null | undefined): value is AdminTheme {
  return value === 'light' || value === 'dark' || value === 'auto'
}

function getSystemTheme(): ResolvedAdminTheme {
  if (typeof window === 'undefined') return 'light'
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

/** Resolve preference → applied theme. */
export function resolveAdminTheme(
  theme: AdminTheme,
  system: ResolvedAdminTheme = getSystemTheme(),
): ResolvedAdminTheme {
  if (theme === 'auto') return system
  return theme
}

/** Read theme preference from localStorage (browser only). Defaults to light. */
export function readStoredAdminTheme(): AdminTheme {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY())
    if (isAdminTheme(stored)) return stored
  } catch {
    /* private mode / blocked storage */
  }
  return 'light'
}

/** Persist theme preference to localStorage immediately. */
export function writeStoredAdminTheme(theme: AdminTheme): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY(), theme)
  } catch {
    /* ignore write failures */
  }
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  // Default light for SSR; hydrate from storage on mount to avoid mismatch.
  const [theme, setThemeState] = useState<AdminTheme>('light')
  const [systemTheme, setSystemTheme] = useState<ResolvedAdminTheme>('light')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readStoredAdminTheme()
    setThemeState(stored)
    setSystemTheme(getSystemTheme())
    setReady(true)
  }, [])

  // Follow OS preference when theme is "auto".
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      setSystemTheme(mq.matches ? 'dark' : 'light')
    }
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Keep storage in sync if theme changes.
  useEffect(() => {
    if (!ready) return
    writeStoredAdminTheme(theme)
  }, [theme, ready])

  // Cross-tab sync: when another tab updates the theme, follow it.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY()) return
      if (isAdminTheme(event.newValue)) {
        setThemeState(event.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const resolvedTheme = useMemo(
    () => resolveAdminTheme(theme, systemTheme),
    [theme, systemTheme],
  )

  const setTheme = useCallback((next: AdminTheme) => {
    setThemeState(next)
    writeStoredAdminTheme(next)
  }, [])

  /** Quick toggle: flip the resolved surface to the opposite explicit mode. */
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const current = resolveAdminTheme(prev, getSystemTheme())
      const next: AdminTheme = current === 'light' ? 'dark' : 'light'
      writeStoredAdminTheme(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme, ready }),
    [theme, resolvedTheme, setTheme, toggleTheme, ready],
  )

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext)
  if (!ctx) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider')
  }
  return ctx
}
