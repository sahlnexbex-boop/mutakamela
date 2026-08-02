'use client'

import { Copy, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { getLocalized, isRtl, type BuilderLocale } from '@/lib/builder/i18n'
import type { FormField, FormSection } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

export function FormCanvas({
  sections,
  selectedFieldId,
  onSelectField,
  onSelectSection,
  selectedSectionId,
  editable = true,
  locale = 'en',
}: {
  sections: FormSection[]
  selectedFieldId?: string | null
  selectedSectionId?: string | null
  onSelectField?: (id: string) => void
  onSelectSection?: (id: string) => void
  editable?: boolean
  locale?: BuilderLocale
}) {
  const dir = isRtl(locale) ? 'rtl' : 'ltr'
  return (
    <div
      className="builder-document relative min-h-[520px] overflow-hidden rounded-xl bg-[var(--a-surface-2)]"
      dir={dir}
      lang={locale}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at top, color-mix(in srgb, var(--a-primary) 35%, transparent), transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-3xl space-y-4 p-5 sm:p-8">
        {sections.map((section) => (
          <section
            key={section.id}
            onClick={(e) => {
              e.stopPropagation()
              onSelectSection?.(section.id)
            }}
            className={cn(
              'rounded-xl border bg-[var(--a-surface)] p-4 shadow-sm transition sm:p-5',
              selectedSectionId === section.id
                ? 'border-[var(--a-primary)] ring-2 ring-[var(--a-ring)]'
                : 'border-[var(--a-border)] hover:border-[var(--a-border-strong)]',
            )}
          >
            <h3 className="mb-4 text-sm font-bold text-[var(--a-text)]">
              {getLocalized(section.title, locale, 'Section')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {section.fields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  selected={selectedFieldId === field.id}
                  editable={editable}
                  locale={locale}
                  onSelect={() => onSelectField?.(field.id)}
                />
              ))}
              {section.fields.length === 0 && (
                <div className="w-full rounded-lg border border-dashed border-[var(--a-border)] py-8 text-center text-xs text-[var(--a-muted)]">
                  Add fields from the library
                </div>
              )}
            </div>
          </section>
        ))}
        {sections.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--a-border)] bg-[var(--a-surface)] py-16 text-center text-sm text-[var(--a-muted)]">
            Add a section or field to begin
          </div>
        )}
      </div>
    </div>
  )
}

function FieldCard({
  field,
  selected,
  onSelect,
  editable,
  locale,
}: {
  field: FormField
  selected: boolean
  onSelect: () => void
  editable: boolean
  locale: BuilderLocale
}) {
  const widthClass = field.width === 'full' ? 'w-full' : 'w-full sm:w-[calc(50%-6px)]'
  const label = getLocalized(field.label, locale, field.type)

  return (
    <div
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        'relative rounded-lg border bg-[var(--a-input-bg)] p-3 transition',
        widthClass,
        selected
          ? 'border-[var(--a-primary)] shadow-md ring-1 ring-[var(--a-ring)]'
          : 'border-[var(--a-border)] hover:border-[var(--a-border-strong)]',
        field.type === 'section_break' && 'border-dashed',
      )}
    >
      {selected && editable && (
        <div className="absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-md bg-[var(--a-primary)] px-1.5 py-0.5 text-white shadow">
          <GripVertical className="h-3 w-3" />
          <span className="text-[9px] font-bold uppercase">Drag handle</span>
          <Pencil className="ml-0.5 h-3 w-3 opacity-80" />
          <Copy className="h-3 w-3 opacity-80" />
          <Trash2 className="h-3 w-3 opacity-80" />
        </div>
      )}

      {field.type === 'section_break' ? (
        <div className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--a-muted)]">
          — {label} —
        </div>
      ) : (
        <>
          <label className="mb-1.5 block text-[11px] font-medium text-[var(--a-text-secondary)]">
            {label}
            {field.required && (
              <span className="ml-0.5 text-[var(--a-primary)]">*</span>
            )}
          </label>
          <FieldPreview
            field={field}
            locale={locale}
            openDropdown={selected && field.type === 'dropdown'}
          />
          <p className="mt-1.5 text-[10px] capitalize text-[var(--a-muted)]">
            {field.type.replace('_', ' ')}
            {field.width === 'half' ? ' · half width' : ''}
          </p>
        </>
      )}
    </div>
  )
}

function FieldPreview({
  field,
  openDropdown,
  locale,
}: {
  field: FormField
  openDropdown?: boolean
  locale: BuilderLocale
}) {
  const base =
    'w-full rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-2 text-sm text-[var(--a-text)] placeholder:text-[var(--a-muted)]'
  const placeholder = getLocalized(field.placeholder, locale, '')
  const label = getLocalized(field.label, locale, '')

  switch (field.type) {
    case 'paragraph':
      return (
        <textarea
          className={cn(base, 'min-h-[72px] resize-none')}
          placeholder={placeholder}
          readOnly
        />
      )
    case 'dropdown':
      return (
        <div className="relative">
          <div className={cn(base, 'flex items-center justify-between')}>
            <span className="text-[var(--a-muted)]">{placeholder || 'Select…'}</span>
            <span className="text-[var(--a-muted)]">▾</span>
          </div>
          {openDropdown && field.options && field.options.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-[var(--a-border)] bg-[var(--a-elevated)] shadow-lg">
              {field.options.map((opt) => (
                <li
                  key={opt.value}
                  className="border-b border-[var(--a-border)] px-3 py-2 text-sm text-[var(--a-text)] last:border-0 hover:bg-[var(--a-primary-soft)]"
                >
                  {getLocalized(opt.label, locale, opt.value)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    case 'radio':
      return (
        <div className="space-y-1.5">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-xs text-[var(--a-text-secondary)]"
            >
              <span className="h-3.5 w-3.5 rounded-full border border-[var(--a-border-strong)]" />
              {getLocalized(opt.label, locale, opt.value)}
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="space-y-1.5">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-xs text-[var(--a-text-secondary)]"
            >
              <span className="h-3.5 w-3.5 rounded border border-[var(--a-border-strong)]" />
              {getLocalized(opt.label, locale, opt.value)}
            </label>
          ))}
        </div>
      )
    case 'file':
      return (
        <div className={cn(base, 'border-dashed text-center text-[var(--a-muted)]')}>
          Choose file…
        </div>
      )
    case 'date':
      return <input type="date" className={base} readOnly />
    case 'number':
      return (
        <input
          type="text"
          className={base}
          placeholder={placeholder || '0'}
          readOnly
        />
      )
    case 'email':
      return (
        <input
          type="text"
          className={base}
          placeholder={placeholder || 'Email'}
          readOnly
        />
      )
    default:
      return (
        <input
          type="text"
          className={base}
          placeholder={placeholder || label}
          readOnly
        />
      )
  }
}
