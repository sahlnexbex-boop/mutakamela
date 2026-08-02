'use client'

import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { BUILDER_ICON_OPTIONS } from '@/components/builder/page/block-renderer'
import { ImageSourceField } from '@/components/builder/shared/image-source-field'
import { LocalizedField } from '@/components/builder/shared/localized-field'
import { getLocalized, type BuilderLocale } from '@/lib/builder/i18n'
import type { FormListItem, PageBlock } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

export type FormOption = Pick<FormListItem, 'id' | 'title' | 'slug' | 'status'>

type Props = {
  block: PageBlock | null
  onChange: (patch: Partial<PageBlock> & { props?: Record<string, unknown>; styles?: PageBlock['styles'] }) => void
  /** Available CMS forms for the Form block picker */
  forms?: FormOption[]
  formsLoading?: boolean
  locale?: BuilderLocale
}

export function PagePropertiesPanel({
  block,
  onChange,
  forms = [],
  formsLoading = false,
  locale = 'en',
}: Props) {
  if (!block) {
    return null
  }

  const setProp = (key: string, value: unknown) => {
    onChange({ props: { ...block.props, [key]: value } })
  }

  const setStyle = (key: string, value: unknown) => {
    onChange({ styles: { ...block.styles, [key]: value } })
  }

  const setSpacing = (
    kind: 'padding' | 'margin',
    side: 'top' | 'right' | 'bottom' | 'left',
    value: number,
  ) => {
    const prev = block.styles[kind] ?? { top: 0, right: 0, bottom: 0, left: 0 }
    onChange({
      styles: {
        ...block.styles,
        [kind]: { ...prev, [side]: value },
      },
    })
  }

  return (
    <div className="space-y-2.5">
      <div>
        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
          Properties
        </p>
        <h3 className="text-xs font-semibold text-[var(--b-text)]">
          {propertyTitle(block.type)}
        </h3>
      </div>

      <div
        className={cn(
          'builder-locale-banner flex items-start gap-2.5 rounded-lg border px-2.5 py-2.5',
          locale === 'ar' ? 'builder-locale-banner-ar' : 'builder-locale-banner-en',
        )}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-base leading-none"
          aria-hidden
        >
          {locale === 'ar' ? '🇸🇦' : '🇬🇧'}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold leading-tight">
            {locale === 'ar' ? 'معاينة العربية · RTL' : 'English preview · LTR'}
          </p>
          <p className="mt-1 text-[10px] font-medium leading-snug">
            {locale === 'ar'
              ? 'Use EN/AR tabs, or click AR → EN / EN → AR to auto-translate.'
              : 'Use EN/AR tabs, or click EN → AR / AR → EN to auto-translate.'}
          </p>
        </div>
      </div>

      {/* Style variants for button */}
      {block.type === 'button' && (
        <Section title="Style">
          <p className="mb-2 text-[11px] text-[var(--b-muted)]">Variants</p>
          <div className="flex flex-wrap gap-1.5">
            {(['primary', 'secondary', 'outline'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setProp('variant', v)}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-[11px] font-semibold capitalize transition',
                  block.props.variant === v
                    ? 'bg-[var(--a-primary)] text-white'
                    : 'bg-[var(--a-surface-2)] text-[var(--b-muted)] hover:bg-[var(--a-primary-soft)] hover:text-[var(--b-text)]',
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="mb-2 mt-3 text-[11px] text-[var(--b-muted)]">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setProp('size', s)}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase transition',
                  (block.props.size ?? 'md') === s
                    ? 'bg-[var(--a-primary)] text-white'
                    : 'bg-[var(--a-surface-2)] text-[var(--b-muted)] hover:bg-[var(--a-primary-soft)] hover:text-[var(--b-text)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.fullWidth === true}
                onChange={(e) => setProp('fullWidth', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Full width
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.openInNewTab === true}
                onChange={(e) => setProp('openInNewTab', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Open in new tab
            </label>
          </div>
        </Section>
      )}

      {block.type === 'badge' && (
        <Section title="Style">
          <p className="mb-2 text-[11px] text-[var(--b-muted)]">Variants</p>
          <div className="flex flex-wrap gap-1.5">
            {(['primary', 'neutral', 'success', 'warning'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setProp('variant', v)}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-[11px] font-semibold capitalize transition',
                  (block.props.variant ?? 'primary') === v
                    ? 'bg-[var(--a-primary)] text-white'
                    : 'bg-[var(--a-surface-2)] text-[var(--b-muted)] hover:bg-[var(--a-primary-soft)] hover:text-[var(--b-text)]',
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section title="Content">
        {(block.type === 'heading' ||
          block.type === 'paragraph' ||
          block.type === 'button' ||
          block.type === 'link' ||
          block.type === 'badge') && (
          <LocalizedField
            label="Text"
            value={block.props.text}
            locale={locale}
            onChange={(next) => setProp('text', next)}
            multiline={block.type === 'paragraph'}
          />
        )}
        {block.type === 'heading' && (
          <Field label="Level">
            <select
              className="builder-input"
              value={Number(block.props.level ?? 2)}
              onChange={(e) => setProp('level', Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  H{n}
                </option>
              ))}
            </select>
          </Field>
        )}
        {(block.type === 'button' || block.type === 'link') && (
          <Field label="Link">
            <input
              className="builder-input"
              value={String(block.props.href ?? '')}
              onChange={(e) => setProp('href', e.target.value)}
              placeholder="#contact"
            />
          </Field>
        )}
        {block.type === 'link' && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.openInNewTab === true}
                onChange={(e) => setProp('openInNewTab', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Open in new tab
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.underline !== false}
                onChange={(e) => setProp('underline', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Underline
            </label>
          </div>
        )}
        {block.type === 'list' && (
          <>
            <Field label="List style">
              <select
                className="builder-input"
                value={String(block.props.style ?? 'bullet')}
                onChange={(e) => setProp('style', e.target.value)}
              >
                <option value="bullet">Bulleted</option>
                <option value="number">Numbered</option>
              </select>
            </Field>
            <ListItemsEditor
              items={Array.isArray(block.props.items) ? block.props.items : []}
              locale={locale}
              onChange={(items) => setProp('items', items)}
            />
          </>
        )}
        {block.type === 'icon' && (
          <>
            <Field label="Icon">
              <select
                className="builder-input"
                value={String(block.props.icon ?? 'sparkles')}
                onChange={(e) => setProp('icon', e.target.value)}
              >
                {BUILDER_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Size (px)">
              <input
                type="number"
                min={12}
                max={128}
                className="builder-input"
                value={Number(block.props.size ?? 32)}
                onChange={(e) => setProp('size', Number(e.target.value))}
              />
            </Field>
          </>
        )}
        {block.type === 'quote' && (
          <>
            <LocalizedField
              label="Quote"
              value={block.props.text}
              locale={locale}
              onChange={(next) => setProp('text', next)}
              multiline
            />
            <LocalizedField
              label="Citation (optional)"
              value={block.props.cite}
              locale={locale}
              onChange={(next) => setProp('cite', next)}
              placeholder="Author or source"
            />
          </>
        )}
        {block.type === 'image' && (
          <>
            <ImageSourceField
              label="Image"
              value={String(block.props.src ?? '')}
              onChange={(url) => setProp('src', url)}
              placeholder="https://… or upload"
              helpText="Paste a link or upload from your computer."
            />
            <LocalizedField
              label="Alt text"
              value={block.props.alt}
              locale={locale}
              onChange={(next) => setProp('alt', next)}
            />
          </>
        )}
        {block.type === 'card' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Description"
              value={block.props.description}
              locale={locale}
              onChange={(next) => setProp('description', next)}
              multiline
            />
            <Field label="Icon">
              <select
                className="builder-input"
                value={String(block.props.icon ?? 'sparkles')}
                onChange={(e) => setProp('icon', e.target.value)}
              >
                {BUILDER_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
        {block.type === 'container' && (
          <>
            <ImageSourceField
              label="Background image"
              value={String(block.props.backgroundImage ?? '')}
              onChange={(url) => setProp('backgroundImage', url)}
              placeholder="https://… or upload"
              helpText="Use a public image URL or upload your own."
            />
            <Field label="Overlay">
              <input
                className="builder-input"
                value={String(block.props.backgroundOverlay ?? '')}
                onChange={(e) => setProp('backgroundOverlay', e.target.value)}
                placeholder="rgba(15, 23, 42, 0.45)"
              />
            </Field>
            <Field label="Min height">
              <input
                className="builder-input"
                value={String(block.props.minHeight ?? '')}
                onChange={(e) => setProp('minHeight', e.target.value)}
                placeholder="420px"
              />
            </Field>
          </>
        )}
        {block.type === 'row' && (
          <>
            <LocalizedField
              label="Section title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <Field label="Columns">
              <input
                type="number"
                min={1}
                max={6}
                className="builder-input"
                value={Number(block.props.columns ?? 2)}
                onChange={(e) => setProp('columns', Number(e.target.value))}
              />
            </Field>
            <Field label="Gap (px)">
              <input
                type="number"
                min={0}
                className="builder-input"
                value={Number(block.props.gap ?? 16)}
                onChange={(e) => setProp('gap', Number(e.target.value))}
              />
            </Field>
          </>
        )}
        {block.type === 'video' && (
          <>
            <Field label="Embed URL">
              <input
                className="builder-input"
                value={String(block.props.url ?? '')}
                onChange={(e) => setProp('url', e.target.value)}
              />
            </Field>
            <LocalizedField
              label="Video title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
          </>
        )}
        {block.type === 'form' && (
          <>
            <LocalizedField
              label="Display title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
              placeholder="Contact form"
            />
            <Field label="Custom form">
              <select
                className="builder-input"
                value={String(block.props.formSlug ?? '')}
                disabled={formsLoading}
                onChange={(e) => {
                  const slug = e.target.value
                  const selected = forms.find((f) => f.slug === slug)
                  const existingTitle = getLocalized(block.props.title, locale, '').trim()
                  onChange({
                    props: {
                      ...block.props,
                      formSlug: slug,
                      formId: selected?.id ?? null,
                      formTitle: selected?.title ?? '',
                      title: existingTitle
                        ? block.props.title
                        : selected?.title || 'Form',
                    },
                  })
                }}
              >
                <option value="">
                  {formsLoading ? 'Loading forms…' : 'Select a form…'}
                </option>
                {forms.map((f) => (
                  <option key={f.id} value={f.slug}>
                    {f.title} ({f.status}) — /{f.slug}
                  </option>
                ))}
              </select>
            </Field>
            {forms.length === 0 && !formsLoading && (
              <p className="rounded-lg border border-dashed border-[var(--b-border)] px-2.5 py-2 text-[11px] leading-relaxed text-[var(--b-muted)]">
                No forms yet.{' '}
                <Link
                  href="/admin/forms"
                  className="font-semibold text-[var(--a-primary-soft-text)] hover:underline"
                >
                  Create a form
                </Link>{' '}
                then come back to embed it.
              </p>
            )}
            {!!block.props.formSlug && (
              <div className="rounded-lg border border-[color-mix(in_srgb,var(--a-primary)_25%,transparent)] bg-[var(--a-primary-soft)] px-2.5 py-2 text-[11px] text-[var(--a-primary-soft-text)]">
                <p className="font-semibold">
                  {getLocalized(
                    block.props.formTitle || block.props.title,
                    locale,
                    'Form',
                  )}
                </p>
                <p className="mt-0.5 text-[var(--a-primary-soft-text)]">
                  Public:{' '}
                  <span className="font-mono">
                    /f/{String(block.props.formSlug)}
                  </span>
                </p>
                <Link
                  href="/admin/forms"
                  className="mt-1 inline-block font-semibold text-[var(--a-primary-soft-text)] hover:underline"
                >
                  Manage forms →
                </Link>
              </div>
            )}
            <Field label="Show form title on page">
              <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
                <input
                  type="checkbox"
                  checked={block.props.showTitle !== false}
                  onChange={(e) => setProp('showTitle', e.target.checked)}
                  className="h-3.5 w-3.5 accent-[var(--a-primary)]"
                />
                Visible heading above the form
              </label>
            </Field>
          </>
        )}
        {block.type === 'spacer' && (
          <Field label="Height (px)">
            <input
              type="number"
              className="builder-input"
              value={Number(block.props.height ?? 40)}
              onChange={(e) => setProp('height', Number(e.target.value))}
            />
          </Field>
        )}
        {block.type === 'accordion' && (
          <>
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.allowMultiple === true}
                onChange={(e) => setProp('allowMultiple', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Allow multiple open panels
            </label>
            <KeyedItemsEditor
              label="Panels"
              items={Array.isArray(block.props.items) ? block.props.items : []}
              locale={locale}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'body', label: 'Body', multiline: true },
              ]}
              createItem={() => ({
                title: 'New question',
                body: 'Answer goes here…',
              })}
              onChange={(items) => setProp('items', items)}
            />
          </>
        )}
        {block.type === 'tabs' && (
          <KeyedItemsEditor
            label="Tabs"
            items={Array.isArray(block.props.tabs) ? block.props.tabs : []}
            locale={locale}
            fields={[
              { key: 'label', label: 'Label' },
              { key: 'content', label: 'Content', multiline: true },
            ]}
            createItem={() => ({
              label: 'New tab',
              content: 'Tab content…',
            })}
            onChange={(items) => setProp('tabs', items)}
          />
        )}
        {block.type === 'alert' && (
          <>
            <Field label="Variant">
              <select
                className="builder-input"
                value={String(block.props.variant ?? 'info')}
                onChange={(e) => setProp('variant', e.target.value)}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </Field>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Message"
              value={block.props.text}
              locale={locale}
              onChange={(next) => setProp('text', next)}
              multiline
            />
          </>
        )}
        {block.type === 'embed' && (
          <>
            <Field label="Embed URL">
              <input
                className="builder-input"
                value={String(block.props.url ?? '')}
                onChange={(e) => setProp('url', e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <LocalizedField
              label="Title (accessibility)"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <Field label="Height (px)">
              <input
                type="number"
                min={120}
                className="builder-input"
                value={Number(block.props.height ?? 360)}
                onChange={(e) => setProp('height', Number(e.target.value))}
              />
            </Field>
            <Field label="Aspect ratio (optional)">
              <input
                className="builder-input"
                value={String(block.props.aspectRatio ?? '')}
                onChange={(e) => setProp('aspectRatio', e.target.value)}
                placeholder="16 / 9"
              />
            </Field>
          </>
        )}
        {block.type === 'gallery' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Columns">
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="builder-input"
                  value={Number(block.props.columns ?? 3)}
                  onChange={(e) => setProp('columns', Number(e.target.value))}
                />
              </Field>
              <Field label="Gap (px)">
                <input
                  type="number"
                  min={0}
                  className="builder-input"
                  value={Number(block.props.gap ?? 12)}
                  onChange={(e) => setProp('gap', Number(e.target.value))}
                />
              </Field>
            </div>
            <GalleryItemsEditor
              items={Array.isArray(block.props.images) ? block.props.images : []}
              locale={locale}
              onChange={(images) => setProp('images', images)}
            />
          </>
        )}
        {block.type === 'cta' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Description"
              value={block.props.description}
              locale={locale}
              onChange={(next) => setProp('description', next)}
              multiline
            />
            <LocalizedField
              label="Button text"
              value={block.props.buttonText}
              locale={locale}
              onChange={(next) => setProp('buttonText', next)}
            />
            <Field label="Button link">
              <input
                className="builder-input"
                value={String(block.props.buttonHref ?? '')}
                onChange={(e) => setProp('buttonHref', e.target.value)}
                placeholder="#contact"
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.openInNewTab === true}
                onChange={(e) => setProp('openInNewTab', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Open button in new tab
            </label>
          </>
        )}
        {block.type === 'table' && (
          <>
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.striped !== false}
                onChange={(e) => setProp('striped', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Striped rows
            </label>
            <TableEditor
              headers={Array.isArray(block.props.headers) ? block.props.headers : []}
              rows={
                Array.isArray(block.props.rows)
                  ? (block.props.rows as unknown[][])
                  : []
              }
              onChange={(headers, rows) =>
                onChange({
                  props: { ...block.props, headers, rows },
                })
              }
            />
          </>
        )}
        {block.type === 'social' && (
          <>
            <Field label="Icon size (px)">
              <input
                type="number"
                min={24}
                max={72}
                className="builder-input"
                value={Number(block.props.size ?? 36)}
                onChange={(e) => setProp('size', Number(e.target.value))}
              />
            </Field>
            <SocialLinksEditor
              links={Array.isArray(block.props.links) ? block.props.links : []}
              onChange={(links) => setProp('links', links)}
            />
          </>
        )}
        {block.type === 'hero' && (
          <>
            <LocalizedField
              label="Eyebrow"
              value={block.props.eyebrow}
              locale={locale}
              onChange={(next) => setProp('eyebrow', next)}
            />
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Subtitle"
              value={block.props.subtitle}
              locale={locale}
              onChange={(next) => setProp('subtitle', next)}
              multiline
            />
            <LocalizedField
              label="Primary button"
              value={block.props.buttonText}
              locale={locale}
              onChange={(next) => setProp('buttonText', next)}
            />
            <Field label="Primary link">
              <input
                className="builder-input"
                value={String(block.props.buttonHref ?? '')}
                onChange={(e) => setProp('buttonHref', e.target.value)}
              />
            </Field>
            <LocalizedField
              label="Secondary button"
              value={block.props.secondaryButtonText}
              locale={locale}
              onChange={(next) => setProp('secondaryButtonText', next)}
            />
            <Field label="Secondary link">
              <input
                className="builder-input"
                value={String(block.props.secondaryButtonHref ?? '')}
                onChange={(e) => setProp('secondaryButtonHref', e.target.value)}
              />
            </Field>
            <ImageSourceField
              label="Background image"
              value={String(block.props.backgroundImage ?? '')}
              onChange={(url) => setProp('backgroundImage', url)}
            />
            <Field label="Overlay">
              <input
                className="builder-input"
                value={String(block.props.backgroundOverlay ?? '')}
                onChange={(e) => setProp('backgroundOverlay', e.target.value)}
                placeholder="rgba(15, 23, 42, 0.5)"
              />
            </Field>
            <Field label="Min height">
              <input
                className="builder-input"
                value={String(block.props.minHeight ?? '')}
                onChange={(e) => setProp('minHeight', e.target.value)}
                placeholder="420px"
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.openInNewTab === true}
                onChange={(e) => setProp('openInNewTab', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Open primary button in new tab
            </label>
          </>
        )}
        {block.type === 'stats' && (
          <>
            <LocalizedField
              label="Section title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <KeyedItemsEditor
              label="Metrics"
              items={Array.isArray(block.props.items) ? block.props.items : []}
              locale={locale}
              fields={[
                { key: 'value', label: 'Value' },
                { key: 'label', label: 'Label' },
              ]}
              createItem={() => ({ value: '100+', label: 'Metric' })}
              onChange={(items) => setProp('items', items)}
            />
          </>
        )}
        {block.type === 'testimonial' && (
          <>
            <LocalizedField
              label="Quote"
              value={block.props.quote}
              locale={locale}
              onChange={(next) => setProp('quote', next)}
              multiline
            />
            <LocalizedField
              label="Name"
              value={block.props.name}
              locale={locale}
              onChange={(next) => setProp('name', next)}
            />
            <LocalizedField
              label="Role"
              value={block.props.role}
              locale={locale}
              onChange={(next) => setProp('role', next)}
            />
            <ImageSourceField
              label="Avatar"
              value={String(block.props.avatar ?? '')}
              onChange={(url) => setProp('avatar', url)}
            />
          </>
        )}
        {block.type === 'pricing' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Subtitle"
              value={block.props.subtitle}
              locale={locale}
              onChange={(next) => setProp('subtitle', next)}
              multiline
            />
            <PricingPlansEditor
              plans={Array.isArray(block.props.plans) ? block.props.plans : []}
              locale={locale}
              onChange={(plans) => setProp('plans', plans)}
            />
          </>
        )}
        {block.type === 'faq' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Subtitle"
              value={block.props.subtitle}
              locale={locale}
              onChange={(next) => setProp('subtitle', next)}
              multiline
            />
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={block.props.allowMultiple === true}
                onChange={(e) => setProp('allowMultiple', e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Allow multiple open panels
            </label>
            <KeyedItemsEditor
              label="Questions"
              items={Array.isArray(block.props.items) ? block.props.items : []}
              locale={locale}
              fields={[
                { key: 'title', label: 'Question' },
                { key: 'body', label: 'Answer', multiline: true },
              ]}
              createItem={() => ({
                title: 'New question?',
                body: 'Answer goes here…',
              })}
              onChange={(items) => setProp('items', items)}
            />
          </>
        )}
        {block.type === 'split' && (
          <>
            <Field label="Image position">
              <select
                className="builder-input"
                value={String(block.props.imagePosition ?? 'left')}
                onChange={(e) => setProp('imagePosition', e.target.value)}
              >
                <option value="left">Image left</option>
                <option value="right">Image right</option>
              </select>
            </Field>
            <ImageSourceField
              label="Image"
              value={String(block.props.imageSrc ?? '')}
              onChange={(url) => setProp('imageSrc', url)}
            />
            <LocalizedField
              label="Image alt"
              value={block.props.imageAlt}
              locale={locale}
              onChange={(next) => setProp('imageAlt', next)}
            />
            <LocalizedField
              label="Eyebrow"
              value={block.props.eyebrow}
              locale={locale}
              onChange={(next) => setProp('eyebrow', next)}
            />
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Body"
              value={block.props.body}
              locale={locale}
              onChange={(next) => setProp('body', next)}
              multiline
            />
            <LocalizedField
              label="Button text"
              value={block.props.buttonText}
              locale={locale}
              onChange={(next) => setProp('buttonText', next)}
            />
            <Field label="Button link">
              <input
                className="builder-input"
                value={String(block.props.buttonHref ?? '')}
                onChange={(e) => setProp('buttonHref', e.target.value)}
              />
            </Field>
          </>
        )}
        {block.type === 'logos' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LogosEditor
              logos={Array.isArray(block.props.logos) ? block.props.logos : []}
              locale={locale}
              onChange={(logos) => setProp('logos', logos)}
            />
          </>
        )}
        {block.type === 'newsletter' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Description"
              value={block.props.description}
              locale={locale}
              onChange={(next) => setProp('description', next)}
              multiline
            />
            <LocalizedField
              label="Placeholder"
              value={block.props.placeholder}
              locale={locale}
              onChange={(next) => setProp('placeholder', next)}
            />
            <LocalizedField
              label="Button text"
              value={block.props.buttonText}
              locale={locale}
              onChange={(next) => setProp('buttonText', next)}
            />
            <LocalizedField
              label="Note"
              value={block.props.note}
              locale={locale}
              onChange={(next) => setProp('note', next)}
            />
          </>
        )}
        {block.type === 'steps' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Subtitle"
              value={block.props.subtitle}
              locale={locale}
              onChange={(next) => setProp('subtitle', next)}
              multiline
            />
            <KeyedItemsEditor
              label="Steps"
              items={Array.isArray(block.props.items) ? block.props.items : []}
              locale={locale}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description', multiline: true },
              ]}
              createItem={() => ({
                title: 'New step',
                description: 'Describe this step…',
              })}
              onChange={(items) => setProp('items', items)}
            />
          </>
        )}
        {block.type === 'contact' && (
          <>
            <LocalizedField
              label="Title"
              value={block.props.title}
              locale={locale}
              onChange={(next) => setProp('title', next)}
            />
            <LocalizedField
              label="Subtitle"
              value={block.props.subtitle}
              locale={locale}
              onChange={(next) => setProp('subtitle', next)}
              multiline
            />
            <ContactItemsEditor
              items={Array.isArray(block.props.items) ? block.props.items : []}
              locale={locale}
              onChange={(items) => setProp('items', items)}
            />
          </>
        )}
      </Section>

      <Section title="Typography">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Size">
            <input
              type="number"
              className="builder-input"
              value={block.styles.fontSize ?? ''}
              placeholder="16"
              onChange={(e) =>
                setStyle('fontSize', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </Field>
          <Field label="Weight">
            <select
              className="builder-input"
              value={String(block.styles.fontWeight ?? '')}
              onChange={(e) =>
                setStyle('fontWeight', e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Default</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </Field>
        </div>
        <Field label="Color">
          <div className="flex gap-2">
            <input
              type="color"
              className="h-9 w-10 cursor-pointer rounded border border-[var(--b-border)] bg-transparent p-0.5"
              value={
                typeof block.styles.color === 'string' && block.styles.color.startsWith('#')
                  ? block.styles.color
                  : '#ffffff'
              }
              onChange={(e) => setStyle('color', e.target.value)}
            />
            <input
              className="builder-input flex-1"
              value={String(block.styles.color ?? '')}
              onChange={(e) => setStyle('color', e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </Field>
        <Field label="Align">
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setStyle('textAlign', a)}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-[11px] font-semibold capitalize',
                  block.styles.textAlign === a
                    ? 'bg-[var(--a-primary)] text-white'
                    : 'bg-[var(--a-surface-2)] text-[var(--b-muted)]',
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Spacing">
        <p className="mb-2 text-[11px] text-[var(--b-muted)]">Padding</p>
        <div className="grid grid-cols-4 gap-1.5">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <Field key={side} label={side[0].toUpperCase()}>
              <input
                type="number"
                className="builder-input px-1 text-center"
                value={block.styles.padding?.[side] ?? 0}
                onChange={(e) => setSpacing('padding', side, Number(e.target.value))}
              />
            </Field>
          ))}
        </div>
        <p className="mb-2 mt-3 text-[11px] text-[var(--b-muted)]">Margin</p>
        <div className="grid grid-cols-4 gap-1.5">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <Field key={side} label={side[0].toUpperCase()}>
              <input
                type="number"
                className="builder-input px-1 text-center"
                value={block.styles.margin?.[side] ?? 0}
                onChange={(e) => setSpacing('margin', side, Number(e.target.value))}
              />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Background">
        <Field label="Color">
          <input
            className="builder-input"
            value={String(block.styles.background ?? '')}
            onChange={(e) => setStyle('background', e.target.value)}
            placeholder="#ffffff"
          />
        </Field>
        <Field label="Radius">
          <input
            type="number"
            className="builder-input"
            value={block.styles.borderRadius ?? 0}
            onChange={(e) => setStyle('borderRadius', Number(e.target.value))}
          />
        </Field>
      </Section>
    </div>
  )
}

function propertyTitle(type: PageBlock['type']): string {
  switch (type) {
    case 'button':
      return 'Button'
    case 'link':
      return 'Link · Anchor'
    case 'list':
      return 'List'
    case 'badge':
      return 'Badge'
    case 'icon':
      return 'Icon'
    case 'quote':
      return 'Quote'
    case 'accordion':
      return 'Accordion'
    case 'tabs':
      return 'Tabs'
    case 'alert':
      return 'Alert · Callout'
    case 'embed':
      return 'Embed · Iframe'
    case 'gallery':
      return 'Gallery'
    case 'cta':
      return 'CTA Band'
    case 'table':
      return 'Table'
    case 'social':
      return 'Social Links'
    case 'hero':
      return 'Hero Section'
    case 'stats':
      return 'Stats'
    case 'testimonial':
      return 'Testimonial'
    case 'pricing':
      return 'Pricing'
    case 'faq':
      return 'FAQ Section'
    case 'split':
      return 'Image + Text'
    case 'logos':
      return 'Logo Cloud'
    case 'newsletter':
      return 'Newsletter'
    case 'steps':
      return 'Steps'
    case 'contact':
      return 'Contact Info'
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

type ListItem = { text?: unknown }

function ListItemsEditor({
  items,
  locale,
  onChange,
}: {
  items: unknown[]
  locale: BuilderLocale
  onChange: (items: ListItem[]) => void
}) {
  const normalized: ListItem[] = items.map((item) => {
    if (item && typeof item === 'object' && 'text' in item) {
      return item as ListItem
    }
    return { text: item }
  })

  const updateItem = (index: number, text: unknown) => {
    const next = normalized.map((item, i) => (i === index ? { ...item, text } : item))
    onChange(next)
  }

  const removeItem = (index: number) => {
    onChange(normalized.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...normalized, { text: 'New item' }])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          Items
        </span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))] hover:opacity-90"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      {normalized.length === 0 && (
        <p className="rounded-lg border border-dashed border-[var(--b-border)] px-2.5 py-2 text-[11px] text-[var(--b-muted)]">
          No items yet. Add one to populate the list.
        </p>
      )}
      {normalized.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-[var(--b-border)] bg-[var(--a-surface)] p-2"
        >
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[var(--b-muted)]">
              Item {index + 1}
            </span>
            <button
              type="button"
              title="Remove item"
              onClick={() => removeItem(index)}
              className="rounded p-0.5 text-[var(--b-muted)] hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <LocalizedField
            label=""
            value={item.text}
            locale={locale}
            onChange={(next) => updateItem(index, next)}
          />
        </div>
      ))}
    </div>
  )
}

function KeyedItemsEditor({
  label,
  items,
  locale,
  fields,
  createItem,
  onChange,
}: {
  label: string
  items: unknown[]
  locale: BuilderLocale
  fields: { key: string; label: string; multiline?: boolean }[]
  createItem: () => Record<string, unknown>
  onChange: (items: Record<string, unknown>[]) => void
}) {
  const normalized: Record<string, unknown>[] = items.map((item) =>
    item && typeof item === 'object' ? { ...(item as Record<string, unknown>) } : {},
  )

  const updateField = (index: number, key: string, value: unknown) => {
    onChange(
      normalized.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          {label}
        </span>
        <button
          type="button"
          onClick={() => onChange([...normalized, createItem()])}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))] hover:opacity-90"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      {normalized.length === 0 && (
        <p className="rounded-lg border border-dashed border-[var(--b-border)] px-2.5 py-2 text-[11px] text-[var(--b-muted)]">
          No items yet.
        </p>
      )}
      {normalized.map((item, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface)] p-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[var(--b-muted)]">
              #{index + 1}
            </span>
            <button
              type="button"
              title="Remove"
              onClick={() => onChange(normalized.filter((_, i) => i !== index))}
              className="rounded p-0.5 text-[var(--b-muted)] hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          {fields.map((field) => (
            <LocalizedField
              key={field.key}
              label={field.label}
              value={item[field.key]}
              locale={locale}
              multiline={field.multiline}
              onChange={(next) => updateField(index, field.key, next)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function GalleryItemsEditor({
  items,
  locale,
  onChange,
}: {
  items: unknown[]
  locale: BuilderLocale
  onChange: (items: { src?: string; alt?: unknown }[]) => void
}) {
  const normalized = items.map((item) => {
    if (item && typeof item === 'object') {
      return item as { src?: string; alt?: unknown }
    }
    return { src: '', alt: '' }
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          Images
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...normalized,
              {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                alt: 'Image',
              },
            ])
          }
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))] hover:opacity-90"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      {normalized.map((item, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface)] p-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[var(--b-muted)]">
              Image {index + 1}
            </span>
            <button
              type="button"
              title="Remove"
              onClick={() => onChange(normalized.filter((_, i) => i !== index))}
              className="rounded p-0.5 text-[var(--b-muted)] hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <ImageSourceField
            label="Image"
            value={String(item.src ?? '')}
            onChange={(url) =>
              onChange(
                normalized.map((row, i) =>
                  i === index ? { ...row, src: url } : row,
                ),
              )
            }
          />
          <LocalizedField
            label="Alt text"
            value={item.alt}
            locale={locale}
            onChange={(next) =>
              onChange(
                normalized.map((row, i) =>
                  i === index ? { ...row, alt: next } : row,
                ),
              )
            }
          />
        </div>
      ))}
    </div>
  )
}

function TableEditor({
  headers,
  rows,
  onChange,
}: {
  headers: unknown[]
  rows: unknown[][]
  onChange: (headers: string[], rows: string[][]) => void
}) {
  const h = headers.map((x) => String(x ?? ''))
  const r = rows.map((row) =>
    (Array.isArray(row) ? row : []).map((cell) => String(cell ?? '')),
  )
  const colCount = Math.max(h.length, ...r.map((row) => row.length), 1)

  const padRow = (row: string[]) => {
    const next = [...row]
    while (next.length < colCount) next.push('')
    return next.slice(0, colCount)
  }

  const setHeader = (ci: number, value: string) => {
    const next = [...h]
    while (next.length < colCount) next.push('')
    next[ci] = value
    onChange(next, r.map(padRow))
  }

  const setCell = (ri: number, ci: number, value: string) => {
    const nextRows = r.map(padRow)
    nextRows[ri] = [...nextRows[ri]]
    nextRows[ri][ci] = value
    onChange(h.length ? h : Array.from({ length: colCount }, () => ''), nextRows)
  }

  const addColumn = () => {
    onChange(
      [...(h.length ? h : Array.from({ length: colCount }, () => '')), 'Column'],
      r.map((row) => [...padRow(row), '']),
    )
  }

  const addRow = () => {
    onChange(
      h.length ? h : Array.from({ length: colCount }, (_, i) => `Col ${i + 1}`),
      [...r.map(padRow), Array.from({ length: colCount }, () => '')],
    )
  }

  const removeColumn = (ci: number) => {
    if (colCount <= 1) return
    onChange(
      h.filter((_, i) => i !== ci),
      r.map((row) => padRow(row).filter((_, i) => i !== ci)),
    )
  }

  const removeRow = (ri: number) => {
    onChange(h, r.filter((_, i) => i !== ri))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={addColumn}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))]"
        >
          <Plus className="h-3 w-3" />
          Column
        </button>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))]"
        >
          <Plus className="h-3 w-3" />
          Row
        </button>
      </div>
      <div className="space-y-1.5 overflow-x-auto">
        <div className="flex min-w-max gap-1">
          {Array.from({ length: colCount }).map((_, ci) => (
            <div key={ci} className="w-24 space-y-1">
              <input
                className="builder-input px-1.5 text-[11px]"
                value={h[ci] ?? ''}
                placeholder={`H${ci + 1}`}
                onChange={(e) => setHeader(ci, e.target.value)}
              />
              {colCount > 1 && (
                <button
                  type="button"
                  className="w-full text-[9px] text-[var(--b-muted)] hover:text-red-500"
                  onClick={() => removeColumn(ci)}
                >
                  Remove col
                </button>
              )}
            </div>
          ))}
        </div>
        {r.map((row, ri) => (
          <div key={ri} className="flex min-w-max items-center gap-1">
            {Array.from({ length: colCount }).map((_, ci) => (
              <input
                key={ci}
                className="builder-input w-24 px-1.5 text-[11px]"
                value={row[ci] ?? ''}
                onChange={(e) => setCell(ri, ci, e.target.value)}
              />
            ))}
            <button
              type="button"
              title="Remove row"
              onClick={() => removeRow(ri)}
              className="rounded p-0.5 text-[var(--b-muted)] hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const SOCIAL_PLATFORMS = [
  'twitter',
  'facebook',
  'instagram',
  'linkedin',
  'youtube',
  'mail',
  'phone',
  'link',
] as const

function SocialLinksEditor({
  links,
  onChange,
}: {
  links: unknown[]
  onChange: (links: { platform: string; url: string }[]) => void
}) {
  const normalized = links.map((item) => {
    const row = (item && typeof item === 'object' ? item : {}) as {
      platform?: unknown
      url?: unknown
    }
    return {
      platform: String(row.platform ?? 'link'),
      url: String(row.url ?? ''),
    }
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          Links
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([...normalized, { platform: 'twitter', url: 'https://' }])
          }
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))]"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      {normalized.map((link, index) => (
        <div
          key={index}
          className="flex items-start gap-1.5 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface)] p-2"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <select
              className="builder-input"
              value={link.platform}
              onChange={(e) =>
                onChange(
                  normalized.map((row, i) =>
                    i === index ? { ...row, platform: e.target.value } : row,
                  ),
                )
              }
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              className="builder-input"
              value={link.url}
              onChange={(e) =>
                onChange(
                  normalized.map((row, i) =>
                    i === index ? { ...row, url: e.target.value } : row,
                  ),
                )
              }
              placeholder="https://…"
            />
          </div>
          <button
            type="button"
            title="Remove"
            onClick={() => onChange(normalized.filter((_, i) => i !== index))}
            className="rounded p-0.5 text-[var(--b-muted)] hover:text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

function PricingPlansEditor({
  plans,
  locale,
  onChange,
}: {
  plans: unknown[]
  locale: BuilderLocale
  onChange: (plans: Record<string, unknown>[]) => void
}) {
  const normalized: Record<string, unknown>[] = plans.map((p) =>
    p && typeof p === 'object' ? { ...(p as Record<string, unknown>) } : {},
  )

  const update = (index: number, patch: Record<string, unknown>) => {
    onChange(
      normalized.map((plan, i) => (i === index ? { ...plan, ...patch } : plan)),
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          Plans
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...normalized,
              {
                name: 'New plan',
                price: '$29',
                period: '/mo',
                features: ['Feature one', 'Feature two'],
                buttonText: 'Choose plan',
                buttonHref: '#',
                highlighted: false,
              },
            ])
          }
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))]"
        >
          <Plus className="h-3 w-3" />
          Add plan
        </button>
      </div>
      {normalized.map((plan, index) => {
        const features = Array.isArray(plan.features)
          ? plan.features.map((f) => String(f ?? ''))
          : []
        return (
          <div
            key={index}
            className="space-y-2 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface)] p-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[var(--b-muted)]">
                Plan {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(normalized.filter((_, i) => i !== index))}
                className="rounded p-0.5 text-[var(--b-muted)] hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <LocalizedField
              label="Name"
              value={plan.name}
              locale={locale}
              onChange={(next) => update(index, { name: next })}
            />
            <div className="grid grid-cols-2 gap-2">
              <LocalizedField
                label="Price"
                value={plan.price}
                locale={locale}
                onChange={(next) => update(index, { price: next })}
              />
              <LocalizedField
                label="Period"
                value={plan.period}
                locale={locale}
                onChange={(next) => update(index, { period: next })}
              />
            </div>
            <LocalizedField
              label="Button text"
              value={plan.buttonText}
              locale={locale}
              onChange={(next) => update(index, { buttonText: next })}
            />
            <Field label="Button link">
              <input
                className="builder-input"
                value={String(plan.buttonHref ?? '')}
                onChange={(e) => update(index, { buttonHref: e.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-[var(--b-text)]">
              <input
                type="checkbox"
                checked={plan.highlighted === true}
                onChange={(e) => update(index, { highlighted: e.target.checked })}
                className="h-3.5 w-3.5 accent-[var(--a-primary)]"
              />
              Highlighted plan
            </label>
            <Field label="Features (one per line)">
              <textarea
                className="builder-input min-h-[72px]"
                value={features.join('\n')}
                onChange={(e) =>
                  update(index, {
                    features: e.target.value
                      .split('\n')
                      .map((line) => line.trimEnd())
                      .filter((line, i, arr) => line.length > 0 || i < arr.length - 1),
                  })
                }
              />
            </Field>
          </div>
        )
      })}
    </div>
  )
}

function LogosEditor({
  logos,
  locale,
  onChange,
}: {
  logos: unknown[]
  locale: BuilderLocale
  onChange: (logos: { src?: string; alt?: unknown; href?: string }[]) => void
}) {
  const normalized = logos.map((item) => {
    if (item && typeof item === 'object') {
      return item as { src?: string; alt?: unknown; href?: string }
    }
    return { src: '', alt: '', href: '' }
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          Logos
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...normalized,
              {
                src: 'https://placehold.co/140x48/e2e8f0/64748b?text=Logo',
                alt: 'Logo',
                href: '',
              },
            ])
          }
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))]"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      {normalized.map((logo, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface)] p-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[var(--b-muted)]">
              Logo {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(normalized.filter((_, i) => i !== index))}
              className="rounded p-0.5 text-[var(--b-muted)] hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <ImageSourceField
            label="Image"
            value={String(logo.src ?? '')}
            onChange={(url) =>
              onChange(
                normalized.map((row, i) =>
                  i === index ? { ...row, src: url } : row,
                ),
              )
            }
          />
          <LocalizedField
            label="Alt"
            value={logo.alt}
            locale={locale}
            onChange={(next) =>
              onChange(
                normalized.map((row, i) =>
                  i === index ? { ...row, alt: next } : row,
                ),
              )
            }
          />
          <Field label="Link (optional)">
            <input
              className="builder-input"
              value={String(logo.href ?? '')}
              onChange={(e) =>
                onChange(
                  normalized.map((row, i) =>
                    i === index ? { ...row, href: e.target.value } : row,
                  ),
                )
              }
            />
          </Field>
        </div>
      ))}
    </div>
  )
}

function ContactItemsEditor({
  items,
  locale,
  onChange,
}: {
  items: unknown[]
  locale: BuilderLocale
  onChange: (items: Record<string, unknown>[]) => void
}) {
  const normalized: Record<string, unknown>[] = items.map((item) =>
    item && typeof item === 'object' ? { ...(item as Record<string, unknown>) } : {},
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          Contact items
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...normalized,
              { icon: 'mail', label: 'Email', value: 'hello@example.com' },
            ])
          }
          className="inline-flex items-center gap-1 rounded-md bg-[var(--a-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--a-primary-soft-text,var(--a-primary))]"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      {normalized.map((item, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-[var(--b-border)] bg-[var(--a-surface)] p-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[var(--b-muted)]">
              Item {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(normalized.filter((_, i) => i !== index))}
              className="rounded p-0.5 text-[var(--b-muted)] hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <Field label="Icon">
            <select
              className="builder-input"
              value={String(item.icon ?? 'mail')}
              onChange={(e) =>
                onChange(
                  normalized.map((row, i) =>
                    i === index ? { ...row, icon: e.target.value } : row,
                  ),
                )
              }
            >
              <option value="mail">Mail</option>
              <option value="phone">Phone</option>
              <option value="map-pin">Map pin</option>
              <option value="clock">Clock</option>
              <option value="sparkles">Sparkles</option>
            </select>
          </Field>
          <LocalizedField
            label="Label"
            value={item.label}
            locale={locale}
            onChange={(next) =>
              onChange(
                normalized.map((row, i) =>
                  i === index ? { ...row, label: next } : row,
                ),
              )
            }
          />
          <LocalizedField
            label="Value"
            value={item.value}
            locale={locale}
            onChange={(next) =>
              onChange(
                normalized.map((row, i) =>
                  i === index ? { ...row, value: next } : row,
                ),
              )
            }
          />
        </div>
      ))}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--b-border)] bg-[var(--a-surface-2)] p-2">
      <h4 className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--b-muted)]">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[9px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
        {label}
      </span>
      {children}
    </label>
  )
}
