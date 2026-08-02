'use client'

import { useState, type DragEvent } from 'react'
import { isBuilderDrag } from '@/lib/builder/dnd'
import { cn } from '@/lib/utils'

type Props = {
  /** When false, slot collapses and ignores pointer events */
  active: boolean
  parentId: string | null
  index: number
  onDropAt: (parentId: string | null, index: number, dt?: DataTransfer) => void
  /** line = between siblings; zone = empty nestable; rail = vertical gap in rows */
  variant?: 'line' | 'zone' | 'rail'
  label?: string
  className?: string
  /** Always show a faint guide while dragging (easier targeting) */
  showGuide?: boolean
}

/**
 * Drop target between blocks (line), empty nestable areas (zone),
 * or between row columns (rail).
 */
export function DropSlot({
  active,
  parentId,
  index,
  onDropAt,
  variant = 'line',
  label,
  className,
  showGuide = true,
}: Props) {
  const [over, setOver] = useState(false)

  if (!active) {
    return variant === 'zone' || variant === 'rail' ? null : (
      <div className="pointer-events-none h-0" aria-hidden />
    )
  }

  const accept = (e: DragEvent) => {
    if (!isBuilderDrag(e.dataTransfer)) return false
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect =
      e.dataTransfer.effectAllowed === 'copy' ? 'copy' : 'move'
    return true
  }

  return (
    <div
      role="presentation"
      data-drop-slot
      data-drop-parent={parentId ?? 'root'}
      data-drop-index={index}
      onDragEnter={(e) => {
        if (!accept(e)) return
        setOver(true)
      }}
      onDragOver={(e) => {
        if (!accept(e)) return
        setOver(true)
      }}
      onDragLeave={(e) => {
        e.stopPropagation()
        // Only clear when leaving the slot itself
        const related = e.relatedTarget as Node | null
        if (related && e.currentTarget.contains(related)) return
        setOver(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setOver(false)
        onDropAt(parentId, index, e.dataTransfer)
      }}
      className={cn(
        'builder-drop-slot relative z-20 transition-all duration-150 ease-out',
        variant === 'line' && 'mx-2',
        variant === 'line' && (over ? 'my-1.5 h-10' : showGuide ? 'my-1 h-4' : 'my-0.5 h-2.5'),
        variant === 'zone' && 'min-h-[72px] rounded-xl border-2 border-dashed',
        variant === 'rail' && 'min-h-[48px] w-3 shrink-0 self-stretch rounded-full',
        over && 'builder-drop-slot-active',
        !over && variant === 'zone' && 'border-slate-300/90 bg-slate-50/90',
        !over && variant === 'line' && showGuide && 'builder-drop-slot-idle',
        !over && variant === 'rail' && 'builder-drop-slot-rail-idle',
        className,
      )}
    >
      {/* Visible guide line while dragging */}
      {variant === 'line' && (
        <div
          className={cn(
            'pointer-events-none absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 rounded-full transition-all',
            over
              ? 'inset-x-2 h-1 bg-[var(--a-primary)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--a-primary)_28%,transparent)]'
              : 'bg-[color-mix(in_srgb,var(--a-primary)_35%,transparent)]',
          )}
        />
      )}

      {variant === 'rail' && (
        <div
          className={cn(
            'pointer-events-none absolute inset-y-2 left-1/2 w-0.5 -translate-x-1/2 rounded-full transition-all',
            over
              ? 'w-1 bg-[var(--a-primary)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--a-primary)_28%,transparent)]'
              : 'bg-[color-mix(in_srgb,var(--a-primary)_35%,transparent)]',
          )}
        />
      )}

      {(over || variant === 'zone') && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm',
              over
                ? 'bg-[var(--a-primary)] text-white'
                : 'bg-white/90 text-slate-400 ring-1 ring-slate-200',
            )}
          >
            {over
              ? (label ?? 'Drop here')
              : (label ?? 'Drop components here')}
          </span>
        </div>
      )}
    </div>
  )
}
