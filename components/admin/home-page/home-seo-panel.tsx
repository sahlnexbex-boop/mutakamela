'use client'

import { ImageSourceField } from '@/components/builder/shared/image-source-field'
import {
  getLocalized,
  setLocalized,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import type { PageSettings } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  settings: PageSettings
  locale: BuilderLocale
  onChange: (settings: PageSettings) => void
}

export function HomeSeoPanel({ settings, locale, onChange }: Props) {
  const set = <K extends keyof PageSettings>(key: K, value: PageSettings[K]) => {
    onChange({ ...settings, [key]: value })
  }

  const seoTitle = getLocalized(settings.seoTitle, locale, '')
  const seoDesc = getLocalized(settings.seoDescription, locale, '')
  const seoKeywords = getLocalized(settings.seoKeywords, locale, '')

  const titlePreview =
    seoTitle.trim() ||
    'Mutakamela Insurance | Protection for today, peace of mind for tomorrow'
  const descPreview =
    seoDesc.trim() ||
    'Comprehensive insurance solutions for you, your family and your business.'

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-[var(--a-text)]">Search & social SEO</h3>
        <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--a-text-secondary)]">
          Metadata for the public home page at{' '}
          <span className="font-mono text-[var(--a-primary)]">/</span>. Switch language
          above to edit EN and AR independently.
        </p>
      </div>

      {/* SERP preview */}
      <div className="overflow-hidden rounded-xl border border-[var(--a-border)] bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Google preview · {locale.toUpperCase()}
          </p>
        </div>
        <div
          className="space-y-0.5 p-3.5"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          lang={locale}
        >
          <p className="truncate text-[15px] font-medium leading-snug text-[#1a0dab]">
            {titlePreview}
          </p>
          <p className="truncate text-[12px] text-[#006621]">
            {settings.canonicalUrl?.trim() || 'yoursite.com/'}
          </p>
          <p className="line-clamp-2 text-[12px] leading-snug text-[#545454]">
            {descPreview}
          </p>
        </div>
      </div>

      <Section title="Search results">
        <Field
          label="SEO title"
          hint={`${seoTitle.length}/60 · ideal under 60 characters`}
          warn={seoTitle.length > 60}
        >
          <input
            className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
            value={seoTitle}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            maxLength={120}
            placeholder="Page title in search results"
            onChange={(e) => set('seoTitle', setLocalized(settings.seoTitle, locale, e.target.value))}
          />
        </Field>

        <Field
          label="Meta description"
          hint={`${seoDesc.length}/160 · ideal under 160 characters`}
          warn={seoDesc.length > 160}
        >
          <textarea
            className="login-input min-h-[88px] w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none transition"
            value={seoDesc}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            maxLength={300}
            placeholder="Brief summary shown under the title in Google…"
            onChange={(e) =>
              set('seoDescription', setLocalized(settings.seoDescription, locale, e.target.value))
            }
          />
        </Field>

        <Field label="Keywords" hint="Comma-separated (optional)">
          <input
            className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
            value={seoKeywords}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            placeholder="insurance, mutakamela, claims"
            onChange={(e) =>
              set('seoKeywords', setLocalized(settings.seoKeywords, locale, e.target.value))
            }
          />
        </Field>

        <Field label="Canonical URL" hint="Leave empty to use the site root URL">
          <input
            className="login-input w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none transition"
            value={settings.canonicalUrl ?? ''}
            placeholder="https://example.com/"
            onChange={(e) => set('canonicalUrl', e.target.value)}
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[var(--a-border)] bg-[var(--a-surface-2)] px-3 py-2.5">
          <input
            type="checkbox"
            checked={!!settings.noIndex}
            onChange={(e) => set('noIndex', e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-[var(--a-primary)]"
          />
          <span>
            <span className="block text-xs font-semibold text-[var(--a-text)]">
              Hide from search engines
            </span>
            <span className="text-[10px] leading-snug text-[var(--a-muted)]">
              Adds <span className="font-mono">noindex, nofollow</span> robots meta. Use
              carefully on the live home page.
            </span>
          </span>
        </label>
      </Section>

      <Section title="Social / Open Graph">
        <div className="admin-home-media">
          <ImageSourceField
            label="Share image (OG)"
            value={settings.ogImage ?? ''}
            onChange={(url) => set('ogImage', url)}
            placeholder="/images/home.png"
            helpText="Recommended 1200×630. Shown when the home page is shared."
          />
        </div>
        <div className="admin-home-media mt-3">
          <ImageSourceField
            label="Favicon"
            value={settings.favicon ?? ''}
            onChange={(url) => set('favicon', url)}
            placeholder="/favicon.ico"
            helpText="Browser tab icon for the public site."
          />
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-3.5 sm:p-4">
      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--a-muted)]">
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  warn,
  children,
}: {
  label: string
  hint?: string
  warn?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
          {label}
        </span>
        {hint && (
          <span
            className={cn(
              'text-[10px]',
              warn ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-[var(--a-muted)]',
            )}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  )
}
