'use client'

import type { ReactNode } from 'react'
import { AuthGuard } from '@/components/admin/auth-guard'
import { useAdminTheme } from '@/lib/auth/admin-theme-context'
import { cn } from '@/lib/utils'

/**
 * Full-viewport builder layout (no admin sidebar).
 * Page builder + form builder live here for an Elementor-style workspace.
 */
export default function BuilderLayout({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme, ready } = useAdminTheme()

  return (
    <AuthGuard>
      <div
        suppressHydrationWarning
        data-theme={theme}
        data-resolved-theme={resolvedTheme}
        className={cn(
          'admin-app builder-root h-svh max-h-svh overflow-hidden',
          ready && 'transition-colors duration-300',
          resolvedTheme === 'dark' && 'dark',
        )}
      >
        {children}
      </div>
    </AuthGuard>
  )
}
