'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, Languages, Loader2, Sparkles } from 'lucide-react'
import { ApiError } from '@/lib/api/types'
import { directionFromLocales, translateApi } from '@/lib/api/translate.api'
import {
  getEnglishSource,
  getLocalized,
  localizationCoverage,
  localeFlag,
  localeFullLabel,
  localeLabel,
  setLocalized,
  type BuilderLocale,
  type LocalizedText,
} from '@/lib/builder/i18n'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: unknown
  locale: BuilderLocale
  onChange: (next: LocalizedText) => void
  multiline?: boolean
  placeholder?: string
  maxLength?: number
  className?: string
  inputClassName?: string
  /** Hide “Copy from English” helper */
  hideCopy?: boolean
  /**
   * When true, field has its own EN/AR tabs (default).
   * Edits do not require flipping the canvas locale.
   */
  dualTabs?: boolean
  /** Hide auto-translate control */
  hideTranslate?: boolean
}

export function LocalizedField({
  label,
  value,
  locale,
  onChange,
  multiline,
  placeholder,
  maxLength,
  className,
  inputClassName,
  hideCopy,
  dualTabs = true,
  hideTranslate,
}: Props) {
  const [fieldLocale, setFieldLocale] = useState<BuilderLocale>(locale)
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [translateOk, setTranslateOk] = useState(false)

  // Follow canvas language when user switches preview locale
  useEffect(() => {
    setFieldLocale(locale)
  }, [locale])

  const active = dualTabs ? fieldLocale : locale
  const current = getLocalized(value, active, '')
  const enSource = getEnglishSource(value)
  const arSource = getLocalized(value, 'ar', '')
  const coverage = localizationCoverage(value)
  const showCopy =
    !hideCopy && active === 'ar' && !coverage.ar && !!enSource.trim()

  const targetLocale: BuilderLocale = active === 'en' ? 'ar' : 'en'
  const sourceText =
    active === 'en' ? current.trim() : getLocalized(value, active, '').trim()
  const canTranslate =
    !hideTranslate && sourceText.length > 0 && !translating

  const dir = active === 'ar' ? 'rtl' : 'ltr'
  const isAr = active === 'ar'
  const sharedClass = cn(
    'builder-input',
    isAr && 'text-right',
    isAr && 'builder-input-ar',
    inputClassName,
  )

  const runTranslate = async () => {
    const from = active
    const to = targetLocale
    const direction = directionFromLocales(from, to)
    const text = getLocalized(value, from, '').trim()
    if (!direction || !text) return

    setTranslating(true)
    setTranslateError(null)
    setTranslateOk(false)
    try {
      const result = await translateApi.translate(text, direction)
      onChange(setLocalized(value, to, result.text))
      setFieldLocale(to)
      setTranslateOk(true)
      window.setTimeout(() => setTranslateOk(false), 2200)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Translation failed. Try again.'
      setTranslateError(message)
    } finally {
      setTranslating(false)
    }
  }

  return (
    <div
      className={cn(
        'builder-localized-field rounded-lg border transition-colors',
        isAr ? 'builder-localized-field-ar' : 'builder-localized-field-en',
        className,
      )}
    >
      <div className="builder-localized-field-head flex items-center justify-between gap-2 px-2 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Languages className="h-3.5 w-3.5 shrink-0 opacity-80" />
          {label ? (
            <span className="builder-localized-field-label truncate text-[10px] font-bold uppercase tracking-wide">
              {label}
            </span>
          ) : null}
          <CoverageDots en={coverage.en} ar={coverage.ar} />
        </div>

        {dualTabs ? (
          <div className="builder-lang-tabs flex shrink-0 items-center gap-0.5 rounded-full p-0.5">
            {(['en', 'ar'] as const).map((loc) => {
              const on = fieldLocale === loc
              const filled = loc === 'en' ? coverage.en : coverage.ar
              return (
                <button
                  key={loc}
                  type="button"
                  title={localeFullLabel(loc)}
                  onClick={() => {
                    setFieldLocale(loc)
                    setTranslateError(null)
                  }}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition',
                    on
                      ? loc === 'ar'
                        ? 'builder-lang-tab-ar-on'
                        : 'builder-lang-tab-en-on'
                      : 'builder-lang-tab-off',
                  )}
                >
                  <span aria-hidden>{localeFlag(loc)}</span>
                  {localeLabel(loc)}
                  {filled ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <span className="builder-lang-tab-dot h-1.5 w-1.5 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
              isAr ? 'builder-lang-tab-ar-on' : 'builder-lang-tab-en-on',
            )}
          >
            <span aria-hidden>{localeFlag(active)}</span>
            {localeLabel(active)}
          </span>
        )}
      </div>

      <div className="p-2 pt-1.5">
        {multiline ? (
          <textarea
            className={cn(sharedClass, 'min-h-[64px] resize-y py-1.5')}
            value={current}
            dir={dir}
            lang={active}
            maxLength={maxLength}
            placeholder={
              placeholder ??
              (isAr ? 'أدخل النص بالعربية…' : 'Enter English text…')
            }
            onChange={(e) => {
              setTranslateError(null)
              onChange(setLocalized(value, active, e.target.value))
            }}
          />
        ) : (
          <input
            className={sharedClass}
            value={current}
            dir={dir}
            lang={active}
            maxLength={maxLength}
            placeholder={
              placeholder ??
              (isAr ? 'أدخل النص بالعربية…' : 'Enter English text…')
            }
            onChange={(e) => {
              setTranslateError(null)
              onChange(setLocalized(value, active, e.target.value))
            }}
          />
        )}

        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5">
          <p className="builder-localized-field-hint text-[10px] font-medium">
            {isAr ? (
              <span dir="rtl" className="inline-flex items-center gap-1">
                <span>العربية</span>
                <span>· RTL</span>
              </span>
            ) : (
              <span>English · LTR</span>
            )}
          </p>

          <div className="flex flex-wrap items-center justify-end gap-1">
            {showCopy && (
              <button
                type="button"
                className="builder-copy-en-btn inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition"
                onClick={() => onChange(setLocalized(value, 'ar', enSource))}
              >
                <Copy className="h-3 w-3" />
                Copy EN
              </button>
            )}

            {!hideTranslate && (
              <button
                type="button"
                disabled={!canTranslate}
                title={
                  sourceText
                    ? `Auto-translate ${localeLabel(active)} → ${localeLabel(targetLocale)}`
                    : 'Enter text first, then translate'
                }
                onClick={() => void runTranslate()}
                className={cn(
                  'builder-auto-translate-btn inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition disabled:cursor-not-allowed disabled:opacity-45',
                  active === 'en'
                    ? 'builder-auto-translate-en-ar'
                    : 'builder-auto-translate-ar-en',
                )}
              >
                {translating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {translating
                  ? 'Translating…'
                  : active === 'en'
                    ? 'EN → AR'
                    : 'AR → EN'}
              </button>
            )}

            {translateOk && (
              <span className="builder-bilingual-ok inline-flex items-center gap-1 text-[10px] font-bold">
                <Check className="h-3 w-3" strokeWidth={3} />
                Done
              </span>
            )}

            {!translateOk && coverage.complete && (
              <span className="builder-bilingual-ok inline-flex items-center gap-1 text-[10px] font-bold">
                <Check className="h-3 w-3" strokeWidth={3} />
                Bilingual
              </span>
            )}
          </div>
        </div>

        {translateError && (
          <p className="builder-translate-error mt-1.5 text-[10px] font-medium leading-snug">
            {translateError}
          </p>
        )}

        {!hideTranslate && !sourceText && (
          <p className="mt-1 text-[9px] text-[var(--b-muted)]">
            Type in {localeLabel(active)}, then click{' '}
            <strong>{active === 'en' ? 'EN → AR' : 'AR → EN'}</strong> to
            auto-translate
            {active === 'en' && arSource
              ? ' (will replace Arabic)'
              : active === 'ar' && enSource
                ? ' (will replace English)'
                : ''}
            .
          </p>
        )}
      </div>
    </div>
  )
}

function CoverageDots({ en, ar }: { en: boolean; ar: boolean }) {
  return (
    <span className="inline-flex items-center gap-1" title="Translation coverage">
      <span
        className={cn(
          'inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[8px] font-extrabold',
          en ? 'builder-cov-en-on' : 'builder-cov-off',
        )}
        title={en ? 'English filled' : 'English missing'}
      >
        EN
      </span>
      <span
        className={cn(
          'inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[8px] font-extrabold',
          ar ? 'builder-cov-ar-on' : 'builder-cov-off',
        )}
        title={ar ? 'Arabic filled' : 'Arabic missing'}
      >
        AR
      </span>
    </span>
  )
}
