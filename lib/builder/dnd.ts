import type { PageBlockType } from './types'

export const BUILDER_DND_MIME = 'application/x-builder-dnd'

export type BuilderDragPayload =
  | { kind: 'palette'; type: PageBlockType }
  | { kind: 'block'; id: string }

/** Where a drop lands relative to a hovered block */
export type DropIntent =
  | { mode: 'before'; parentId: string | null; index: number }
  | { mode: 'after'; parentId: string | null; index: number }
  | { mode: 'into'; parentId: string; index: number }

/** Block types that can hold nested children */
export const NESTABLE_BLOCK_TYPES: ReadonlySet<PageBlockType> = new Set([
  'container',
  'row',
])

export function canNestChildren(type: PageBlockType): boolean {
  return NESTABLE_BLOCK_TYPES.has(type)
}

export function writeDragPayload(
  dataTransfer: DataTransfer,
  payload: BuilderDragPayload,
): void {
  const raw = JSON.stringify(payload)
  dataTransfer.setData(BUILDER_DND_MIME, raw)
  dataTransfer.setData('text/plain', raw)
  dataTransfer.effectAllowed = payload.kind === 'palette' ? 'copy' : 'move'
}

export function readDragPayload(dataTransfer: DataTransfer): BuilderDragPayload | null {
  const raw =
    dataTransfer.getData(BUILDER_DND_MIME) || dataTransfer.getData('text/plain')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as BuilderDragPayload
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.kind === 'palette' && typeof parsed.type === 'string') return parsed
    if (parsed.kind === 'block' && typeof parsed.id === 'string') return parsed
    return null
  } catch {
    return null
  }
}

export function isBuilderDrag(dataTransfer: DataTransfer): boolean {
  if (dataTransfer.types.includes(BUILDER_DND_MIME)) return true
  return dataTransfer.types.includes('text/plain') || dataTransfer.types.includes('Text')
}

export function intentToDrop(
  intent: DropIntent,
): { parentId: string | null; index: number } {
  if (intent.mode === 'into') {
    return { parentId: intent.parentId, index: intent.index }
  }
  if (intent.mode === 'before') {
    return { parentId: intent.parentId, index: intent.index }
  }
  // after → insert at index + 1
  return { parentId: intent.parentId, index: intent.index + 1 }
}

/**
 * Resolve drop intent from pointer position over a block.
 * Nestable blocks: top 22% before, bottom 22% after, middle = into.
 * Leaf blocks: top half before, bottom half after.
 * Horizontal axis (rows): left/right thirds map to before/after; center into if nestable.
 */
export function resolveDropIntent(opts: {
  clientX: number
  clientY: number
  rect: DOMRect
  parentId: string | null
  index: number
  blockId: string
  nestable: boolean
  childCount: number
  axis?: 'vertical' | 'horizontal'
}): DropIntent {
  const {
    clientX,
    clientY,
    rect,
    parentId,
    index,
    blockId,
    nestable,
    childCount,
    axis = 'vertical',
  } = opts

  if (axis === 'horizontal') {
    const ratio = (clientX - rect.left) / Math.max(rect.width, 1)
    if (nestable && ratio > 0.28 && ratio < 0.72) {
      return { mode: 'into', parentId: blockId, index: childCount }
    }
    if (ratio < 0.5) return { mode: 'before', parentId, index }
    return { mode: 'after', parentId, index }
  }

  const ratio = (clientY - rect.top) / Math.max(rect.height, 1)
  if (nestable) {
    if (ratio < 0.22) return { mode: 'before', parentId, index }
    if (ratio > 0.78) return { mode: 'after', parentId, index }
    return { mode: 'into', parentId: blockId, index: childCount }
  }
  if (ratio < 0.5) return { mode: 'before', parentId, index }
  return { mode: 'after', parentId, index }
}

/** Create a floating drag preview chip (caller should remove after dragend). */
export function createDragGhost(opts: {
  label: string
  accent?: string
  subtitle?: string
}): HTMLElement {
  const el = document.createElement('div')
  el.className = 'builder-drag-ghost'
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML = `
    <span class="builder-drag-ghost-dot" style="background:${opts.accent ?? 'var(--a-primary, #6366f1)'}"></span>
    <span class="builder-drag-ghost-text">
      <span class="builder-drag-ghost-label">${escapeHtml(opts.label)}</span>
      ${opts.subtitle ? `<span class="builder-drag-ghost-sub">${escapeHtml(opts.subtitle)}</span>` : ''}
    </span>
  `
  Object.assign(el.style, {
    position: 'fixed',
    top: '-1000px',
    left: '-1000px',
    zIndex: '99999',
    pointerEvents: 'none',
  })
  document.body.appendChild(el)
  return el
}

export function setDragGhostImage(
  dataTransfer: DataTransfer,
  ghost: HTMLElement,
  offsetX = 16,
  offsetY = 16,
): void {
  try {
    dataTransfer.setDragImage(ghost, offsetX, offsetY)
  } catch {
    /* some browsers reject custom images */
  }
  // Remove after the browser has captured the bitmap
  window.setTimeout(() => {
    ghost.remove()
  }, 0)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Auto-scroll a scrollable container while dragging near edges.
 * Returns a cleanup that cancels the rAF loop.
 */
export function startDragAutoScroll(
  container: HTMLElement | null,
  edgePx = 56,
  maxSpeed = 18,
): () => void {
  if (!container) return () => {}
  let raf = 0
  let lastY: number | null = null
  let lastX: number | null = null

  const onMove = (e: DragEvent) => {
    lastY = e.clientY
    lastX = e.clientX
  }

  const tick = () => {
    if (lastY != null && lastX != null) {
      const rect = container.getBoundingClientRect()
      let dy = 0
      let dx = 0
      if (lastY < rect.top + edgePx) {
        dy = -maxSpeed * (1 - Math.max(0, lastY - rect.top) / edgePx)
      } else if (lastY > rect.bottom - edgePx) {
        dy = maxSpeed * (1 - Math.max(0, rect.bottom - lastY) / edgePx)
      }
      if (lastX < rect.left + edgePx) {
        dx = -maxSpeed * (1 - Math.max(0, lastX - rect.left) / edgePx)
      } else if (lastX > rect.right - edgePx) {
        dx = maxSpeed * (1 - Math.max(0, rect.right - lastX) / edgePx)
      }
      if (dy !== 0 || dx !== 0) {
        container.scrollTop += dy
        container.scrollLeft += dx
      }
    }
    raf = requestAnimationFrame(tick)
  }

  window.addEventListener('dragover', onMove)
  raf = requestAnimationFrame(tick)

  return () => {
    window.removeEventListener('dragover', onMove)
    cancelAnimationFrame(raf)
  }
}
