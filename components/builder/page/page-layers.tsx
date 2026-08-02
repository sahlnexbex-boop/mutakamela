'use client'

import {
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  GripVertical,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import {
  canNestChildren,
  createDragGhost,
  isBuilderDrag,
  setDragGhostImage,
  writeDragPayload,
  type BuilderDragPayload,
} from '@/lib/builder/dnd'
import { getLocalized } from '@/lib/builder/i18n'
import { blockTypeLabel, pagePalette } from '@/lib/builder/palette'
import type { PageBlock } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  blocks: PageBlock[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  /** @deprecated Reorder via drag-and-drop; kept optional for callers */
  onMove?: (id: string, direction: 'up' | 'down') => void
  dragActive: BuilderDragPayload | null
  onDragStartBlock: (id: string) => void
  onDragEnd: () => void
  onDropAt: (parentId: string | null, index: number, dt?: DataTransfer) => void
}

export function PageLayers({
  blocks,
  selectedId,
  onSelect,
  onDuplicate,
  onDelete,
  dragActive,
  onDragStartBlock,
  onDragEnd,
  onDropAt,
}: Props) {
  if (blocks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--b-border)] px-2 py-5 text-center">
        <p className="text-[11px] font-medium text-[var(--b-muted)]">No layers yet</p>
        <p className="mt-0.5 text-[10px] leading-snug text-[var(--b-muted)]/80">
          Add a component from the palette.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      <p className="mb-1 px-0.5 text-[9px] leading-snug text-[var(--b-muted)]">
        Drag to reorder · drop into container/row to nest
      </p>
      <LayerDropLine
        active={!!dragActive}
        parentId={null}
        index={0}
        onDropAt={onDropAt}
      />
      {blocks.map((block, index) => (
        <LayerNode
          key={block.id}
          block={block}
          depth={0}
          index={index}
          parentId={null}
          selectedId={selectedId}
          onSelect={onSelect}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          dragActive={dragActive}
          onDragStartBlock={onDragStartBlock}
          onDragEnd={onDragEnd}
          onDropAt={onDropAt}
        />
      ))}
    </div>
  )
}

function LayerNode({
  block,
  depth,
  index,
  parentId,
  selectedId,
  onSelect,
  onDuplicate,
  onDelete,
  dragActive,
  onDragStartBlock,
  onDragEnd,
  onDropAt,
}: {
  block: PageBlock
  depth: number
  index: number
  parentId: string | null
  selectedId: string | null
  onSelect: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  dragActive: BuilderDragPayload | null
  onDragStartBlock: (id: string) => void
  onDragEnd: () => void
  onDropAt: (parentId: string | null, index: number, dt?: DataTransfer) => void
}) {
  const hasChildren = !!block.children?.length
  const [open, setOpen] = useState(true)
  const selected = selectedId === block.id
  const meta = pagePalette.find((p) => p.type === block.type)
  const Icon = meta?.icon
  const accent = meta?.accent ?? '#64748b'
  const preview = previewText(block)
  const draggingSelf = dragActive?.kind === 'block' && dragActive.id === block.id
  const nestable = canNestChildren(block.type)
  const [nestOver, setNestOver] = useState(false)

  const typeLabel = blockTypeLabel(block.type)
  const fullTitle = preview ? `${typeLabel} — ${preview}` : typeLabel

  return (
    <div className={cn(draggingSelf && 'opacity-40')}>
      <div
        className={cn(
          'group flex items-center gap-0.5 rounded-md py-0.5 pr-0.5 transition',
          selected
            ? 'bg-[var(--a-primary-soft)] ring-1 ring-[color-mix(in_srgb,var(--a-primary)_35%,transparent)]'
            : 'hover:bg-[var(--a-surface-2)]',
          nestOver && nestable && 'ring-2 ring-[var(--a-primary)]',
        )}
        style={{ paddingLeft: 2 + depth * 10 }}
        title={fullTitle}
        onDragOver={(e) => {
          if (!dragActive || !nestable || draggingSelf) return
          if (!isBuilderDrag(e.dataTransfer)) return
          e.preventDefault()
          e.stopPropagation()
          e.dataTransfer.dropEffect =
            dragActive.kind === 'palette' ? 'copy' : 'move'
          setNestOver(true)
        }}
        onDragLeave={() => setNestOver(false)}
        onDrop={(e) => {
          if (!nestable || draggingSelf) return
          e.preventDefault()
          e.stopPropagation()
          setNestOver(false)
          // Nest as last child
          onDropAt(block.id, block.children?.length ?? 0, e.dataTransfer)
        }}
      >
        <button
          type="button"
          draggable
          title="Drag to reorder"
          onDragStart={(e) => {
            e.stopPropagation()
            writeDragPayload(e.dataTransfer, { kind: 'block', id: block.id })
            const ghost = createDragGhost({
              label: typeLabel,
              subtitle: 'Reorder in layers',
              accent: accent,
            })
            setDragGhostImage(e.dataTransfer, ghost, 16, 14)
            onDragStartBlock(block.id)
            onSelect(block.id)
          }}
          onDragEnd={() => onDragEnd()}
          className="flex h-5 w-4 shrink-0 cursor-grab items-center justify-center rounded text-[var(--b-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--b-text)] active:cursor-grabbing"
        >
          <GripVertical className="h-3 w-3" />
        </button>

        <button
          type="button"
          className={cn(
            'flex h-5 w-4 shrink-0 items-center justify-center rounded text-[var(--b-muted)]',
            !hasChildren && !nestable && 'invisible',
          )}
          onClick={() => setOpen((v) => !v)}
          tabIndex={hasChildren || nestable ? 0 : -1}
          title={open ? 'Collapse' : 'Expand'}
        >
          {open ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect(block.id)}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md py-0.5 text-left"
          title={fullTitle}
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
            style={{
              background: `${accent}22`,
              color: accent,
            }}
          >
            {Icon ? <Icon className="h-3 w-3" strokeWidth={2} /> : <Eye className="h-3 w-3" />}
          </span>
          <span className="min-w-0 flex-1 overflow-hidden">
            <span
              className={cn(
                'block truncate text-[11px] font-semibold leading-tight',
                selected ? 'text-[var(--a-primary-soft-text)]' : 'text-[var(--b-text)]',
              )}
            >
              {typeLabel}
            </span>
            {preview ? (
              <span className="block truncate text-[9px] leading-tight text-[var(--b-muted)]">
                {preview}
              </span>
            ) : null}
          </span>
        </button>

        {/* Hover-only actions so labels keep readable width */}
        <div className="flex w-0 shrink-0 items-center justify-end gap-px overflow-hidden opacity-0 transition-all group-hover:w-[52px] group-hover:opacity-100 group-focus-within:w-[52px] group-focus-within:opacity-100">
          <IconBtn title="Duplicate" onClick={() => onDuplicate(block.id)}>
            <Copy className="h-3 w-3" />
          </IconBtn>
          <IconBtn title="Delete" danger onClick={() => onDelete(block.id)}>
            <Trash2 className="h-3 w-3" />
          </IconBtn>
        </div>
      </div>

      {(hasChildren || nestable) && open && (
        <div>
          <LayerDropLine
            active={!!dragActive && !draggingSelf}
            parentId={block.id}
            index={0}
            onDropAt={onDropAt}
          />
          {(block.children ?? []).map((child, i) => (
            <LayerNode
              key={child.id}
              block={child}
              depth={depth + 1}
              index={i}
              parentId={block.id}
              selectedId={selectedId}
              onSelect={onSelect}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              dragActive={dragActive}
              onDragStartBlock={onDragStartBlock}
              onDragEnd={onDragEnd}
              onDropAt={onDropAt}
            />
          ))}
        </div>
      )}

      <LayerDropLine
        active={!!dragActive && !draggingSelf}
        parentId={parentId}
        index={index + 1}
        onDropAt={onDropAt}
      />
    </div>
  )
}

function LayerDropLine({
  active,
  parentId,
  index,
  onDropAt,
}: {
  active: boolean
  parentId: string | null
  index: number
  onDropAt: (parentId: string | null, index: number, dt?: DataTransfer) => void
}) {
  const [over, setOver] = useState(false)
  if (!active) return null

  return (
    <div
      role="presentation"
      onDragEnter={(e) => {
        if (!isBuilderDrag(e.dataTransfer)) return
        e.preventDefault()
        e.stopPropagation()
        setOver(true)
      }}
      onDragOver={(e) => {
        if (!isBuilderDrag(e.dataTransfer)) return
        e.preventDefault()
        e.stopPropagation()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setOver(false)
        onDropAt(parentId, index, e.dataTransfer)
      }}
      className={cn(
        'mx-1 rounded transition-all',
        over ? 'my-0.5 h-5 bg-[var(--a-primary-soft)] ring-1 ring-[var(--a-primary)]' : 'h-1.5',
      )}
    />
  )
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold transition disabled:opacity-25',
        danger
          ? 'text-[var(--b-muted)] hover:bg-red-500/15 hover:text-red-300'
          : 'text-[var(--b-muted)] hover:bg-[var(--a-primary-soft)] hover:text-[var(--b-text)]',
      )}
    >
      {children}
    </button>
  )
}

function previewText(block: PageBlock): string {
  const p = block.props
  const text = getLocalized(p.text, 'en', '').trim()
  if (text) return text.slice(0, 40)

  const title = getLocalized(p.title, 'en', '').trim()
  if (title) return title.slice(0, 40)

  const formTitle = getLocalized(p.formTitle, 'en', '').trim()
  if (formTitle) return formTitle.slice(0, 40)

  const quote = getLocalized(p.quote, 'en', '').trim()
  if (quote) return quote.slice(0, 40)

  if (block.type === 'row') return `${p.columns ?? 2} columns`
  if (block.type === 'button') {
    const btn = getLocalized(p.text, 'en', 'Button').trim()
    return btn.slice(0, 40)
  }
  if (block.type === 'form' && p.formSlug) return String(p.formSlug)
  if (block.type === 'image') {
    const alt = getLocalized(p.alt, 'en', '').trim()
    return alt || 'Image'
  }
  if (block.type === 'spacer') return `${p.height ?? 40}px`
  return ''
}
