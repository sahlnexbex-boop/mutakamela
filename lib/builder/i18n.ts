/** Locale helpers for page/form builder bilingual content */

export const BUILDER_LOCALES = ['en', 'ar'] as const

export type BuilderLocale = (typeof BUILDER_LOCALES)[number]

/** Plain string = legacy English-only; object = bilingual */
export type LocalizedText = string | { en?: string; ar?: string }

export function isBuilderLocale(value: string): value is BuilderLocale {
  return value === 'en' || value === 'ar'
}

/** Map site/i18next language codes to a builder locale */
export function toBuilderLocale(lang: string | undefined | null): BuilderLocale {
  if (!lang) return 'en'
  const base = lang.toLowerCase().split('-')[0]
  return base === 'ar' ? 'ar' : 'en'
}

export function isRtl(locale: BuilderLocale): boolean {
  return locale === 'ar'
}

export function localeLabel(locale: BuilderLocale): string {
  return locale === 'ar' ? 'AR' : 'EN'
}

export function localeFullLabel(locale: BuilderLocale): string {
  return locale === 'ar' ? 'العربية' : 'English'
}

function asLocalizedObject(value: unknown): { en?: string; ar?: string } | null {
  if (value == null) return null
  if (typeof value === 'string') return { en: value }
  if (typeof value === 'object' && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    const en = typeof o.en === 'string' ? o.en : undefined
    const ar = typeof o.ar === 'string' ? o.ar : undefined
    if (en !== undefined || ar !== undefined) return { en, ar }
  }
  return null
}

/**
 * Resolve a localized value for display.
 * Plain strings are treated as English and used as fallback for Arabic.
 */
export function getLocalized(
  value: unknown,
  locale: BuilderLocale,
  fallback = '',
): string {
  if (value == null) return fallback
  if (typeof value === 'string') return value || fallback
  const obj = asLocalizedObject(value)
  if (!obj) return fallback
  const primary = obj[locale]
  if (primary != null && primary !== '') return primary
  if (locale === 'ar' && obj.en) return obj.en
  if (locale === 'en' && obj.ar) return obj.ar
  return fallback
}

/** Merge a new string for one locale into a LocalizedText value. */
export function setLocalized(
  value: unknown,
  locale: BuilderLocale,
  next: string,
): LocalizedText {
  const obj = asLocalizedObject(value) ?? {}
  return { ...obj, [locale]: next }
}

/** English source string (for “Copy from English”). */
export function getEnglishSource(value: unknown): string {
  return getLocalized(value, 'en', '')
}

export function hasArabic(value: unknown): boolean {
  const obj = asLocalizedObject(value)
  return !!(obj?.ar && obj.ar.trim())
}

export function hasEnglish(value: unknown): boolean {
  if (typeof value === 'string') return !!value.trim()
  const obj = asLocalizedObject(value)
  return !!(obj?.en && obj.en.trim())
}

/** Which locales currently have non-empty content */
export function localizationCoverage(value: unknown): {
  en: boolean
  ar: boolean
  complete: boolean
  partial: boolean
  empty: boolean
} {
  const en = hasEnglish(value)
  const ar = hasArabic(value)
  return {
    en,
    ar,
    complete: en && ar,
    partial: (en && !ar) || (!en && ar),
    empty: !en && !ar,
  }
}

export function localeFlag(locale: BuilderLocale): string {
  return locale === 'ar' ? '🇸🇦' : '🇬🇧'
}

export function localeShortHint(locale: BuilderLocale): string {
  return locale === 'ar' ? 'RTL' : 'LTR'
}
