'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  ExternalLink,
  GripVertical,
  Keyboard,
  Layers,
  LayoutGrid,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'
import { PagePreview } from '@/components/builder/page/page-preview'
import {
  BuilderCanvasFrame,
  BuilderPanel,
  BuilderShell,
  BuilderTopBar,
  StatusToast,
} from '@/components/builder/shared/builder-chrome'
import { CanvasEmpty } from '@/components/builder/page/canvas-empty'
import { DndHud } from '@/components/builder/page/dnd-hud'
import { PageDocument } from '@/components/builder/page/block-renderer'
import { PageLayers } from '@/components/builder/page/page-layers'
import { PagePalette } from '@/components/builder/page/page-palette'
import {
  PagePropertiesPanel,
  type FormOption,
} from '@/components/builder/page/page-properties'
import { PageSettingsPanel } from '@/components/builder/page/page-settings-panel'
import { formsApi } from '@/lib/api/forms.api'
import { pagesApi } from '@/lib/api/pages.api'
import { ApiError } from '@/lib/api/types'
import { swalConfirm } from '@/lib/swal'
import {
  createBlock,
  defaultPageSettings,
  pageShowsFooter,
  pageShowsHeader,
} from '@/lib/builder/defaults'
import { blockTypeLabel } from '@/lib/builder/palette'
import type { BuilderLocale } from '@/lib/builder/i18n'
import type {
  DeviceMode,
  PageBlock,
  PageContent,
  PageDetail,
  PageSettings,
} from '@/lib/builder/types'
import {
  canNestChildren,
  readDragPayload,
  startDragAutoScroll,
  type BuilderDragPayload,
} from '@/lib/builder/dnd'
import {
  createId,
  duplicateBlock,
  findBlock,
  insertBlock,
  moveBlock,
  normalizePageContent,
  relocateBlock,
  removeBlockFromTree,
  updateBlockInTree,
} from '@/lib/builder/utils'
import { cn } from '@/lib/utils'

type Props = { pageId: number }

const MAX_HISTORY = 40

type RightTab = 'block' | 'seo'
type LeftTab = 'components' | 'layers'

export function PageBuilder({ pageId }: Props) {
  const [page, setPage] = useState<PageDetail | null>(null)
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const [locale, setLocale] = useState<BuilderLocale>('en')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'ok' | 'error' } | null>(null)
  const [history, setHistory] = useState<PageBlock[][]>([])
  const [titleEdit, setTitleEdit] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [slugDraft, setSlugDraft] = useState('')
  const [settings, setSettings] = useState<PageSettings>(defaultPageSettings())
  const [rightTab, setRightTab] = useState<RightTab>('seo')
  const [leftTab, setLeftTab] = useState<LeftTab>('components')
  const [forms, setForms] = useState<FormOption[]>([])
  const [formsLoading, setFormsLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [dragActive, setDragActive] = useState<BuilderDragPayload | null>(null)

  const showToast = useCallback((message: string, tone: 'ok' | 'error' = 'ok') => {
    setToast({ message, tone })
    window.setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await pagesApi.get(pageId)
        if (cancelled) return
        setPage(data)
        setBlocks(normalizePageContent(data.content).blocks)
        setTitleDraft(data.title)
        setSlugDraft(data.slug)
        setSettings({ ...defaultPageSettings(), ...(data.settings ?? {}) })
        setDirty(false)
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Failed to load page', 'error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [pageId, showToast])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setFormsLoading(true)
        const list = await formsApi.list()
        if (cancelled) return
        setForms(
          list.map((f) => ({
            id: f.id,
            title: f.title,
            slug: f.slug,
            status: f.status,
          })),
        )
      } catch {
        /* optional */
      } finally {
        if (!cancelled) setFormsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const commit = useCallback((next: PageBlock[], pushHistory = true) => {
    setBlocks((prev) => {
      if (pushHistory) {
        setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), prev])
      }
      return next
    })
    setDirty(true)
  }, [])

  const selected = useMemo(() => {
    if (!selectedId) return null
    return findBlock(blocks, selectedId)?.block ?? null
  }, [blocks, selectedId])

  const selectBlock = (id: string) => {
    setSelectedId(id)
    setRightTab('block')
  }

  const clearSelection = () => {
    setSelectedId(null)
    setRightTab('seo')
  }

  const addBlock = (type: PageBlock['type']) => {
    const block = createBlock(type)
    if (selected && canNestChildren(selected.type)) {
      commit(insertBlock(blocks, block, selected.id))
    } else {
      commit(insertBlock(blocks, block, null))
    }
    setSelectedId(block.id)
    setRightTab('block')
  }

  const handleDropAt = useCallback(
    (parentId: string | null, index: number, payload?: BuilderDragPayload | null) => {
      const active = payload ?? dragActive
      if (!active) return

      if (active.kind === 'palette') {
        const block = createBlock(active.type)
        commit(insertBlock(blocks, block, parentId, index))
        setSelectedId(block.id)
        setRightTab('block')
      } else {
        // Prevent nesting into non-nestable targets is enforced by only offering
        // those parent slots; still guard relocating into invalid places.
        if (parentId) {
          const parent = findBlock(blocks, parentId)?.block
          if (parent && !canNestChildren(parent.type)) return
        }
        commit(relocateBlock(blocks, active.id, parentId, index))
        setSelectedId(active.id)
        setRightTab('block')
      }
      setDragActive(null)
    },
    [blocks, commit, dragActive],
  )

  const handleDropEvent = useCallback(
    (parentId: string | null, index: number, dataTransfer?: DataTransfer) => {
      const fromEvent = dataTransfer ? readDragPayload(dataTransfer) : null
      handleDropAt(parentId, index, fromEvent ?? dragActive)
    },
    [dragActive, handleDropAt],
  )

  const addHero = () => {
    const hero = createBlock('container')
    hero.props = {
      backgroundImage:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
      backgroundOverlay: 'rgba(15, 23, 42, 0.45)',
      minHeight: '420px',
      align: 'center',
    }
    hero.styles = {
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      textAlign: 'center',
    }
    const h = createBlock('heading')
    h.props = { text: 'Welcome to Our Page Builder', level: 1 }
    h.styles = {
      color: '#ffffff',
      fontSize: 42,
      fontWeight: 700,
      margin: { top: 0, right: 0, bottom: 12, left: 0 },
    }
    const p = createBlock('paragraph')
    p.props = { text: 'Design beautiful pages with drag-and-drop simplicity.' }
    p.styles = {
      color: 'rgba(255,255,255,0.88)',
      fontSize: 18,
      margin: { top: 0, right: 0, bottom: 28, left: 0 },
    }
    const b = createBlock('button')
    b.props = { text: 'Get Started', href: '#', variant: 'primary' }
    hero.children = [h, p, b]
    commit(insertBlock(blocks, hero, null))
    setSelectedId(hero.id)
    setRightTab('block')
  }

  const addFeatures = () => {
    const row = createBlock('row')
    row.props = { columns: 3, gap: 24, title: 'Our Features' }
    row.styles = {
      padding: { top: 56, right: 24, bottom: 56, left: 24 },
      background: '#ffffff',
    }
    const cards = [
      { icon: 'gauge', title: 'Fast Performance', description: 'Lightning-fast pages your visitors will love.' },
      { icon: 'mouse-pointer-click', title: 'Easy Drag & Drop', description: 'Build sections visually without code.' },
      { icon: 'monitor-smartphone', title: 'Responsive Design', description: 'Looks great on every screen size.' },
    ].map((c) => {
      const card = createBlock('card')
      card.props = c
      card.id = createId('card')
      return card
    })
    row.children = cards
    commit(insertBlock(blocks, row, null))
    setSelectedId(row.id)
    setRightTab('block')
  }

  const updateSelected = (
    patch: Partial<PageBlock> & {
      props?: Record<string, unknown>
      styles?: PageBlock['styles']
    },
  ) => {
    if (!selectedId) return
    commit(
      updateBlockInTree(blocks, selectedId, (b) => ({
        ...b,
        ...patch,
        props: patch.props ? { ...b.props, ...patch.props } : b.props,
        styles: patch.styles ? { ...b.styles, ...patch.styles } : b.styles,
      })),
    )
  }

  const deleteBlock = useCallback(
    (id: string) => {
      commit(removeBlockFromTree(blocks, id))
      if (selectedId === id) {
        setSelectedId(null)
        setRightTab('seo')
      }
    },
    [blocks, commit, selectedId],
  )

  const deleteSelected = () => {
    if (!selectedId) return
    deleteBlock(selectedId)
  }

  const canvasDnd = useMemo(
    () => ({
      dragActive,
      onDragStartBlock: (id: string) => setDragActive({ kind: 'block', id }),
      onDragEnd: () => setDragActive(null),
      onDropAt: handleDropEvent,
      onMove: (id: string, dir: 'up' | 'down') => commit(moveBlock(blocks, id, dir)),
      onDuplicate: (id: string) => {
        commit(duplicateBlock(blocks, id))
        setRightTab('block')
      },
      onDelete: deleteBlock,
    }),
    [blocks, commit, deleteBlock, dragActive, handleDropEvent],
  )

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h
      const prev = h[h.length - 1]
      setBlocks(prev)
      setDirty(true)
      return h.slice(0, -1)
    })
  }, [])

  const clearCanvas = async () => {
    const ok = await swalConfirm({
      title: 'Clear entire canvas?',
      text: 'All blocks will be removed. You can undo once after clearing.',
      confirmText: 'Clear canvas',
      cancelText: 'Cancel',
      danger: true,
      icon: 'warning',
    })
    if (!ok) return
    commit([])
    setSelectedId(null)
    setRightTab('seo')
  }

  const buildPayload = () => {
    const content: PageContent = { version: 1, blocks }
    return {
      title: titleDraft.trim() || page!.title,
      slug: slugDraft.trim() || page!.slug,
      content,
      settings,
    }
  }

  const saveDraft = async () => {
    if (!page) return
    try {
      setSaving(true)
      const updated = await pagesApi.update(page.id, {
        ...buildPayload(),
        status: 'draft',
      })
      setPage(updated)
      setSlugDraft(updated.slug)
      setTitleDraft(updated.title)
      setSettings({ ...defaultPageSettings(), ...(updated.settings ?? {}) })
      setDirty(false)
      showToast('Draft saved')
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    if (!page) return
    try {
      setPublishing(true)
      await pagesApi.update(page.id, buildPayload())
      const updated = await pagesApi.publish(page.id)
      setPage(updated)
      setSlugDraft(updated.slug)
      setTitleDraft(updated.title)
      setSettings({ ...defaultPageSettings(), ...(updated.settings ?? {}) })
      setDirty(false)
      showToast('Page published')
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Publish failed', 'error')
    } finally {
      setPublishing(false)
    }
  }

  // Auto-scroll canvas while dragging near edges
  useEffect(() => {
    if (!dragActive) return
    const scroller =
      (document.querySelector('.builder-canvas-scroll') as HTMLElement | null) ??
      null
    return startDragAutoScroll(scroller)
  }, [dragActive])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const typing =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void saveDraft()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !typing) {
        e.preventDefault()
        undo()
        return
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !typing && selectedId) {
        e.preventDefault()
        deleteBlock(selectedId)
        return
      }
      if (e.key === 'Escape') {
        if (dragActive) {
          setDragActive(null)
          return
        }
        if (previewOpen) {
          setPreviewOpen(false)
          return
        }
        clearSelection()
      }
      // Alt+↑/↓ move selected block among siblings
      if (!typing && selectedId && e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault()
        commit(moveBlock(blocks, selectedId, e.key === 'ArrowUp' ? 'up' : 'down'))
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p' && !typing) {
        e.preventDefault()
        setPreviewOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, blocks, titleDraft, slugDraft, settings, page, previewOpen, dragActive])

  if (loading) {
    return (
      <BuilderShell>
        <div className="builder-loading flex flex-1 flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--a-primary)_30%,transparent)] border-t-[var(--a-primary)]" />
          <p className="text-sm text-[var(--b-muted)]">Opening page builder…</p>
        </div>
      </BuilderShell>
    )
  }

  if (!page) {
    return (
      <BuilderShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-sm text-[var(--b-muted)]">Page not found</p>
          <Link href="/admin/page-builder" className="text-sm text-[var(--a-primary-soft-text)] hover:underline">
            Back to pages
          </Link>
        </div>
      </BuilderShell>
    )
  }

  return (
    <BuilderShell>
      <BuilderTopBar
        backHref="/admin/page-builder"
        brand={
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="builder-brand-mark flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-white">
              PB
            </div>
            <div className="min-w-0">
              {titleEdit ? (
                <input
                  autoFocus
                  className="builder-input h-8 max-w-[200px] text-sm font-semibold"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={() => setTitleEdit(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setTitleEdit(false)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setTitleEdit(true)}
                  className="flex min-w-0 items-center gap-1 text-sm font-semibold text-[var(--b-text)]"
                >
                  <span className="max-w-[160px] truncate sm:max-w-[220px]">
                    {titleDraft || page.title}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--b-muted)]" />
                </button>
              )}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null)
                    setRightTab('seo')
                  }}
                  className="truncate font-mono text-[10px] text-[var(--b-muted)] transition hover:text-[var(--a-primary-soft-text)]"
                >
                  /p/{slugDraft || page.slug}
                </button>
                {dirty && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                    Unsaved
                  </span>
                )}
              </div>
            </div>
            <span
              className={cn(
                'hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:inline',
                page.status === 'published'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-amber-500/15 text-amber-300',
              )}
            >
              {page.status}
            </span>
          </div>
        }
        center={
          page.status === 'published' ? (
            <Link
              href={`/p/${slugDraft || page.slug}`}
              target="_blank"
              className="flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-[var(--b-muted)] transition hover:bg-[var(--a-surface-2)] hover:text-[var(--a-primary-soft-text)]"
            >
              <ExternalLink className="h-3 w-3" />
              Live
            </Link>
          ) : undefined
        }
        device={device}
        onDeviceChange={setDevice}
        locale={locale}
        onLocaleChange={setLocale}
        onHistory={undo}
        onClear={clearCanvas}
        onPreview={() => setPreviewOpen(true)}
        previewActive={previewOpen}
        onSaveDraft={saveDraft}
        onPublish={publish}
        saving={saving}
        publishing={publishing}
        publishLabel="Publish Page"
      />

      <div className="flex min-h-0 flex-1">
        {/* Left: components + layers */}
        <BuilderPanel
          title={leftTab === 'components' ? 'Components' : 'Layers'}
          className="builder-panel-left w-[288px] border-r"
          headerExtra={
            <div className="flex gap-0.5 rounded-md bg-[var(--a-surface-2)] p-0.5">
              <LeftTabBtn
                active={leftTab === 'components'}
                onClick={() => setLeftTab('components')}
                icon={LayoutGrid}
                label="Add"
              />
              <LeftTabBtn
                active={leftTab === 'layers'}
                onClick={() => setLeftTab('layers')}
                icon={Layers}
                label="Tree"
              />
            </div>
          }
        >
          {leftTab === 'components' ? (
            <PagePalette
              onAdd={addBlock}
              onDragStartPalette={(type) =>
                setDragActive({ kind: 'palette', type })
              }
              onDragEndPalette={() => setDragActive(null)}
            />
          ) : (
            <PageLayers
              blocks={blocks}
              selectedId={selectedId}
              onSelect={selectBlock}
              onDuplicate={(id) => {
                commit(duplicateBlock(blocks, id))
                setRightTab('block')
              }}
              onDelete={deleteBlock}
              onMove={(id, dir) => commit(moveBlock(blocks, id, dir))}
              dragActive={dragActive}
              onDragStartBlock={(id) => setDragActive({ kind: 'block', id })}
              onDragEnd={() => setDragActive(null)}
              onDropAt={handleDropEvent}
            />
          )}
        </BuilderPanel>

        {/* Canvas */}
        <BuilderCanvasFrame
          title="Viewport"
          device={device}
          subtitle={
            selected
              ? `Selected · ${blockTypeLabel(selected.type)}`
              : `${blocks.length} top-level block${blocks.length === 1 ? '' : 's'}`
          }
          toolbar={
            <div className="flex items-center gap-1">
              <ActionBtn title="Keyboard shortcuts" onClick={() => setShowShortcuts((v) => !v)}>
                <Keyboard className="h-3.5 w-3.5" />
              </ActionBtn>
              {selectedId && (
                <>
                  <div className="mx-1 h-4 w-px bg-white/10" />
                  <ActionBtn
                    title="Move up"
                    onClick={() => commit(moveBlock(blocks, selectedId, 'up'))}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </ActionBtn>
                  <ActionBtn
                    title="Move down"
                    onClick={() => commit(moveBlock(blocks, selectedId, 'down'))}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </ActionBtn>
                  <ActionBtn
                    title="Duplicate"
                    onClick={() => commit(duplicateBlock(blocks, selectedId))}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </ActionBtn>
                  <ActionBtn title="Delete" danger onClick={deleteSelected}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </ActionBtn>
                </>
              )}
              {dragActive && (
                <span className="ml-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--a-primary-soft-text)]">
                  {dragActive.kind === 'palette' ? 'Drop to place' : 'Drop to move'}
                </span>
              )}
            </div>
          }
        >
          <PageDocument
            blocks={blocks}
            selectedId={selectedId}
            onSelect={selectBlock}
            editable
            onCanvasClick={clearSelection}
            showHeader={pageShowsHeader(settings)}
            showFooter={pageShowsFooter(settings)}
            locale={locale}
            dnd={canvasDnd}
            emptyState={
              <CanvasEmpty
                onAdd={addBlock}
                onAddHero={addHero}
                onAddFeatures={addFeatures}
                dragActive={!!dragActive}
                onDropAtRoot={() => handleDropEvent(null, 0)}
              />
            }
          />
        </BuilderCanvasFrame>

        {/* Right: block / SEO */}
        <BuilderPanel
          title={
            rightTab === 'seo'
              ? 'SEO & URL'
              : selected
                ? blockTypeLabel(selected.type)
                : 'Properties'
          }
          className="w-[280px] border-l"
        >
          <div className="mb-2 flex gap-0.5 rounded-lg bg-[var(--a-surface-2)] p-0.5">
            <RightTabBtn
              active={rightTab === 'block'}
              onClick={() => setRightTab('block')}
              icon={Pencil}
              label="Block"
            />
            <RightTabBtn
              active={rightTab === 'seo'}
              onClick={() => setRightTab('seo')}
              icon={Search}
              label="SEO"
            />
          </div>

          {rightTab === 'seo' ? (
            <PageSettingsPanel
              title={titleDraft}
              slug={slugDraft}
              settings={settings}
              status={page.status}
              locale={locale}
              onTitleChange={(v) => {
                setTitleDraft(v)
                setDirty(true)
              }}
              onSlugChange={(v) => {
                setSlugDraft(v)
                setDirty(true)
              }}
              onSettingsChange={(v) => {
                setSettings(v)
                setDirty(true)
              }}
            />
          ) : selected ? (
            <>
              <div className="builder-selected-banner mb-2 flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[var(--a-primary-soft-text)]">
                <GripVertical className="h-3 w-3 opacity-70" />
                <span className="min-w-0 flex-1 truncate">
                  {blockTypeLabel(selected.type)}
                </span>
                <button
                  type="button"
                  className="rounded p-0.5 hover:bg-[var(--a-primary-soft)]"
                  onClick={deleteSelected}
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <PagePropertiesPanel
                block={selected}
                onChange={updateSelected}
                forms={forms}
                formsLoading={formsLoading}
                locale={locale}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-1 py-8 text-center">
              <div className="builder-empty-icon flex h-10 w-10 items-center justify-center rounded-xl text-base">
                ✦
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--b-text)]">Nothing selected</p>
                <p className="mt-0.5 text-[10px] leading-snug text-[var(--b-muted)]">
                  Click a block to edit properties.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLeftTab('layers')}
                  className="rounded-md bg-[var(--a-surface-2)] px-2 py-1 text-[10px] font-semibold text-[var(--b-text)] hover:bg-[var(--a-primary-soft)]"
                >
                  Layers
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('seo')}
                  className="rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text)]"
                >
                  SEO
                </button>
              </div>
            </div>
          )}
        </BuilderPanel>
      </div>

      {showShortcuts && (
        <div className="builder-shortcuts pointer-events-none fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#121820]/95 px-5 py-4 text-xs text-[var(--b-text)] shadow-2xl backdrop-blur">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
            Shortcuts
          </p>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Kbd>Ctrl</Kbd>+<Kbd>S</Kbd> Save draft
            </li>
            <li>
              <Kbd>Ctrl</Kbd>+<Kbd>Z</Kbd> Undo
            </li>
            <li>
              <Kbd>Del</Kbd> Delete selected
            </li>
            <li>
              <Kbd>Esc</Kbd> Clear selection / exit preview
            </li>
            <li>
              <Kbd>Ctrl</Kbd>+<Kbd>P</Kbd> Preview page
            </li>
            <li>
              <Kbd>Alt</Kbd>+<Kbd>↑</Kbd>/<Kbd>↓</Kbd> Move selected block
            </li>
            <li className="pt-1 text-[var(--b-muted)]">
              Drag from Components · hover block edges to place before/after · center of
              container/row to nest
            </li>
          </ul>
        </div>
      )}

      <PagePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={titleDraft || page.title}
        slug={slugDraft || page.slug}
        status={page.status}
        blocks={blocks}
        device={device}
        onDeviceChange={setDevice}
        locale={locale}
        onLocaleChange={setLocale}
        dirty={dirty}
        showHeader={pageShowsHeader(settings)}
        showFooter={pageShowsFooter(settings)}
        onSaveDraft={saveDraft}
        onPublish={async () => {
          await publish()
          setPreviewOpen(false)
        }}
        saving={saving}
        publishing={publishing}
        liveHref={
          page.status === 'published' ? `/p/${slugDraft || page.slug}` : null
        }
      />

      <DndHud drag={dragActive} />
      <StatusToast message={toast?.message ?? null} tone={toast?.tone} />
    </BuilderShell>
  )
}

function LeftTabBtn({
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
        'flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition',
        active
          ? 'bg-[var(--a-primary)] text-white shadow-sm'
          : 'text-[var(--b-muted)] hover:text-[var(--b-text)]',
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  )
}

function RightTabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Pencil
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-[10px] font-semibold transition',
        active
          ? 'bg-gradient-to-r from-[var(--a-primary)] to-[var(--a-accent)] text-white shadow-sm'
          : 'text-[var(--b-muted)] hover:bg-[var(--a-primary-soft)] hover:text-[var(--a-primary-soft-text)]',
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  )
}

function ActionBtn({
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
        'flex h-7 w-7 items-center justify-center rounded-md transition',
        danger
          ? 'text-[var(--b-muted)] hover:bg-red-500/15 hover:text-red-300'
          : 'text-[var(--b-muted)] hover:bg-[var(--a-primary-soft)] hover:text-[var(--a-primary-soft-text)]',
      )}
    >
      {children}
    </button>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex min-w-[1.4rem] items-center justify-center rounded border border-white/10 bg-[var(--a-surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--b-text)]">
      {children}
    </span>
  )
}
