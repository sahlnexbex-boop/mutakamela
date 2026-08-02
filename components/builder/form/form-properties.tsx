'use client'

import { useState } from 'react'
import { LocalizedField } from '@/components/builder/shared/localized-field'
import {
  getEnglishSource,
  getLocalized,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import type { FormField, FormFieldOption } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  field: FormField | null
  onChange: (patch: Partial<FormField>) => void
  locale?: BuilderLocale
}

export function FormPropertiesPanel({ field, onChange, locale = 'en' }: Props) {
  const [tab, setTab] = useState<'basic' | 'validation' | 'logic'>('basic')

  if (!field) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--a-surface-2)] text-lg">◇</div>
        <p className="text-sm font-medium text-[var(--b-text)]">No field selected</p>
        <p className="text-xs leading-relaxed text-[var(--b-muted)]">
          Select a field on the form canvas to configure label, validation, and options.
        </p>
      </div>
    )
  }

  const setOption = (index: number, patch: Partial<FormFieldOption>) => {
    const options = [...(field.options ?? [])]
    options[index] = { ...options[index], ...patch }
    onChange({ options })
  }

  const addOption = () => {
    const options = [
      ...(field.options ?? []),
      { label: `Option ${(field.options?.length ?? 0) + 1}`, value: `opt-${Date.now()}` },
    ]
    onChange({ options })
  }

  const removeOption = (index: number) => {
    onChange({ options: (field.options ?? []).filter((_, i) => i !== index) })
  }

  const displayLabel = getLocalized(field.label, locale, field.type)

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
          Field properties
        </p>
        <h3 className="text-sm font-semibold text-[var(--b-text)]">
          {displayLabel} · {field.type.replace('_', ' ')}
        </h3>
      </div>

      <div className="mb-1 flex gap-1 rounded-lg bg-[var(--a-surface-2)] p-0.5">
        {(
          [
            ['basic', 'Basic'],
            ['validation', 'Validation'],
            ['logic', 'Logic'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-[11px] font-semibold transition',
              tab === id
                ? 'bg-[var(--a-primary)] text-white shadow-sm'
                : 'text-[var(--b-muted)] hover:text-[var(--b-text)]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'basic' && (
        <div className="space-y-3">
          <LocalizedField
            label="Label"
            value={field.label}
            locale={locale}
            onChange={(next) => onChange({ label: next })}
          />
          {field.type !== 'section_break' && (
            <LocalizedField
              label="Placeholder"
              value={field.placeholder}
              locale={locale}
              onChange={(next) => onChange({ placeholder: next })}
            />
          )}
          <LocalizedField
            label="Help text"
            value={field.helpText}
            locale={locale}
            onChange={(next) => onChange({ helpText: next })}
          />
          <Field label="Width">
            <div className="flex gap-1">
              {(['half', 'full'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ width: w })}
                  className={cn(
                    'flex-1 rounded-md py-1.5 text-[11px] font-semibold capitalize',
                    field.width === w
                      ? 'bg-[var(--a-primary)] text-white'
                      : 'bg-[var(--a-surface-2)] text-[var(--b-muted)]',
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </Field>
          <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
            <input
              type="checkbox"
              checked={!!field.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="h-3.5 w-3.5 rounded border-[var(--b-border)] accent-[var(--a-primary)]"
            />
            Required
          </label>

          {(field.type === 'dropdown' ||
            field.type === 'radio' ||
            field.type === 'checkbox') && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
                  Options
                </span>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-[11px] font-semibold text-[var(--a-primary-soft-text)] hover:text-[var(--a-primary-soft-text)]"
                >
                  + Add option
                </button>
              </div>
              <div className="space-y-1.5">
                {(field.options ?? []).map((opt, i) => (
                  <div key={i} className="flex gap-1">
                    <div className="min-w-0 flex-1">
                      <LocalizedField
                        label={`Option ${i + 1}`}
                        value={opt.label}
                        locale={locale}
                        onChange={(next) => {
                          const en = getEnglishSource(next) || getLocalized(next, locale, '')
                          setOption(i, {
                            label: next,
                            ...(locale === 'en'
                              ? { value: slug(en) || opt.value }
                              : {}),
                          })
                        }}
                        hideCopy={false}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="mt-6 shrink-0 rounded-md px-2 text-xs text-[var(--b-muted)] hover:bg-red-500/10 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'validation' && (
        <div className="space-y-3">
          <Field label="Min">
            <input
              className="builder-input"
              value={String(field.validation?.min ?? '')}
              onChange={(e) =>
                onChange({
                  validation: { ...field.validation, min: e.target.value },
                })
              }
              placeholder="Optional"
            />
          </Field>
          <Field label="Max">
            <input
              className="builder-input"
              value={String(field.validation?.max ?? '')}
              onChange={(e) =>
                onChange({
                  validation: { ...field.validation, max: e.target.value },
                })
              }
              placeholder="Optional"
            />
          </Field>
          <Field label="Pattern (regex)">
            <input
              className="builder-input"
              value={field.validation?.pattern ?? ''}
              onChange={(e) =>
                onChange({
                  validation: { ...field.validation, pattern: e.target.value },
                })
              }
              placeholder="e.g. ^[A-Z].*"
            />
          </Field>
        </div>
      )}

      {tab === 'logic' && (
        <div className="rounded-lg border border-dashed border-[var(--b-border)] p-3 text-xs leading-relaxed text-[var(--b-muted)]">
          <p className="mb-1 font-semibold text-[var(--b-text)]">Conditional Rules</p>
          Show or hide this field based on other answers. Rule attachments can be layered onto the
          schema in a later release.
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
        {label}
      </span>
      {children}
    </label>
  )
}

function slug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}
