'use client'

import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { useAdminTheme } from '@/lib/auth/admin-theme-context'
import { cn } from '@/lib/utils'

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { theme, resolvedTheme, ready } = useAdminTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      suppressHydrationWarning
      data-theme={theme}
      data-resolved-theme={resolvedTheme}
      className={cn(
        'admin-app flex h-svh max-h-svh overflow-hidden',
        ready && 'transition-colors duration-300',
        resolvedTheme === 'dark' && 'dark',
      )}
    >
      <AdminSidebar
        open={mobileOpen}
        collapsed={collapsed}
        onClose={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader
          pathname={pathname}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="admin-main flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3 sm:px-4 sm:py-3.5 lg:px-5 lg:py-4">
          {/* min-h-min on small screens so content can grow and main scrolls;
              sm+ keeps min-h-0 for pages with internal scroll regions */}
          <div
            key={pathname}
            className="admin-anim-in flex min-h-min w-full flex-1 flex-col sm:min-h-0"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
