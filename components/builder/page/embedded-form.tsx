'use client'

import { useEffect, useMemo, useState } from 'react'
import { formsApi } from '@/lib/api/forms.api'
import { ApiError } from '@/lib/api/types'
import {
  getLocalized,
  isRtl,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import type { FormDetail, FormField } from '@/lib/builder/types'
import { normalizeFormSchema } from '@/lib/builder/utils'
import { cn } from '@/lib/utils'

/** Renders a published form inline (used on public pages). */
export function EmbeddedForm({
  slug,
  title,
  showTitle = true,
  locale = 'en',
}: {
  slug: string
  title?: string
  showTitle?: boolean
  locale?: BuilderLocale
}) {
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
        setError(null)
        const data = await formsApi.getPublic(slug)
        if (!cancelled) setForm(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Form unavailable')
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
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading form…
      </div>
    )
  }

  if (error && !form) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-800">
        {error}
        <p className="mt-2 text-xs text-amber-700/80">
          Publish the form in Form Builder, then refresh this page.
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center"
        dir={isRtl(locale) ? 'rtl' : 'ltr'}
        lang={locale}
      >
        <p className="text-sm font-semibold text-emerald-800">{success}</p>
      </div>
    )
  }

  if (!form) return null

  const heading = title || form.title
  const submitLabel = getLocalized(form.settings?.submitLabel, locale, 'Submit')
  const dir = isRtl(locale) ? 'rtl' : 'ltr'

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      dir={dir}
      lang={locale}
    >
      {showTitle && (
        <header className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">{heading}</h2>
          {form.description && (
            <p className="mt-1 text-sm text-slate-500">{form.description}</p>
          )}
        </header>
      )}

      {sections.map((section) => (
        <fieldset key={section.id} className="space-y-3">
          <legend className="text-sm font-bold text-slate-800">
            {getLocalized(section.title, locale, '')}
          </legend>
          <div className="flex flex-wrap gap-3">
            {section.fields.map((field) => (
              <InlineField
                key={field.id}
                field={field}
                locale={locale}
                value={values[field.id]}
                onChange={(v) => setValues((prev) => ({ ...prev, [field.id]: v }))}
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
        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting ? '…' : submitLabel}
      </button>
    </form>
  )
}

function InlineField({
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
          className={cn(inputClass, 'min-h-[88px]')}
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
      ) : (
        <input
          type={
            field.type === 'email'
              ? 'email'
              : field.type === 'number'
                ? 'number'
                : field.type === 'date'
                  ? 'date'
                  : field.type === 'file'
                    ? 'file'
                    : 'text'
          }
          className={inputClass}
          required={field.required}
          placeholder={placeholder}
          value={field.type === 'file' ? undefined : String(value ?? '')}
          onChange={(e) =>
            onChange(
              field.type === 'file'
                ? e.target.files?.[0]?.name ?? ''
                : e.target.value,
            )
          }
        />
      )}
      {helpText && (
        <span className="mt-1 block text-[11px] text-slate-400">{helpText}</span>
      )}
    </label>
  )
}
