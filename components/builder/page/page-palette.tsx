'use client'

import { useMemo, useRef, useState } from 'react'
import { GripVertical, Search } from 'lucide-react'
import {
  createDragGhost,
  setDragGhostImage,
  writeDragPayload,
  type BuilderDragPayload,
} from '@/lib/builder/dnd'
import {
  pagePalette,
  pagePaletteCategories,
  type PaletteItem,
} from '@/lib/builder/palette'
import type { PageBlockType } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  onAdd: (type: PageBlockType) => void
  onDragStartPalette?: (type: PageBlockType) => void
  onDragEndPalette?: () => void
}

export function PagePalette({
  onAdd,
  onDragStartPalette,
  onDragEndPalette,
}: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | PaletteItem<PageBlockType>['category']>('all')
  const [draggingType, setDraggingType] = useState<PageBlockType | null>(null)
  const didDragRef = useRef(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pagePalette.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return (
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.type.includes(q)
      )
    })
  }, [query, category])

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--b-muted)]" />
        <input
          className="builder-input h-8 pl-8 text-xs"
          placeholder="Search components…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        <Chip active={category === 'all'} onClick={() => setCategory('all')}>
          All
        </Chip>
        {pagePaletteCategories.map((c) => (
          <Chip
            key={c.id}
            active={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5">
        {(category === 'all' ? pagePaletteCategories : pagePaletteCategories.filter((c) => c.id === category)).map(
          (cat) => {
            const items = filtered.filter((i) => i.category === cat.id)
            if (!items.length) return null
            return (
              <div key={cat.id}>
                <p className="mb-1.5 px-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--b-muted)]">
                  {cat.label}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {items.map((item) => {
                    const Icon = item.icon
                    const dragging = draggingType === item.type
                    return (
                      <button
                        key={item.type}
                        type="button"
                        draggable
                        title={item.description ? `${item.label} — ${item.description}` : item.label}
                        onClick={() => {
                          if (didDragRef.current) {
                            didDragRef.current = false
                            return
                          }
                          onAdd(item.type)
                        }}
                        onDragStart={(e) => {
                          didDragRef.current = true
                          const payload: BuilderDragPayload = {
                            kind: 'palette',
                            type: item.type,
                          }
                          writeDragPayload(e.dataTransfer, payload)
                          const ghost = createDragGhost({
                            label: item.label,
                            subtitle: 'Drop on canvas',
                            accent: item.accent ?? '#6366f1',
                          })
                          setDragGhostImage(e.dataTransfer, ghost, 18, 16)
                          setDraggingType(item.type)
                          onDragStartPalette?.(item.type)
                        }}
                        onDragEnd={() => {
                          setDraggingType(null)
                          onDragEndPalette?.()
                          window.setTimeout(() => {
                            didDragRef.current = false
                          }, 50)
                        }}
                        className={cn(
                          'builder-palette-item group relative flex cursor-grab items-center gap-2 overflow-hidden rounded-lg border border-[var(--b-border)] px-2 py-2 text-left transition active:cursor-grabbing',
                          dragging &&
                            'builder-palette-item-dragging scale-[0.97] opacity-55 ring-1 ring-[var(--a-primary)]',
                        )}
                      >
                        <span
                          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                          style={{
                            background: `linear-gradient(145deg, ${item.accent}33, ${item.accent}14)`,
                            color: item.accent,
                          }}
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                        <span className="relative min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-semibold leading-tight text-[var(--b-text)]">
                            {item.label}
                          </span>
                        </span>
                        <GripVertical className="h-3.5 w-3.5 shrink-0 text-[var(--b-muted)] opacity-40 group-hover:opacity-90" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          },
        )}

        {filtered.length === 0 && (
          <p className="py-6 text-center text-xs text-[var(--b-muted)]">
            No match for “{query}”
          </p>
        )}
      </div>
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-2 py-0.5 text-[10px] font-semibold transition',
        active ? 'builder-chip-active' : 'builder-chip-idle',
      )}
    >
      {children}
    </button>
  )
}
