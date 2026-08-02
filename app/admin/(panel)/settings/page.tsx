'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  BadgeCheck,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  UserRound,
  Shield,
  KeyRound,
  Moon,
  Sun,
  Monitor,
  Server,
  Save,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useAdminTheme, type AdminTheme } from '@/lib/auth/admin-theme-context'
import {
  settingsApi,
  type GoogleSheetsSettings,
  type MailSettings,
} from '@/lib/api/settings.api'
import { ApiError } from '@/lib/api/types'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'

const themeOptions: {
  value: AdminTheme
  label: string
  description: string
  icon: typeof Sun
}[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Clean bright surfaces (default)',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Low-glare for longer sessions',
    icon: Moon,
  },
  {
    value: 'auto',
    label: 'Auto',
    description: 'Match your system light/dark preference',
    icon: Monitor,
  },
]

type MailDraft = {
  enabled: boolean
  host: string
  port: string
  secure: boolean
  username: string
  password: string
  mailFrom: string
}

type SheetsDraft = {
  enabled: boolean
  clientEmail: string
  privateKey: string
}

const emptyMailDraft = (): MailDraft => ({
  enabled: false,
  host: '',
  port: '587',
  secure: false,
  username: '',
  password: '',
  mailFrom: 'noreply@mutakamela.sa',
})

const emptySheetsDraft = (): SheetsDraft => ({
  enabled: false,
  clientEmail: '',
  privateKey: '',
})

function toDraft(s: MailSettings): MailDraft {
  return {
    enabled: s.enabled,
    host: s.host ?? '',
    port: String(s.port ?? 587),
    secure: s.secure,
    username: s.username ?? '',
    password: '',
    mailFrom: s.mailFrom || 'noreply@mutakamela.sa',
  }
}

function toSheetsDraft(s: GoogleSheetsSettings): SheetsDraft {
  return {
    enabled: s.enabled,
    clientEmail: s.clientEmail ?? '',
    privateKey: '',
  }
}

export default function AdminSettingsPage() {
  const { admin, status } = useAuth()
  const { theme, setTheme } = useAdminTheme()

  const [mail, setMail] = useState<MailSettings | null>(null)
  const [draft, setDraft] = useState<MailDraft>(emptyMailDraft)
  const [mailLoading, setMailLoading] = useState(true)
  const [mailSaving, setMailSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mailToast, setMailToast] = useState<{
    tone: 'ok' | 'error'
    message: string
  } | null>(null)

  const [sheets, setSheets] = useState<GoogleSheetsSettings | null>(null)
  const [sheetsDraft, setSheetsDraft] = useState<SheetsDraft>(emptySheetsDraft)
  const [sheetsLoading, setSheetsLoading] = useState(true)
  const [sheetsSaving, setSheetsSaving] = useState(false)
  const [sheetsToast, setSheetsToast] = useState<{
    tone: 'ok' | 'error'
    message: string
  } | null>(null)

  const showMailToast = useCallback(
    (message: string, tone: 'ok' | 'error' = 'ok') => {
      setMailToast({ message, tone })
      window.setTimeout(() => setMailToast(null), 3200)
    },
    [],
  )

  const showSheetsToast = useCallback(
    (message: string, tone: 'ok' | 'error' = 'ok') => {
      setSheetsToast({ message, tone })
      window.setTimeout(() => setSheetsToast(null), 3200)
    },
    [],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setMailLoading(true)
        const data = await settingsApi.getMailSettings()
        if (cancelled) return
        setMail(data)
        setDraft(toDraft(data))
      } catch (err) {
        if (!cancelled) {
          showMailToast(
            err instanceof ApiError
              ? err.message
              : 'Failed to load mail settings',
            'error',
          )
        }
      } finally {
        if (!cancelled) setMailLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [showMailToast])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setSheetsLoading(true)
        const data = await settingsApi.getGoogleSheetsSettings()
        if (cancelled) return
        setSheets(data)
        setSheetsDraft(toSheetsDraft(data))
      } catch (err) {
        if (!cancelled) {
          showSheetsToast(
            err instanceof ApiError
              ? err.message
              : 'Failed to load Google Sheets settings',
            'error',
          )
        }
      } finally {
        if (!cancelled) setSheetsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [showSheetsToast])

  const patchDraft = <K extends keyof MailDraft>(key: K, value: MailDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const patchSheetsDraft = <K extends keyof SheetsDraft>(
    key: K,
    value: SheetsDraft[K],
  ) => {
    setSheetsDraft((prev) => ({ ...prev, [key]: value }))
  }

  const saveMailSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    const port = Number.parseInt(draft.port, 10)
    if (!Number.isFinite(port) || port < 1 || port > 65535) {
      showMailToast('SMTP port must be between 1 and 65535', 'error')
      return
    }

    try {
      setMailSaving(true)
      const payload: Parameters<typeof settingsApi.updateMailSettings>[0] = {
        enabled: draft.enabled,
        host: draft.host.trim(),
        port,
        secure: draft.secure,
        username: draft.username.trim(),
        mailFrom: draft.mailFrom.trim(),
      }
      // Only send password when the admin typed a new one
      if (draft.password.length > 0) {
        payload.password = draft.password
      }

      const updated = await settingsApi.updateMailSettings(payload)
      setMail(updated)
      setDraft(toDraft(updated))
      showMailToast('SMTP settings saved')
    } catch (err) {
      showMailToast(
        err instanceof ApiError ? err.message : 'Failed to save mail settings',
        'error',
      )
    } finally {
      setMailSaving(false)
    }
  }

  const clearStoredPassword = async () => {
    try {
      setMailSaving(true)
      const updated = await settingsApi.updateMailSettings({
        password: '__clear__',
      })
      setMail(updated)
      setDraft((d) => ({ ...d, password: '' }))
      showMailToast('Stored SMTP password cleared')
    } catch (err) {
      showMailToast(
        err instanceof ApiError ? err.message : 'Failed to clear password',
        'error',
      )
    } finally {
      setMailSaving(false)
    }
  }

  const saveSheetsSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSheetsSaving(true)
      const payload: Parameters<
        typeof settingsApi.updateGoogleSheetsSettings
      >[0] = {
        enabled: sheetsDraft.enabled,
        clientEmail: sheetsDraft.clientEmail.trim(),
      }
      if (sheetsDraft.privateKey.trim().length > 0) {
        payload.privateKey = sheetsDraft.privateKey.trim()
      }

      const updated = await settingsApi.updateGoogleSheetsSettings(payload)
      setSheets(updated)
      setSheetsDraft(toSheetsDraft(updated))
      showSheetsToast('Google Sheets settings saved')
    } catch (err) {
      showSheetsToast(
        err instanceof ApiError
          ? err.message
          : 'Failed to save Google Sheets settings',
        'error',
      )
    } finally {
      setSheetsSaving(false)
    }
  }

  const clearStoredPrivateKey = async () => {
    try {
      setSheetsSaving(true)
      const updated = await settingsApi.updateGoogleSheetsSettings({
        privateKey: '__clear__',
      })
      setSheets(updated)
      setSheetsDraft((d) => ({ ...d, privateKey: '' }))
      showSheetsToast('Stored private key cleared')
    } catch (err) {
      showSheetsToast(
        err instanceof ApiError ? err.message : 'Failed to clear private key',
        'error',
      )
    } finally {
      setSheetsSaving(false)
    }
  }

  const sourceLabel =
    mail?.source === 'database'
      ? 'Database (this form)'
      : mail?.source === 'env'
        ? 'Environment variables (.env)'
        : 'Not configured'

  const sheetsSourceLabel =
    sheets?.source === 'database'
      ? 'Database (this form)'
      : sheets?.source === 'env'
        ? 'Environment variables (.env)'
        : 'Not configured'

  return (
    <div className="flex flex-col gap-3 pb-1">
      {/* Appearance */}
      <section className="admin-card admin-anim-in p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: 'var(--a-primary-soft)',
              color: 'var(--a-primary-soft-text)',
            }}
          >
            <Monitor className="h-4 w-4" />
          </div>
          <div>
            <h2
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: 'var(--a-text)' }}
            >
              Appearance
            </h2>
            <p
              className="mt-0.5 text-[12px]"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              Choose light, dark, or auto for the CMS console — including the
              login page. Your choice is saved in this browser&apos;s local
              storage and restored on the next visit.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const active = theme === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  'admin-card-hover flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200',
                )}
                style={{
                  borderColor: active
                    ? 'var(--a-primary)'
                    : 'var(--a-border)',
                  background: active
                    ? 'var(--a-primary-soft)'
                    : 'var(--a-surface-2)',
                  boxShadow: active ? `0 0 0 1px var(--a-primary)` : undefined,
                }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                  style={{
                    background: active
                      ? 'var(--a-primary)'
                      : 'var(--a-surface)',
                    color: active ? '#fff' : 'var(--a-text-secondary)',
                    border: active ? 'none' : '1px solid var(--a-border)',
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0">
                  <span
                    className="block text-[13px] font-semibold"
                    style={{
                      color: active
                        ? 'var(--a-primary-soft-text)'
                        : 'var(--a-text)',
                    }}
                  >
                    {option.label}
                    {option.value === 'light' && (
                      <span
                        className="ml-1.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ color: 'var(--a-muted)' }}
                      >
                        Default
                      </span>
                    )}
                  </span>
                  <span
                    className="mt-0.5 block text-[11px]"
                    style={{ color: 'var(--a-text-secondary)' }}
                  >
                    {option.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* SMTP / Mail */}
      <section className="admin-card admin-anim-in admin-delay-1 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: 'var(--a-primary-soft)',
                color: 'var(--a-primary-soft-text)',
              }}
            >
              <Server className="h-4 w-4" />
            </div>
            <div>
              <h2
                className="text-[15px] font-semibold tracking-tight"
                style={{ color: 'var(--a-text)' }}
              >
                Email (SMTP)
              </h2>
              <p
                className="mt-0.5 max-w-xl text-[12px]"
                style={{ color: 'var(--a-text-secondary)' }}
              >
                Outbound mail used when forms send submission data. Configure
                host, port, credentials, and From address here — no need to
                edit server env files.
              </p>
            </div>
          </div>
          {mail && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: mail.configured
                  ? 'color-mix(in srgb, var(--a-success) 15%, transparent)'
                  : 'var(--a-surface-2)',
                color: mail.configured
                  ? 'var(--a-success)'
                  : 'var(--a-muted)',
                border: '1px solid var(--a-border)',
              }}
            >
              {mail.configured ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              {mail.configured ? 'Ready' : 'Inactive'} · {sourceLabel}
            </span>
          )}
        </div>

        {mailLoading ? (
          <div
            className="flex items-center gap-2 py-8 text-[13px]"
            style={{ color: 'var(--a-muted)' }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading SMTP settings…
          </div>
        ) : (
          <form onSubmit={saveMailSettings} className="space-y-3">
            <label
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px]"
              style={{
                borderColor: 'var(--a-border)',
                background: 'var(--a-surface-2)',
                color: 'var(--a-text)',
              }}
            >
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => patchDraft('enabled', e.target.checked)}
                className="h-3.5 w-3.5 rounded accent-[var(--a-primary)]"
              />
              <span className="font-medium">Enable SMTP from CMS settings</span>
              <span
                className="text-[11px]"
                style={{ color: 'var(--a-muted)' }}
              >
                (when off, env SMTP_* is used as fallback if present)
              </span>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="SMTP_HOST">
                <input
                  className="admin-input font-mono text-[12px]"
                  value={draft.host}
                  onChange={(e) => patchDraft('host', e.target.value)}
                  placeholder="smtp.example.com"
                  autoComplete="off"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SMTP_PORT">
                  <input
                    className="admin-input font-mono text-[12px]"
                    type="number"
                    min={1}
                    max={65535}
                    value={draft.port}
                    onChange={(e) => patchDraft('port', e.target.value)}
                    placeholder="587"
                  />
                </Field>
                <Field label="SMTP_SECURE">
                  <button
                    type="button"
                    onClick={() => patchDraft('secure', !draft.secure)}
                    className="admin-input flex w-full items-center justify-between text-left text-[12px]"
                  >
                    <span className="font-mono">
                      {draft.secure ? 'true' : 'false'}
                    </span>
                    <span
                      className="text-[10px] font-semibold uppercase"
                      style={{ color: 'var(--a-muted)' }}
                    >
                      {draft.secure ? 'TLS/SSL' : 'STARTTLS'}
                    </span>
                  </button>
                </Field>
              </div>
              <Field label="SMTP_USER">
                <input
                  className="admin-input font-mono text-[12px]"
                  value={draft.username}
                  onChange={(e) => patchDraft('username', e.target.value)}
                  placeholder="user@example.com"
                  autoComplete="off"
                />
              </Field>
              <Field
                label="SMTP_PASS"
                hint={
                  mail?.hasPassword
                    ? 'A password is stored. Leave blank to keep it, or enter a new one to replace.'
                    : 'Optional depending on your provider'
                }
              >
                <div className="relative">
                  <input
                    className="admin-input w-full pr-10 font-mono text-[12px]"
                    type={showPassword ? 'text' : 'password'}
                    value={draft.password}
                    onChange={(e) => patchDraft('password', e.target.value)}
                    placeholder={
                      mail?.hasPassword ? '•••••••• (unchanged)' : ''
                    }
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: 'var(--a-muted)' }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                {mail?.hasPassword && (
                  <button
                    type="button"
                    onClick={() => void clearStoredPassword()}
                    disabled={mailSaving}
                    className="mt-1 text-[11px] font-semibold hover:underline"
                    style={{ color: 'var(--a-danger, #ef4444)' }}
                  >
                    Clear stored password
                  </button>
                )}
              </Field>
              <Field
                label="MAIL_FROM"
                className="sm:col-span-2"
                hint="From address on form notification emails"
              >
                <input
                  className="admin-input font-mono text-[12px]"
                  type="email"
                  value={draft.mailFrom}
                  onChange={(e) => patchDraft('mailFrom', e.target.value)}
                  placeholder="noreply@mutakamela.sa"
                  autoComplete="off"
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={mailSaving}
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-semibold text-white transition disabled:opacity-60"
                style={{ background: 'var(--a-primary)' }}
              >
                {mailSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save SMTP settings
              </button>
              {mailToast && (
                <span
                  className="text-[12px] font-medium"
                  style={{
                    color:
                      mailToast.tone === 'ok'
                        ? 'var(--a-success)'
                        : 'var(--a-danger, #ef4444)',
                  }}
                >
                  {mailToast.message}
                </span>
              )}
            </div>
          </form>
        )}
      </section>

      {/* Google Sheets */}
      <section className="admin-card admin-anim-in admin-delay-2 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: 'var(--a-primary-soft)',
                color: 'var(--a-primary-soft-text)',
              }}
            >
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h2
                className="text-[15px] font-semibold tracking-tight"
                style={{ color: 'var(--a-text)' }}
              >
                Google Sheets
              </h2>
              <p
                className="mt-0.5 max-w-xl text-[12px]"
                style={{ color: 'var(--a-text-secondary)' }}
              >
                Service account used when forms append submissions to a
                spreadsheet. Create a Google Cloud service account, enable the
                Sheets API, paste the client email and private key here, then
                share each target sheet with that email as Editor.
              </p>
            </div>
          </div>
          {sheets && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: sheets.configured
                  ? 'color-mix(in srgb, var(--a-success) 15%, transparent)'
                  : 'var(--a-surface-2)',
                color: sheets.configured
                  ? 'var(--a-success)'
                  : 'var(--a-muted)',
                border: '1px solid var(--a-border)',
              }}
            >
              {sheets.configured ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              {sheets.configured ? 'Ready' : 'Inactive'} · {sheetsSourceLabel}
            </span>
          )}
        </div>

        {sheetsLoading ? (
          <div
            className="flex items-center gap-2 py-8 text-[13px]"
            style={{ color: 'var(--a-muted)' }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Google Sheets settings…
          </div>
        ) : (
          <form onSubmit={saveSheetsSettings} className="space-y-3">
            <label
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px]"
              style={{
                borderColor: 'var(--a-border)',
                background: 'var(--a-surface-2)',
                color: 'var(--a-text)',
              }}
            >
              <input
                type="checkbox"
                checked={sheetsDraft.enabled}
                onChange={(e) =>
                  patchSheetsDraft('enabled', e.target.checked)
                }
                className="h-3.5 w-3.5 rounded accent-[var(--a-primary)]"
              />
              <span className="font-medium">
                Enable Google Sheets from CMS settings
              </span>
              <span
                className="text-[11px]"
                style={{ color: 'var(--a-muted)' }}
              >
                (when off, env GOOGLE_SHEETS_* is used as fallback if present)
              </span>
            </label>

            <div className="grid gap-3">
              <Field
                label="Service account email"
                hint="client_email from the service account JSON key"
              >
                <input
                  className="admin-input font-mono text-[12px]"
                  type="email"
                  value={sheetsDraft.clientEmail}
                  onChange={(e) =>
                    patchSheetsDraft('clientEmail', e.target.value)
                  }
                  placeholder="sheets-bot@project.iam.gserviceaccount.com"
                  autoComplete="off"
                />
              </Field>
              <Field
                label="Private key (PEM)"
                hint={
                  sheets?.hasPrivateKey
                    ? 'A private key is stored. Leave blank to keep it, or paste a new PEM to replace.'
                    : 'Paste private_key from the service account JSON (including BEGIN/END lines)'
                }
              >
                <textarea
                  className="admin-input min-h-[120px] w-full resize-y font-mono text-[11px] leading-relaxed"
                  value={sheetsDraft.privateKey}
                  onChange={(e) =>
                    patchSheetsDraft('privateKey', e.target.value)
                  }
                  placeholder={
                    sheets?.hasPrivateKey
                      ? '•••••••• (unchanged — paste new key to replace)'
                      : '-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----'
                  }
                  spellCheck={false}
                  autoComplete="off"
                />
                {sheets?.hasPrivateKey && (
                  <button
                    type="button"
                    onClick={() => void clearStoredPrivateKey()}
                    disabled={sheetsSaving}
                    className="mt-1 text-[11px] font-semibold hover:underline"
                    style={{ color: 'var(--a-danger, #ef4444)' }}
                  >
                    Clear stored private key
                  </button>
                )}
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={sheetsSaving}
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-semibold text-white transition disabled:opacity-60"
                style={{ background: 'var(--a-primary)' }}
              >
                {sheetsSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save Google Sheets settings
              </button>
              {sheetsToast && (
                <span
                  className="text-[12px] font-medium"
                  style={{
                    color:
                      sheetsToast.tone === 'ok'
                        ? 'var(--a-success)'
                        : 'var(--a-danger, #ef4444)',
                  }}
                >
                  {sheetsToast.message}
                </span>
              )}
            </div>
          </form>
        )}
      </section>

      {/* Account */}
      <section className="admin-card admin-anim-in admin-delay-3 p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
            style={{
              background: 'linear-gradient(135deg, #3b25b0, #5b42ec)',
            }}
          >
            <UserRound className="h-4 w-4" />
          </div>
          <div>
            <h2
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: 'var(--a-text)' }}
            >
              Account
            </h2>
            <p
              className="mt-0.5 text-[12px]"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              Profile details for the signed-in CMS administrator.
            </p>
          </div>
        </div>

        <dl className="grid gap-2 sm:grid-cols-2">
          <div className="admin-card-muted px-3 py-2.5">
            <dt
              className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: 'var(--a-muted)' }}
            >
              Display name
            </dt>
            <dd
              className="mt-0.5 text-[13px] font-semibold"
              style={{ color: 'var(--a-text)' }}
            >
              {admin?.name ?? '—'}
            </dd>
          </div>
          <div className="admin-card-muted px-3 py-2.5">
            <dt
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: 'var(--a-muted)' }}
            >
              <Mail className="h-3 w-3" />
              Email
            </dt>
            <dd
              className="mt-0.5 break-all text-[13px] font-semibold"
              style={{ color: 'var(--a-text)' }}
            >
              {admin?.email ?? '—'}
            </dd>
          </div>
          <div className="admin-card-muted px-3 py-2.5">
            <dt
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: 'var(--a-muted)' }}
            >
              <BadgeCheck className="h-3 w-3" />
              Role
            </dt>
            <dd className="mt-0.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{
                  background: 'var(--a-primary-soft)',
                  color: 'var(--a-primary-soft-text)',
                }}
              >
                {admin?.role ?? '—'}
              </span>
            </dd>
          </div>
          <div className="admin-card-muted px-3 py-2.5">
            <dt
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: 'var(--a-muted)' }}
            >
              <Shield className="h-3 w-3" />
              Session
            </dt>
            <dd
              className="mt-0.5 text-[13px] font-semibold capitalize"
              style={{ color: 'var(--a-success)' }}
            >
              {status}
            </dd>
          </div>
        </dl>
      </section>

      {/* API */}
      <section className="admin-card admin-anim-in admin-delay-4 p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: 'var(--a-surface-2)',
              color: 'var(--a-text-secondary)',
              border: '1px solid var(--a-border)',
            }}
          >
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <h2
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: 'var(--a-text)' }}
            >
              API connection
            </h2>
            <p
              className="mt-0.5 text-[12px]"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              Backend endpoint used by this CMS session.
            </p>
          </div>
        </div>
        <div className="admin-card-muted px-3 py-2.5">
          <p
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: 'var(--a-muted)' }}
          >
            API base URL
          </p>
          <p
            className="mt-0.5 break-all font-mono text-[12px]"
            style={{ color: 'var(--a-text)' }}
          >
            {env.apiBaseUrl}
          </p>
        </div>
      </section>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span
        className="mb-1 block text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: 'var(--a-muted)' }}
      >
        {label}
      </span>
      {children}
      {hint ? (
        <span
          className="mt-1 block text-[10px] leading-relaxed"
          style={{ color: 'var(--a-muted)' }}
        >
          {hint}
        </span>
      ) : null}
    </label>
  )
}
