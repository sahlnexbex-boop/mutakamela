'use client'

import { useState, type CSSProperties, type DragEvent, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  CircleAlert,
  Clock,
  Copy,
  Gauge,
  GripVertical,
  Heart,
  Info,
  Link as LinkIcon,
  Mail,
  MapPin,
  MonitorSmartphone,
  MousePointerClick,
  Phone,
  Shield,
  Sparkles,
  Star,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { DropSlot } from '@/components/builder/page/drop-slot'
import { EmbeddedForm } from '@/components/builder/page/embedded-form'
import { SiteChrome } from '@/components/builder/page/site-chrome'
import { mediaUrl } from '@/lib/api/media.api'
import {
  canNestChildren,
  createDragGhost,
  intentToDrop,
  isBuilderDrag,
  resolveDropIntent,
  setDragGhostImage,
  writeDragPayload,
  type BuilderDragPayload,
  type DropIntent,
} from '@/lib/builder/dnd'
import { getLocalized, isRtl, type BuilderLocale } from '@/lib/builder/i18n'
import { blockTypeLabel } from '@/lib/builder/palette'
import type { PageBlock } from '@/lib/builder/types'
import { spacingToCss } from '@/lib/builder/utils'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  gauge: Gauge,
  'mouse-pointer-click': MousePointerClick,
  'monitor-smartphone': MonitorSmartphone,
  sparkles: Sparkles,
  link: LinkIcon,
  check: Check,
  star: Star,
  heart: Heart,
  shield: Shield,
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  clock: Clock,
}

export const BUILDER_ICON_OPTIONS = [
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'gauge', label: 'Gauge' },
  { value: 'mouse-pointer-click', label: 'Pointer' },
  { value: 'monitor-smartphone', label: 'Devices' },
  { value: 'link', label: 'Link' },
  { value: 'check', label: 'Check' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'shield', label: 'Shield' },
  { value: 'phone', label: 'Phone' },
  { value: 'mail', label: 'Mail' },
  { value: 'map-pin', label: 'Map pin' },
  { value: 'clock', label: 'Clock' },
] as const

export type CanvasDndHandlers = {
  dragActive: BuilderDragPayload | null
  onDragStartBlock: (id: string) => void
  onDragEnd: () => void
  onDropAt: (parentId: string | null, index: number, dt?: DataTransfer) => void
  onMove: (id: string, direction: 'up' | 'down') => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

function blockStyle(block: PageBlock): CSSProperties {
  const s = block.styles ?? {}
  return {
    padding: spacingToCss(s.padding),
    margin: spacingToCss(s.margin),
    background: s.background,
    color: s.color,
    fontSize: s.fontSize ? `${s.fontSize}px` : undefined,
    fontWeight: s.fontWeight,
    textAlign: s.textAlign,
    borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
    width: s.width,
    maxWidth: s.maxWidth,
  }
}

export function BlockRenderer({
  block,
  selectedId,
  onSelect,
  editable = false,
  locale = 'en',
  dnd,
  parentId = null,
  index = 0,
  siblingCount = 1,
  layoutAxis = 'vertical',
}: {
  block: PageBlock
  selectedId?: string | null
  onSelect?: (id: string) => void
  editable?: boolean
  locale?: BuilderLocale
  dnd?: CanvasDndHandlers | null
  parentId?: string | null
  index?: number
  siblingCount?: number
  /** vertical = stack; horizontal = row columns */
  layoutAxis?: 'vertical' | 'horizontal'
}) {
  const selected = selectedId === block.id
  const style = blockStyle(block)
  const nestable = canNestChildren(block.type)
  const draggingSelf = dnd?.dragActive?.kind === 'block' && dnd.dragActive.id === block.id
  const showDropSlots = editable && !!dnd?.dragActive && !draggingSelf
  const [dropIntent, setDropIntent] = useState<DropIntent | null>(null)

  const startBlockDrag = (e: DragEvent) => {
    if (!dnd) return
    e.stopPropagation()
    writeDragPayload(e.dataTransfer, { kind: 'block', id: block.id })
    const ghost = createDragGhost({
      label: blockTypeLabel(block.type),
      subtitle: 'Moving on canvas',
      accent: 'var(--a-primary, #6366f1)',
    })
    setDragGhostImage(e.dataTransfer, ghost, 20, 18)
    dnd.onDragStartBlock(block.id)
    onSelect?.(block.id)
  }

  const clearIntent = () => setDropIntent(null)

  const handleBlockDragOver = (e: DragEvent) => {
    if (!dnd?.dragActive || draggingSelf) return
    if (!isBuilderDrag(e.dataTransfer)) return
    // Prefer child drop zones when pointer is over a nested drop slot
    const target = e.target as HTMLElement
    if (target.closest('[data-drop-slot]')) return
    if (target.closest('[data-block-id]') !== e.currentTarget) return

    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect =
      dnd.dragActive.kind === 'palette' ? 'copy' : 'move'

    const rect = e.currentTarget.getBoundingClientRect()
    const intent = resolveDropIntent({
      clientX: e.clientX,
      clientY: e.clientY,
      rect,
      parentId,
      index,
      blockId: block.id,
      nestable,
      childCount: block.children?.length ?? 0,
      axis: layoutAxis,
    })
    setDropIntent(intent)
  }

  const handleBlockDrop = (e: DragEvent) => {
    if (!dnd?.dragActive || draggingSelf) return
    const target = e.target as HTMLElement
    if (target.closest('[data-drop-slot]')) return
    if (target.closest('[data-block-id]') !== e.currentTarget) return

    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const intent =
      dropIntent ??
      resolveDropIntent({
        clientX: e.clientX,
        clientY: e.clientY,
        rect,
        parentId,
        index,
        blockId: block.id,
        nestable,
        childCount: block.children?.length ?? 0,
        axis: layoutAxis,
      })
    const { parentId: p, index: i } = intentToDrop(intent)
    dnd.onDropAt(p, i, e.dataTransfer)
    clearIntent()
  }

  const wrap = (content: ReactNode, extraClass?: string) => {
    if (!editable) return <div style={style} className={extraClass}>{content}</div>
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.(block.id)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect?.(block.id)
          }
        }}
        onDragOver={handleBlockDragOver}
        onDragLeave={(e) => {
          const related = e.relatedTarget as Node | null
          if (related && e.currentTarget.contains(related)) return
          clearIntent()
        }}
        onDrop={handleBlockDrop}
        style={style}
        className={cn(
          'builder-block group/block relative outline-none transition-[box-shadow,outline-color,opacity] duration-150',
          selected && 'builder-block-selected',
          draggingSelf && 'builder-block-dragging opacity-40',
          dropIntent?.mode === 'into' && 'builder-block-drop-into',
          dropIntent?.mode === 'before' && 'builder-block-drop-before',
          dropIntent?.mode === 'after' && 'builder-block-drop-after',
          dnd?.dragActive && !draggingSelf && 'builder-block-droppable',
          extraClass,
        )}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        {/* Smart edge indicators while hovering drop */}
        {dropIntent?.mode === 'before' && (
          <div
            className={cn(
              'builder-edge-indicator pointer-events-none absolute z-40',
              layoutAxis === 'horizontal'
                ? 'inset-y-2 left-0 w-1 rounded-full'
                : 'inset-x-2 top-0 h-1 rounded-full',
            )}
          />
        )}
        {dropIntent?.mode === 'after' && (
          <div
            className={cn(
              'builder-edge-indicator pointer-events-none absolute z-40',
              layoutAxis === 'horizontal'
                ? 'inset-y-2 right-0 w-1 rounded-full'
                : 'inset-x-2 bottom-0 h-1 rounded-full',
            )}
          />
        )}
        {dropIntent?.mode === 'into' && (
          <div className="builder-into-badge pointer-events-none absolute left-1/2 top-2 z-40 -translate-x-1/2 rounded-full bg-[var(--a-primary)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-lg">
            Drop inside
          </div>
        )}

        {/* Easy drag rail — always easy to grab on hover / selection / during dnd */}
        {dnd && (
          <div
            className={cn(
              'builder-drag-rail pointer-events-none absolute inset-y-1 left-0 z-30 flex w-7 items-center justify-center rounded-l-md transition',
              selected || draggingSelf
                ? 'opacity-100'
                : 'opacity-0 group-hover/block:opacity-100',
            )}
          >
            <span
              draggable
              onDragStart={startBlockDrag}
              onDragEnd={() => {
                dnd.onDragEnd()
                clearIntent()
              }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto flex h-10 w-5 cursor-grab items-center justify-center rounded-md bg-slate-900/80 text-white shadow-md active:cursor-grabbing"
              title="Drag to move"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </span>
          </div>
        )}

        {/* Hover / selected chrome */}
        <div
          className={cn(
            'builder-block-chrome pointer-events-none absolute -top-9 left-0 z-30 flex max-w-full items-center gap-0.5 transition',
            selected
              ? 'opacity-100'
              : 'opacity-0 group-hover/block:opacity-100',
          )}
        >
          <span className="flex items-center gap-1 rounded-t-lg bg-gradient-to-r from-[var(--a-primary)] to-[var(--a-accent)] py-1 pl-1.5 pr-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-[color-mix(in_srgb,var(--a-primary)_30%,transparent)]">
            {dnd && (
              <span
                draggable
                onDragStart={startBlockDrag}
                onDragEnd={() => dnd.onDragEnd()}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto flex h-5 w-5 cursor-grab items-center justify-center rounded-md bg-white/15 active:cursor-grabbing"
                title="Drag to move"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </span>
            )}
            {labelFor(block)}
          </span>
          {dnd && (
            <span className="pointer-events-auto flex items-center gap-0.5 rounded-t-lg bg-slate-800/95 p-0.5 shadow-lg">
              <ChromeBtn
                title="Move up"
                disabled={index <= 0}
                onClick={() => dnd.onMove(block.id, 'up')}
              >
                <ArrowUp className="h-3 w-3" />
              </ChromeBtn>
              <ChromeBtn
                title="Move down"
                disabled={index >= siblingCount - 1}
                onClick={() => dnd.onMove(block.id, 'down')}
              >
                <ArrowDown className="h-3 w-3" />
              </ChromeBtn>
              <ChromeBtn title="Duplicate" onClick={() => dnd.onDuplicate(block.id)}>
                <Copy className="h-3 w-3" />
              </ChromeBtn>
              <ChromeBtn title="Delete" danger onClick={() => dnd.onDelete(block.id)}>
                <Trash2 className="h-3 w-3" />
              </ChromeBtn>
            </span>
          )}
        </div>
        {content}
      </div>
    )
  }

  const renderChildren = (children: PageBlock[] | undefined, nestParentId: string) => {
    const list = children ?? []
    if (!editable || !dnd) {
      return list.map((child) => (
        <BlockRenderer
          key={child.id}
          block={child}
          selectedId={selectedId}
          onSelect={onSelect}
          locale={locale}
          editable={editable}
        />
      ))
    }

    return (
      <>
        <DropSlot
          active={showDropSlots}
          parentId={nestParentId}
          index={0}
          onDropAt={dnd.onDropAt}
          label="Insert at top"
        />
        {list.map((child, i) => (
          <div key={child.id} className="w-full">
            <BlockRenderer
              block={child}
              selectedId={selectedId}
              onSelect={onSelect}
              locale={locale}
              editable={editable}
              dnd={dnd}
              parentId={nestParentId}
              index={i}
              siblingCount={list.length}
            />
            <DropSlot
              active={showDropSlots}
              parentId={nestParentId}
              index={i + 1}
              onDropAt={dnd.onDropAt}
            />
          </div>
        ))}
        {list.length === 0 && (
          <DropSlot
            active={!!dnd.dragActive}
            parentId={nestParentId}
            index={0}
            onDropAt={dnd.onDropAt}
            variant="zone"
            label="Drop into this section"
          />
        )}
      </>
    )
  }

  switch (block.type) {
    case 'container': {
      const bg = mediaUrl(String(block.props.backgroundImage ?? ''))
      const overlay = String(block.props.backgroundOverlay ?? '')
      const minHeight = String(block.props.minHeight ?? '200px')
      return wrap(
        <div
          className="relative flex w-full flex-col items-center justify-center"
          style={{
            minHeight,
            backgroundImage: bg ? `url(${bg})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {overlay && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: overlay }}
            />
          )}
          <div className="relative z-[1] flex w-full max-w-4xl flex-col items-center">
            {renderChildren(block.children, block.id)}
          </div>
        </div>,
      )
    }
    case 'row': {
      const cols = Number(block.props.columns ?? 3) || 3
      const gap = Number(block.props.gap ?? 16)
      const title = getLocalized(block.props.title, locale, '')
      const children = block.children ?? []
      return wrap(
        <div>
          {title && (
            <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
              {title}
            </h2>
          )}
          {editable && dnd ? (
            <div className="flex flex-col gap-1">
              {children.length === 0 ? (
                <DropSlot
                  active={!!dnd.dragActive}
                  parentId={block.id}
                  index={0}
                  onDropAt={dnd.onDropAt}
                  variant="zone"
                  label="Drop cards or content into this row"
                />
              ) : (
                <div
                  className="grid items-stretch"
                  style={{
                    gridTemplateColumns: buildRowTemplate(cols, children.length, showDropSlots),
                    gap: showDropSlots ? 4 : gap,
                  }}
                >
                  {showDropSlots && (
                    <DropSlot
                      active
                      parentId={block.id}
                      index={0}
                      onDropAt={dnd.onDropAt}
                      variant="rail"
                      className="min-h-[80px]"
                    />
                  )}
                  {children.map((child, i) => (
                    <div key={child.id} className="min-w-0">
                      <BlockRenderer
                        block={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        editable={editable}
                        locale={locale}
                        dnd={dnd}
                        parentId={block.id}
                        index={i}
                        siblingCount={children.length}
                        layoutAxis="horizontal"
                      />
                    </div>
                  ))}
                  {showDropSlots && (
                    <DropSlot
                      active
                      parentId={block.id}
                      index={children.length}
                      onDropAt={dnd.onDropAt}
                      variant="rail"
                      className="min-h-[80px]"
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${Math.min(cols, Math.max(children.length || cols, 1))}, minmax(0, 1fr))`,
                gap,
              }}
            >
              {children.map((child) => (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  editable={editable}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>,
      )
    }
    case 'heading': {
      const level = Number(block.props.level ?? 2)
      const text = getLocalized(block.props.text, locale, 'Heading')
      const Tag = (`h${Math.min(6, Math.max(1, level))}` as unknown) as 'h1'
      return wrap(<Tag className="leading-tight tracking-tight">{text}</Tag>)
    }
    case 'paragraph': {
      const text = getLocalized(block.props.text, locale, '')
      return wrap(<p className="leading-relaxed">{text}</p>)
    }
    case 'button': {
      const text = getLocalized(block.props.text, locale, 'Button')
      const href = String(block.props.href ?? '#')
      const variant = String(block.props.variant ?? 'primary')
      const size = String(block.props.size ?? 'md')
      const fullWidth = block.props.fullWidth === true
      const openInNewTab = block.props.openInNewTab === true
      return wrap(
        <a
          href={editable ? undefined : href}
          target={!editable && openInNewTab ? '_blank' : undefined}
          rel={!editable && openInNewTab ? 'noopener noreferrer' : undefined}
          onClick={(e) => editable && e.preventDefault()}
          className={cn(
            'inline-flex items-center justify-center rounded-lg font-semibold transition',
            size === 'sm' && 'px-3 py-1.5 text-xs',
            size === 'md' && 'px-5 py-2.5 text-sm',
            size === 'lg' && 'px-7 py-3.5 text-base',
            fullWidth && 'w-full',
            variant === 'secondary' && 'bg-slate-800 text-white hover:bg-slate-700',
            variant === 'outline' &&
              'border-2 border-[var(--a-primary)] bg-transparent text-[var(--a-primary)] hover:bg-[var(--a-primary-soft)]',
            variant === 'primary' &&
              'bg-[var(--a-primary)] text-white shadow-md shadow-[color-mix(in_srgb,var(--a-primary)_25%,transparent)] hover:bg-[var(--a-primary)]',
          )}
        >
          {text}
        </a>,
      )
    }
    case 'link': {
      const text = getLocalized(block.props.text, locale, 'Link')
      const href = String(block.props.href ?? '#')
      const openInNewTab = block.props.openInNewTab === true
      const underline = block.props.underline !== false
      return wrap(
        <a
          href={editable ? undefined : href}
          target={!editable && openInNewTab ? '_blank' : undefined}
          rel={!editable && openInNewTab ? 'noopener noreferrer' : undefined}
          onClick={(e) => editable && e.preventDefault()}
          className={cn(
            'inline-flex items-center gap-1 font-medium transition hover:opacity-80',
            underline ? 'underline underline-offset-4' : 'no-underline',
          )}
        >
          {text}
        </a>,
      )
    }
    case 'list': {
      const listStyle = String(block.props.style ?? 'bullet')
      const rawItems = Array.isArray(block.props.items) ? block.props.items : []
      const items = rawItems.map((item) => {
        if (item && typeof item === 'object' && 'text' in item) {
          return getLocalized((item as { text: unknown }).text, locale, '')
        }
        return getLocalized(item, locale, '')
      }).filter(Boolean)
      const Tag = listStyle === 'number' ? 'ol' : 'ul'
      return wrap(
        items.length === 0 ? (
          <p className="text-sm italic text-slate-400">Add list items in properties</p>
        ) : (
          <Tag
            className={cn(
              'space-y-1.5 pl-5 text-slate-600',
              listStyle === 'number' ? 'list-decimal' : 'list-disc',
            )}
          >
            {items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </Tag>
        ),
      )
    }
    case 'badge': {
      const text = getLocalized(block.props.text, locale, 'Badge')
      const variant = String(block.props.variant ?? 'primary')
      return wrap(
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            variant === 'primary' &&
              'bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text,var(--a-primary))]',
            variant === 'neutral' && 'bg-slate-100 text-slate-600',
            variant === 'success' && 'bg-emerald-50 text-emerald-700',
            variant === 'warning' && 'bg-amber-50 text-amber-700',
          )}
        >
          {text}
        </span>,
      )
    }
    case 'icon': {
      const iconKey = String(block.props.icon ?? 'sparkles')
      const size = Number(block.props.size ?? 32) || 32
      const Icon = iconMap[iconKey] ?? Sparkles
      return wrap(
        <span className="inline-flex items-center justify-center" aria-hidden>
          <Icon style={{ width: size, height: size }} strokeWidth={1.75} />
        </span>,
      )
    }
    case 'quote': {
      const text = getLocalized(block.props.text, locale, '')
      const cite = getLocalized(block.props.cite, locale, '')
      return wrap(
        <blockquote className="border-l-4 border-[var(--a-primary)] pl-4">
          <p className="leading-relaxed italic text-slate-700">
            {text || 'Quote text…'}
          </p>
          {cite ? (
            <footer className="mt-2 text-sm not-italic text-slate-500">
              — {cite}
            </footer>
          ) : null}
        </blockquote>,
      )
    }
    case 'image': {
      const src = mediaUrl(String(block.props.src ?? ''))
      const alt = getLocalized(block.props.alt, locale, '')
      return wrap(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-auto w-full object-cover"
          style={{ borderRadius: block.styles.borderRadius ?? 12 }}
          draggable={false}
        />,
      )
    }
    case 'card': {
      const title = getLocalized(block.props.title, locale, 'Card')
      const description = getLocalized(block.props.description, locale, '')
      const iconKey = String(block.props.icon ?? 'sparkles')
      const Icon = iconMap[iconKey] ?? Sparkles
      return wrap(
        <div
          className={cn(
            'h-full rounded-xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition',
            selected && 'border-[var(--a-primary)] shadow-[color-mix(in_srgb,var(--a-primary)_10%,transparent)]',
          )}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--a-primary-soft)] text-[var(--a-primary)]">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h3 className="mb-2 text-base font-bold text-slate-800">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-500">{description}</p>
        </div>,
      )
    }
    case 'video': {
      const url = String(block.props.url ?? '')
      return wrap(
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
          {url ? (
            <iframe
              src={url}
              title={getLocalized(block.props.title, locale, 'Video')}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Set a video URL
            </div>
          )}
        </div>,
      )
    }
    case 'separator':
      return wrap(<hr className="border-slate-200" />)
    case 'form': {
      const title = getLocalized(
        block.props.title || block.props.formTitle,
        locale,
        'Form',
      )
      const slug = String(block.props.formSlug ?? '')
      const showTitle = block.props.showTitle !== false

      if (!editable && slug) {
        return wrap(
          <div className="px-2 py-4 sm:px-4">
            <div className="mx-auto max-w-2xl">
              <EmbeddedForm
                slug={slug}
                title={title}
                showTitle={showTitle}
                locale={locale}
              />
            </div>
          </div>,
        )
      }

      return wrap(
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {showTitle && (
            <p className="mb-3 text-center text-base font-bold text-slate-800">{title}</p>
          )}
          {slug ? (
            <div className="space-y-2 rounded-lg border border-dashed border-[color-mix(in_srgb,var(--a-primary)_30%,var(--a-border))] bg-[var(--a-primary-soft)] px-4 py-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--a-primary-hover)]">
                Embedded form
              </p>
              <p className="text-sm text-slate-600">
                {getLocalized(block.props.formTitle || block.props.title, locale, title)}
              </p>
              <p className="font-mono text-[11px] text-slate-400">/f/{slug}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
              Select a custom form in the Block properties panel
            </div>
          )}
        </div>,
      )
    }
    case 'spacer': {
      const height = Number(block.props.height ?? 40)
      return wrap(<div style={{ height }} />)
    }
    case 'accordion': {
      const rawItems = Array.isArray(block.props.items) ? block.props.items : []
      const items = rawItems.map((item) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          title?: unknown
          body?: unknown
        }
        return {
          title: getLocalized(row.title, locale, 'Untitled'),
          body: getLocalized(row.body, locale, ''),
        }
      })
      const allowMultiple = block.props.allowMultiple === true
      return wrap(
        <AccordionBlock
          items={items}
          allowMultiple={allowMultiple}
          editable={editable}
        />,
      )
    }
    case 'tabs': {
      const rawTabs = Array.isArray(block.props.tabs) ? block.props.tabs : []
      const tabs = rawTabs.map((item) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          label?: unknown
          content?: unknown
        }
        return {
          label: getLocalized(row.label, locale, 'Tab'),
          content: getLocalized(row.content, locale, ''),
        }
      })
      return wrap(<TabsBlock tabs={tabs} editable={editable} />)
    }
    case 'alert': {
      const variant = String(block.props.variant ?? 'info')
      const title = getLocalized(block.props.title, locale, '')
      const text = getLocalized(block.props.text, locale, '')
      const styles =
        variant === 'success'
          ? {
              box: 'border-emerald-200 bg-emerald-50 text-emerald-900',
              icon: 'text-emerald-600',
              Icon: Check,
            }
          : variant === 'warning'
            ? {
                box: 'border-amber-200 bg-amber-50 text-amber-900',
                icon: 'text-amber-600',
                Icon: AlertTriangle,
              }
            : variant === 'error'
              ? {
                  box: 'border-red-200 bg-red-50 text-red-900',
                  icon: 'text-red-600',
                  Icon: CircleAlert,
                }
              : {
                  box: 'border-sky-200 bg-sky-50 text-sky-900',
                  icon: 'text-sky-600',
                  Icon: Info,
                }
      const AlertIcon = styles.Icon
      return wrap(
        <div
          className={cn(
            'flex gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm',
            styles.box,
          )}
        >
          <AlertIcon className={cn('mt-0.5 h-5 w-5 shrink-0', styles.icon)} />
          <div className="min-w-0">
            {title ? <p className="mb-0.5 font-semibold">{title}</p> : null}
            {text ? <p className="leading-relaxed opacity-90">{text}</p> : null}
          </div>
        </div>,
      )
    }
    case 'embed': {
      const url = String(block.props.url ?? '').trim()
      const title = getLocalized(block.props.title, locale, 'Embed')
      const height = Number(block.props.height ?? 360) || 360
      const aspectRatio = String(block.props.aspectRatio ?? '').trim()
      return wrap(
        <div
          className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          style={
            aspectRatio
              ? { aspectRatio, height: 'auto' }
              : { height }
          }
        >
          {url ? (
            <iframe
              src={url}
              title={title}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-slate-400">
              Set an embed URL in properties
            </div>
          )}
        </div>,
      )
    }
    case 'gallery': {
      const cols = Math.min(6, Math.max(1, Number(block.props.columns ?? 3) || 3))
      const gap = Number(block.props.gap ?? 12) || 0
      const rawImages = Array.isArray(block.props.images) ? block.props.images : []
      const images = rawImages.map((item) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          src?: unknown
          alt?: unknown
        }
        return {
          src: mediaUrl(String(row.src ?? '')),
          alt: getLocalized(row.alt, locale, ''),
        }
      }).filter((img) => !!img.src)
      return wrap(
        images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
            Add images in the properties panel
          </div>
        ) : (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap,
            }}
          >
            {images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className="h-full min-h-[100px] w-full rounded-lg object-cover"
                draggable={false}
              />
            ))}
          </div>
        ),
      )
    }
    case 'cta': {
      const title = getLocalized(block.props.title, locale, '')
      const description = getLocalized(block.props.description, locale, '')
      const buttonText = getLocalized(block.props.buttonText, locale, 'Learn more')
      const buttonHref = String(block.props.buttonHref ?? '#')
      const openInNewTab = block.props.openInNewTab === true
      return wrap(
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          {title ? (
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm leading-relaxed opacity-90 sm:text-base">{description}</p>
          ) : null}
          <a
            href={editable ? undefined : buttonHref}
            target={!editable && openInNewTab ? '_blank' : undefined}
            rel={!editable && openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={(e) => editable && e.preventDefault()}
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-slate-50"
          >
            {buttonText}
          </a>
        </div>,
      )
    }
    case 'table': {
      const headers = Array.isArray(block.props.headers)
        ? block.props.headers.map((h) => getLocalized(h, locale, String(h ?? '')))
        : []
      const rows = Array.isArray(block.props.rows)
        ? block.props.rows.map((row) =>
            Array.isArray(row)
              ? row.map((cell) => getLocalized(cell, locale, String(cell ?? '')))
              : [],
          )
        : []
      const striped = block.props.striped !== false
      return wrap(
        headers.length === 0 && rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
            Configure table headers and rows
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[280px] border-collapse text-left text-sm">
              {headers.length > 0 && (
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-3 py-2.5 font-semibold text-slate-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={cn(
                      'border-b border-slate-100 last:border-0',
                      striped && ri % 2 === 1 && 'bg-slate-50/80',
                    )}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2.5 text-slate-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      )
    }
    case 'social': {
      const rawLinks = Array.isArray(block.props.links) ? block.props.links : []
      const size = Number(block.props.size ?? 36) || 36
      const links = rawLinks
        .map((item) => {
          const row = (item && typeof item === 'object' ? item : {}) as {
            platform?: unknown
            url?: unknown
          }
          return {
            platform: String(row.platform ?? 'link').toLowerCase(),
            url: String(row.url ?? '').trim(),
          }
        })
        .filter((l) => !!l.url)
      return wrap(
        links.length === 0 ? (
          <div className="text-center text-sm text-slate-400">
            Add social links in properties
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {links.map((link, i) => (
              <a
                key={i}
                href={editable ? undefined : link.url}
                target={!editable ? '_blank' : undefined}
                rel={!editable ? 'noopener noreferrer' : undefined}
                onClick={(e) => editable && e.preventDefault()}
                title={link.platform}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition hover:opacity-90"
                style={{ width: size, height: size }}
              >
                <SocialGlyph platform={link.platform} size={size * 0.42} />
              </a>
            ))}
          </div>
        ),
      )
    }
    case 'hero': {
      const eyebrow = getLocalized(block.props.eyebrow, locale, '')
      const title = getLocalized(block.props.title, locale, 'Hero title')
      const subtitle = getLocalized(block.props.subtitle, locale, '')
      const buttonText = getLocalized(block.props.buttonText, locale, 'Get started')
      const buttonHref = String(block.props.buttonHref ?? '#')
      const secondaryButtonText = getLocalized(
        block.props.secondaryButtonText,
        locale,
        '',
      )
      const secondaryButtonHref = String(block.props.secondaryButtonHref ?? '#')
      const bg = mediaUrl(String(block.props.backgroundImage ?? ''))
      const overlay = String(block.props.backgroundOverlay ?? '')
      const minHeight = String(block.props.minHeight ?? '420px')
      const openInNewTab = block.props.openInNewTab === true
      return wrap(
        <div
          className="relative flex w-full flex-col items-center justify-center"
          style={{
            minHeight,
            backgroundImage: bg ? `url(${bg})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {overlay ? (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: overlay }}
            />
          ) : null}
          <div className="relative z-[1] mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-2">
            {eyebrow ? (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                {subtitle}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={editable ? undefined : buttonHref}
                target={!editable && openInNewTab ? '_blank' : undefined}
                rel={!editable && openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={(e) => editable && e.preventDefault()}
                className="inline-flex items-center justify-center rounded-lg bg-[var(--a-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              >
                {buttonText}
              </a>
              {secondaryButtonText ? (
                <a
                  href={editable ? undefined : secondaryButtonHref}
                  onClick={(e) => editable && e.preventDefault()}
                  className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  {secondaryButtonText}
                </a>
              ) : null}
            </div>
          </div>
        </div>,
      )
    }
    case 'stats': {
      const title = getLocalized(block.props.title, locale, '')
      const rawItems = Array.isArray(block.props.items) ? block.props.items : []
      const items = rawItems.map((item) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          value?: unknown
          label?: unknown
        }
        return {
          value: getLocalized(row.value, locale, '0'),
          label: getLocalized(row.label, locale, ''),
        }
      })
      return wrap(
        <div className="mx-auto w-full max-w-5xl">
          {title ? (
            <h2 className="mb-8 text-2xl font-bold text-slate-800">{title}</h2>
          ) : null}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(4, Math.max(items.length || 1, 1))}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-6 shadow-sm"
              >
                <p className="text-2xl font-bold tracking-tight text-[var(--a-primary)] sm:text-3xl">
                  {item.value}
                </p>
                {item.label ? (
                  <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>,
      )
    }
    case 'testimonial': {
      const quote = getLocalized(block.props.quote, locale, '')
      const name = getLocalized(block.props.name, locale, '')
      const role = getLocalized(block.props.role, locale, '')
      const avatar = mediaUrl(String(block.props.avatar ?? ''))
      return wrap(
        <div className="mx-auto max-w-2xl">
          <p className="text-lg leading-relaxed text-slate-700 sm:text-xl">
            “{quote || 'Customer quote…'}”
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow"
                draggable={false}
              />
            ) : null}
            <div>
              {name ? (
                <p className="font-semibold text-slate-800">{name}</p>
              ) : null}
              {role ? <p className="text-sm text-slate-500">{role}</p> : null}
            </div>
          </div>
        </div>,
      )
    }
    case 'pricing': {
      const title = getLocalized(block.props.title, locale, '')
      const subtitle = getLocalized(block.props.subtitle, locale, '')
      const rawPlans = Array.isArray(block.props.plans) ? block.props.plans : []
      const plans = rawPlans.map((item) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          name?: unknown
          price?: unknown
          period?: unknown
          features?: unknown
          buttonText?: unknown
          buttonHref?: unknown
          highlighted?: unknown
        }
        const features = Array.isArray(row.features)
          ? row.features.map((f) => getLocalized(f, locale, String(f ?? '')))
          : []
        return {
          name: getLocalized(row.name, locale, 'Plan'),
          price: getLocalized(row.price, locale, '$0'),
          period: getLocalized(row.period, locale, '/mo'),
          features,
          buttonText: getLocalized(row.buttonText, locale, 'Choose plan'),
          buttonHref: String(row.buttonHref ?? '#'),
          highlighted: row.highlighted === true,
        }
      })
      return wrap(
        <div className="mx-auto w-full max-w-5xl">
          {title ? (
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">{title}</h2>
          ) : null}
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
              {subtitle}
            </p>
          ) : null}
          <div
            className="mt-8 grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(3, Math.max(plans.length || 1, 1))}, minmax(0, 1fr))`,
            }}
          >
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  'flex flex-col rounded-2xl border bg-white p-6 text-left shadow-sm',
                  plan.highlighted
                    ? 'border-[var(--a-primary)] ring-2 ring-[var(--a-primary)]/30'
                    : 'border-slate-200',
                )}
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {plan.name}
                </p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={editable ? undefined : plan.buttonHref}
                  onClick={(e) => editable && e.preventDefault()}
                  className={cn(
                    'mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition',
                    plan.highlighted
                      ? 'bg-[var(--a-primary)] text-white shadow-md'
                      : 'bg-slate-900 text-white hover:bg-slate-800',
                  )}
                >
                  {plan.buttonText}
                </a>
              </div>
            ))}
          </div>
        </div>,
      )
    }
    case 'faq': {
      const title = getLocalized(block.props.title, locale, '')
      const subtitle = getLocalized(block.props.subtitle, locale, '')
      const rawItems = Array.isArray(block.props.items) ? block.props.items : []
      const items = rawItems.map((item) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          title?: unknown
          body?: unknown
        }
        return {
          title: getLocalized(row.title, locale, 'Question'),
          body: getLocalized(row.body, locale, ''),
        }
      })
      const allowMultiple = block.props.allowMultiple === true
      return wrap(
        <div className="mx-auto w-full max-w-3xl">
          {title ? (
            <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
              {subtitle}
            </p>
          ) : null}
          <div className={cn((title || subtitle) && 'mt-8')}>
            <AccordionBlock
              items={items}
              allowMultiple={allowMultiple}
              editable={editable}
            />
          </div>
        </div>,
      )
    }
    case 'split': {
      const imageSrc = mediaUrl(String(block.props.imageSrc ?? ''))
      const imageAlt = getLocalized(block.props.imageAlt, locale, '')
      const imagePosition = String(block.props.imagePosition ?? 'left')
      const eyebrow = getLocalized(block.props.eyebrow, locale, '')
      const title = getLocalized(block.props.title, locale, '')
      const body = getLocalized(block.props.body, locale, '')
      const buttonText = getLocalized(block.props.buttonText, locale, '')
      const buttonHref = String(block.props.buttonHref ?? '#')
      const openInNewTab = block.props.openInNewTab === true
      const imageFirst = imagePosition !== 'right'
      const imageEl = (
        <div className="min-w-0 overflow-hidden rounded-2xl bg-slate-100">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full min-h-[220px] w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-400">
              Add an image
            </div>
          )}
        </div>
      )
      const textEl = (
        <div className="flex min-w-0 flex-col justify-center gap-3 text-left">
          {eyebrow ? (
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--a-primary)]">
              {eyebrow}
            </span>
          ) : null}
          {title ? (
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              {title}
            </h2>
          ) : null}
          {body ? (
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{body}</p>
          ) : null}
          {buttonText ? (
            <div>
              <a
                href={editable ? undefined : buttonHref}
                target={!editable && openInNewTab ? '_blank' : undefined}
                rel={!editable && openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={(e) => editable && e.preventDefault()}
                className="inline-flex items-center justify-center rounded-lg bg-[var(--a-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-md"
              >
                {buttonText}
              </a>
            </div>
          ) : null}
        </div>
      )
      return wrap(
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-2">
          {imageFirst ? (
            <>
              {imageEl}
              {textEl}
            </>
          ) : (
            <>
              {textEl}
              {imageEl}
            </>
          )}
        </div>,
      )
    }
    case 'logos': {
      const title = getLocalized(block.props.title, locale, '')
      const rawLogos = Array.isArray(block.props.logos) ? block.props.logos : []
      const logos = rawLogos
        .map((item) => {
          const row = (item && typeof item === 'object' ? item : {}) as {
            src?: unknown
            alt?: unknown
            href?: unknown
          }
          return {
            src: mediaUrl(String(row.src ?? '')),
            alt: getLocalized(row.alt, locale, ''),
            href: String(row.href ?? '').trim(),
          }
        })
        .filter((l) => !!l.src)
      return wrap(
        <div className="mx-auto w-full max-w-4xl">
          {title ? (
            <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {logos.map((logo, i) => {
              const img = (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 w-auto max-w-[140px] object-contain opacity-80"
                  draggable={false}
                />
              )
              if (logo.href && !editable) {
                return (
                  <a key={i} href={logo.href} target="_blank" rel="noopener noreferrer">
                    {img}
                  </a>
                )
              }
              return <div key={i}>{img}</div>
            })}
          </div>
        </div>,
      )
    }
    case 'newsletter': {
      const title = getLocalized(block.props.title, locale, '')
      const description = getLocalized(block.props.description, locale, '')
      const placeholder = getLocalized(block.props.placeholder, locale, 'Email')
      const buttonText = getLocalized(block.props.buttonText, locale, 'Subscribe')
      const note = getLocalized(block.props.note, locale, '')
      return wrap(
        <div className="mx-auto max-w-xl">
          {title ? (
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-2 text-sm opacity-90 sm:text-base">{description}</p>
          ) : null}
          <form
            className="mt-6 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <input
              type="email"
              placeholder={placeholder}
              disabled={editable}
              className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-inherit placeholder:text-current/50 outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="button"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              {buttonText}
            </button>
          </form>
          {note ? <p className="mt-3 text-xs opacity-70">{note}</p> : null}
        </div>,
      )
    }
    case 'steps': {
      const title = getLocalized(block.props.title, locale, '')
      const subtitle = getLocalized(block.props.subtitle, locale, '')
      const rawItems = Array.isArray(block.props.items) ? block.props.items : []
      const items = rawItems.map((item, index) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          title?: unknown
          description?: unknown
        }
        return {
          n: index + 1,
          title: getLocalized(row.title, locale, `Step ${index + 1}`),
          description: getLocalized(row.description, locale, ''),
        }
      })
      return wrap(
        <div className="mx-auto w-full max-w-5xl">
          {title ? (
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">{title}</h2>
          ) : null}
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{subtitle}</p>
          ) : null}
          <div
            className="mt-8 grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(3, Math.max(items.length || 1, 1))}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.n}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--a-primary-soft)] text-sm font-bold text-[var(--a-primary)]">
                  {item.n}
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>,
      )
    }
    case 'contact': {
      const title = getLocalized(block.props.title, locale, '')
      const subtitle = getLocalized(block.props.subtitle, locale, '')
      const rawItems = Array.isArray(block.props.items) ? block.props.items : []
      const items = rawItems.map((item) => {
        const row = (item && typeof item === 'object' ? item : {}) as {
          icon?: unknown
          label?: unknown
          value?: unknown
        }
        return {
          icon: String(row.icon ?? 'mail'),
          label: getLocalized(row.label, locale, ''),
          value: getLocalized(row.value, locale, ''),
        }
      })
      return wrap(
        <div className="mx-auto w-full max-w-4xl">
          {title ? (
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">{title}</h2>
          ) : null}
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{subtitle}</p>
          ) : null}
          <div
            className="mt-8 grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(4, Math.max(items.length || 1, 1))}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item, i) => {
              const Icon = iconMap[item.icon] ?? Mail
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--a-primary-soft)] text-[var(--a-primary)]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  {item.label ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {item.label}
                    </p>
                  ) : null}
                  {item.value ? (
                    <p className="mt-1 text-sm font-semibold text-slate-800">{item.value}</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>,
      )
    }
    default:
      return wrap(<div className="text-xs text-slate-400">Unknown block</div>)
  }
}

/** Brand icons were removed from Lucide; use compact glyphs instead. */
function SocialGlyph({ platform, size }: { platform: string; size: number }) {
  const p = platform.toLowerCase()
  if (p === 'mail' || p === 'email') {
    return <Mail style={{ width: size, height: size }} strokeWidth={2} />
  }
  if (p === 'phone') {
    return <Phone style={{ width: size, height: size }} strokeWidth={2} />
  }
  if (p === 'link') {
    return <LinkIcon style={{ width: size, height: size }} strokeWidth={2} />
  }
  const letter =
    p === 'twitter' || p === 'x'
      ? '𝕏'
      : p === 'facebook'
        ? 'f'
        : p === 'instagram'
          ? 'ig'
          : p === 'linkedin'
            ? 'in'
            : p === 'youtube'
              ? '▶'
              : p.slice(0, 1).toUpperCase()
  return (
    <span
      className="select-none font-bold leading-none tracking-tight"
      style={{ fontSize: Math.max(10, size * 0.85) }}
    >
      {letter}
    </span>
  )
}

function AccordionBlock({
  items,
  allowMultiple,
  editable,
}: {
  items: { title: string; body: string }[]
  allowMultiple: boolean
  editable?: boolean
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(items.length ? [0] : []))

  const toggle = (index: number) => {
    setOpen((prev) => {
      if (allowMultiple) {
        const next = new Set(prev)
        if (next.has(index)) next.delete(index)
        else next.add(index)
        return next
      }
      if (prev.has(index)) return new Set()
      return new Set([index])
    })
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
        Add accordion items in properties
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {items.map((item, index) => {
        const isOpen = open.has(index)
        return (
          <div key={index}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              onClick={(e) => {
                e.stopPropagation()
                toggle(index)
              }}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-slate-400 transition-transform',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600">
                {item.body || (editable ? 'Empty panel body' : null)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function TabsBlock({
  tabs,
  editable,
}: {
  tabs: { label: string; content: string }[]
  editable?: boolean
}) {
  const [active, setActive] = useState(0)
  const safeActive = tabs.length ? Math.min(active, tabs.length - 1) : 0

  if (!tabs.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
        Add tabs in properties
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActive(index)
            }}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-semibold transition',
              safeActive === index
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="px-4 py-4 text-sm leading-relaxed text-slate-600">
        {tabs[safeActive]?.content ||
          (editable ? 'Empty tab content' : null)}
      </div>
    </div>
  )
}

function ChromeBtn({
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
        'flex h-6 w-6 items-center justify-center rounded-md text-white/90 transition disabled:opacity-30',
        danger ? 'hover:bg-red-500/80' : 'hover:bg-white/15',
      )}
    >
      {children}
    </button>
  )
}

function labelFor(block: PageBlock): string {
  if (block.type === 'button') return 'Button'
  if (block.type === 'link') return 'Link'
  if (block.type === 'list') {
    return block.props.style === 'number' ? 'List · Numbered' : 'List · Bullet'
  }
  if (block.type === 'badge') return 'Badge'
  if (block.type === 'icon') return 'Icon'
  if (block.type === 'quote') return 'Quote'
  if (block.type === 'accordion') return 'Accordion'
  if (block.type === 'tabs') return 'Tabs'
  if (block.type === 'alert') return 'Alert'
  if (block.type === 'embed') return 'Embed'
  if (block.type === 'gallery') return 'Gallery'
  if (block.type === 'cta') return 'CTA Band'
  if (block.type === 'table') return 'Table'
  if (block.type === 'social') return 'Social'
  if (block.type === 'hero') return 'Hero'
  if (block.type === 'stats') return 'Stats'
  if (block.type === 'testimonial') return 'Testimonial'
  if (block.type === 'pricing') return 'Pricing'
  if (block.type === 'faq') return 'FAQ'
  if (block.type === 'split') return 'Image + Text'
  if (block.type === 'logos') return 'Logo Cloud'
  if (block.type === 'newsletter') return 'Newsletter'
  if (block.type === 'steps') return 'Steps'
  if (block.type === 'contact') return 'Contact'
  if (block.type === 'row') return `Row: ${block.props.columns ?? 2} Col`
  if (block.type === 'heading') return `Heading H${block.props.level ?? 2}`
  if (block.type === 'card') return 'Card'
  return block.type.charAt(0).toUpperCase() + block.type.slice(1)
}

/** Grid columns: optional leading/trailing rails + content tracks */
function buildRowTemplate(cols: number, childCount: number, withRails: boolean): string {
  const tracks = Math.max(childCount, Math.min(cols, Math.max(childCount, 1)))
  const content = `repeat(${tracks}, minmax(0, 1fr))`
  if (!withRails) return content
  return `12px ${content} 12px`
}

export function PageDocument({
  blocks,
  selectedId,
  onSelect,
  editable,
  onCanvasClick,
  emptyState,
  showHeader = false,
  showFooter = false,
  locale = 'en',
  dnd,
}: {
  blocks: PageBlock[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  editable?: boolean
  onCanvasClick?: () => void
  emptyState?: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  locale?: BuilderLocale
  dnd?: CanvasDndHandlers | null
}) {
  const dir = isRtl(locale) ? 'rtl' : 'ltr'
  const dragActive = !!dnd?.dragActive
  const body = (
    <div
      className={cn(
        'builder-document min-h-[320px] bg-[#f1f5f9]',
        dragActive && 'builder-document-dnd-active',
      )}
      onClick={() => onCanvasClick?.()}
      dir={dir}
      lang={locale}
    >
      {blocks.length === 0 && editable && (
        emptyState ?? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 p-10 text-center">
            <p className="text-sm font-semibold text-slate-600">Empty canvas</p>
            <p className="max-w-xs text-xs text-slate-400">
              Pick a component from the left panel to start building your page.
            </p>
          </div>
        )
      )}
      {editable && dnd && blocks.length > 0 && (
        <DropSlot
          active={dragActive}
          parentId={null}
          index={0}
          onDropAt={dnd.onDropAt}
          label="Drop at top"
        />
      )}
      {blocks.map((block, i) => (
        <div key={block.id}>
          <BlockRenderer
            block={block}
            selectedId={selectedId}
            onSelect={onSelect}
            editable={editable}
            locale={locale}
            dnd={editable ? dnd : null}
            parentId={null}
            index={i}
            siblingCount={blocks.length}
          />
          {editable && dnd && (
            <DropSlot
              active={dragActive}
              parentId={null}
              index={i + 1}
              onDropAt={dnd.onDropAt}
            />
          )}
        </div>
      ))}
      {editable && dnd && blocks.length === 0 && dragActive && (
        <div className="p-4">
          <DropSlot
            active
            parentId={null}
            index={0}
            onDropAt={dnd.onDropAt}
            variant="zone"
            label="Drop component to add it"
            className="min-h-[220px]"
          />
        </div>
      )}
    </div>
  )

  if (!showHeader && !showFooter) {
    return (
      <div className="builder-document-shell min-h-[520px] bg-[#f1f5f9]" dir={dir} lang={locale}>
        {body}
      </div>
    )
  }

  return (
    <SiteChrome
      showHeader={showHeader}
      showFooter={showFooter}
      previewChrome={!!editable}
      className="builder-document-shell min-h-[520px]"
    >
      {body}
    </SiteChrome>
  )
}
