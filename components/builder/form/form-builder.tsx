'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Copy,
  Eye,
  Inbox,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  BuilderCanvasFrame,
  BuilderPanel,
  BuilderShell,
  BuilderTopBar,
  StatusToast,
} from '@/components/builder/shared/builder-chrome'
import { FormCanvas } from '@/components/builder/form/form-canvas'
import { FormEmailSettings } from '@/components/builder/form/form-email-settings'
import { FormGoogleSheetSettings } from '@/components/builder/form/form-google-sheet-settings'
import { FormPropertiesPanel } from '@/components/builder/form/form-properties'
import { LocalizedField } from '@/components/builder/shared/localized-field'
import { formsApi } from '@/lib/api/forms.api'
import { ApiError } from '@/lib/api/types'
import { createField, defaultFormSettings } from '@/lib/builder/defaults'
import {
  getLocalized,
  type BuilderLocale,
  type LocalizedText,
} from '@/lib/builder/i18n'
import { formFieldPalette } from '@/lib/builder/palette'
import type {
  DeviceMode,
  FormDetail,
  FormField,
  FormFieldType,
  FormSchema,
  FormSection,
  FormSettings,
} from '@/lib/builder/types'
import { createId, normalizeFormSchema } from '@/lib/builder/utils'
import { cn } from '@/lib/utils'

type Props = { formId: number }

export function FormBuilder({ formId }: Props) {
  const [form, setForm] = useState<FormDetail | null>(null)
  const [sections, setSections] = useState<FormSection[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const [locale, setLocale] = useState<BuilderLocale>('en')
  const [settings, setSettings] = useState<FormSettings>(defaultFormSettings())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'ok' | 'error' } | null>(null)
  const [preview, setPreview] = useState(false)

  const showToast = useCallback((message: string, tone: 'ok' | 'error' = 'ok') => {
    setToast({ message, tone })
    window.setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await formsApi.get(formId)
        if (cancelled) return
        setForm(data)
        const schema = normalizeFormSchema(data.schema)
        setSections(schema.sections)
        setSettings({ ...defaultFormSettings(), ...(data.settings ?? {}) })
        if (schema.sections[0]) setSelectedSectionId(schema.sections[0].id)
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Failed to load form', 'error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [formId, showToast])

  const selectedField = useMemo(() => {
    if (!selectedFieldId) return null
    for (const sec of sections) {
      const f = sec.fields.find((x) => x.id === selectedFieldId)
      if (f) return f
    }
    return null
  }, [sections, selectedFieldId])

  const activeSectionId = selectedSectionId ?? sections[0]?.id ?? null

  const addField = (type: FormFieldType) => {
    if (type === 'section_break') {
      const section: FormSection = {
        id: createId('sec'),
        title: `${sections.length + 1}. New Section`,
        fields: [],
      }
      setSections((s) => [...s, section])
      setSelectedSectionId(section.id)
      setSelectedFieldId(null)
      return
    }

    const field = createField(type)
    setSections((prev) => {
      if (!prev.length) {
        const sec: FormSection = {
          id: createId('sec'),
          title: '1. Personal Information',
          fields: [field],
        }
        setSelectedSectionId(sec.id)
        return [sec]
      }
      return prev.map((sec) =>
        sec.id === (activeSectionId ?? prev[0].id)
          ? { ...sec, fields: [...sec.fields, field] }
          : sec,
      )
    })
    setSelectedFieldId(field.id)
  }

  const updateField = (patch: Partial<FormField>) => {
    if (!selectedFieldId) return
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        fields: sec.fields.map((f) =>
          f.id === selectedFieldId ? { ...f, ...patch } : f,
        ),
      })),
    )
  }

  const deleteField = () => {
    if (!selectedFieldId) return
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        fields: sec.fields.filter((f) => f.id !== selectedFieldId),
      })),
    )
    setSelectedFieldId(null)
  }

  const duplicateField = () => {
    if (!selectedField) return
    const copy: FormField = { ...selectedField, id: createId(selectedField.type) }
    setSections((prev) =>
      prev.map((sec) => {
        const idx = sec.fields.findIndex((f) => f.id === selectedField.id)
        if (idx < 0) return sec
        const fields = [...sec.fields]
        fields.splice(idx + 1, 0, copy)
        return { ...sec, fields }
      }),
    )
    setSelectedFieldId(copy.id)
  }

  const addSection = () => {
    const section: FormSection = {
      id: createId('sec'),
      title: `${sections.length + 1}. New Section`,
      fields: [],
    }
    setSections((s) => [...s, section])
    setSelectedSectionId(section.id)
  }

  const renameSection = (id: string, title: LocalizedText) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)))
  }

  const patchSettings = <K extends keyof FormSettings>(key: K, value: FormSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const deleteSection = (id: string) => {
    if (sections.length <= 1) {
      showToast('Keep at least one section', 'error')
      return
    }
    setSections((prev) => prev.filter((s) => s.id !== id))
    if (selectedSectionId === id) setSelectedSectionId(null)
  }

  const saveDraft = async () => {
    if (!form) return
    try {
      setSaving(true)
      const schema: FormSchema = { version: 1, sections }
      const updated = await formsApi.update(form.id, {
        schema,
        settings,
        status: 'draft',
      })
      setForm(updated)
      showToast('Draft saved')
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    if (!form) return
    try {
      setPublishing(true)
      const schema: FormSchema = { version: 1, sections }
      await formsApi.update(form.id, { schema, settings })
      const updated = await formsApi.publish(form.id)
      setForm(updated)
      showToast('Form published')
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Publish failed', 'error')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <BuilderShell>
        <div className="flex flex-1 items-center justify-center text-sm text-[var(--b-muted)]">
          Loading form builder…
        </div>
      </BuilderShell>
    )
  }

  if (!form) {
    return (
      <BuilderShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-sm text-[var(--b-muted)]">Form not found</p>
          <Link href="/admin/forms" className="text-sm text-[var(--a-primary-soft-text)] hover:underline">
            Back to forms
          </Link>
        </div>
      </BuilderShell>
    )
  }

  return (
    <BuilderShell>
      <BuilderTopBar
        backHref="/admin/forms"
        brand={
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--a-primary)] to-[var(--a-accent)] text-xs font-bold text-white shadow-lg">
              F
            </div>
            <span className="hidden text-[var(--b-muted)] sm:inline">Project Alpha</span>
            <ChevronRight className="hidden h-3.5 w-3.5 text-[var(--b-muted)] sm:block" />
            <span className="truncate font-semibold text-[var(--b-text)]">{form.title}</span>
            <span
              className={cn(
                'hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:inline',
                form.status === 'published'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-amber-500/15 text-amber-300',
              )}
            >
              {form.status}
            </span>
          </div>
        }
        center={
          <div className="flex items-center gap-1.5">
            <Link
              href={`/admin/forms/${form.id}/submissions`}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[var(--b-muted)] transition hover:bg-[var(--a-surface-2)] hover:text-[var(--b-text)]"
              title="View submitted responses"
            >
              <Inbox className="h-3.5 w-3.5" />
              Responses
              {(form.submissionCount ?? 0) > 0 && (
                <span className="rounded-full bg-[var(--a-primary)]/20 px-1.5 py-px text-[10px] font-bold tabular-nums text-[var(--a-primary-soft-text)]">
                  {form.submissionCount! > 99 ? '99+' : form.submissionCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition',
                preview
                  ? 'bg-[var(--a-primary)] text-white'
                  : 'text-[var(--b-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--b-text)]',
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>
        }
        device={device}
        onDeviceChange={setDevice}
        locale={locale}
        onLocaleChange={setLocale}
        onSaveDraft={saveDraft}
        onPublish={publish}
        saving={saving}
        publishing={publishing}
        publishLabel="Publish Form"
      />

      <div className="flex min-h-0 flex-1">
        <BuilderPanel title="Field Library" className="border-r">
          <div className="grid grid-cols-2 gap-2">
            {formFieldPalette.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => addField(item.type)}
                  className="builder-palette-item group flex flex-col items-start gap-2 rounded-xl border border-[var(--b-border)] bg-[var(--a-surface-2)] p-3 text-left transition hover:border-[color-mix(in_srgb,var(--a-primary)_50%,transparent)] hover:bg-[var(--a-primary-soft)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--a-surface-2)] text-[var(--b-muted)] transition group-hover:bg-[var(--a-primary-soft)] group-hover:text-[var(--a-primary-soft-text)]">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-[var(--b-text)]">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </BuilderPanel>

        <BuilderCanvasFrame
          title="Form Canvas"
          device={device}
          toolbar={
            <div className="flex items-center gap-1">
              <ToolBtn onClick={addSection} title="Add section">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Add Field</span>
              </ToolBtn>
              {selectedFieldId && (
                <>
                  <ToolBtn onClick={duplicateField} title="Duplicate">
                    <Copy className="h-3.5 w-3.5" />
                  </ToolBtn>
                  <ToolBtn onClick={deleteField} title="Delete" danger>
                    <Trash2 className="h-3.5 w-3.5" />
                  </ToolBtn>
                </>
              )}
            </div>
          }
        >
          <FormCanvas
            sections={sections}
            selectedFieldId={selectedFieldId}
            selectedSectionId={selectedSectionId}
            onSelectField={(id) => {
              setSelectedFieldId(id)
              const sec = sections.find((s) => s.fields.some((f) => f.id === id))
              if (sec) setSelectedSectionId(sec.id)
            }}
            onSelectSection={setSelectedSectionId}
            editable={!preview}
            locale={locale}
          />
        </BuilderCanvasFrame>

        <BuilderPanel
          title={
            selectedField
              ? `Field Properties: ${getLocalized(selectedField.label, locale, selectedField.type)}`
              : 'Field Properties'
          }
          className="w-[280px] border-l"
        >
          <div className="mb-4 space-y-2 rounded-xl border border-[var(--b-border)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
              Form settings
            </p>
            <LocalizedField
              label="Submit button"
              value={settings.submitLabel}
              locale={locale}
              onChange={(next) => patchSettings('submitLabel', next)}
              placeholder="Submit"
            />
            <LocalizedField
              label="Success message"
              value={settings.successMessage}
              locale={locale}
              onChange={(next) => patchSettings('successMessage', next)}
              multiline
              placeholder="Thank you!"
            />
          </div>
          <div className="mb-4">
            <FormEmailSettings
              value={settings.emailNotification}
              onChange={(next) => patchSettings('emailNotification', next)}
              sections={sections}
              locale={locale}
            />
          </div>
          <div className="mb-4">
            <FormGoogleSheetSettings
              value={settings.googleSheet}
              onChange={(next) => patchSettings('googleSheet', next)}
            />
          </div>
          {selectedSectionId && !selectedField && (
            <div className="mb-4 space-y-2 rounded-xl border border-[var(--b-border)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
                Section
              </p>
              <LocalizedField
                label="Section title"
                value={sections.find((s) => s.id === selectedSectionId)?.title}
                locale={locale}
                onChange={(next) => renameSection(selectedSectionId, next)}
              />
              <button
                type="button"
                onClick={() => deleteSection(selectedSectionId)}
                className="text-[11px] font-semibold text-red-300 hover:underline"
              >
                Delete section
              </button>
            </div>
          )}
          <FormPropertiesPanel
            field={selectedField}
            onChange={updateField}
            locale={locale}
          />
        </BuilderPanel>
      </div>

      <StatusToast message={toast?.message ?? null} tone={toast?.tone} />
    </BuilderShell>
  )
}

function ToolBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold transition',
        danger
          ? 'text-[var(--b-muted)] hover:bg-red-500/15 hover:text-red-300'
          : 'bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)] hover:bg-[var(--a-primary-soft)]',
      )}
    >
      {children}
    </button>
  )
}
