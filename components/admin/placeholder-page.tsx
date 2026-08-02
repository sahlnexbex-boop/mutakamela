import Link from 'next/link'
import { ArrowRight, Construction } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type PlaceholderPageProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="admin-card admin-anim-scale relative overflow-hidden p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl"
        style={{ background: 'var(--a-primary-soft)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-1/4 h-36 w-36 rounded-full blur-3xl opacity-60"
        style={{ background: 'var(--a-info-soft)' }}
        aria-hidden
      />
      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #3b25b0, #5b42ec)',
            boxShadow: '0 8px 20px -6px rgba(59,37,176,0.45)',
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{
              background: 'var(--a-warning-soft)',
              color: 'var(--a-warning)',
            }}
          >
            <Construction className="h-3 w-3" />
            Coming soon
          </div>
          <h2
            className="mt-2 text-lg font-semibold tracking-tight"
            style={{ color: 'var(--a-text)' }}
          >
            {title}
          </h2>
          <p
            className="mt-1 max-w-xl text-[13px] leading-relaxed"
            style={{ color: 'var(--a-text-secondary)' }}
          >
            {description} This module uses the shared sidebar layout and theme
            system.
          </p>
          <Link
            href="/admin"
            className="admin-btn-primary mt-4 h-9 px-3.5 text-[13px]"
          >
            Back to dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
