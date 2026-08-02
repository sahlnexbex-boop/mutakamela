'use client'

import { useState } from 'react'
import { ChevronDown, FileSpreadsheet } from 'lucide-react'
import type { FormGoogleSheet } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  value: FormGoogleSheet | undefined
  onChange: (next: FormGoogleSheet) => void
}

const emptyConfig = (): FormGoogleSheet => ({
  enabled: false,
  spreadsheetId: '',
  sheetName: 'Sheet1',
  includeTimestamp: true,
  includeSubmissionId: true,
})

export function FormGoogleSheetSettings({ value, onChange }: Props) {
  const cfg = value ?? emptyConfig()
  const [open, setOpen] = useState(!!cfg.enabled)

  const patch = <K extends keyof FormGoogleSheet>(
    key: K,
    next: FormGoogleSheet[K],
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
        <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-[var(--a-primary-soft-text)]" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
            Advanced
          </p>
          <p className="truncate text-xs font-semibold text-[var(--b-text)]">
            Google Sheet
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
            When a visitor submits this form, append all field values as a new
            row. Configure a Google service account under{' '}
            <span className="font-semibold text-[var(--b-text)]">
              Settings → Google Sheets
            </span>
            , then share the spreadsheet with that service account email
            (Editor).
          </p>

          <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
            <input
              type="checkbox"
              checked={!!cfg.enabled}
              onChange={(e) => patch('enabled', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-[var(--b-border)] accent-[var(--a-primary)]"
            />
            Store submissions in Google Sheets
          </label>

          <Field label="Spreadsheet URL or ID (required)">
            <input
              className="builder-input"
              type="text"
              value={cfg.spreadsheetId ?? ''}
              onChange={(e) => patch('spreadsheetId', e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/… or sheet id"
              disabled={!cfg.enabled}
            />
            <Hint>
              Paste the full sheet link or just the id from{' '}
              <code className="text-[10px]">/d/&#123;id&#125;/</code>
            </Hint>
          </Field>

          <Field label="Sheet tab name">
            <input
              className="builder-input"
              type="text"
              value={cfg.sheetName ?? 'Sheet1'}
              onChange={(e) => patch('sheetName', e.target.value)}
              placeholder="Sheet1"
              disabled={!cfg.enabled}
            />
            <Hint>Exact tab name at the bottom of the spreadsheet</Hint>
          </Field>

          <label className="flex items-start gap-2 text-xs text-[var(--b-text)]">
            <input
              type="checkbox"
              checked={cfg.includeTimestamp !== false}
              onChange={(e) => patch('includeTimestamp', e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-[var(--b-border)] accent-[var(--a-primary)]"
              disabled={!cfg.enabled}
            />
            <span>
              <span className="font-medium">Include submitted-at column</span>
              <span className="mt-0.5 block text-[11px] text-[var(--b-muted)]">
                ISO timestamp in the first data column
              </span>
            </span>
          </label>

          <label className="flex items-start gap-2 text-xs text-[var(--b-text)]">
            <input
              type="checkbox"
              checked={cfg.includeSubmissionId !== false}
              onChange={(e) => patch('includeSubmissionId', e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-[var(--b-border)] accent-[var(--a-primary)]"
              disabled={!cfg.enabled}
            />
            <span>
              <span className="font-medium">Include submission ID column</span>
              <span className="mt-0.5 block text-[11px] text-[var(--b-muted)]">
                Matches the id shown in the CMS responses list
              </span>
            </span>
          </label>
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
