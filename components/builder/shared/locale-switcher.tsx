'use client'

import {
  BUILDER_LOCALES,
  localeFlag,
  localeFullLabel,
  localeLabel,
  localeShortHint,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import { cn } from '@/lib/utils'

export function LocaleSwitcher({
  value,
  onChange,
  className,
  size = 'md',
  showNames = false,
}: {
  value: BuilderLocale
  onChange: (locale: BuilderLocale) => void
  className?: string
  size?: 'sm' | 'md'
  /** Show full language name instead of EN/AR codes */
  showNames?: boolean
}) {
  return (
    <div
      className={cn(
        'builder-locale-switch inline-flex items-center rounded-full p-0.5',
        className,
      )}
      role="group"
      aria-label="Content language"
    >
      {BUILDER_LOCALES.map((locale) => {
        const active = value === locale
        const isAr = locale === 'ar'
        return (
          <button
            key={locale}
            type="button"
            title={`${localeFullLabel(locale)} · ${localeShortHint(locale)}`}
            onClick={() => onChange(locale)}
            className={cn(
              'relative flex items-center gap-1 rounded-full font-bold tracking-wide transition-all',
              size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
              active
                ? isAr
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                  : 'bg-gradient-to-r from-[var(--a-primary)] to-[var(--a-accent)] text-white shadow-md shadow-[color-mix(in_srgb,var(--a-primary)_30%,transparent)]'
                : 'text-[var(--b-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--b-text)]',
            )}
          >
            <span className="text-[12px] leading-none" aria-hidden>
              {localeFlag(locale)}
            </span>
            <span>{showNames ? localeFullLabel(locale) : localeLabel(locale)}</span>
            {active && (
              <span
                className={cn(
                  'ml-0.5 rounded px-1 py-px text-[8px] font-bold uppercase tracking-wider',
                  isAr ? 'bg-white/20' : 'bg-white/20',
                )}
              >
                {localeShortHint(locale)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
