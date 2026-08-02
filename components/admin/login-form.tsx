'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { ApiError } from '@/lib/api/types'
import { cn } from '@/lib/utils'

export function AdminLoginForm() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login({ email: email.trim(), password })
      // remember flag reserved for future cookie strategy; token is always stored for bearer auth
      void remember
      router.replace('/admin')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm animate-[login-fade-in_0.25s_ease-out]"
          style={{
            borderColor: 'color-mix(in srgb, var(--a-danger) 35%, transparent)',
            background: 'var(--a-danger-soft)',
            color: 'var(--a-danger)',
          }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label
          htmlFor="admin-email"
          className="block text-xs font-bold uppercase tracking-wide"
          style={{ color: 'var(--a-text-secondary)' }}
        >
          Email address
        </label>
        <div className="group/field relative">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition group-focus-within/field:text-[var(--a-primary)]"
            style={{ color: 'var(--a-muted)' }}
          />
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={cn(
              'login-input w-full rounded-2xl border py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-200',
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="admin-password"
          className="block text-xs font-bold uppercase tracking-wide"
          style={{ color: 'var(--a-text-secondary)' }}
        >
          Password
        </label>
        <div className="group/field relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition group-focus-within/field:text-[var(--a-primary)]"
            style={{ color: 'var(--a-muted)' }}
          />
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={cn(
              'login-input w-full rounded-2xl border py-3.5 pl-11 pr-12 text-sm outline-none transition-all duration-200',
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition"
            style={{ color: 'var(--a-muted)' }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <label
          className="flex cursor-pointer items-center gap-2"
          style={{ color: 'var(--a-text-secondary)' }}
        >
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--a-border-strong)] text-[var(--a-primary)] focus:ring-[var(--a-primary)]"
          />
          <span className="text-xs font-medium sm:text-sm">Keep me signed in</span>
        </label>
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold"
          style={{ color: 'var(--a-primary-soft-text)' }}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure login
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          'group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-bold text-white transition-all duration-300',
          'bg-gradient-to-r from-[#251B93] via-[#3B25B0] to-[#5B42EC]',
          'bg-[length:200%_100%] hover:bg-[position:100%_0]',
          'shadow-lg shadow-[#3B25B0]/30 hover:shadow-xl hover:shadow-[#3B25B0]/40 hover:scale-[1.01] active:scale-[0.99]',
          'disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100',
        )}
      >
        <span className="login-btn-shine pointer-events-none absolute inset-0" aria-hidden />
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>Sign in to CMS</>
          )}
        </span>
      </button>
    </form>
  )
}
