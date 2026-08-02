'use client'

import { GripVertical, Plus } from 'lucide-react'
import type { BuilderDragPayload } from '@/lib/builder/dnd'
import { blockTypeLabel } from '@/lib/builder/palette'
import { cn } from '@/lib/utils'

type Props = {
  drag: BuilderDragPayload | null
  className?: string
}

/** Floating status chip while a builder drag is active. */
export function DndHud({ drag, className }: Props) {
  if (!drag) return null

  const isPalette = drag.kind === 'palette'
  const label = isPalette
    ? blockTypeLabel(drag.type)
    : 'Moving block'
  const hint = isPalette
    ? 'Drop on canvas · nest into section · or between blocks'
    : 'Drop before / after a block · or into a container / row'

  return (
    <div
      className={cn(
        'builder-dnd-hud pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0f141c]/95 px-4 py-2.5 text-white shadow-2xl shadow-black/40 backdrop-blur-md">
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-xl',
            isPalette
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-sky-500/20 text-sky-300',
          )}
        >
          {isPalette ? (
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <GripVertical className="h-4 w-4" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-tight">
            {isPalette ? `Adding · ${label}` : label}
          </p>
          <p className="mt-0.5 text-[10px] text-white/55">{hint}</p>
        </div>
        <kbd className="ml-1 hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/50 sm:inline">
          Esc cancel
        </kbd>
      </div>
    </div>
  )
}
