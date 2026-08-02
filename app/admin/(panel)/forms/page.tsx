'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Clock3,
  ExternalLink,
  FileInput,
  Globe2,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Table2,
  Trash2,
} from 'lucide-react'
import { formsApi } from '@/lib/api/forms.api'
import { ApiError } from '@/lib/api/types'
import type { FormListItem, FormStatus } from '@/lib/builder/types'
import { swalConfirm } from '@/lib/swal'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | FormStatus

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16] as const
const DEFAULT_PAGE_SIZE = 8

export default function AdminFormsPage() {
  const [forms, setForms] = useState<FormListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await formsApi.list()
      setForms(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load forms')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = useMemo(() => {
    const published = forms.filter((f) => f.status === 'published').length
    const drafts = forms.filter((f) => f.status === 'draft').length
    const submissions = forms.reduce((sum, f) => sum + (f.submissionCount ?? 0), 0)
    return { total: forms.length, published, drafts, submissions }
  }, [forms])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return forms.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (!q) return true
      return (
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [forms, query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage, pageSize])

  useEffect(() => {
    setPage(1)
  }, [query, statusFilter, pageSize])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const rangeEnd = Math.min(safePage * pageSize, filtered.length)

  const createForm = async () => {
    const t = title.trim() || 'Untitled Form'
    try {
      setCreating(true)
      const form = await formsApi.create({ title: t })
      setTitle('')
      window.location.href = `/admin/forms/${form.id}/builder`
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed')
      setCreating(false)
    }
  }

  const remove = async (id: number, name: string) => {
    const ok = await swalConfirm({
      title: `Delete “${name}”?`,
      text: 'This form and all of its submissions will be permanently removed.',
      confirmText: 'Delete form',
      cancelText: 'Cancel',
      danger: true,
    })
    if (!ok) return
    try {
      await formsApi.delete(id)
      setForms((f) => f.filter((x) => x.id !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="admin-cx-page relative flex min-h-0 w-full flex-1 flex-col gap-3 sm:h-full">
      <div
        className="admin-cx-dots pointer-events-none absolute -right-2 top-0 h-32 w-32 opacity-25"
        aria-hidden
      />
      <div
        className="admin-cx-mesh pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50"
        aria-hidden
      />

      {/* ── Compact hero ── */}
      <header className="admin-cx-header admin-anim-scale relative shrink-0 overflow-hidden rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4">
        <div
          className="admin-cx-header-glow pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full blur-3xl"
          aria-hidden
        />
        <div
          className="admin-cx-header-glow-b pointer-events-none absolute -bottom-14 left-1/4 h-28 w-28 rounded-full blur-3xl"
          aria-hidden
        />
        <div className="admin-cx-header-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="admin-cx-kicker text-[10px] font-bold uppercase tracking-[0.14em]">
                Form builder
              </p>
              <span className="admin-cx-chip !py-0.5">
                <Sparkles className="h-3 w-3" />
                Multi-section
              </span>
            </div>
            <h1
              className="mt-1 text-[1.3rem] font-bold tracking-tight sm:text-[1.45rem]"
              style={{ color: 'var(--a-text)' }}
            >
              Forms
            </h1>
            <p
              className="mt-0.5 max-w-lg text-[12px] leading-relaxed"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              Build multi-section forms with validation, dropdowns, and file fields — then publish
              and collect submissions.
            </p>
          </div>

          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:max-w-none">
            <div className="relative min-w-0 flex-1 sm:w-52 lg:w-56">
              <FileInput
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--a-muted)]"
                aria-hidden
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name your new form…"
                className="h-10 w-full rounded-xl border border-[var(--a-border)] bg-[var(--a-input-bg)] pl-9 pr-3 text-sm shadow-[var(--a-shadow-sm)] outline-none transition focus:border-[var(--a-primary)] focus:ring-2 focus:ring-[var(--a-ring)]"
                onKeyDown={(e) => e.key === 'Enter' && void createForm()}
              />
            </div>
            <button
              type="button"
              onClick={() => void createForm()}
              disabled={creating}
              className="admin-btn-primary flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:opacity-60"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New form
            </button>
          </div>
        </div>

        {/* Compact stats */}
        <div className="admin-stagger relative mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            label="Total"
            value={loading ? '—' : String(stats.total)}
            icon={ClipboardList}
            tone="violet"
          />
          <StatCard
            label="Published"
            value={loading ? '—' : String(stats.published)}
            icon={Globe2}
            tone="emerald"
          />
          <StatCard
            label="Drafts"
            value={loading ? '—' : String(stats.drafts)}
            icon={FileInput}
            tone="amber"
          />
          <StatCard
            label="Submissions"
            value={loading ? '—' : String(stats.submissions)}
            icon={Inbox}
            tone="sky"
          />
        </div>
      </header>

      {error && (
        <div className="admin-anim-fade shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="admin-anim-in relative flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--a-muted)]"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or slug…"
            className="h-9 w-full rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] pl-9 pr-3 text-sm shadow-[var(--a-shadow-sm)] outline-none transition focus:border-[var(--a-primary)] focus:ring-2 focus:ring-[var(--a-ring)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'published', label: 'Published' },
              { id: 'draft', label: 'Drafts' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                'inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition',
                statusFilter === tab.id
                  ? 'bg-[var(--a-primary)] text-white shadow-md shadow-[color-mix(in_srgb,var(--a-primary)_35%,transparent)]'
                  : 'border border-[var(--a-border)] bg-[var(--a-surface)] text-[var(--a-text-secondary)] hover:border-[var(--a-border-strong)] hover:text-[var(--a-text)]',
              )}
            >
              {tab.label}
              {!loading && (
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums',
                    statusFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--a-surface-2)] text-[var(--a-muted)]',
                  )}
                >
                  {tab.id === 'all'
                    ? stats.total
                    : tab.id === 'published'
                      ? stats.published
                      : stats.drafts}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {/* Mobile: natural height so main scrolls and card actions stay reachable.
          sm+: fill remaining viewport with an internal scroll region. */}
      <div className="relative flex flex-col sm:min-h-0 sm:flex-1">
        {loading ? (
          <div className="admin-card flex flex-1 items-center justify-center gap-2 rounded-2xl text-sm text-[var(--a-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading forms…
          </div>
        ) : forms.length === 0 ? (
          <EmptyState
            title="No forms yet"
            description="Create a registration or contact form and design fields visually."
            actionLabel="Create first form"
            onAction={() => void createForm()}
            busy={creating}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try a different search term or clear the status filter."
            actionLabel="Clear filters"
            onAction={() => {
              setQuery('')
              setStatusFilter('all')
            }}
          />
        ) : (
          <>
            <div className="admin-stagger grid w-full auto-rows-max content-start gap-3 grid-cols-1 sm:min-h-0 sm:flex-1 sm:grid-cols-2 sm:overflow-y-auto sm:pr-0.5 lg:grid-cols-3 xl:grid-cols-4">
              {paged.map((item) => (
                <FormCard key={item.id} form={item} onDelete={remove} />
              ))}
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
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  icon: typeof ClipboardList
  tone: 'violet' | 'emerald' | 'amber' | 'sky'
}) {
  const toneClass =
    tone === 'emerald'
      ? 'from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-300'
      : tone === 'amber'
        ? 'from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-300'
        : tone === 'sky'
          ? 'from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-300'
          : 'from-[var(--a-primary)]/15 to-[var(--a-primary)]/5 text-[var(--a-primary-soft-text)]'

  return (
    <div className="admin-cx-snap group relative overflow-hidden !rounded-xl !px-2.5 !py-2">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
            toneClass,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--a-muted)]">
            {label}
          </p>
          <p className="text-lg font-bold leading-tight tabular-nums tracking-tight text-[var(--a-text)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function FormCard({
  form,
  onDelete,
}: {
  form: FormListItem
  onDelete: (id: number, name: string) => void | Promise<void>
}) {
  const published = form.status === 'published'
  const submissions = form.submissionCount ?? 0
  const initials = form.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <article className="admin-card admin-card-hover group relative flex flex-col overflow-hidden rounded-2xl p-0">
      {/* Form mini mockup */}
      <div
        className={cn(
          'relative shrink-0 overflow-hidden border-b border-[var(--a-border)] px-3 pb-2.5 pt-2.5',
          published
            ? 'bg-gradient-to-br from-[#efeaff] via-[#f0f4ff] to-[#e6f7f4] dark:from-[#2a2250]/80 dark:via-[#1e1a38] dark:to-[#152836]'
            : 'bg-gradient-to-br from-[#fff7ed] via-[#faf5ff] to-[#eef2ff] dark:from-[#3a2a18]/70 dark:via-[#1e1a38] dark:to-[#1a1830]',
        )}
      >
        <div className="absolute right-2.5 top-2.5 z-10">
          <StatusBadge status={form.status} />
        </div>

        <div className="relative mx-auto max-w-[220px] transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <div className="overflow-hidden rounded-lg border border-white/80 bg-white/90 shadow-[0_8px_22px_-12px_rgba(59,37,176,0.35)] backdrop-blur-sm dark:border-white/10 dark:bg-[var(--a-surface)]/90">
            {/* Browser chrome */}
            <div className="flex items-center gap-1 border-b border-[var(--a-border)] bg-[var(--a-surface-2)]/80 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              <div className="ml-1 h-3 flex-1 truncate rounded bg-[var(--a-surface)] px-1.5 text-[7px] leading-[12px] text-[var(--a-muted)]">
                /f/{form.slug}
              </div>
            </div>
            {/* Form field skeleton */}
            <div className="space-y-1.5 p-2">
              <div className="h-1.5 w-[45%] rounded-full bg-[var(--a-border-strong)]/60" />
              <div className="h-4 rounded-md bg-[var(--a-surface-2)] ring-1 ring-[var(--a-border)]" />
              <div className="h-1.5 w-[35%] rounded-full bg-[var(--a-border-strong)]/50" />
              <div className="h-4 rounded-md bg-[var(--a-surface-2)] ring-1 ring-[var(--a-border)]" />
              <div className="flex gap-1 pt-0.5">
                <div className="h-2.5 w-2.5 rounded-full ring-1 ring-[var(--a-border-strong)]/50" />
                <div className="h-1.5 w-[28%] self-center rounded-full bg-[var(--a-border)]" />
                <div className="h-2.5 w-2.5 rounded-full ring-1 ring-[var(--a-border)]" />
                <div className="h-1.5 w-[22%] self-center rounded-full bg-[var(--a-border)]" />
              </div>
              <div
                className={cn(
                  'mt-0.5 h-4 w-[42%] rounded-md',
                  published
                    ? 'bg-gradient-to-r from-[#5b42ec]/85 to-[#0284c7]/70'
                    : 'bg-gradient-to-r from-amber-400/70 to-[#8b7aef]/55',
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meta + actions: never shrink so Edit stays visible on short viewports */}
      <div className="flex shrink-0 flex-col gap-2.5 p-3 sm:p-3.5">
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm ring-1 ring-black/[0.03]',
              published
                ? 'bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)]'
                : 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
            )}
          >
            {initials || <ClipboardList className="h-3.5 w-3.5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[13px] font-bold tracking-tight text-[var(--a-text)]">
              {form.title}
            </h2>
            <p className="mt-0.5 truncate font-mono text-[11px] text-[var(--a-text-secondary)]">
              /{form.slug}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-[var(--a-muted)]">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-2.5 w-2.5 shrink-0" />
                {formatRelative(form.updatedAt)}
              </span>
              <Link
                href={`/admin/forms/${form.id}/submissions`}
                className="inline-flex items-center gap-1 transition hover:text-[var(--a-primary)]"
                onClick={(e) => e.stopPropagation()}
              >
                <Inbox className="h-2.5 w-2.5 shrink-0" />
                {submissions} {submissions === 1 ? 'response' : 'responses'}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--a-border)] pt-2.5">
          <Link
            href={`/admin/forms/${form.id}/builder`}
            className="admin-btn-primary inline-flex h-8 min-w-0 flex-1 basis-[4.5rem] items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold"
          >
            <Pencil className="h-3 w-3 shrink-0" />
            Edit
          </Link>
          <Link
            href={`/admin/forms/${form.id}/submissions`}
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold transition',
              submissions > 0
                ? 'bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)] ring-1 ring-[color-mix(in_srgb,var(--a-primary)_25%,transparent)] hover:opacity-90'
                : 'admin-btn-ghost',
            )}
            title="View form responses"
          >
            <Table2 className="h-3 w-3" />
            <span className="hidden sm:inline">Data</span>
            {submissions > 0 && (
              <span className="rounded-full bg-[var(--a-primary)]/15 px-1.5 py-px text-[10px] font-bold tabular-nums">
                {submissions > 99 ? '99+' : submissions}
              </span>
            )}
          </Link>
          {published && (
            <Link
              href={`/f/${form.slug}`}
              target="_blank"
              className="admin-btn-ghost inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold"
              title="View live form"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">View</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => void onDelete(form.id, form.title)}
            className="admin-btn-ghost admin-btn-danger-hover inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            title="Delete form"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  )
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
    <div className="admin-card mt-3 shrink-0 overflow-hidden rounded-2xl border border-[var(--a-border)]">
      <div className="relative flex flex-col gap-3 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--a-primary)]/35 to-transparent"
          aria-hidden
        />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-[12px] text-[var(--a-text-secondary)]">
            <span className="font-semibold text-[var(--a-text)]">
              {rangeStart}–{rangeEnd}
            </span>
            <span className="mx-1 text-[var(--a-muted)]">of</span>
            <span className="font-semibold text-[var(--a-text)]">{totalItems}</span>
            <span className="ml-1 text-[var(--a-muted)]">forms</span>
          </p>

          <div className="hidden h-4 w-px bg-[var(--a-border)] sm:block" aria-hidden />

          <label className="flex items-center gap-2 text-[11px] font-medium text-[var(--a-muted)]">
            Show
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-[var(--a-border)] bg-[var(--a-input-bg)] px-2 text-xs font-semibold text-[var(--a-text)] outline-none transition focus:border-[var(--a-primary)] focus:ring-2 focus:ring-[var(--a-ring)]"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            per page
          </label>
        </div>

        <div className="flex items-center gap-1">
          <PagerButton
            label="First page"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </PagerButton>
          <PagerButton
            label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </PagerButton>

          <div className="mx-0.5 flex items-center gap-0.5 rounded-xl bg-[var(--a-surface-2)]/80 p-0.5 ring-1 ring-[var(--a-border)]">
            {pages.map((item, i) =>
              item === '…' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex h-8 w-7 items-center justify-center text-xs font-semibold text-[var(--a-muted)]"
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
                    'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold tabular-nums transition',
                    item === page
                      ? 'bg-[var(--a-primary)] text-white shadow-md shadow-[color-mix(in_srgb,var(--a-primary)_40%,transparent)]'
                      : 'text-[var(--a-text-secondary)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)]',
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
            <ChevronRight className="h-3.5 w-3.5" />
          </PagerButton>
          <PagerButton
            label="Last page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
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
      className="admin-btn-ghost inline-flex h-8 w-8 items-center justify-center rounded-lg disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}

function buildPageList(current: number, total: number): Array<number | '…'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = new Set<number>()
  pages.add(1)
  pages.add(total)
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

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  busy,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  busy?: boolean
}) {
  return (
    <div className="admin-card admin-anim-scale relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-12 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in srgb, var(--a-primary) 12%, transparent), transparent 70%)',
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-2.5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--a-primary)]/20 to-[#0284c7]/15 text-[var(--a-primary)] shadow-inner">
          <ClipboardList className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-[var(--a-text)]">{title}</p>
        <p className="text-xs leading-relaxed text-[var(--a-muted)]">{description}</p>
        <button
          type="button"
          onClick={onAction}
          disabled={busy}
          className="admin-btn-primary mt-1.5 inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {actionLabel}
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const published = status === 'published'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm',
        published
          ? 'border border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
          : 'border border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          published ? 'bg-emerald-500 admin-dot-live' : 'bg-amber-500',
        )}
      />
      {status}
    </span>
  )
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
