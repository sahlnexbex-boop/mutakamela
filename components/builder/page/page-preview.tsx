'use client'

import { useEffect } from 'react'
import {
  Check,
  ExternalLink,
  Loader2,
  Pencil,
  X,
} from 'lucide-react'
import { DeviceSwitcher } from '@/components/builder/shared/device-switcher'
import { LocaleSwitcher } from '@/components/builder/shared/locale-switcher'
import { PageDocument } from '@/components/builder/page/block-renderer'
import type { BuilderLocale } from '@/lib/builder/i18n'
import type { DeviceMode, PageBlock } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  slug: string
  status: string
  blocks: PageBlock[]
  device: DeviceMode
  onDeviceChange: (d: DeviceMode) => void
  locale?: BuilderLocale
  onLocaleChange?: (l: BuilderLocale) => void
  dirty?: boolean
  showHeader?: boolean
  showFooter?: boolean
  onSaveDraft?: () => void
  onPublish?: () => void
  saving?: boolean
  publishing?: boolean
  liveHref?: string | null
}

/**
 * Fullscreen pre-publish preview of the current canvas (includes unsaved edits).
 * Uses admin panel theme colours.
 */
export function PagePreview({
  open,
  onClose,
  title,
  slug,
  status,
  blocks,
  device,
  onDeviceChange,
  locale = 'en',
  onLocaleChange,
  dirty,
  showHeader = true,
  showFooter = true,
  onSaveDraft,
  onPublish,
  saving,
  publishing,
  liveHref,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const width =
    device === 'mobile' ? 390 : device === 'tablet' ? 768 : '100%'

  return (
    <div className="builder-preview admin-app fixed inset-0 z-[100] flex flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--a-border)] bg-[var(--a-header-bg)] px-3 backdrop-blur sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--a-primary-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-primary-soft-text)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--a-primary)]" />
            Preview
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--a-text)]">{title}</p>
            <p className="truncate font-mono text-[10px] text-[var(--a-muted)]">
              /p/{slug}
              {dirty ? ' · includes unsaved changes' : ''}
            </p>
          </div>
          <span
            className={cn(
              'hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:inline',
              status === 'published'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
            )}
          >
            {status}
          </span>
        </div>

        {onLocaleChange && (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--a-border)] bg-[var(--a-surface-2)] px-2 py-1">
            <span className="hidden text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)] sm:inline">
              Lang
            </span>
            <LocaleSwitcher value={locale} onChange={onLocaleChange} />
          </div>
        )}
        <div className="flex items-center gap-2 rounded-xl border border-[var(--a-border)] bg-[var(--a-surface-2)] px-2 py-1">
          <span className="hidden text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)] sm:inline">
            Device
          </span>
          <DeviceSwitcher value={device} onChange={onDeviceChange} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {liveHref && (
            <a
              href={liveHref}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold text-[var(--a-muted)] transition hover:bg-[var(--a-primary-soft)] hover:text-[var(--a-primary-soft-text)] sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live
            </a>
          )}
          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saving || publishing}
              className="builder-btn-ghost hidden h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold disabled:opacity-60 sm:flex"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Save draft
            </button>
          )}
          {onPublish && (
            <button
              type="button"
              onClick={onPublish}
              disabled={saving || publishing}
              className="builder-btn-primary flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold disabled:opacity-60"
            >
              {publishing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Publish
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-[var(--a-primary-soft)] px-3 text-xs font-semibold text-[var(--a-primary-soft-text)] transition hover:opacity-90"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back to editor</span>
            <X className="h-3.5 w-3.5 sm:hidden" />
          </button>
        </div>
      </header>

      <div className="builder-preview-stage min-h-0 flex-1 overflow-auto p-4 sm:p-8">
        <div
          className={cn(
            'builder-preview-frame mx-auto min-h-[min(100%,720px)] overflow-hidden bg-white transition-all duration-300',
            device === 'desktop' ? 'rounded-xl' : 'rounded-[1.25rem]',
            device !== 'desktop' && 'builder-viewport-device',
          )}
          style={{
            width: typeof width === 'number' ? width : width,
            maxWidth: '100%',
            minHeight: 'calc(100svh - 8rem)',
          }}
        >
          {blocks.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 bg-[var(--a-surface-2)] p-10 text-center">
              <p className="text-sm font-semibold text-[var(--a-text)]">Nothing to preview</p>
              <p className="max-w-xs text-xs text-[var(--a-muted)]">
                Add components in the editor, then open preview again.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="builder-btn-primary mt-3 rounded-lg px-4 py-2 text-xs font-semibold"
              >
                Back to editor
              </button>
            </div>
          ) : (
            <PageDocument
              blocks={blocks}
              editable={false}
              showHeader={showHeader}
              showFooter={showFooter}
              locale={locale}
            />
          )}
        </div>
      </div>

      <footer className="flex h-9 shrink-0 items-center justify-center border-t border-[var(--a-border)] bg-[var(--a-surface)] text-[10px] text-[var(--a-muted)]">
        Preview only — visitors will not see this until you publish
        <span className="mx-2 opacity-40">·</span>
        Press{' '}
        <kbd className="mx-1 rounded border border-[var(--a-border)] bg-[var(--a-surface-2)] px-1.5 py-0.5 font-mono text-[var(--a-text)]">
          Esc
        </kbd>{' '}
        to exit
      </footer>
    </div>
  )
}
