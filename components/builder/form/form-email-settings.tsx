'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Mail } from 'lucide-react'
import type { FormEmailNotification, FormField, FormSection } from '@/lib/builder/types'
import { getLocalized, type BuilderLocale } from '@/lib/builder/i18n'
import { cn } from '@/lib/utils'

type Props = {
  value: FormEmailNotification | undefined
  onChange: (next: FormEmailNotification) => void
  sections: FormSection[]
  locale?: BuilderLocale
}

const emptyConfig = (): FormEmailNotification => ({
  enabled: false,
  to: '',
  cc: '',
  subject: 'New submission: {formTitle}',
  includeAllFields: true,
  replyToFieldId: '',
})

export function FormEmailSettings({
  value,
  onChange,
  sections,
  locale = 'en',
}: Props) {
  const cfg = value ?? emptyConfig()
  const [open, setOpen] = useState(!!cfg.enabled)

  const emailFields = useMemo(() => {
    const fields: FormField[] = []
    for (const sec of sections) {
      for (const f of sec.fields) {
        if (f.type === 'email') fields.push(f)
      }
    }
    return fields
  }, [sections])

  const patch = <K extends keyof FormEmailNotification>(
    key: K,
    next: FormEmailNotification[K],
  ) => {
    onChange({ ...cfg, [key]: next })
  }

  return (
    <div className="rounded-xl border border-[var(--b-border)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition hover:bg-[var(--a-surface-2)]/60"
      >
        <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--a-primary-soft-text)]" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
            Advanced
          </p>
          <p className="truncate text-xs font-semibold text-[var(--b-text)]">
            Email form data
            {cfg.enabled ? (
              <span className="ml-1.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                On
              </span>
            ) : null}
          </p>
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-[var(--b-muted)] transition',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-[var(--b-border)] px-3 py-3">
          <p className="text-[11px] leading-relaxed text-[var(--b-muted)]">
            When a visitor submits this form, email all field values to the
            recipients below. Configure SMTP under{' '}
            <span className="font-semibold text-[var(--b-text)]">
              Settings → Email (SMTP)
            </span>
            .
          </p>

          <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
            <input
              type="checkbox"
              checked={!!cfg.enabled}
              onChange={(e) => patch('enabled', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-[var(--b-border)] accent-[var(--a-primary)]"
            />
            Send submission by email
          </label>

          <Field label="To (required)">
            <input
              className="builder-input"
              type="text"
              value={cfg.to ?? ''}
              onChange={(e) => patch('to', e.target.value)}
              placeholder="team@company.com, ops@company.com"
              disabled={!cfg.enabled}
            />
            <Hint>Comma-separated addresses</Hint>
          </Field>

          <Field label="CC (optional)">
            <input
              className="builder-input"
              type="text"
              value={cfg.cc ?? ''}
              onChange={(e) => patch('cc', e.target.value)}
              placeholder="manager@company.com"
              disabled={!cfg.enabled}
            />
          </Field>

          <Field label="Subject">
            <input
              className="builder-input"
              type="text"
              value={cfg.subject ?? ''}
              onChange={(e) => patch('subject', e.target.value)}
              placeholder="New submission: {formTitle}"
              disabled={!cfg.enabled}
            />
            <Hint>
              Use <code className="text-[10px]">{`{formTitle}`}</code> for the form
              name
            </Hint>
          </Field>

          <label className="flex items-start gap-2 text-xs text-[var(--b-text)]">
            <input
              type="checkbox"
              checked={cfg.includeAllFields !== false}
              onChange={(e) => patch('includeAllFields', e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-[var(--b-border)] accent-[var(--a-primary)]"
              disabled={!cfg.enabled}
            />
            <span>
              <span className="font-medium">Include all form fields</span>
              <span className="mt-0.5 block text-[11px] text-[var(--b-muted)]">
                Email body lists every field label and submitted value
              </span>
            </span>
          </label>

          <Field label="Reply-To field">
            <select
              className="builder-input"
              value={cfg.replyToFieldId ?? ''}
              onChange={(e) => patch('replyToFieldId', e.target.value)}
              disabled={!cfg.enabled}
            >
              <option value="">None</option>
              {emailFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {getLocalized(f.label, locale, f.id)}
                </option>
              ))}
            </select>
            <Hint>
              Uses the submitter&apos;s email so you can reply directly
              {emailFields.length === 0
                ? ' (add an Email field to the form first)'
                : ''}
            </Hint>
          </Field>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
        {label}
      </span>
      {children}
    </label>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1 block text-[10px] leading-relaxed text-[var(--b-muted)]">
      {children}
    </span>
  )
}
