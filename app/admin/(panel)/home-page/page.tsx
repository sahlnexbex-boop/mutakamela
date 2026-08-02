'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  ExternalLink,
  Globe2,
  GripVertical,
  Home,
  Layers,
  Loader2,
  RotateCcw,
  Save,
  Search,
  Sparkles,
} from 'lucide-react'
import { LocaleSwitcher } from '@/components/builder/shared/locale-switcher'
import { HomeSectionEditor } from '@/components/admin/home-page/home-section-editor'
import { HomeSeoPanel } from '@/components/admin/home-page/home-seo-panel'
import { pagesApi } from '@/lib/api/pages.api'
import { ApiError } from '@/lib/api/types'
import type { BuilderLocale } from '@/lib/builder/i18n'
import type { PageDetail, PageSettings } from '@/lib/builder/types'
import { HOME_SECTION_META } from '@/lib/home/defaults'
import {
  defaultHomePageContent,
  defaultHomeSeoSettings,
} from '@/lib/home/defaults'
import {
  moveSection,
  normalizeHomeContent,
  normalizeHomeSettings,
  resetSectionsToDefault,
  sectionCount,
} from '@/lib/home/utils'
import type { HomePageContent, HomeSection, HomeSectionKey } from '@/lib/home/types'
import { swalConfirm } from '@/lib/swal'
import { cn } from '@/lib/utils'

const HOME_SLUG = 'home'

type Tab = 'sections' | 'seo'

export default function AdminHomePage() {
  const [page, setPage] = useState<PageDetail | null>(null)
  const [content, setContent] = useState<HomePageContent>(defaultHomePageContent())
  const [settings, setSettings] = useState<PageSettings>(defaultHomeSeoSettings())
  const [selectedKey, setSelectedKey] = useState<HomeSectionKey>('hero')
  const [tab, setTab] = useState<Tab>('sections')
  const [locale, setLocale] = useState<BuilderLocale>('en')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2800)
  }

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const list = await pagesApi.list()
      let home = list.find((p) => p.slug === HOME_SLUG)

      if (!home) {
        const created = await pagesApi.create({
          title: 'Home',
          slug: HOME_SLUG,
          content: defaultHomePageContent() as unknown as PageDetail['content'],
          settings: defaultHomeSeoSettings(),
        })
        setPage(created)
        setContent(normalizeHomeContent(created.content))
        setSettings(normalizeHomeSettings(created.settings))
      } else {
        const detail = await pagesApi.get(home.id)
        setPage(detail)
        setContent(normalizeHomeContent(detail.content))
        setSettings(normalizeHomeSettings(detail.settings))
      }
      setDirty(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load home page')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const counts = useMemo(() => sectionCount(content), [content])
  const selected = content.sections.find((s) => s.key === selectedKey) ?? content.sections[0]

  const markDirty = () => setDirty(true)

  const updateSection = (next: HomeSection) => {
    setContent((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.key === next.key ? next : s)),
    }))
    markDirty()
  }

  const toggleSection = (key: HomeSectionKey) => {
    setContent((c) => ({
      ...c,
      sections: c.sections.map((s) =>
        s.key === key ? { ...s, enabled: !s.enabled } : s,
      ),
    }))
    markDirty()
  }

  const reorder = (key: HomeSectionKey, direction: 'up' | 'down') => {
    setContent((c) => ({
      ...c,
      sections: moveSection(c.sections, key, direction),
    }))
    markDirty()
  }

  const save = async (opts?: { publish?: boolean }) => {
    if (!page) return
    try {
      if (opts?.publish) setPublishing(true)
      else setSaving(true)
      setError(null)

      const updated = await pagesApi.update(page.id, {
        title: page.title || 'Home',
        slug: HOME_SLUG,
        content: content as unknown as PageDetail['content'],
        settings,
        ...(opts?.publish ? { status: 'published' as const } : {}),
      })

      if (opts?.publish && updated.status !== 'published') {
        const pub = await pagesApi.publish(page.id)
        setPage(pub)
      } else {
        setPage(updated)
      }

      setDirty(false)
      showToast(opts?.publish ? 'Home page published' : 'Changes saved')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const unpublish = async () => {
    if (!page) return
    try {
      setSaving(true)
      setError(null)
      const updated = await pagesApi.update(page.id, { status: 'draft' })
      setPage(updated)
      showToast('Unpublished — public site uses defaults until republished')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unpublish failed')
    } finally {
      setSaving(false)
    }
  }

  const resetCopy = async () => {
    const ok = await swalConfirm({
      title: 'Reset sections?',
      text: 'All section copy and order will be restored to defaults. SEO settings are kept.',
      confirmText: 'Reset sections',
      cancelText: 'Cancel',
      danger: true,
      icon: 'warning',
    })
    if (!ok) return
    setContent({ version: 1, kind: 'home', sections: resetSectionsToDefault() })
    setSelectedKey('hero')
    markDirty()
  }

  if (loading) {
    return (
      <div className="admin-cx-page flex flex-1 items-center justify-center gap-2 text-xs text-[var(--a-muted)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading home page manager…
      </div>
    )
  }

  return (
    <div className="admin-cx-page relative flex h-full min-h-0 w-full flex-1 flex-col gap-2.5">
      <div
        className="admin-cx-dots pointer-events-none absolute -right-2 top-0 h-28 w-28 opacity-20"
        aria-hidden
      />
      <div
        className="admin-cx-mesh pointer-events-none absolute inset-x-0 top-0 h-32 opacity-45"
        aria-hidden
      />

      {/* Header */}
      <header className="admin-cx-header admin-anim-scale relative shrink-0 overflow-hidden rounded-xl px-3 py-2.5 sm:px-4 sm:py-3">
        <div
          className="admin-cx-header-glow pointer-events-none absolute -right-10 -top-16 h-28 w-28 rounded-full blur-3xl"
          aria-hidden
        />
        <div className="admin-cx-header-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="admin-cx-kicker text-[9px] font-bold uppercase tracking-[0.14em]">
                Content
              </p>
              <span className="admin-cx-chip !py-0.5">
                <Sparkles className="h-3 w-3" />
                Public landing
              </span>
              {dirty && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  Unsaved
                </span>
              )}
            </div>
            <h1
              className="mt-0.5 flex items-center gap-2 text-[1.05rem] font-bold tracking-tight sm:text-[1.15rem]"
              style={{ color: 'var(--a-text)' }}
            >
              <Home className="h-4 w-4 text-[var(--a-primary)]" />
              Home Page Manager
            </h1>
            <p
              className="mt-0.5 max-w-xl text-[11px] leading-relaxed"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              Control every section of the public home page, reorder layout, edit bilingual
              copy, and manage SEO — without opening the freeform builder.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <LocaleSwitcher value={locale} onChange={setLocale} />
            <Link
              href="/"
              target="_blank"
              className="admin-btn-ghost inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview live
            </Link>
            {page?.status === 'published' ? (
              <button
                type="button"
                onClick={() => void unpublish()}
                disabled={saving || publishing}
                className="admin-btn-ghost inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold disabled:opacity-50"
              >
                Unpublish
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving || publishing || !dirty}
              className="admin-btn-ghost inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold disabled:opacity-50"
            >
              {saving && !publishing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save draft
            </button>
            <button
              type="button"
              onClick={() => void save({ publish: true })}
              disabled={saving || publishing}
              className="admin-btn-primary inline-flex h-8 items-center gap-1 rounded-lg px-3 text-[11px] font-semibold disabled:opacity-60"
            >
              {publishing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {page?.status === 'published' ? 'Save & publish' : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="admin-anim-fade shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {toast && (
        <div className="admin-anim-fade pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-lg dark:border-emerald-900/50 dark:bg-emerald-950 dark:text-emerald-200">
          {toast}
        </div>
      )}

      {/* Stats strip */}
      <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard
          icon={Layers}
          label="Sections"
          value={`${counts.enabled}/${counts.total}`}
          hint="enabled"
        />
        <StatCard
          icon={page?.status === 'published' ? CheckCircle2 : EyeOff}
          label="Status"
          value={page?.status === 'published' ? 'Published' : 'Draft'}
          hint={
            page?.status === 'published'
              ? 'Live on public site'
              : 'Defaults until published'
          }
          tone={page?.status === 'published' ? 'success' : 'warn'}
        />
        <StatCard
          icon={Search}
          label="SEO title"
          value={
            (typeof settings.seoTitle === 'string'
              ? settings.seoTitle
              : settings.seoTitle?.[locale] || settings.seoTitle?.en || ''
            ).trim()
              ? 'Configured'
              : 'Missing'
          }
          hint="search snippet"
          tone={
            (typeof settings.seoTitle === 'string'
              ? settings.seoTitle
              : settings.seoTitle?.[locale] || settings.seoTitle?.en || ''
            ).trim()
              ? 'success'
              : 'warn'
          }
        />
        <StatCard
          icon={Globe2}
          label="Languages"
          value="EN · AR"
          hint="bilingual copy"
        />
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 items-center gap-1 rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-1">
        <TabButton
          active={tab === 'sections'}
          onClick={() => setTab('sections')}
          icon={Layers}
          label="Sections"
        />
        <TabButton
          active={tab === 'seo'}
          onClick={() => setTab('seo')}
          icon={Search}
          label="SEO"
        />
        <div className="ml-auto flex items-center gap-1.5 pr-1">
          {tab === 'sections' && (
            <button
              type="button"
              onClick={resetCopy}
              className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[10px] font-semibold text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset sections
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {tab === 'sections' ? (
        <div className="grid min-h-0 flex-1 gap-2.5 lg:grid-cols-[minmax(260px,320px)_1fr]">
          {/* Section list */}
          <div className="admin-card flex min-h-0 flex-col overflow-hidden rounded-xl">
            <div className="shrink-0 border-b border-[var(--a-border)] px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--a-muted)]">
                Page structure
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--a-text-secondary)]">
                Drag order with arrows · toggle visibility
              </p>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
              {content.sections.map((section, index) => {
                const meta = HOME_SECTION_META[section.key]
                const active = section.key === selectedKey
                return (
                  <div
                    key={section.key}
                    className={cn(
                      'group flex items-stretch gap-0.5 rounded-xl border transition-all',
                      active
                        ? 'border-[var(--a-primary)] bg-[var(--a-primary-soft)] shadow-sm'
                        : 'border-transparent bg-transparent hover:border-[var(--a-border)] hover:bg-[var(--a-surface-2)]',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedKey(section.key)}
                      className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2.5 text-left"
                    >
                      <span className="text-[var(--a-muted)] opacity-50 group-hover:opacity-100">
                        <GripVertical className="h-3.5 w-3.5" />
                      </span>
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[11px] font-black text-white shadow-sm',
                          meta.accent,
                          !section.enabled && 'opacity-40 grayscale',
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block truncate text-[12px] font-semibold',
                            active
                              ? 'text-[var(--a-primary-soft-text)]'
                              : 'text-[var(--a-text)]',
                            !section.enabled && 'text-[var(--a-muted)]',
                          )}
                        >
                          {meta.label}
                        </span>
                        <span className="block truncate text-[10px] text-[var(--a-muted)]">
                          {section.enabled ? 'Visible on site' : 'Hidden'}
                        </span>
                      </span>
                      <ChevronRight
                        className={cn(
                          'h-3.5 w-3.5 shrink-0 text-[var(--a-muted)]',
                          active && 'text-[var(--a-primary)]',
                        )}
                      />
                    </button>
                    <div className="flex flex-col justify-center gap-0.5 py-1 pr-1">
                      <button
                        type="button"
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => reorder(section.key, 'up')}
                        className="rounded p-0.5 text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)] disabled:opacity-25"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        disabled={index === content.sections.length - 1}
                        onClick={() => reorder(section.key, 'down')}
                        className="rounded p-0.5 text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)] disabled:opacity-25"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      title={section.enabled ? 'Hide section' : 'Show section'}
                      onClick={() => toggleSection(section.key)}
                      className={cn(
                        'mr-1.5 self-center rounded-lg p-1.5 transition',
                        section.enabled
                          ? 'text-emerald-600 hover:bg-emerald-500/10'
                          : 'text-[var(--a-muted)] hover:bg-[var(--a-surface)]',
                      )}
                    >
                      {section.enabled ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section editor */}
          <div className="admin-card min-h-0 overflow-y-auto rounded-xl p-3.5 sm:p-5">
            {selected ? (
              <HomeSectionEditor
                section={selected}
                locale={locale}
                onChange={updateSection}
              />
            ) : (
              <p className="text-sm text-[var(--a-muted)]">Select a section</p>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-card min-h-0 flex-1 overflow-y-auto rounded-xl p-3.5 sm:p-5">
          <div className="mx-auto max-w-2xl">
            <HomeSeoPanel
              settings={settings}
              locale={locale}
              onChange={(s) => {
                setSettings(s)
                markDirty()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Layers
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold transition sm:flex-none',
        active
          ? 'bg-[var(--a-primary)] text-white shadow-sm'
          : 'text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Layers
  label: string
  value: string
  hint: string
  tone?: 'success' | 'warn'
}) {
  return (
    <div className="admin-card admin-anim-fade flex items-center gap-2.5 rounded-xl px-3 py-2.5">
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          tone === 'success'
            ? 'bg-emerald-500/15 text-emerald-600'
            : tone === 'warn'
              ? 'bg-amber-500/15 text-amber-600'
              : 'bg-[var(--a-primary-soft)] text-[var(--a-primary)]',
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--a-muted)]">
          {label}
        </p>
        <p className="truncate text-[13px] font-bold text-[var(--a-text)]">{value}</p>
        <p className="truncate text-[10px] text-[var(--a-muted)]">{hint}</p>
      </div>
    </div>
  )
}
