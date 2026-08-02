'use client'

import {
  getLocalized,
  setLocalized,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import {
  HOME_SECTION_META,
  defaultHomeFaqs,
  defaultHomeStories,
} from '@/lib/home/defaults'
import type { HomeSection, HomeSectionCopy } from '@/lib/home/types'
import { ImageSourceField } from '@/components/builder/shared/image-source-field'
import { HomeFaqsEditor } from '@/components/admin/home-page/home-faqs-editor'
import { HomeStoriesEditor } from '@/components/admin/home-page/home-stories-editor'
import { cn } from '@/lib/utils'
import { ExternalLink, Link2, Smartphone } from 'lucide-react'

type Props = {
  section: HomeSection
  locale: BuilderLocale
  onChange: (section: HomeSection) => void
}

const FIELD_MAP: Record<
  HomeSection['key'],
  Array<keyof HomeSectionCopy>
> = {
  hero: ['badge', 'title', 'titleHighlight', 'subtitle', 'imageUrl'],
  'quick-actions': ['title'],
  products: ['title', 'subtitle'],
  'why-us': ['badge', 'title', 'subtitle'],
  'claim-services': ['badge', 'title', 'subtitle'],
  'how-it-works': ['badge', 'title'],
  'app-experience': ['badge', 'title', 'subtitle', 'ctaLabel', 'imageUrl'],
  testimonials: ['badge', 'title'],
  faq: ['badge', 'title', 'subtitle', 'imageUrl'],
}

const LABELS: Record<keyof HomeSectionCopy, string> = {
  badge: 'Badge / kicker',
  title: 'Title',
  titleHighlight: 'Highlighted title word',
  subtitle: 'Subtitle / description',
  ctaLabel: 'CTA button label',
  ctaUrl: 'CTA button URL',
  appStoreUrl: 'App Store URL',
  playStoreUrl: 'Google Play URL',
  scanTitle: 'Scan card title',
  availableOnLabel: 'Available on label',
  imageUrl: 'Image',
}

const MULTILINE: Array<keyof HomeSectionCopy> = ['subtitle']

export function HomeSectionEditor({ section, locale, onChange }: Props) {
  const meta = HOME_SECTION_META[section.key]
  const fields = FIELD_MAP[section.key]
  const isApp = section.key === 'app-experience'
  const isTestimonials = section.key === 'testimonials'
  const isFaq = section.key === 'faq'
  const stories = section.stories ?? defaultHomeStories()
  const faqs = section.faqs ?? defaultHomeFaqs()

  const setCopy = <K extends keyof HomeSectionCopy>(key: K, value: HomeSectionCopy[K]) => {
    onChange({
      ...section,
      copy: { ...section.copy, [key]: value },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white shadow-md',
            meta.accent,
          )}
        >
          {meta.label.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[var(--a-text)]">{meta.label}</h3>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                section.enabled
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-500/15 text-slate-500',
              )}
            >
              {section.enabled ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--a-text-secondary)]">
            {meta.description}
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--a-border)] bg-[var(--a-surface-2)] px-3.5 py-3">
        <span>
          <span className="block text-xs font-semibold text-[var(--a-text)]">
            Show on public home page
          </span>
          <span className="text-[10px] text-[var(--a-muted)]">
            Hidden sections stay saved but are not rendered on{' '}
            <span className="font-mono">/</span>
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={section.enabled}
          onClick={() => onChange({ ...section, enabled: !section.enabled })}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors',
            section.enabled ? 'bg-[var(--a-primary)]' : 'bg-slate-300 dark:bg-slate-600',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              section.enabled && 'translate-x-5',
            )}
          />
        </button>
      </label>

      <div className="rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-3.5 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--a-muted)]">
            Section content
          </h4>
          <span className="rounded-md bg-[var(--a-primary-soft)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--a-primary-soft-text)]">
            {locale.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3">
          {fields.map((field) => {
            if (field === 'imageUrl') {
              return (
                <div key={field} className="admin-home-media">
                  <ImageSourceField
                    label={isApp ? 'Phones / section image' : LABELS.imageUrl}
                    value={section.copy.imageUrl ?? ''}
                    onChange={(url) => setCopy('imageUrl', url)}
                    placeholder="/images/…"
                    helpText={
                      isApp
                        ? 'Graphic shown next to the download card (phones mockup).'
                        : 'Optional override for the section image.'
                    }
                  />
                </div>
              )
            }

            const value = getLocalized(section.copy[field], locale, '')
            const multiline = MULTILINE.includes(field)

            return (
              <label key={field} className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                  {LABELS[field]}
                </span>
                {multiline ? (
                  <textarea
                    className="login-input min-h-[80px] w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none transition"
                    value={value}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={`Enter ${LABELS[field].toLowerCase()}…`}
                    onChange={(e) =>
                      setCopy(field, setLocalized(section.copy[field], locale, e.target.value))
                    }
                  />
                ) : (
                  <input
                    className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                    value={value}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={`Enter ${LABELS[field].toLowerCase()}…`}
                    onChange={(e) =>
                      setCopy(field, setLocalized(section.copy[field], locale, e.target.value))
                    }
                  />
                )}
              </label>
            )
          })}
        </div>
      </div>

      {isTestimonials && (
        <HomeStoriesEditor
          stories={stories}
          locale={locale}
          onChange={(next) => onChange({ ...section, stories: next })}
        />
      )}

      {isFaq && (
        <HomeFaqsEditor
          faqs={faqs}
          locale={locale}
          onChange={(next) => onChange({ ...section, faqs: next })}
        />
      )}

      {isApp && (
        <div className="rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-3.5 sm:p-4">
          <div className="mb-3 flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-300">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--a-muted)]">
                App download links
              </h4>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--a-text-secondary)]">
                Control the purple Download button and App Store / Google Play badges on the
                scan card.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <UrlField
              label="Download App button URL"
              hint="Primary purple CTA under the feature tiles"
              value={section.copy.ctaUrl ?? ''}
              placeholder="https://… or #app"
              onChange={(v) => setCopy('ctaUrl', v)}
            />
            <UrlField
              label="Apple App Store URL"
              hint="Opens from the App Store badge"
              value={section.copy.appStoreUrl ?? ''}
              placeholder="https://apps.apple.com/app/…"
              onChange={(v) => setCopy('appStoreUrl', v)}
            />
            <UrlField
              label="Google Play URL"
              hint="Opens from the Google Play badge"
              value={section.copy.playStoreUrl ?? ''}
              placeholder="https://play.google.com/store/apps/details?id=…"
              onChange={(v) => setCopy('playStoreUrl', v)}
            />

            <div className="border-t border-[var(--a-border)] pt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                  Scan card text
                </span>
                <span className="rounded-md bg-[var(--a-primary-soft)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--a-primary-soft-text)]">
                  {locale.toUpperCase()}
                </span>
              </div>
              <label className="mb-2.5 block">
                <span className="mb-1 block text-[10px] font-medium text-[var(--a-muted)]">
                  Card title
                </span>
                <input
                  className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                  value={getLocalized(section.copy.scanTitle, locale, '')}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  placeholder="Scan to Download Mutakamela App"
                  onChange={(e) =>
                    setCopy(
                      'scanTitle',
                      setLocalized(section.copy.scanTitle, locale, e.target.value),
                    )
                  }
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-medium text-[var(--a-muted)]">
                  “Available on” label
                </span>
                <input
                  className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                  value={getLocalized(section.copy.availableOnLabel, locale, '')}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  placeholder="Available on"
                  onChange={(e) =>
                    setCopy(
                      'availableOnLabel',
                      setLocalized(section.copy.availableOnLabel, locale, e.target.value),
                    )
                  }
                />
              </label>
            </div>

            {/* Quick link preview */}
            <div className="rounded-lg border border-dashed border-[var(--a-border)] bg-[var(--a-surface-2)] px-3 py-2.5">
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-muted)]">
                Live targets
              </p>
              <ul className="space-y-1 text-[11px]">
                {(
                  [
                    ['CTA', section.copy.ctaUrl || '#app'],
                    ['App Store', section.copy.appStoreUrl || '—'],
                    ['Play Store', section.copy.playStoreUrl || '—'],
                  ] as const
                ).map(([label, href]) => (
                  <li key={label} className="flex items-center gap-2 min-w-0">
                    <Link2 className="h-3 w-3 shrink-0 text-[var(--a-muted)]" />
                    <span className="shrink-0 font-semibold text-[var(--a-text-secondary)]">
                      {label}:
                    </span>
                    {href.startsWith('http') ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-w-0 items-center gap-1 truncate font-mono text-[var(--a-primary)] hover:underline"
                      >
                        <span className="truncate">{href}</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="truncate font-mono text-[var(--a-muted)]">{href}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function UrlField({
  label,
  hint,
  value,
  placeholder,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
        {label}
      </span>
      {hint && (
        <span className="mb-1 block text-[10px] text-[var(--a-muted)]">{hint}</span>
      )}
      <input
        type="url"
        className="login-input w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none transition"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
