'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import I18nProvider from '@/components/i18n-provider'
import { formsApi } from '@/lib/api/forms.api'
import { ApiError } from '@/lib/api/types'
import {
  getLocalized,
  isRtl,
  toBuilderLocale,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import type { FormDetail, FormField } from '@/lib/builder/types'
import { normalizeFormSchema } from '@/lib/builder/utils'
import { cn } from '@/lib/utils'

export default function PublicFormRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <I18nProvider>
      <PublicFormInner params={params} />
    </I18nProvider>
  )
}

function PublicFormInner({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { i18n } = useTranslation()
  const locale = toBuilderLocale(i18n.language)
  const [form, setForm] = useState<FormDetail | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await formsApi.getPublic(slug)
        if (!cancelled) setForm(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Form not found')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  const sections = useMemo(
    () => (form ? normalizeFormSchema(form.schema).sections : []),
    [form],
  )

  const setValue = (id: string, value: unknown) => {
    setValues((v) => ({ ...v, [id]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    try {
      setSubmitting(true)
      setError(null)
      const res = await formsApi.submit(slug, values)
      const localized =
        getLocalized(form.settings?.successMessage, locale, '') || res.message
      setSuccess(localized)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-100 text-sm text-slate-500">
        Loading form…
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-slate-100">
        <p className="text-sm font-semibold text-slate-700">{error || 'Form not found'}</p>
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          Back home
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div
        className="flex min-h-svh flex-col items-center justify-center gap-3 bg-slate-100 px-4"
        dir={isRtl(locale) ? 'rtl' : 'ltr'}
        lang={locale}
      >
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            ✓
          </div>
          <h1 className="text-lg font-bold text-slate-800">
            {locale === 'ar' ? 'تم الإرسال' : 'Submitted'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{success}</p>
        </div>
      </div>
    )
  }

  const submitLabel = getLocalized(form.settings?.submitLabel, locale, 'Submit')
  const dir = isRtl(locale) ? 'rtl' : 'ltr'

  return (
    <div className="min-h-svh bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-10">
      <form
        onSubmit={submit}
        className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
        dir={dir}
        lang={locale}
      >
        <header className="border-b border-slate-100 pb-5">
          <div className="mb-3 flex justify-end">
            <PublicLangToggle />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
          {form.description && (
            <p className="mt-1 text-sm text-slate-500">{form.description}</p>
          )}
        </header>

        {sections.map((section) => (
          <fieldset key={section.id} className="space-y-3">
            <legend className="text-sm font-bold text-slate-800">
              {getLocalized(section.title, locale, '')}
            </legend>
            <div className="flex flex-wrap gap-3">
              {section.fields.map((field) => (
                <PublicField
                  key={field.id}
                  field={field}
                  locale={locale}
                  value={values[field.id]}
                  onChange={(v) => setValue(field.id, v)}
                />
              ))}
            </div>
          </fieldset>
        ))}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? (locale === 'ar' ? 'جارٍ الإرسال…' : 'Sending…') : submitLabel}
        </button>
      </form>
    </div>
  )
}

function PublicLangToggle() {
  const { i18n } = useTranslation()
  const current = toBuilderLocale(i18n.language)
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
      {(['en', 'ar'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => i18n.changeLanguage(l)}
          className={cn(
            'rounded-md px-2.5 py-1 transition',
            current === l
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-white',
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function PublicField({
  field,
  value,
  onChange,
  locale,
}: {
  field: FormField
  value: unknown
  onChange: (v: unknown) => void
  locale: BuilderLocale
}) {
  const label = getLocalized(field.label, locale, '')
  const placeholder = getLocalized(field.placeholder, locale, '')
  const helpText = getLocalized(field.helpText, locale, '')

  if (field.type === 'section_break') {
    return (
      <div className="w-full border-t border-dashed border-slate-200 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
    )
  }

  const width = field.width === 'full' ? 'w-full' : 'w-full sm:w-[calc(50%-6px)]'
  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

  return (
    <label className={cn('block', width)}>
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
        {field.required && <span className="text-red-500"> *</span>}
      </span>
      {field.type === 'paragraph' ? (
        <textarea
          className={cn(inputClass, 'min-h-[96px]')}
          required={field.required}
          placeholder={placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === 'dropdown' ? (
        <select
          className={inputClass}
          required={field.required}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder || 'Select…'}</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {getLocalized(o.label, locale, o.value)}
            </option>
          ))}
        </select>
      ) : field.type === 'radio' ? (
        <div className="space-y-1.5">
          {(field.options ?? []).map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name={field.id}
                required={field.required}
                checked={value === o.value}
                onChange={() => onChange(o.value)}
              />
              {getLocalized(o.label, locale, o.value)}
            </label>
          ))}
        </div>
      ) : field.type === 'checkbox' ? (
        <div className="space-y-1.5">
          {(field.options ?? []).map((o) => {
            const arr = Array.isArray(value) ? (value as string[]) : []
            const checked = arr.includes(o.value)
            return (
              <label key={o.value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onChange(
                      checked ? arr.filter((x) => x !== o.value) : [...arr, o.value],
                    )
                  }}
                />
                {getLocalized(o.label, locale, o.value)}
              </label>
            )
          })}
        </div>
      ) : field.type === 'file' ? (
        <input
          type="file"
          className={inputClass}
          onChange={(e) => onChange(e.target.files?.[0]?.name ?? '')}
        />
      ) : (
        <input
          type={
            field.type === 'email'
              ? 'email'
              : field.type === 'number'
                ? 'number'
                : field.type === 'date'
                  ? 'date'
                  : 'text'
          }
          className={inputClass}
          required={field.required}
          placeholder={placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {helpText && (
        <span className="mt-1 block text-[11px] text-slate-400">{helpText}</span>
      )}
    </label>
  )
}
