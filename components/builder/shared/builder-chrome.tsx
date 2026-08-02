'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  Eye,
  History,
  Loader2,
  Trash2,
} from 'lucide-react'
import { DeviceSwitcher } from './device-switcher'
import { LocaleSwitcher } from './locale-switcher'
import type { BuilderLocale } from '@/lib/builder/i18n'
import type { DeviceMode } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

export function BuilderShell({ children }: { children: ReactNode }) {
  return (
    <div className="builder-app flex h-svh max-h-svh flex-col overflow-hidden">
      {children}
    </div>
  )
}

export function BuilderTopBar({
  backHref,
  brand,
  center,
  device,
  onDeviceChange,
  locale,
  onLocaleChange,
  onHistory,
  onClear,
  onPreview,
  onSaveDraft,
  onPublish,
  saving,
  publishing,
  previewActive,
  publishLabel = 'Publish',
  saveLabel = 'Save Draft',
  previewLabel = 'Preview',
}: {
  backHref: string
  brand: ReactNode
  center?: ReactNode
  device: DeviceMode
  onDeviceChange: (d: DeviceMode) => void
  locale?: BuilderLocale
  onLocaleChange?: (l: BuilderLocale) => void
  onHistory?: () => void
  onClear?: () => void
  onPreview?: () => void
  onSaveDraft: () => void
  onPublish: () => void
  saving?: boolean
  publishing?: boolean
  previewActive?: boolean
  publishLabel?: string
  saveLabel?: string
  previewLabel?: string
}) {
  return (
    <header className="builder-topbar flex h-12 shrink-0 items-center gap-2 border-b border-[var(--b-border)] px-2.5 sm:px-3">
      <Link
        href={backHref}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--b-muted)] transition hover:bg-[var(--a-primary-soft)] hover:text-[var(--a-primary-soft-text)]"
        title="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div className="flex min-w-0 items-center gap-1.5">{brand}</div>

      <div className="mx-auto hidden items-center gap-2 md:flex">
        {center}
        {locale != null && onLocaleChange && (
          <div className="flex items-center gap-2 rounded-full border border-[var(--b-border)] bg-[var(--a-surface-2)] px-1.5 py-0.5 shadow-sm">
            <span className="hidden pl-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--b-muted)] sm:inline">
              Language
            </span>
            <LocaleSwitcher value={locale} onChange={onLocaleChange} size="sm" />
          </div>
        )}
        <div className="flex items-center gap-1.5 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] px-1.5 py-0.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--b-muted)]">
            Device
          </span>
          <DeviceSwitcher value={device} onChange={onDeviceChange} />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        {onHistory && (
          <button
            type="button"
            onClick={onHistory}
            className="hidden h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-[var(--b-muted)] transition hover:bg-[var(--a-primary-soft)] hover:text-[var(--a-primary-soft-text)] sm:flex"
          >
            <History className="h-3.5 w-3.5" />
            Undo
          </button>
        )}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="hidden h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-[var(--b-muted)] transition hover:bg-red-500/10 hover:text-red-300 sm:flex"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition',
              previewActive
                ? 'bg-[var(--a-primary)] text-white shadow-sm shadow-[color-mix(in_srgb,var(--a-primary)_25%,transparent)]'
                : 'border border-[color-mix(in_srgb,var(--a-primary)_30%,var(--a-border))] bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)] hover:opacity-90',
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{previewLabel}</span>
          </button>
        )}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving || publishing}
          className="builder-btn-ghost flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {saveLabel}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={saving || publishing}
          className="builder-btn-primary flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold disabled:opacity-60"
        >
          {publishing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {publishLabel}
        </button>
      </div>
    </header>
  )
}

export function BuilderPanel({
  title,
  children,
  className,
  footer,
  headerExtra,
}: {
  title: string
  children: ReactNode
  className?: string
  footer?: ReactNode
  headerExtra?: ReactNode
}) {
  return (
    <aside
      className={cn(
        'builder-panel flex w-[240px] shrink-0 flex-col border-[var(--b-border)] bg-[var(--b-panel)]',
        className,
      )}
    >
      <div className="flex h-10 shrink-0 items-center justify-between gap-1.5 border-b border-[var(--b-border)] px-2.5">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--b-muted)]">
          {title}
        </h2>
        {headerExtra}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">{children}</div>
      {footer}
    </aside>
  )
}

export function BuilderCanvasFrame({
  title,
  subtitle,
  device,
  children,
  toolbar,
}: {
  title: string
  subtitle?: string
  device: DeviceMode
  children: ReactNode
  toolbar?: ReactNode
}) {
  const width =
    device === 'mobile' ? 390 : device === 'tablet' ? 768 : '100%'

  return (
    <div className="builder-canvas-area flex min-w-0 flex-1 flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-[var(--b-border)] px-3">
        <div className="min-w-0">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--b-muted)]">
            {title}
            {subtitle ? (
              <span className="ml-1.5 font-medium normal-case tracking-normal text-[var(--b-muted)]/80">
                · {subtitle}
              </span>
            ) : null}
          </h2>
        </div>
        {toolbar}
      </div>
      <div className="builder-canvas-scroll min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        <div
          className={cn(
            'builder-viewport mx-auto min-h-[460px] overflow-hidden transition-all duration-300',
            device !== 'desktop' && 'builder-viewport-device',
          )}
          style={{
            width: typeof width === 'number' ? width : width,
            maxWidth: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function StatusToast({
  message,
  tone = 'ok',
}: {
  message: string | null
  tone?: 'ok' | 'error'
}) {
  if (!message) return null
  return (
    <div
      className={cn(
        'pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-xs font-semibold shadow-xl backdrop-blur',
        tone === 'ok'
          ? 'bg-emerald-500/95 text-white shadow-emerald-500/20'
          : 'bg-red-500/95 text-white shadow-red-500/20',
      )}
    >
      {message}
    </div>
  )
}
