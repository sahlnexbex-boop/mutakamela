'use client'

import type { ReactNode } from 'react'
import 'sweetalert2/dist/sweetalert2.min.css'
import { AuthProvider } from '@/lib/auth/auth-context'
import { AdminThemeProvider } from '@/lib/auth/admin-theme-context'

/**
 * Shared providers for all /admin routes (login + authenticated panel).
 * Theme lives here so login inherits the same light/dark/auto preference.
 */
export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminThemeProvider>{children}</AdminThemeProvider>
    </AuthProvider>
  )
}
