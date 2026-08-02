'use client'

import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Inbox,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import {
  formsApi,
  type FormSubmission,
  type SubmissionStatus,
} from '@/lib/api/forms.api'
import { ApiError } from '@/lib/api/types'
import { getLocalized } from '@/lib/builder/i18n'
import type { FormDetail, FormField } from '@/lib/builder/types'
import { normalizeFormSchema } from '@/lib/builder/utils'
import { swalConfirm } from '@/lib/swal'
import { cn } from '@/lib/utils'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const
const DEFAULT_PAGE_SIZE = 10

const SUBMISSION_STATUSES: SubmissionStatus[] = ['new', 'reviewed', 'archived']

const STATUS_META: Record<
  SubmissionStatus,
  { label: string; short: string; className: string; dot: string }
> = {
  new: {
    label: 'New',
    short: 'New',
    className:
      'border-sky-500/25 bg-sky-500/12 text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  reviewed: {
    label: 'Reviewed',
    short: 'Reviewed',
    className:
      'border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  archived: {
    label: 'Archived',
    short: 'Archived',
    className:
      'border-[var(--a-border-strong)] bg-[var(--a-surface-2)] text-[var(--a-text-secondary)]',
    dot: 'bg-[var(--a-muted)]',
  },
}

type StatusFilter = 'all' | SubmissionStatus
type ColumnField = Pick<FormField, 'id' | 'type' | 'label' | 'options'>
type FieldFilterOp =
  | 'contains'
  | 'equals'
  | 'starts_with'
  | 'is_empty'
  | 'is_not_empty'
type SortMode = 'newest' | 'oldest'
type DatePreset = 'all' | 'today' | '7d' | '30d' | 'custom'

type FieldFilterRule = {
  id: string
  fieldId: string
  op: FieldFilterOp
  value: string
}

const FIELD_FILTER_OPS: { id: FieldFilterOp; label: string }[] = [
  { id: 'contains', label: 'Contains' },
  { id: 'equals', label: 'Equals' },
  { id: 'starts_with', label: 'Starts with' },
  { id: 'is_empty', label: 'Is empty' },
  { id: 'is_not_empty', label: 'Is not empty' },
]

function newFieldRule(fieldId = ''): FieldFilterRule {
  return {
    id: `fr_${Math.random().toString(36).slice(2, 9)}`,
    fieldId,
    op: 'contains',
    value: '',
  }
}

export default function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = use(params)
  const formId = Number(idParam)

  const [form, setForm] = useState<FormDetail | null>(null)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  // Advanced filters
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [datePreset, setDatePreset] = useState<DatePreset>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusMulti, setStatusMulti] = useState<SubmissionStatus[]>([])
  const [fieldRules, setFieldRules] = useState<FieldFilterRule[]>([])
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const load = useCallback(async () => {
    if (!Number.isFinite(formId)) {
      setError('Invalid form id')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const [formData, rows] = await Promise.all([
        formsApi.get(formId),
        formsApi.listSubmissions(formId),
      ])
      setForm(formData)
      setSubmissions(rows)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }, [formId])

  useEffect(() => {
    void load()
  }, [load])

  const fields = useMemo((): ColumnField[] => {
    if (!form) return []
    const schema = normalizeFormSchema(form.schema)
    return schema.sections.flatMap((section) =>
      section.fields
        .filter((f) => f.type !== 'section_break')
        .map((f) => ({
          id: f.id,
          type: f.type,
          label: f.label,
          options: f.options,
        })),
    )
  }, [form])

  /** Prefer first text-like fields as table columns (cap for readability). */
  const tableColumns = useMemo(() => {
    const preferred = fields.filter((f) =>
      ['short_text', 'email', 'number', 'dropdown', 'date', 'radio'].includes(f.type),
    )
    const rest = fields.filter((f) => !preferred.includes(f))
    return [...preferred, ...rest].slice(0, 5)
  }, [fields])

  const stats = useMemo(() => {
    let neu = 0
    let reviewed = 0
    let archived = 0
    for (const s of submissions) {
      const st = normalizeStatus(s.status)
      if (st === 'new') neu++
      else if (st === 'reviewed') reviewed++
      else archived++
    }
    return { total: submissions.length, new: neu, reviewed, archived }
  }, [submissions])

  const resolvedDateRange = useMemo(() => {
    if (datePreset === 'custom') {
      return {
        from: dateFrom ? startOfDay(dateFrom) : null,
        to: dateTo ? endOfDay(dateTo) : null,
      }
    }
    if (datePreset === 'all') return { from: null, to: null }
    const now = new Date()
    const to = endOfDay(toInputDate(now))
    if (datePreset === 'today') {
      return { from: startOfDay(toInputDate(now)), to }
    }
    const days = datePreset === '7d' ? 7 : 30
    const fromDate = new Date(now)
    fromDate.setDate(fromDate.getDate() - (days - 1))
    return { from: startOfDay(toInputDate(fromDate)), to }
  }, [datePreset, dateFrom, dateTo])

  const activeAdvancedCount = useMemo(() => {
    let n = 0
    if (datePreset !== 'all') n++
    if (statusMulti.length > 0) n++
    if (sortMode !== 'newest') n++
    n += fieldRules.filter((r) => r.fieldId && (r.op === 'is_empty' || r.op === 'is_not_empty' || r.value.trim())).length
    return n
  }, [datePreset, statusMulti, sortMode, fieldRules])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const { from: rangeFrom, to: rangeTo } = resolvedDateRange

    // Quick status chips vs advanced multi-status (advanced wins when set)
    const statusSet =
      statusMulti.length > 0
        ? new Set(statusMulti)
        : statusFilter !== 'all'
          ? new Set([statusFilter])
          : null

    const activeRules = fieldRules.filter(
      (r) =>
        r.fieldId &&
        (r.op === 'is_empty' || r.op === 'is_not_empty' || r.value.trim()),
    )

    const rows = submissions.filter((row) => {
      const status = normalizeStatus(row.status)
      if (statusSet && !statusSet.has(status)) return false

      const created = new Date(row.createdAt).getTime()
      if (rangeFrom != null && created < rangeFrom) return false
      if (rangeTo != null && created > rangeTo) return false

      const data = asRecord(row.data)

      for (const rule of activeRules) {
        if (!matchFieldRule(data[rule.fieldId], rule)) return false
      }

      if (!q) return true
      if (String(row.id).includes(q)) return true
      if (status.includes(q) || STATUS_META[status].label.toLowerCase().includes(q)) {
        return true
      }
      if (formatDateTime(row.createdAt).toLowerCase().includes(q)) return true
      return Object.values(data).some((v) =>
        formatCellValue(v, undefined).toLowerCase().includes(q),
      )
    })

    rows.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return sortMode === 'oldest' ? ta - tb : tb - ta
    })

    return rows
  }, [
    submissions,
    query,
    statusFilter,
    statusMulti,
    resolvedDateRange,
    fieldRules,
    sortMode,
  ])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage, pageSize])

  useEffect(() => {
    setPage(1)
  }, [query, pageSize, statusFilter, datePreset, dateFrom, dateTo, statusMulti, fieldRules, sortMode])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const clearAdvancedFilters = () => {
    setDatePreset('all')
    setDateFrom('')
    setDateTo('')
    setStatusMulti([])
    setFieldRules([])
    setSortMode('newest')
  }

  const clearAllFilters = () => {
    setQuery('')
    setStatusFilter('all')
    clearAdvancedFilters()
  }

  const toggleStatusMulti = (st: SubmissionStatus) => {
    setStatusMulti((prev) => {
      const next = prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
      // Keep quick chip in sync when multi is used
      if (next.length === 1) setStatusFilter(next[0])
      else if (next.length === 0) setStatusFilter('all')
      else setStatusFilter('all')
      return next
    })
  }

  const setQuickStatus = (next: StatusFilter) => {
    setStatusFilter(next)
    setStatusMulti(next === 'all' ? [] : [next])
  }

  const updateFieldRule = (id: string, patch: Partial<FieldFilterRule>) => {
    setFieldRules((rules) =>
      rules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    )
  }

  const removeFieldRule = (id: string) => {
    setFieldRules((rules) => rules.filter((r) => r.id !== id))
  }

  const addFieldRule = () => {
    const defaultField = fields[0]?.id ?? ''
    setFieldRules((rules) => [...rules, newFieldRule(defaultField)])
    setAdvancedOpen(true)
  }

  const selected = useMemo(
    () => submissions.find((s) => s.id === selectedId) ?? null,
    [submissions, selectedId],
  )

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const rangeEnd = Math.min(safePage * pageSize, filtered.length)

  const setStatus = async (submissionId: number, status: SubmissionStatus) => {
    const current = submissions.find((r) => r.id === submissionId)
    if (!current || normalizeStatus(current.status) === status) return
    try {
      setUpdatingStatusId(submissionId)
      setError(null)
      const updated = await formsApi.updateSubmission(formId, submissionId, {
        status,
      })
      setSubmissions((rows) =>
        rows.map((r) => (r.id === submissionId ? { ...r, ...updated } : r)),
      )
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update status')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const remove = async (submissionId: number) => {
    const ok = await swalConfirm({
      title: 'Delete this response?',
      text: 'This submission will be permanently removed. This cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      danger: true,
    })
    if (!ok) return
    try {
      setDeletingId(submissionId)
      await formsApi.deleteSubmission(formId, submissionId)
      setSubmissions((rows) => rows.filter((r) => r.id !== submissionId))
      if (selectedId === submissionId) setSelectedId(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const exportCsv = () => {
    if (!form) return
    const headers = [
      'ID',
      'Status',
      'Submitted at',
      ...fields.map((f) => getLocalized(f.label, 'en', f.id)),
    ]
    const lines = filtered.map((row) => {
      const data = asRecord(row.data)
      return [
        String(row.id),
        STATUS_META[normalizeStatus(row.status)].label,
        formatDateTime(row.createdAt),
        ...fields.map((f) => formatCellValue(data[f.id], f)),
      ]
        .map(csvEscape)
        .join(',')
    })
    const csv = [headers.map(csvEscape).join(','), ...lines].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.slug || 'form'}-submissions.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copySelectedJson = async () => {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(selected, null, 2))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setError('Could not copy to clipboard')
    }
  }

  if (!Number.isFinite(formId)) {
    return (
      <div className="admin-card flex flex-1 items-center justify-center rounded-2xl text-sm text-[var(--a-muted)]">
        Invalid form id
      </div>
    )
  }

  return (
    <div className="admin-cx-page relative flex h-full min-h-0 w-full flex-1 flex-col gap-2">
      <div
        className="admin-cx-dots pointer-events-none absolute -right-2 top-0 h-24 w-24 opacity-20"
        aria-hidden
      />
      <div
        className="admin-cx-mesh pointer-events-none absolute inset-x-0 top-0 h-28 opacity-40"
        aria-hidden
      />

      {/* Compact header */}
      <header className="admin-cx-header admin-anim-scale relative shrink-0 overflow-hidden rounded-xl px-3 py-2.5 sm:px-4">
        <div
          className="admin-cx-header-glow pointer-events-none absolute -right-10 -top-16 h-28 w-28 rounded-full blur-3xl"
          aria-hidden
        />
        <div className="admin-cx-header-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                href="/admin/forms"
                className="inline-flex h-6 items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)]/70 px-1.5 text-[10px] font-semibold text-[var(--a-text-secondary)] transition hover:text-[var(--a-text)]"
              >
                <ArrowLeft className="h-3 w-3" />
                Forms
              </Link>
              <p className="admin-cx-kicker text-[9px] font-bold uppercase tracking-[0.14em]">
                Responses
              </p>
              {form?.slug && (
                <span className="truncate font-mono text-[10px] text-[var(--a-muted)]">
                  /f/{form.slug}
                </span>
              )}
            </div>
            <h1
              className="mt-0.5 truncate text-[1.05rem] font-bold tracking-tight sm:text-[1.15rem]"
              style={{ color: 'var(--a-text)' }}
            >
              {loading ? 'Loading…' : form?.title || 'Form responses'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {form && (
              <>
                <Link
                  href={`/admin/forms/${form.id}/builder`}
                  className="admin-btn-ghost inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
                {form.status === 'published' && (
                  <Link
                    href={`/f/${form.slug}`}
                    target="_blank"
                    className="admin-btn-ghost inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Live
                  </Link>
                )}
              </>
            )}
            <button
              type="button"
              onClick={exportCsv}
              disabled={loading || filtered.length === 0}
              className="admin-btn-primary inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold disabled:opacity-50"
            >
              <Download className="h-3 w-3" />
              Export
            </button>
          </div>
        </div>

        <div className="admin-stagger relative mt-2 grid grid-cols-4 gap-1.5">
          <StatCard
            label="Total"
            value={loading ? '—' : String(stats.total)}
            icon={Inbox}
            tone="violet"
            active={statusFilter === 'all' && statusMulti.length === 0}
            onClick={() => setQuickStatus('all')}
          />
          <StatCard
            label="New"
            value={loading ? '—' : String(stats.new)}
            icon={Sparkles}
            tone="sky"
            active={statusFilter === 'new' || statusMulti.includes('new')}
            onClick={() => setQuickStatus('new')}
          />
          <StatCard
            label="Reviewed"
            value={loading ? '—' : String(stats.reviewed)}
            icon={CheckSquare}
            tone="emerald"
            active={statusFilter === 'reviewed' || statusMulti.includes('reviewed')}
            onClick={() => setQuickStatus('reviewed')}
          />
          <StatCard
            label="Archived"
            value={loading ? '—' : String(stats.archived)}
            icon={CalendarDays}
            tone="amber"
            active={statusFilter === 'archived' || statusMulti.includes('archived')}
            onClick={() => setQuickStatus('archived')}
          />
        </div>
      </header>

      {error && (
        <div className="admin-anim-fade shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="relative flex min-h-0 flex-1 gap-2">
        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col',
            selected ? 'hidden lg:flex' : 'flex',
          )}
        >
          {loading ? (
            <div className="admin-card flex flex-1 items-center justify-center gap-2 rounded-xl text-xs text-[var(--a-muted)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading responses…
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState
              title="No responses yet"
              description="When people submit this form, their answers will appear here ready to search and export."
              actionLabel="Edit form"
              href={`/admin/forms/${formId}/builder`}
            />
          ) : (
            <div className="admin-card relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl ring-1 ring-[color-mix(in_srgb,var(--a-primary)_6%,transparent)]">
              {/* Compact toolbar + chrome */}
              <div className="relative flex shrink-0 flex-col gap-1.5 border-b border-[var(--a-border)] bg-gradient-to-r from-[var(--a-surface)] via-[var(--a-primary-soft)]/20 to-[var(--a-surface)] px-2.5 py-1.5">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                  <div className="relative min-w-0 flex-1 sm:max-w-xs">
                    <Search
                      className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--a-muted)]"
                      aria-hidden
                    />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search…"
                      className="h-7 w-full rounded-lg border border-[var(--a-border)] bg-[var(--a-input-bg)] pl-7 pr-2 text-[12px] outline-none transition focus:border-[var(--a-primary)] focus:ring-1 focus:ring-[var(--a-ring)]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <div className="flex items-center gap-0.5 rounded-lg bg-[var(--a-surface-2)]/80 p-0.5 ring-1 ring-[var(--a-border)]">
                      {(
                        [
                          { id: 'all' as const, label: 'All', count: stats.total },
                          { id: 'new' as const, label: 'New', count: stats.new },
                          {
                            id: 'reviewed' as const,
                            label: 'Done',
                            count: stats.reviewed,
                          },
                          {
                            id: 'archived' as const,
                            label: 'Archive',
                            count: stats.archived,
                          },
                        ] as const
                      ).map((tab) => {
                        const active =
                          tab.id === 'all'
                            ? statusFilter === 'all' && statusMulti.length === 0
                            : statusFilter === tab.id || statusMulti.includes(tab.id)
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setQuickStatus(tab.id)}
                            className={cn(
                              'inline-flex h-6 items-center rounded-md px-2 text-[10px] font-semibold transition',
                              active
                                ? 'bg-[var(--a-primary)] text-white shadow-sm'
                                : 'text-[var(--a-text-secondary)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)]',
                            )}
                          >
                            {tab.label}
                            <span
                              className={cn(
                                'ml-1 rounded px-1 text-[9px] tabular-nums',
                                active
                                  ? 'bg-white/20'
                                  : 'bg-[var(--a-surface)] text-[var(--a-muted)]',
                              )}
                            >
                              {tab.count}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setAdvancedOpen((o) => !o)}
                      className={cn(
                        'inline-flex h-6 items-center gap-1 rounded-md border px-2 text-[10px] font-semibold transition',
                        advancedOpen || activeAdvancedCount > 0
                          ? 'border-[color-mix(in_srgb,var(--a-primary)_35%,var(--a-border))] bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)]'
                          : 'border-[var(--a-border)] bg-[var(--a-surface)] text-[var(--a-text-secondary)] hover:text-[var(--a-text)]',
                      )}
                    >
                      <SlidersHorizontal className="h-3 w-3" />
                      Filters
                      {activeAdvancedCount > 0 && (
                        <span className="rounded-full bg-[var(--a-primary)] px-1 text-[9px] font-bold text-white">
                          {activeAdvancedCount}
                        </span>
                      )}
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 transition',
                          advancedOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    <span className="hidden rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-1.5 py-0.5 text-[9px] font-semibold tabular-nums text-[var(--a-muted)] sm:inline">
                      {safePage}/{totalPages}
                    </span>
                  </div>
                </div>

                {/* Active filter chips */}
                {(activeAdvancedCount > 0 || query.trim()) && (
                  <div className="flex flex-wrap items-center gap-1">
                    {query.trim() && (
                      <FilterChip
                        label={`Search: ${query.trim()}`}
                        onClear={() => setQuery('')}
                      />
                    )}
                    {datePreset !== 'all' && (
                      <FilterChip
                        label={
                          datePreset === 'today'
                            ? 'Today'
                            : datePreset === '7d'
                              ? 'Last 7 days'
                              : datePreset === '30d'
                                ? 'Last 30 days'
                                : `Date ${dateFrom || '…'} → ${dateTo || '…'}`
                        }
                        onClear={() => {
                          setDatePreset('all')
                          setDateFrom('')
                          setDateTo('')
                        }}
                      />
                    )}
                    {statusMulti.length > 1 && (
                      <FilterChip
                        label={`Status: ${statusMulti.map((s) => STATUS_META[s].short).join(', ')}`}
                        onClear={() => {
                          setStatusMulti([])
                          setStatusFilter('all')
                        }}
                      />
                    )}
                    {sortMode === 'oldest' && (
                      <FilterChip
                        label="Oldest first"
                        onClear={() => setSortMode('newest')}
                      />
                    )}
                    {fieldRules
                      .filter(
                        (r) =>
                          r.fieldId &&
                          (r.op === 'is_empty' ||
                            r.op === 'is_not_empty' ||
                            r.value.trim()),
                      )
                      .map((r) => {
                        const field = fields.find((f) => f.id === r.fieldId)
                        const name = field
                          ? getLocalized(field.label, 'en', 'Field')
                          : 'Field'
                        const opLabel =
                          FIELD_FILTER_OPS.find((o) => o.id === r.op)?.label ?? r.op
                        const label =
                          r.op === 'is_empty' || r.op === 'is_not_empty'
                            ? `${name}: ${opLabel}`
                            : `${name} ${opLabel.toLowerCase()} “${r.value.trim()}”`
                        return (
                          <FilterChip
                            key={r.id}
                            label={label}
                            onClear={() => removeFieldRule(r.id)}
                          />
                        )
                      })}
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="inline-flex h-5 items-center rounded px-1.5 text-[9px] font-semibold text-[var(--a-muted)] hover:text-[var(--a-text)]"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Advanced filter panel */}
                {advancedOpen && (
                  <div className="rounded-lg border border-[var(--a-border)] bg-[var(--a-surface)]/90 p-2 shadow-sm">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                        <Filter className="h-3 w-3" />
                        Advanced filters
                      </p>
                      <div className="flex items-center gap-1">
                        {activeAdvancedCount > 0 && (
                          <button
                            type="button"
                            onClick={clearAdvancedFilters}
                            className="h-6 rounded-md px-2 text-[10px] font-semibold text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setAdvancedOpen(false)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]"
                          title="Close"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface-2)]/40 p-1.5">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                          Date submitted
                        </p>
                        <div className="flex flex-wrap gap-0.5">
                          {(
                            [
                              { id: 'all' as const, label: 'Any' },
                              { id: 'today' as const, label: 'Today' },
                              { id: '7d' as const, label: '7d' },
                              { id: '30d' as const, label: '30d' },
                              { id: 'custom' as const, label: 'Custom' },
                            ] as const
                          ).map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setDatePreset(p.id)}
                              className={cn(
                                'h-6 rounded-md px-1.5 text-[10px] font-semibold transition',
                                datePreset === p.id
                                  ? 'bg-[var(--a-primary)] text-white'
                                  : 'bg-[var(--a-surface)] text-[var(--a-text-secondary)] ring-1 ring-[var(--a-border)] hover:text-[var(--a-text)]',
                              )}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                        {datePreset === 'custom' && (
                          <div className="mt-1.5 grid grid-cols-2 gap-1">
                            <label className="block">
                              <span className="text-[9px] text-[var(--a-muted)]">From</span>
                              <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="mt-0.5 h-7 w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input-bg)] px-1.5 text-[11px] outline-none focus:border-[var(--a-primary)]"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[9px] text-[var(--a-muted)]">To</span>
                              <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="mt-0.5 h-7 w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input-bg)] px-1.5 text-[11px] outline-none focus:border-[var(--a-primary)]"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface-2)]/40 p-1.5">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                          Status (multi)
                        </p>
                        <div className="flex flex-wrap gap-0.5">
                          {SUBMISSION_STATUSES.map((st) => {
                            const on = statusMulti.includes(st)
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => toggleStatusMulti(st)}
                                className={cn(
                                  'inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold transition',
                                  on
                                    ? STATUS_META[st].className
                                    : 'border-[var(--a-border)] bg-[var(--a-surface)] text-[var(--a-text-secondary)]',
                                )}
                              >
                                <span
                                  className={cn('h-1 w-1 rounded-full', STATUS_META[st].dot)}
                                />
                                {STATUS_META[st].short}
                              </button>
                            )
                          })}
                        </div>
                        <p className="mt-1 text-[9px] text-[var(--a-muted)]">
                          Leave empty for all statuses.
                        </p>
                      </div>

                      <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface-2)]/40 p-1.5">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                          Sort by
                        </p>
                        <div className="flex gap-0.5">
                          {(
                            [
                              { id: 'newest' as const, label: 'Newest first' },
                              { id: 'oldest' as const, label: 'Oldest first' },
                            ] as const
                          ).map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSortMode(s.id)}
                              className={cn(
                                'h-6 flex-1 rounded-md px-1.5 text-[10px] font-semibold transition',
                                sortMode === s.id
                                  ? 'bg-[var(--a-primary)] text-white'
                                  : 'bg-[var(--a-surface)] text-[var(--a-text-secondary)] ring-1 ring-[var(--a-border)]',
                              )}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface-2)]/40 p-1.5">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                          Field rules
                        </p>
                        <button
                          type="button"
                          onClick={addFieldRule}
                          disabled={fields.length === 0}
                          className="inline-flex h-7 w-full items-center justify-center gap-1 rounded-md border border-dashed border-[var(--a-border-strong)] bg-[var(--a-surface)] text-[10px] font-semibold text-[var(--a-text-secondary)] transition hover:border-[var(--a-primary)] hover:text-[var(--a-primary)] disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3" />
                          Add field filter
                        </button>
                        <p className="mt-1 text-[9px] text-[var(--a-muted)]">
                          Filter by any form answer.
                        </p>
                      </div>
                    </div>

                    {fieldRules.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {fieldRules.map((rule) => {
                          const needsValue =
                            rule.op !== 'is_empty' && rule.op !== 'is_not_empty'
                          const field = fields.find((f) => f.id === rule.fieldId)
                          const isChoice =
                            field?.type === 'dropdown' ||
                            field?.type === 'radio' ||
                            field?.type === 'checkbox'
                          return (
                            <div
                              key={rule.id}
                              className="flex flex-wrap items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface-2)]/30 p-1"
                            >
                              <select
                                value={rule.fieldId}
                                onChange={(e) =>
                                  updateFieldRule(rule.id, {
                                    fieldId: e.target.value,
                                    value: '',
                                  })
                                }
                                className="h-7 min-w-[8rem] flex-1 rounded-md border border-[var(--a-border)] bg-[var(--a-input-bg)] px-1.5 text-[11px] font-medium outline-none focus:border-[var(--a-primary)]"
                              >
                                <option value="">Select field…</option>
                                {fields.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {getLocalized(f.label, 'en', f.id)}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={rule.op}
                                onChange={(e) =>
                                  updateFieldRule(rule.id, {
                                    op: e.target.value as FieldFilterOp,
                                  })
                                }
                                className="h-7 rounded-md border border-[var(--a-border)] bg-[var(--a-input-bg)] px-1.5 text-[11px] outline-none focus:border-[var(--a-primary)]"
                              >
                                {FIELD_FILTER_OPS.map((op) => (
                                  <option key={op.id} value={op.id}>
                                    {op.label}
                                  </option>
                                ))}
                              </select>
                              {needsValue &&
                                (isChoice && field?.options?.length ? (
                                  <select
                                    value={rule.value}
                                    onChange={(e) =>
                                      updateFieldRule(rule.id, {
                                        value: e.target.value,
                                      })
                                    }
                                    className="h-7 min-w-[7rem] flex-1 rounded-md border border-[var(--a-border)] bg-[var(--a-input-bg)] px-1.5 text-[11px] outline-none focus:border-[var(--a-primary)]"
                                  >
                                    <option value="">Any value…</option>
                                    {field.options.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {getLocalized(opt.label, 'en', opt.value)}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    value={rule.value}
                                    onChange={(e) =>
                                      updateFieldRule(rule.id, {
                                        value: e.target.value,
                                      })
                                    }
                                    placeholder="Value…"
                                    className="h-7 min-w-[7rem] flex-1 rounded-md border border-[var(--a-border)] bg-[var(--a-input-bg)] px-1.5 text-[11px] outline-none focus:border-[var(--a-primary)]"
                                  />
                                ))}
                              <button
                                type="button"
                                onClick={() => removeFieldRule(rule.id)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--a-muted)] hover:bg-red-500/10 hover:text-red-600"
                                title="Remove rule"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <p className="mt-1.5 text-[9px] text-[var(--a-muted)]">
                      Showing{' '}
                      <span className="font-bold text-[var(--a-text)]">{filtered.length}</span>
                      {' '}of{' '}
                      <span className="font-bold text-[var(--a-text)]">
                        {submissions.length}
                      </span>{' '}
                      responses
                    </p>
                  </div>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--a-primary-soft)] text-[var(--a-primary)]">
                    <Filter className="h-4 w-4" />
                  </div>
                  <p className="text-[13px] font-bold text-[var(--a-text)]">No matches</p>
                  <p className="max-w-xs text-[11px] text-[var(--a-muted)]">
                    Nothing matches your search or advanced filters. Adjust rules or clear them.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="admin-btn-primary mt-1 inline-flex h-7 items-center rounded-lg px-3 text-[11px] font-semibold"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
              <>
              <div className="min-h-0 flex-1 overflow-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b border-[var(--a-border)] bg-[var(--a-surface-2)]/95 backdrop-blur-sm">
                      <th className="w-9 px-2 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-[var(--a-muted)]">
                        #
                      </th>
                      <th className="px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-muted)]">
                        Status
                      </th>
                      <th className="px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-muted)]">
                        When
                      </th>
                      {tableColumns.map((col, colIdx) => (
                        <th
                          key={col.id}
                          className={cn(
                            'max-w-[160px] px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-muted)]',
                            colIdx === 0 && 'min-w-[120px]',
                          )}
                        >
                          <span className="line-clamp-1">
                            {getLocalized(col.label, 'en', 'Field')}
                          </span>
                        </th>
                      ))}
                      <th className="sticky right-0 w-[76px] bg-[var(--a-surface-2)]/95 px-2 py-1.5 text-right text-[9px] font-bold uppercase tracking-wider text-[var(--a-muted)] shadow-[-6px_0_10px_-10px_rgba(15,23,42,0.2)]">
                        ···
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((row, idx) => {
                      const data = asRecord(row.data)
                      const active = row.id === selectedId
                      const status = normalizeStatus(row.status)
                      const isNew = status === 'new'
                      const primaryCol = tableColumns[0]
                      const primaryRaw = primaryCol
                        ? formatCellValue(data[primaryCol.id], primaryCol)
                        : ''
                      const avatarTone = avatarToneFor(row.id)

                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedId(row.id)}
                          className={cn(
                            'group relative cursor-pointer border-b border-[var(--a-border)]/50 transition',
                            active
                              ? 'bg-[var(--a-primary-soft)]/70'
                              : isNew
                                ? 'bg-sky-500/[0.03] hover:bg-sky-500/[0.06]'
                                : idx % 2 === 1
                                  ? 'bg-[var(--a-surface-2)]/30 hover:bg-[var(--a-primary-soft)]/35'
                                  : 'hover:bg-[var(--a-primary-soft)]/30',
                          )}
                        >
                          <td className="relative px-2 py-1.5 text-center align-middle">
                            <span
                              className={cn(
                                'absolute inset-y-1 left-0 w-0.5 rounded-r-full',
                                active
                                  ? 'bg-[var(--a-primary)]'
                                  : isNew
                                    ? 'bg-sky-400'
                                    : 'bg-transparent group-hover:bg-[var(--a-primary)]/30',
                              )}
                            />
                            <span
                              className={cn(
                                'inline-flex h-5 min-w-5 items-center justify-center rounded font-mono text-[10px] font-bold tabular-nums',
                                active
                                  ? 'bg-[var(--a-primary)] text-white'
                                  : 'text-[var(--a-muted)]',
                              )}
                            >
                              {rangeStart + idx}
                            </span>
                          </td>

                          <td
                            className="whitespace-nowrap px-2 py-1.5 align-middle"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <StatusSelect
                              value={status}
                              disabled={updatingStatusId === row.id}
                              busy={updatingStatusId === row.id}
                              onChange={(next) => void setStatus(row.id, next)}
                            />
                          </td>

                          <td className="whitespace-nowrap px-2 py-1.5 align-middle">
                            <p className="text-[11px] font-semibold leading-none text-[var(--a-text)]">
                              {formatRelative(row.createdAt)}
                            </p>
                            <p className="mt-0.5 text-[9px] tabular-nums leading-none text-[var(--a-muted)]">
                              {formatCompactDateTime(row.createdAt)}
                            </p>
                          </td>

                          {tableColumns.map((col, colIdx) => {
                            const text = formatCellValue(data[col.id], col)
                            const isPrimary = colIdx === 0
                            return (
                              <td
                                key={col.id}
                                className="max-w-[160px] px-2 py-1.5 align-middle"
                                title={text}
                              >
                                {isPrimary ? (
                                  <div className="flex min-w-0 items-center gap-1.5">
                                    <span
                                      className={cn(
                                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-white shadow-sm',
                                        avatarTone,
                                      )}
                                    >
                                      {initialsFrom(primaryRaw || String(row.id))}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-[12px] font-semibold leading-tight text-[var(--a-text)]">
                                        {text || (
                                          <span className="font-medium text-[var(--a-muted)]">
                                            —
                                          </span>
                                        )}
                                      </p>
                                      <p className="truncate font-mono text-[9px] leading-none text-[var(--a-muted)]">
                                        #{row.id}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <TableCellValue value={text} field={col} />
                                )}
                              </td>
                            )
                          })}

                          <td
                            className={cn(
                              'sticky right-0 px-2 py-1.5 text-right align-middle shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.2)]',
                              active
                                ? 'bg-[color-mix(in_srgb,var(--a-primary-soft)_80%,var(--a-surface))]'
                                : isNew
                                  ? 'bg-[color-mix(in_srgb,#e0f2fe_30%,var(--a-surface))] group-hover:bg-[color-mix(in_srgb,#e0f2fe_45%,var(--a-surface))]'
                                  : idx % 2 === 1
                                    ? 'bg-[color-mix(in_srgb,var(--a-surface-2)_45%,var(--a-surface))] group-hover:bg-[color-mix(in_srgb,var(--a-primary-soft)_40%,var(--a-surface))]'
                                    : 'bg-[var(--a-surface)] group-hover:bg-[color-mix(in_srgb,var(--a-primary-soft)_35%,var(--a-surface))]',
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex items-center gap-0.5 rounded-md border border-[var(--a-border)]/70 bg-[var(--a-surface)]/95 p-px">
                              <button
                                type="button"
                                onClick={() => setSelectedId(row.id)}
                                className="inline-flex h-6 w-6 items-center justify-center rounded text-[var(--a-primary)] transition hover:bg-[var(--a-primary-soft)]"
                                title="View"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => void remove(row.id)}
                                disabled={deletingId === row.id}
                                className="inline-flex h-6 w-6 items-center justify-center rounded text-[var(--a-muted)] transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === row.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <PaginationBar
                page={safePage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filtered.length}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
              </>
              )}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && form && (
          <aside className="admin-card admin-anim-in flex w-full min-h-0 shrink-0 flex-col overflow-hidden rounded-xl ring-1 ring-[color-mix(in_srgb,var(--a-primary)_8%,transparent)] lg:w-[320px] xl:w-[360px]">
            <div className="relative flex items-center justify-between gap-2 border-b border-[var(--a-border)] bg-gradient-to-r from-[var(--a-primary-soft)]/40 to-[var(--a-surface)] px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm',
                    avatarToneFor(selected.id),
                  )}
                >
                  {initialsFrom(
                    tableColumns[0]
                      ? formatCellValue(
                          asRecord(selected.data)[tableColumns[0].id],
                          tableColumns[0],
                        ) || String(selected.id)
                      : String(selected.id),
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[12px] font-bold text-[var(--a-text)]">
                    #{selected.id}
                  </p>
                  <p className="truncate text-[10px] text-[var(--a-muted)]">
                    {formatCompactDateTime(selected.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => void copySelectedJson()}
                  className="admin-btn-ghost inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold"
                  title="Copy JSON"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? 'OK' : 'JSON'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="admin-btn-ghost inline-flex h-7 w-7 items-center justify-center rounded-md"
                  title="Close"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 border-b border-[var(--a-border)] px-2.5 py-2">
              {SUBMISSION_STATUSES.map((st) => {
                const active = normalizeStatus(selected.status) === st
                const meta = STATUS_META[st]
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={updatingStatusId === selected.id}
                    onClick={() => void setStatus(selected.id, st)}
                    className={cn(
                      'inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold transition disabled:opacity-60',
                      active
                        ? meta.className
                        : 'border-[var(--a-border)] bg-[var(--a-surface)] text-[var(--a-text-secondary)] hover:text-[var(--a-text)]',
                    )}
                  >
                    {updatingStatusId === selected.id && active ? (
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    ) : (
                      <span className={cn('h-1 w-1 rounded-full', meta.dot)} />
                    )}
                    {meta.short}
                  </button>
                )
              })}
            </div>

            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2.5">
              {fields.length === 0 ? (
                <RawDataBlock data={asRecord(selected.data)} />
              ) : (
                fields.map((field) => {
                  const value = asRecord(selected.data)[field.id]
                  const label = getLocalized(field.label, 'en', 'Untitled field')
                  return (
                    <div
                      key={field.id}
                      className="rounded-lg border border-[var(--a-border)] bg-[var(--a-surface-2)]/35 px-2.5 py-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold text-[var(--a-muted)]">
                          {label}
                        </p>
                        <span className="text-[8px] font-bold uppercase tracking-wide text-[var(--a-muted)]/80">
                          {field.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[12px] leading-snug text-[var(--a-text)]">
                        <FieldValueDisplay value={value} field={field} />
                      </div>
                    </div>
                  )
                })
              )}

              {(() => {
                const data = asRecord(selected.data)
                const known = new Set(fields.map((f) => f.id))
                const extras = Object.keys(data).filter((k) => !known.has(k))
                if (extras.length === 0) return null
                return (
                  <div className="rounded-lg border border-dashed border-[var(--a-border)] px-2.5 py-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                      Other
                    </p>
                    <div className="mt-1 space-y-1">
                      {extras.map((key) => (
                        <div key={key}>
                          <p className="font-mono text-[9px] text-[var(--a-muted)]">{key}</p>
                          <p className="text-[11px] text-[var(--a-text-secondary)]">
                            {formatCellValue(data[key], undefined) || '—'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>

            <div className="border-t border-[var(--a-border)] px-2.5 py-2">
              <button
                type="button"
                onClick={() => void remove(selected.id)}
                disabled={deletingId === selected.id}
                className="admin-btn-ghost admin-btn-danger-hover inline-flex h-7 w-full items-center justify-center gap-1 rounded-lg text-[11px] font-semibold disabled:opacity-50"
              >
                {deletingId === selected.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
                Delete
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function FieldValueDisplay({
  value,
  field,
}: {
  value: unknown
  field: ColumnField
}) {
  if (value == null || value === '') {
    return <span className="text-[var(--a-muted)]">No answer</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-[var(--a-muted)]">No answer</span>
    }
    return (
      <ul className="flex flex-wrap gap-1.5">
        {value.map((item, i) => (
          <li
            key={i}
            className="inline-flex rounded-lg bg-[var(--a-primary-soft)] px-2 py-0.5 text-[12px] font-medium text-[var(--a-primary-soft-text)]"
          >
            {resolveOptionLabel(String(item), field)}
          </li>
        ))}
      </ul>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <span
        className={cn(
          'inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold',
          value
            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
            : 'bg-[var(--a-surface)] text-[var(--a-muted)] ring-1 ring-[var(--a-border)]',
        )}
      >
        {value ? 'Yes' : 'No'}
      </span>
    )
  }

  if (typeof value === 'object') {
    return (
      <pre className="overflow-x-auto rounded-lg bg-[var(--a-surface)] p-2 font-mono text-[11px] text-[var(--a-text-secondary)] ring-1 ring-[var(--a-border)]">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  const text = String(value)
  if (field.type === 'email' && text.includes('@')) {
    return (
      <a
        href={`mailto:${text}`}
        className="font-medium text-[var(--a-primary)] hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {text}
      </a>
    )
  }

  if (field.type === 'file' || looksLikeUrl(text)) {
    return (
      <a
        href={text}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 break-all font-medium text-[var(--a-primary)] hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="h-3 w-3 shrink-0" />
        {text}
      </a>
    )
  }

  if (field.type === 'dropdown' || field.type === 'radio') {
    return <span>{resolveOptionLabel(text, field)}</span>
  }

  if (field.type === 'paragraph') {
    return <p className="whitespace-pre-wrap">{text}</p>
  }

  return <span>{text}</span>
}

function RawDataBlock({ data }: { data: Record<string, unknown> }) {
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return <p className="text-sm text-[var(--a-muted)]">Empty submission.</p>
  }
  return (
    <div className="space-y-2">
      {keys.map((key) => (
        <div
          key={key}
          className="rounded-xl border border-[var(--a-border)] bg-[var(--a-surface-2)]/40 px-3 py-2.5"
        >
          <p className="font-mono text-[10px] text-[var(--a-muted)]">{key}</p>
          <p className="mt-1 text-[13px] text-[var(--a-text-secondary)]">
            {formatCellValue(data[key], undefined) || '—'}
          </p>
        </div>
      ))}
    </div>
  )
}

function StatusSelect({
  value,
  onChange,
  disabled,
  busy,
}: {
  value: SubmissionStatus
  onChange: (status: SubmissionStatus) => void
  disabled?: boolean
  busy?: boolean
}) {
  const meta = STATUS_META[value]
  return (
    <div className="relative inline-flex items-center">
      <span
        className={cn(
          'pointer-events-none absolute left-1.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full',
          meta.dot,
          value === 'new' && 'animate-pulse',
        )}
      />
      {busy ? (
        <Loader2 className="pointer-events-none absolute right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-spin opacity-70" />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 opacity-50" />
      )}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as SubmissionStatus)}
        className={cn(
          'h-6 min-w-[5.5rem] cursor-pointer appearance-none rounded-full border py-0 pl-3.5 pr-5 text-[9px] font-bold uppercase tracking-wide outline-none transition focus:ring-1 focus:ring-[var(--a-ring)] disabled:opacity-60',
          meta.className,
        )}
        aria-label="Response status"
      >
        {SUBMISSION_STATUSES.map((st) => (
          <option key={st} value={st}>
            {STATUS_META[st].short}
          </option>
        ))}
      </select>
    </div>
  )
}

function TableCellValue({
  value,
  field,
}: {
  value: string
  field: ColumnField
}) {
  if (!value) {
    return <span className="text-[11px] text-[var(--a-muted)]">—</span>
  }

  if (field.type === 'email' || (value.includes('@') && value.includes('.'))) {
    return (
      <a
        href={`mailto:${value}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex max-w-full items-center gap-1 text-[11px] font-medium text-[var(--a-primary)] hover:underline"
        title={value}
      >
        <Mail className="h-2.5 w-2.5 shrink-0 opacity-70" />
        <span className="truncate">{value}</span>
      </a>
    )
  }

  if (field.type === 'number' || /^[\d+\-\s().]{7,}$/.test(value)) {
    const looksPhone = /^[\d+\-\s().]{7,}$/.test(value)
    return (
      <span
        className="inline-flex max-w-full items-center gap-1 text-[11px] font-medium tabular-nums text-[var(--a-text)]"
        title={value}
      >
        {looksPhone && <Phone className="h-2.5 w-2.5 shrink-0 text-emerald-600 opacity-80" />}
        <span className="truncate">{value}</span>
      </span>
    )
  }

  return (
    <span className="block max-w-[160px] truncate text-[11px] font-medium text-[var(--a-text)]" title={value}>
      {value}
    </span>
  )
}

function initialsFrom(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

const AVATAR_TONES = [
  'bg-gradient-to-br from-[#5b42ec] to-[#0284c7]',
  'bg-gradient-to-br from-violet-500 to-fuchsia-500',
  'bg-gradient-to-br from-emerald-500 to-teal-500',
  'bg-gradient-to-br from-amber-500 to-orange-500',
  'bg-gradient-to-br from-rose-500 to-pink-500',
  'bg-gradient-to-br from-sky-500 to-indigo-500',
] as const

function avatarToneFor(id: number) {
  return AVATAR_TONES[Math.abs(id) % AVATAR_TONES.length]
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  active,
  onClick,
}: {
  label: string
  value: string
  icon: typeof Inbox
  tone: 'violet' | 'emerald' | 'sky' | 'amber'
  active?: boolean
  onClick?: () => void
}) {
  const toneClass =
    tone === 'emerald'
      ? 'from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-300'
      : tone === 'sky'
        ? 'from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-300'
        : tone === 'amber'
          ? 'from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-300'
          : 'from-[var(--a-primary)]/15 to-[var(--a-primary)]/5 text-[var(--a-primary-soft-text)]'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'admin-cx-snap group relative w-full overflow-hidden !rounded-lg !px-2 !py-1.5 text-left transition',
        active && 'ring-2 ring-[var(--a-primary)]/35 shadow-sm',
      )}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br',
            toneClass,
          )}
        >
          <Icon className="h-3 w-3" />
        </div>
        <div className="min-w-0 leading-none">
          <p className="text-[8px] font-semibold uppercase tracking-wide text-[var(--a-muted)]">
            {label}
          </p>
          <p className="mt-0.5 text-sm font-bold tabular-nums tracking-tight text-[var(--a-text)]">
            {value}
          </p>
        </div>
      </div>
    </button>
  )
}

function normalizeStatus(value: unknown): SubmissionStatus {
  if (value === 'reviewed' || value === 'archived' || value === 'new') return value
  return 'new'
}

function FilterChip({
  label,
  onClear,
}: {
  label: string
  onClear: () => void
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-[color-mix(in_srgb,var(--a-primary)_22%,var(--a-border))] bg-[var(--a-primary-soft)]/70 py-0.5 pl-2 pr-0.5 text-[9px] font-semibold text-[var(--a-primary-soft-text)]">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full hover:bg-[var(--a-primary)]/15"
        title="Remove"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  )
}

function matchFieldRule(raw: unknown, rule: FieldFilterRule): boolean {
  const text = formatCellValue(raw, undefined).trim().toLowerCase()
  const empty =
    raw == null ||
    raw === '' ||
    (Array.isArray(raw) && raw.length === 0) ||
    text === ''

  if (rule.op === 'is_empty') return empty
  if (rule.op === 'is_not_empty') return !empty

  const needle = rule.value.trim().toLowerCase()
  if (!needle) return true

  // Arrays / multi-select: match if any item matches
  if (Array.isArray(raw)) {
    const items = raw.map((v) => String(v).toLowerCase())
    if (rule.op === 'equals') return items.includes(needle) || text === needle
    if (rule.op === 'starts_with') {
      return items.some((i) => i.startsWith(needle)) || text.startsWith(needle)
    }
    return items.some((i) => i.includes(needle)) || text.includes(needle)
  }

  if (rule.op === 'equals') return text === needle
  if (rule.op === 'starts_with') return text.startsWith(needle)
  return text.includes(needle)
}

function toInputDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfDay(yyyyMmDd: string): number {
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0).getTime()
}

function endOfDay(yyyyMmDd: string): number {
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999).getTime()
}

function PaginationBar({
  page,
  totalPages,
  pageSize,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
  onPageSizeChange,
}: {
  page: number
  totalPages: number
  pageSize: number
  totalItems: number
  rangeStart: number
  rangeEnd: number
  onPageChange: (p: number) => void
  onPageSizeChange: (n: number) => void
}) {
  const pages = useMemo(() => buildPageList(page, totalPages), [page, totalPages])

  return (
    <div className="relative shrink-0 border-t border-[var(--a-border)] bg-[var(--a-surface-2)]/40">
      <div className="flex flex-col gap-1.5 px-2.5 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[10px] text-[var(--a-text-secondary)]">
            <span className="font-bold tabular-nums text-[var(--a-text)]">
              {rangeStart}–{rangeEnd}
            </span>
            <span className="mx-0.5 text-[var(--a-muted)]">/</span>
            <span className="font-bold tabular-nums text-[var(--a-text)]">{totalItems}</span>
          </p>
          <label className="flex items-center gap-1 text-[10px] font-medium text-[var(--a-muted)]">
            Rows
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-6 rounded-md border border-[var(--a-border)] bg-[var(--a-input-bg)] px-1 text-[10px] font-bold text-[var(--a-text)] outline-none focus:border-[var(--a-primary)]"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-0.5">
          <PagerButton label="First page" disabled={page <= 1} onClick={() => onPageChange(1)}>
            <ChevronsLeft className="h-3 w-3" />
          </PagerButton>
          <PagerButton
            label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-3 w-3" />
          </PagerButton>

          <div className="mx-0.5 flex items-center gap-px rounded-lg border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5">
            {pages.map((item, i) =>
              item === '…' ? (
                <span
                  key={`e-${i}`}
                  className="flex h-6 w-5 items-center justify-center text-[10px] font-semibold text-[var(--a-muted)]"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-current={item === page ? 'page' : undefined}
                  className={cn(
                    'flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-bold tabular-nums transition',
                    item === page
                      ? 'bg-[var(--a-primary)] text-white shadow-sm'
                      : 'text-[var(--a-text-secondary)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]',
                  )}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <PagerButton
            label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-3 w-3" />
          </PagerButton>
          <PagerButton
            label="Last page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="h-3 w-3" />
          </PagerButton>
        </div>
      </div>
    </div>
  )
}

function PagerButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: ReactNode
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] text-[var(--a-text-secondary)] transition hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)] disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}

function formatCompactDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  href,
}: {
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
  href?: string
}) {
  const actionClass =
    'admin-btn-primary mt-1 inline-flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold'

  return (
    <div className="admin-card admin-anim-scale relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl px-4 py-8 text-center">
      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-1.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--a-primary)]/20 to-[#0284c7]/15 text-[var(--a-primary)]">
          <ClipboardList className="h-4 w-4" />
        </div>
        <p className="text-[13px] font-bold text-[var(--a-text)]">{title}</p>
        <p className="text-[11px] leading-relaxed text-[var(--a-muted)]">{description}</p>
        {href ? (
          <Link href={href} className={actionClass}>
            {actionLabel}
          </Link>
        ) : onAction ? (
          <button type="button" onClick={onAction} className={actionClass}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function resolveOptionLabel(value: string, field?: ColumnField): string {
  if (!field?.options?.length) return value
  const match = field.options.find((o) => o.value === value)
  if (!match) return value
  return getLocalized(match.label, 'en', value)
}

function formatCellValue(value: unknown, field?: ColumnField): string {
  if (value == null || value === '') return ''
  if (Array.isArray(value)) {
    return value.map((v) => resolveOptionLabel(String(v), field)).join('; ')
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  const text = String(value)
  if (field && (field.type === 'dropdown' || field.type === 'radio')) {
    return resolveOptionLabel(text, field)
  }
  return text
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.startsWith('/uploads/')
}

function buildPageList(current: number, total: number): Array<number | '…'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total])
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i)
  }
  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: Array<number | '…'> = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…')
    result.push(sorted[i])
  }
  return result
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelative(iso: string) {
  const date = new Date(iso)
  const diffMs = date.getTime() - Date.now()
  const abs = Math.abs(diffMs)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  const minutes = Math.round(diffMs / 60_000)
  if (abs < 60_000) return 'just now'
  if (abs < 3_600_000) return rtf.format(minutes, 'minute')
  const hours = Math.round(diffMs / 3_600_000)
  if (abs < 86_400_000) return rtf.format(hours, 'hour')
  const days = Math.round(diffMs / 86_400_000)
  if (abs < 30 * 86_400_000) return rtf.format(days, 'day')
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
