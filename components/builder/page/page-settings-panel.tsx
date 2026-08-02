'use client'

import { ImageSourceField } from '@/components/builder/shared/image-source-field'
import { LocalizedField } from '@/components/builder/shared/localized-field'
import { getLocalized, type BuilderLocale } from '@/lib/builder/i18n'
import type { PageSettings } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  slug: string
  settings: PageSettings
  status: string
  locale?: BuilderLocale
  onTitleChange: (title: string) => void
  onSlugChange: (slug: string) => void
  onSettingsChange: (settings: PageSettings) => void
}

export function PageSettingsPanel({
  title,
  slug,
  settings,
  status,
  locale = 'en',
  onTitleChange,
  onSlugChange,
  onSettingsChange,
}: Props) {
  const set = <K extends keyof PageSettings>(key: K, value: PageSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const seoTitlePreview =
    getLocalized(settings.seoTitle, locale, '') || title || 'Page title'
  const seoDescPreview =
    getLocalized(settings.seoDescription, locale, '') ||
    'Meta description will appear here. Write a clear summary for search engines.'

  return (
    <div className="space-y-2.5">
      <div>
        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
          Page settings
        </p>
        <h3 className="text-xs font-semibold text-[var(--b-text)]">SEO & URL</h3>
      </div>

      <Section title="Identity">
        <Field label="Page title">
          <input
            className="builder-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Home"
          />
        </Field>
        <Field label="URL slug">
          <div className="flex items-center gap-1">
            <span className="shrink-0 rounded-md bg-[var(--a-surface-2)] px-2 py-2 text-[11px] text-[var(--b-muted)]">
              /p/
            </span>
            <input
              className="builder-input flex-1 font-mono text-xs"
              value={slug}
              onChange={(e) => onSlugChange(slugifyLive(e.target.value))}
              placeholder="home"
            />
          </div>
          <p className="mt-1 text-[10px] text-[var(--b-muted)]">
            Public URL: <span className="font-mono text-[var(--a-primary-soft-text)]">/p/{slug || '…'}</span>
          </p>
        </Field>
        <div className="flex items-center justify-between rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] px-3 py-2">
          <span className="text-[11px] text-[var(--b-muted)]">Status</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              status === 'published'
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-amber-500/15 text-amber-300',
            )}
          >
            {status}
          </span>
        </div>
      </Section>

      <Section title="Site chrome">
        <p className="mb-2 text-[11px] leading-relaxed text-[var(--b-muted)]">
          Use the same header and footer as the public marketing site. Enabled by default.
        </p>
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] px-3 py-2.5">
          <input
            type="checkbox"
            checked={settings.showHeader !== false}
            onChange={(e) => set('showHeader', e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-[var(--a-primary)]"
          />
          <span>
            <span className="block text-xs font-semibold text-[var(--b-text)]">
              Show site header
            </span>
            <span className="text-[10px] leading-snug text-[var(--b-muted)]">
              Public navbar (logo, menus, language).
            </span>
          </span>
        </label>
        <label className="mt-2 flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] px-3 py-2.5">
          <input
            type="checkbox"
            checked={settings.showFooter !== false}
            onChange={(e) => set('showFooter', e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-[var(--a-primary)]"
          />
          <span>
            <span className="block text-xs font-semibold text-[var(--b-text)]">
              Show site footer
            </span>
            <span className="text-[10px] leading-snug text-[var(--b-muted)]">
              Public footer (links, contact, socials).
            </span>
          </span>
        </label>
      </Section>

      <Section title="Header menu">
        <p className="mb-2 text-[11px] leading-relaxed text-[var(--b-muted)]">
          Optionally add this page as a link in the public site header navigation. Only
          published pages appear in the menu.
        </p>
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] px-3 py-2.5">
          <input
            type="checkbox"
            checked={!!settings.showInHeaderMenu}
            onChange={(e) => set('showInHeaderMenu', e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-[var(--a-primary)]"
          />
          <span>
            <span className="block text-xs font-semibold text-[var(--b-text)]">
              Link in header menu
            </span>
            <span className="text-[10px] leading-snug text-[var(--b-muted)]">
              Show a nav item pointing to /p/{slug || '…'} when published.
            </span>
          </span>
        </label>
        {settings.showInHeaderMenu ? (
          <div className="mt-2.5 space-y-2.5">
            <LocalizedField
              label="Menu label"
              value={settings.headerMenuLabel}
              locale={locale}
              onChange={(next) => set('headerMenuLabel', next)}
              placeholder={title || 'Page title'}
            />
            <p className="text-[10px] text-[var(--b-muted)]">
              Leave blank to use the page title. Supports EN/AR via the locale switcher.
            </p>
            <Field label="Menu order">
              <input
                type="number"
                className="builder-input"
                value={settings.headerMenuOrder ?? 0}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  set('headerMenuOrder', Number.isFinite(n) ? n : 0)
                }}
                min={0}
                step={1}
              />
            </Field>
            <p className="text-[10px] text-[var(--b-muted)]">
              Lower numbers appear first among linked CMS pages.
            </p>
          </div>
        ) : null}
      </Section>

      <Section title="SEO">
        <LocalizedField
          label="SEO title"
          value={settings.seoTitle}
          locale={locale}
          onChange={(next) => set('seoTitle', next)}
          placeholder={title || 'Page title for search results'}
          maxLength={70}
        />
        <CharCount value={getLocalized(settings.seoTitle, locale, '')} max={60} />
        <LocalizedField
          label="Meta description"
          value={settings.seoDescription}
          locale={locale}
          onChange={(next) => set('seoDescription', next)}
          multiline
          placeholder="Brief summary shown in Google and social previews…"
          maxLength={180}
        />
        <CharCount value={getLocalized(settings.seoDescription, locale, '')} max={160} />
        <LocalizedField
          label="Keywords"
          value={settings.seoKeywords}
          locale={locale}
          onChange={(next) => set('seoKeywords', next)}
          placeholder="insurance, claims, mutakamela"
        />
        <p className="mt-1 text-[10px] text-[var(--b-muted)]">Comma-separated</p>
        <Field label="Canonical URL">
          <input
            className="builder-input"
            value={settings.canonicalUrl ?? ''}
            onChange={(e) => set('canonicalUrl', e.target.value)}
            placeholder="https://example.com/p/home"
          />
        </Field>
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] px-3 py-2.5">
          <input
            type="checkbox"
            checked={!!settings.noIndex}
            onChange={(e) => set('noIndex', e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-[var(--a-primary)]"
          />
          <span>
            <span className="block text-xs font-semibold text-[var(--b-text)]">
              No index
            </span>
            <span className="text-[10px] leading-snug text-[var(--b-muted)]">
              Ask search engines not to list this page (adds noindex robots meta).
            </span>
          </span>
        </label>
      </Section>

      <Section title="Social / Open Graph">
        <ImageSourceField
          label="OG image"
          value={settings.ogImage ?? ''}
          onChange={(url) => set('ogImage', url)}
          placeholder="https://…/share-image.jpg"
          helpText="Image shown when the page is shared on social media."
        />
        <ImageSourceField
          label="Favicon"
          value={settings.favicon ?? ''}
          onChange={(url) => set('favicon', url)}
          placeholder="/favicon.ico"
          helpText="Browser tab icon (PNG or ICO recommended)."
        />
      </Section>

      <Section title="SERP preview">
        <div
          className="rounded-lg border border-[var(--b-border)] bg-white p-3"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          lang={locale}
        >
          <p className="truncate text-[13px] font-medium text-[#1a0dab]">
            {seoTitlePreview}
          </p>
          <p className="truncate text-[11px] text-[#006621]">
            {settings.canonicalUrl || `yoursite.com/p/${slug || 'page'}`}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#545454]">
            {seoDescPreview}
          </p>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] p-2">
      <h4 className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[9px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
        {label}
      </span>
      {children}
    </label>
  )
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length
  return (
    <p
      className={cn(
        'mt-1 text-right text-[10px]',
        len > max ? 'text-amber-400' : 'text-[var(--b-muted)]',
      )}
    >
      {len}/{max}
    </p>
  )
}

/** Allow typing while normalizing separators; keep empty mid-edit friendly */
function slugifyLive(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-/, '')
    .slice(0, 200)
}
