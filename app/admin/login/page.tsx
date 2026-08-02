'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import {
  Shield,
  ShieldCheck,
  Home,
  Car,
  HeartPulse,
  Umbrella,
} from 'lucide-react'
import { AdminLoginForm } from '@/components/admin/login-form'
import { AuthGuard } from '@/components/admin/auth-guard'
import { useAdminTheme } from '@/lib/auth/admin-theme-context'
import { cn } from '@/lib/utils'

const coverageNodes = [
  { icon: Home, label: 'Home', position: 'top' as const },
  { icon: Car, label: 'Motor', position: 'right' as const },
  { icon: HeartPulse, label: 'Health', position: 'bottom' as const },
  { icon: Umbrella, label: 'Life', position: 'left' as const },
]

const LOGO_COLOR = '/images/logo_navbar.png'
const LOGO_WHITE = '/images/mutakamelawhitelogo.png'

export default function AdminLoginPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme, ready } = useAdminTheme()
  const isDark = resolvedTheme === 'dark'
  const logoSrc = isDark ? LOGO_WHITE : LOGO_COLOR

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.set(
        [
          '[data-login="bg-orb"]',
          '[data-login="brand-panel"]',
          '[data-login="logo"]',
          '[data-login="brand-copy"]',
          '[data-login="insurance-scene"]',
          '[data-login="coverage-node"]',
          '[data-login="form-card"]',
          '[data-login="form-item"]',
        ],
        { opacity: 0 },
      )

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '[data-login="bg-orb"]',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 1.1, stagger: 0.1 },
        0,
      )
        .fromTo(
          '[data-login="brand-panel"]',
          { opacity: 0, x: -36 },
          { opacity: 1, x: 0, duration: 0.8 },
          0.12,
        )
        .fromTo(
          '[data-login="logo"]',
          { opacity: 0, scale: 0.85, y: 18 },
          { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'back.out(1.5)' },
          0.28,
        )
        .fromTo(
          '[data-login="brand-copy"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.48,
        )
        .fromTo(
          '[data-login="insurance-scene"]',
          { opacity: 0, scale: 0.88, y: 18 },
          { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'back.out(1.2)' },
          0.62,
        )
        .fromTo(
          '[data-login="coverage-node"]',
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' },
          0.85,
        )
        .fromTo(
          '[data-login="form-card"]',
          { opacity: 0, y: 28, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
          0.35,
        )
        .fromTo(
          '[data-login="form-item"]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 },
          0.6,
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <AuthGuard guestOnly>
      <div
        ref={rootRef}
        suppressHydrationWarning
        data-theme={theme}
        data-resolved-theme={resolvedTheme}
        className={cn(
          'admin-app login-page relative min-h-screen overflow-hidden',
          ready && 'transition-colors duration-300',
          isDark && 'dark',
        )}
        style={{ background: 'var(--a-bg)' }}
      >
        {/* Soft ambient background — theme-aware */}
        <div className="pointer-events-none absolute inset-0">
          <div
            data-login="bg-orb"
            className={cn(
              'login-orb absolute -left-24 -top-28 h-[26rem] w-[26rem] rounded-full blur-3xl',
              isDark ? 'bg-indigo-500/15' : 'bg-indigo-100/70',
            )}
          />
          <div
            data-login="bg-orb"
            className={cn(
              'login-orb-delayed absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full blur-3xl',
              isDark ? 'bg-violet-500/12' : 'bg-blue-100/60',
            )}
          />
          <div
            data-login="bg-orb"
            className={cn(
              'login-orb-slow absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl',
              isDark ? 'bg-[#5B42EC]/18' : 'bg-[#3B25B0]/8',
            )}
          />
          <span
            className={cn(
              'login-particle absolute left-[14%] top-[24%] h-2 w-2 rounded-full',
              isDark ? 'bg-indigo-400/30' : 'bg-[#3B25B0]/20',
            )}
          />
          <span
            className={cn(
              'login-particle-delayed absolute left-[82%] top-[16%] h-1.5 w-1.5 rounded-full',
              isDark ? 'bg-violet-400/35' : 'bg-indigo-400/25',
            )}
          />
          <span
            className={cn(
              'login-particle-slow absolute left-[70%] top-[72%] h-2.5 w-2.5 rounded-full',
              isDark ? 'bg-indigo-300/25' : 'bg-violet-300/30',
            )}
          />
          <span
            className={cn(
              'login-particle absolute left-[28%] top-[78%] h-1.5 w-1.5 rounded-full',
              isDark ? 'bg-indigo-400/20' : 'bg-[#3B25B0]/15',
            )}
          />
        </div>

        <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
          {/* Brand panel — transparent (no solid purple card) */}
          <aside
            data-login="brand-panel"
            className="relative hidden flex-col justify-between p-8 lg:flex xl:p-10"
          >
            <div className="relative flex h-full flex-col justify-center overflow-hidden p-4 xl:p-6">
              {/* Soft ambient rings only — no filled background */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                  className={cn(
                    'login-ring absolute -right-10 -top-10 h-52 w-52 rounded-full border',
                    isDark ? 'border-violet-400/15' : 'border-[#3B25B0]/10',
                  )}
                />
                <div
                  className={cn(
                    'login-ring-reverse absolute -bottom-12 -left-8 h-60 w-60 rounded-full border',
                    isDark ? 'border-indigo-400/12' : 'border-indigo-300/15',
                  )}
                />
                <div
                  className={cn(
                    'absolute bottom-20 right-8 h-32 w-32 rounded-full blur-2xl',
                    isDark ? 'bg-violet-500/12' : 'bg-indigo-200/40',
                  )}
                />
                <div
                  className={cn(
                    'absolute left-1/3 top-1/2 h-20 w-20 rounded-full blur-xl',
                    isDark ? 'bg-indigo-400/10' : 'bg-[#3B25B0]/8',
                  )}
                />
              </div>

              {/* Single stacked column — no justify-between gap */}
              <div className="relative flex flex-col gap-7">
                <div className="flex flex-col items-center gap-3.5 text-center">
                  <div
                    data-login="logo"
                    className={cn(
                      'login-logo-glow rounded-3xl px-7 py-5 shadow-lg',
                      isDark
                        ? 'bg-[var(--a-surface-2)] shadow-black/40 ring-1 ring-white/10'
                        : 'bg-white shadow-black/10 ring-1 ring-indigo-50',
                    )}
                  >
                    <Image
                      src={logoSrc}
                      alt="Mutakamela Insurance"
                      width={240}
                      height={64}
                      priority
                      className="h-12 w-auto object-contain xl:h-14"
                    />
                  </div>
                  <div
                    data-login="brand-copy"
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold',
                      isDark
                        ? 'bg-white/8 text-violet-200 ring-1 ring-white/10'
                        : 'bg-[#3B25B0]/8 text-[#3B25B0] ring-1 ring-[#3B25B0]/12',
                    )}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    CMS Control Center
                  </div>
                </div>

                <div className="space-y-4 text-center lg:text-left">
                  <h1
                    data-login="brand-copy"
                    className="max-w-md text-3xl font-bold leading-[1.15] tracking-tight xl:text-4xl"
                    style={{ color: 'var(--a-text)' }}
                  >
                    Protecting trust starts with a{' '}
                    <span
                      className={cn(
                        isDark ? 'text-violet-300' : 'text-[#3B25B0]',
                      )}
                    >
                      secure admin
                    </span>
                  </h1>
                  <p
                    data-login="brand-copy"
                    className="max-w-sm text-sm leading-relaxed"
                    style={{ color: 'var(--a-text-secondary)' }}
                  >
                    Sign in to manage Mutakamela content, monitor operations, and
                    keep every customer experience consistent.
                  </p>
                </div>

                {/* Insurance protection animation */}
                <div
                  data-login="insurance-scene"
                  className="relative mt-1 flex flex-col items-center gap-4"
                  aria-hidden
                >
                  <div className="relative h-[13.5rem] w-[13.5rem] xl:h-60 xl:w-60">
                    {/* Soft core glow */}
                    <div
                      className={cn(
                        'login-ins-core-glow absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl xl:h-32 xl:w-32',
                        isDark ? 'bg-violet-500/25' : 'bg-[#5B42EC]/18',
                      )}
                    />

                    {/* SVG coverage rings */}
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 240 240"
                      fill="none"
                    >
                      <circle
                        cx="120"
                        cy="120"
                        r="102"
                        className={cn(
                          'login-ins-dash',
                          isDark ? 'stroke-violet-300/30' : 'stroke-[#3B25B0]/22',
                        )}
                        strokeWidth="1.25"
                        strokeDasharray="6 10"
                      />
                      <circle
                        cx="120"
                        cy="120"
                        r="78"
                        className={cn(
                          isDark ? 'stroke-indigo-300/25' : 'stroke-indigo-400/20',
                        )}
                        strokeWidth="1"
                      />
                      <circle
                        cx="120"
                        cy="120"
                        r="54"
                        className={cn(
                          isDark ? 'stroke-violet-200/20' : 'stroke-[#5B42EC]/15',
                        )}
                        strokeWidth="1"
                        strokeDasharray="3 8"
                      />
                      {/* Subtle connection arcs */}
                      <path
                        d="M120 18 C170 40 200 80 202 120"
                        className={cn(
                          isDark ? 'stroke-violet-300/25' : 'stroke-[#3B25B0]/18',
                        )}
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <path
                        d="M120 222 C70 200 40 160 38 120"
                        className={cn(
                          isDark ? 'stroke-indigo-300/22' : 'stroke-indigo-400/16',
                        )}
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Outer orbit — slow spin with counter-rotated icons */}
                    <div className="login-ins-orbit absolute inset-[6%] rounded-full">
                      {coverageNodes.map(({ icon: Icon, label, position }) => {
                        const posClass =
                          position === 'top'
                            ? 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2'
                            : position === 'right'
                              ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2'
                              : position === 'bottom'
                                ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
                                : 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'

                        return (
                          <div
                            key={label}
                            data-login="coverage-node"
                            className={cn('absolute', posClass)}
                          >
                            <div className="login-ins-counter">
                              <div
                                className={cn(
                                  'login-ins-node flex h-11 w-11 items-center justify-center rounded-2xl backdrop-blur-md xl:h-12 xl:w-12',
                                  isDark
                                    ? 'bg-[var(--a-surface)] ring-1 ring-white/12 shadow-lg shadow-black/25'
                                    : 'bg-white ring-1 ring-[#3B25B0]/12 shadow-lg shadow-indigo-200/50',
                                )}
                                title={label}
                              >
                                <Icon
                                  className={cn(
                                    'h-[1.15rem] w-[1.15rem]',
                                    isDark ? 'text-violet-300' : 'text-[#3B25B0]',
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Inner reverse ring accent */}
                    <div
                      className={cn(
                        'login-ins-orbit-reverse pointer-events-none absolute inset-[22%] rounded-full border border-dashed',
                        isDark ? 'border-violet-300/25' : 'border-[#3B25B0]/18',
                      )}
                    />

                    {/* Floating spark accents */}
                    <span
                      className={cn(
                        'login-ins-spark absolute left-[18%] top-[28%] h-1.5 w-1.5 rounded-full',
                        isDark ? 'bg-violet-300/70' : 'bg-[#5B42EC]/55',
                      )}
                    />
                    <span
                      className={cn(
                        'login-ins-spark-delayed absolute right-[20%] top-[34%] h-1 w-1 rounded-full',
                        isDark ? 'bg-indigo-300/60' : 'bg-indigo-400/50',
                      )}
                    />
                    <span
                      className={cn(
                        'login-ins-spark absolute bottom-[26%] left-[30%] h-1 w-1 rounded-full',
                        isDark ? 'bg-violet-200/50' : 'bg-[#3B25B0]/40',
                      )}
                    />

                    {/* Center protective shield */}
                    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                      <div
                        className={cn(
                          'login-ins-shield flex h-[4.75rem] w-[4.75rem] flex-col items-center justify-center rounded-[1.35rem] xl:h-20 xl:w-20',
                          isDark
                            ? 'bg-gradient-to-br from-[#5B42EC] to-[#3B25B0] ring-1 ring-white/15 shadow-xl shadow-violet-900/40'
                            : 'bg-gradient-to-br from-[#5B42EC] to-[#3B25B0] ring-1 ring-[#3B25B0]/20 shadow-xl shadow-indigo-300/50',
                        )}
                      >
                        <ShieldCheck
                          className="h-8 w-8 text-white drop-shadow-sm xl:h-9 xl:w-9"
                          strokeWidth={1.75}
                        />
                        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/95">
                          Cover
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="login-ins-float flex flex-col items-center gap-1 text-center">
                    <p
                      className="text-sm font-semibold tracking-tight"
                      style={{ color: 'var(--a-text)' }}
                    >
                      Coverage that moves with you
                    </p>
                    <p
                      className="max-w-[16rem] text-xs leading-relaxed"
                      style={{ color: 'var(--a-text-secondary)' }}
                    >
                      Home · Motor · Health · Life — protected under one trusted shield
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Form panel */}
          <main className="flex items-center justify-center px-5 py-12 sm:px-8">
            <div className="w-full max-w-md">
              <div
                data-login="form-card"
                className={cn(
                  'relative overflow-hidden rounded-[1.85rem] border p-7 shadow-soft-lg backdrop-blur-xl sm:p-9',
                  isDark
                    ? 'border-[var(--a-border)] bg-[var(--a-surface)]/92'
                    : 'border-white/80 bg-white/90',
                )}
              >
                <div
                  className={cn(
                    'pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl',
                    isDark ? 'bg-indigo-500/20' : 'bg-indigo-100/80',
                  )}
                />
                <div
                  className={cn(
                    'pointer-events-none absolute -bottom-20 -left-12 h-36 w-36 rounded-full blur-3xl',
                    isDark ? 'bg-violet-500/15' : 'bg-blue-100/60',
                  )}
                />

                <div
                  data-login="logo"
                  className="relative mb-8 flex flex-col items-center text-center"
                >
                  <div
                    className={cn(
                      'login-logo-glow mb-5 flex items-center justify-center rounded-3xl px-8 py-5 shadow-soft',
                      isDark
                        ? 'bg-[var(--a-surface-2)] ring-1 ring-[var(--a-border)]'
                        : 'bg-white ring-1 ring-indigo-50',
                    )}
                  >
                    <Image
                      src={logoSrc}
                      alt="Mutakamela Insurance"
                      width={220}
                      height={58}
                      priority
                      className="h-11 w-auto object-contain sm:h-12"
                    />
                  </div>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: 'var(--a-primary-soft-text)' }}
                  >
                    Admin Console
                  </p>
                  <div className="mt-3 h-1 w-10 rounded-full bg-gradient-to-r from-[#3B25B0] to-[#5B42EC]" />
                </div>

                <div
                  data-login="form-item"
                  className="relative mb-7 space-y-1.5 text-center"
                >
                  <h2
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: 'var(--a-text)' }}
                  >
                    Welcome back
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--a-text-secondary)' }}
                  >
                    Enter your admin credentials to access the CMS panel.
                  </p>
                </div>

                <div data-login="form-item" className="relative">
                  <AdminLoginForm />
                </div>

                <div
                  data-login="form-item"
                  className="relative mt-6 flex flex-col items-center gap-2"
                >
                  <p
                    className="inline-flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: 'var(--a-muted)' }}
                  >
                    <ShieldCheck
                      className="h-3.5 w-3.5"
                      style={{ color: 'var(--a-primary-soft-text)' }}
                    />
                    Authorized personnel only · activity may be audited
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
