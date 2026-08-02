'use client'

import { useState } from 'react'
import {
  BadgeDollarSign,
  CircleHelp,
  LayoutTemplate,
  ListOrdered,
  Megaphone,
  Sparkles,
} from 'lucide-react'
import { isBuilderDrag } from '@/lib/builder/dnd'
import type { PageBlockType } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

type Props = {
  onAdd: (type: PageBlockType) => void
  onAddHero: () => void
  onAddFeatures: () => void
  dragActive?: boolean
  onDropAtRoot?: () => void
}

export function CanvasEmpty({
  onAdd,
  onAddHero,
  onAddFeatures,
  dragActive,
  onDropAtRoot,
}: Props) {
  const [over, setOver] = useState(false)

  return (
    <div
      className={cn(
        'builder-empty flex min-h-[380px] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,#e0e7ff_0%,#f8fafc_45%,#f1f5f9_100%)] px-4 py-8 text-center transition',
        dragActive && 'ring-2 ring-inset ring-[var(--a-primary)]/40',
        over && 'bg-[color-mix(in_srgb,var(--a-primary)_8%,#f8fafc)]',
      )}
      onDragEnter={(e) => {
        if (!dragActive || !isBuilderDrag(e.dataTransfer)) return
        e.preventDefault()
        setOver(true)
      }}
      onDragOver={(e) => {
        if (!dragActive || !isBuilderDrag(e.dataTransfer)) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!onDropAtRoot) return
        e.preventDefault()
        e.stopPropagation()
        setOver(false)
        onDropAtRoot()
      }}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--a-primary)] to-[var(--a-accent)] text-white shadow-lg shadow-[color-mix(in_srgb,var(--a-primary)_30%,transparent)]">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold tracking-tight text-slate-800">
        {over ? 'Release to add component' : 'Start building your page'}
      </h3>
      <p className="mt-1 max-w-xs text-[11px] leading-snug text-slate-500">
        {dragActive
          ? 'Release to place the component.'
          : 'Drop a section or pick a block from the left panel.'}
      </p>
      {dragActive && (
        <div className="mt-2 rounded-full bg-[var(--a-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
          Drop to add
        </div>
      )}

      <div className="mt-4 grid w-full max-w-md gap-1.5 sm:grid-cols-3">
        <Quick icon={LayoutTemplate} label="Hero" onClick={() => onAdd('hero')} />
        <Quick icon={ListOrdered} label="Steps" onClick={() => onAdd('steps')} />
        <Quick icon={BadgeDollarSign} label="Pricing" onClick={() => onAdd('pricing')} />
        <Quick icon={CircleHelp} label="FAQ" onClick={() => onAdd('faq')} />
        <Quick icon={Megaphone} label="CTA band" onClick={() => onAdd('cta')} />
        <Quick icon={Sparkles} label="Features row" onClick={onAddFeatures} />
      </div>

      <button
        type="button"
        onClick={onAddHero}
        className="mt-2 text-[10px] font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
      >
        Classic nested hero
      </button>

      <p className="mt-3 text-[10px] text-slate-400">
        Tip: use the <span className="font-semibold">Sections</span> category for ready layouts
      </p>
    </div>
  )
}

function Quick({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Sparkles
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-lg border border-slate-200/80 bg-white/90 px-2 py-2.5 text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--a-primary)] hover:shadow-md"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--a-primary-soft)] text-[var(--a-primary)]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  )
}
