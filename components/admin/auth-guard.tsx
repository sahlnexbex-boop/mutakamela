'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useAdminTheme } from '@/lib/auth/admin-theme-context'
import { cn } from '@/lib/utils'

type AuthGuardProps = {
  children: ReactNode
  /** When true, redirect authenticated users away (e.g. login page) */
  guestOnly?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  guestOnly = false,
  redirectTo,
}: AuthGuardProps) {
  const router = useRouter()
  const { status } = useAuth()
  const { resolvedTheme } = useAdminTheme()

  useEffect(() => {
    if (status === 'loading') return

    if (guestOnly && status === 'authenticated') {
      router.replace(redirectTo ?? '/admin')
      return
    }

    if (!guestOnly && status === 'unauthenticated') {
      router.replace(redirectTo ?? '/admin/login')
    }
  }, [status, guestOnly, redirectTo, router])

  if (status === 'loading') {
    return (
      <div
        className={cn(
          'admin-app flex h-svh max-h-svh items-center justify-center overflow-hidden',
          resolvedTheme === 'dark' && 'dark',
        )}
      >
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: 'var(--a-surface)',
              border: '1px solid var(--a-border)',
              boxShadow: 'var(--a-shadow-sm)',
            }}
          >
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: 'var(--a-primary)' }}
            />
          </div>
          <p
            className="text-[13px] font-medium"
            style={{ color: 'var(--a-text-secondary)' }}
          >
            Checking session…
          </p>
        </div>
      </div>
    )
  }

  if (guestOnly && status === 'authenticated') {
    return null
  }

  if (!guestOnly && status === 'unauthenticated') {
    return null
  }

  return <>{children}</>
}
