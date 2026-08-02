'use client'

import { useState } from 'react'
import {
  getLocalized,
  setLocalized,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import { createEmptyStory } from '@/lib/home/defaults'
import type { HomeStory } from '@/lib/home/types'
import { moveStory } from '@/lib/home/utils'
import { swalAlert, swalConfirm } from '@/lib/swal'
import { ImageSourceField } from '@/components/builder/shared/image-source-field'
import { cn } from '@/lib/utils'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  MessageSquareQuote,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'

type Props = {
  stories: HomeStory[]
  locale: BuilderLocale
  onChange: (stories: HomeStory[]) => void
}

export function HomeStoriesEditor({ stories, locale, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(stories[0]?.id ?? null)

  const update = (id: string, patch: Partial<HomeStory>) => {
    onChange(stories.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const updateLocalized = (
    id: string,
    field: 'name' | 'role' | 'quote',
    value: string,
  ) => {
    const story = stories.find((s) => s.id === id)
    if (!story) return
    update(id, { [field]: setLocalized(story[field], locale, value) })
  }

  const addStory = () => {
    const story = createEmptyStory()
    onChange([...stories, story])
    setOpenId(story.id)
  }

  const removeStory = async (id: string) => {
    if (stories.length <= 1) {
      await swalAlert({
        title: 'Cannot remove',
        text: 'Keep at least one customer story, or hide the section instead.',
        icon: 'info',
      })
      return
    }
    const ok = await swalConfirm({
      title: 'Remove customer story?',
      text: 'This story will be removed from the home page after you save.',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      danger: true,
    })
    if (!ok) return
    const next = stories.filter((s) => s.id !== id)
    onChange(next)
    if (openId === id) setOpenId(next[0]?.id ?? null)
  }

  const reorder = (id: string, direction: 'up' | 'down') => {
    onChange(moveStory(stories, id, direction))
  }

  return (
    <div className="rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-3.5 sm:p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <MessageSquareQuote className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--a-muted)]">
              Customer stories
            </h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--a-text-secondary)]">
              Add, edit, hide, or reorder testimonial cards shown in the carousel.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addStory}
          className="admin-btn-primary inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          Add story
        </button>
      </div>

      <div className="space-y-2">
        {stories.map((story, index) => {
          const open = openId === story.id
          const namePreview =
            getLocalized(story.name, locale, '') ||
            getLocalized(story.name, 'en', '') ||
            `Story ${index + 1}`
          const rolePreview = getLocalized(story.role, locale, '')

          return (
            <div
              key={story.id}
              className={cn(
                'overflow-hidden rounded-xl border transition',
                open
                  ? 'border-[var(--a-primary)] shadow-sm'
                  : 'border-[var(--a-border)] bg-[var(--a-surface-2)]',
                story.enabled === false && !open && 'opacity-60',
              )}
            >
              {/* Row header */}
              <div className="flex items-stretch gap-0.5">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : story.id)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left"
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white',
                      story.enabled === false
                        ? 'bg-slate-400'
                        : 'bg-gradient-to-br from-amber-500 to-orange-600',
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold text-[var(--a-text)]">
                      {namePreview}
                    </span>
                    <span className="block truncate text-[10px] text-[var(--a-muted)]">
                      {rolePreview || 'No role'} ·{' '}
                      {story.enabled === false ? 'Hidden' : 'Visible'} ·{' '}
                      {typeof story.rating === 'number' ? story.rating : 5}★
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-[var(--a-muted)] transition',
                      open && 'rotate-180',
                    )}
                  />
                </button>

                <div className="flex flex-col justify-center gap-0.5 py-1 pr-0.5">
                  <button
                    type="button"
                    title="Move up"
                    disabled={index === 0}
                    onClick={() => reorder(story.id, 'up')}
                    className="rounded p-0.5 text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)] disabled:opacity-25"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={index === stories.length - 1}
                    onClick={() => reorder(story.id, 'down')}
                    className="rounded p-0.5 text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)] disabled:opacity-25"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                <button
                  type="button"
                  title="Remove story"
                  onClick={() => removeStory(story.id)}
                  className="mr-1.5 self-center rounded-lg p-1.5 text-[var(--a-muted)] hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Expanded editor */}
              {open && (
                <div className="space-y-3 border-t border-[var(--a-border)] bg-[var(--a-surface)] p-3 sm:p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[var(--a-primary-soft)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--a-primary-soft-text)]">
                      Editing · {locale.toUpperCase()}
                    </span>
                    <label className="flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-[var(--a-text-secondary)]">
                      <input
                        type="checkbox"
                        checked={story.enabled !== false}
                        onChange={(e) => update(story.id, { enabled: e.target.checked })}
                        className="h-3.5 w-3.5 accent-[var(--a-primary)]"
                      />
                      Show on site
                    </label>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                        Name
                      </span>
                      <input
                        className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                        value={getLocalized(story.name, locale, '')}
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        placeholder="Customer name"
                        onChange={(e) => updateLocalized(story.id, 'name', e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                        Role / product
                      </span>
                      <input
                        className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                        value={getLocalized(story.role, locale, '')}
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        placeholder="e.g. Motor Policy Holder"
                        onChange={(e) => updateLocalized(story.id, 'role', e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                      Quote
                    </span>
                    <textarea
                      className="login-input min-h-[88px] w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none transition"
                      value={getLocalized(story.quote, locale, '')}
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      placeholder="What the customer said…"
                      onChange={(e) => updateLocalized(story.id, 'quote', e.target.value)}
                    />
                  </label>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                        Rating
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.5}
                          className="login-input w-24 rounded-lg border px-3 py-2 text-sm outline-none transition"
                          value={typeof story.rating === 'number' ? story.rating : 5}
                          onChange={(e) => {
                            const n = Number(e.target.value)
                            update(story.id, {
                              rating: Number.isFinite(n)
                                ? Math.min(5, Math.max(0, n))
                                : 5,
                            })
                          }}
                        />
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-3.5 w-3.5',
                                i <= Math.round(story.rating ?? 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-transparent text-slate-300',
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </label>
                    <div className="admin-home-media min-w-0">
                      <ImageSourceField
                        label="Avatar photo"
                        value={story.avatar ?? ''}
                        onChange={(url) => update(story.id, { avatar: url })}
                        placeholder="/images/user_01.png"
                        helpText="Square photo works best."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {stories.length === 0 && (
        <p className="py-6 text-center text-xs text-[var(--a-muted)]">
          No stories yet. Add your first customer story.
        </p>
      )}
    </div>
  )
}
