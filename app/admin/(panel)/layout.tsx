'use client'

import type { ReactNode } from 'react'
import { AuthGuard } from '@/components/admin/auth-guard'
import { AdminShell } from '@/components/admin/admin-shell'

/**
 * Shared shell for authenticated admin pages (sidebar + top bar).
 * Login lives outside this route group so it keeps a full-page layout.
 */
export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  )
}
