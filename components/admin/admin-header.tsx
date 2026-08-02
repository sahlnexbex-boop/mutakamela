'use client'

import { useRouter } from 'next/navigation'
import {
  LogOut,
  Menu,
  Bell,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useAdminTheme } from '@/lib/auth/admin-theme-context'
import { getAdminNavItem } from '@/components/admin/nav-items'

type AdminHeaderProps = {
  onMenuClick: () => void
  pathname: string
}

export function AdminHeader({ onMenuClick, pathname }: AdminHeaderProps) {
  const router = useRouter()
  const { admin, logout } = useAuth()
  const { resolvedTheme, toggleTheme } = useAdminTheme()
  const current = getAdminNavItem(pathname)

  const handleLogout = async () => {
    await logout()
    router.replace('/admin/login')
  }

  const initials =
    admin?.name
      ?.split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD'

  return (
    <header
      className="admin-anim-fade sticky top-0 z-30 h-13 shrink-0 border-b backdrop-blur-xl"
      style={{
        height: '3.25rem',
        background: 'var(--a-header-bg)',
        borderColor: 'var(--a-border)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset',
      }}
    >
      <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onMenuClick}
            className="admin-btn-ghost h-8 w-8 lg:!hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <div
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: 'var(--a-muted)' }}
            >
              <span>CMS</span>
              <ChevronRight className="h-2.5 w-2.5 opacity-60" />
              <span
                className="truncate"
                style={{ color: 'var(--a-primary-soft-text)' }}
              >
                {current?.label ?? 'Admin'}
              </span>
            </div>
            <h1
              className="truncate text-[14px] font-semibold tracking-tight sm:text-[15px]"
              style={{ color: 'var(--a-text)' }}
            >
              {current?.label ?? 'Admin'}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="admin-btn-ghost h-8 w-8"
            aria-label={
              resolvedTheme === 'light'
                ? 'Switch to dark theme'
                : 'Switch to light theme'
            }
            title={resolvedTheme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {resolvedTheme === 'light' ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="button"
            className="admin-btn-ghost relative h-8 w-8"
            aria-label="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            <span
              className="admin-dot-live absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
              style={{
                background: 'var(--a-danger)',
                boxShadow: '0 0 0 2px var(--a-surface)',
              }}
            />
          </button>

          <div
            className="hidden items-center gap-2 rounded-xl border py-1 pl-1 pr-2.5 sm:flex"
            style={{
              borderColor: 'var(--a-border)',
              background: 'var(--a-surface)',
              boxShadow: 'var(--a-shadow-sm)',
            }}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3b25b0, #5b42ec)',
                boxShadow: '0 2px 8px -2px rgba(59,37,176,0.45)',
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p
                className="max-w-[120px] truncate text-xs font-semibold leading-tight"
                style={{ color: 'var(--a-text)' }}
              >
                {admin?.name ?? 'Admin'}
              </p>
              <p
                className="max-w-[120px] truncate text-[10px] capitalize leading-tight"
                style={{ color: 'var(--a-muted)' }}
              >
                {admin?.role ?? 'administrator'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="admin-btn-ghost admin-btn-danger-hover h-8 gap-1.5 px-2.5 text-[12px] font-semibold"
            style={{ color: 'var(--a-text-secondary)' }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
