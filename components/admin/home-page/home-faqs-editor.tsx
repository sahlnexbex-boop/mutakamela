'use client'

import { useState } from 'react'
import {
  getLocalized,
  setLocalized,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import { createEmptyFaq } from '@/lib/home/defaults'
import type { HomeFaqItem } from '@/lib/home/types'
import { moveFaq } from '@/lib/home/utils'
import { swalAlert, swalConfirm } from '@/lib/swal'
import { cn } from '@/lib/utils'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  CircleHelp,
  Plus,
  Trash2,
} from 'lucide-react'

type Props = {
  faqs: HomeFaqItem[]
  locale: BuilderLocale
  onChange: (faqs: HomeFaqItem[]) => void
}

export function HomeFaqsEditor({ faqs, locale, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  const update = (id: string, patch: Partial<HomeFaqItem>) => {
    onChange(faqs.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const updateLocalized = (
    id: string,
    field: 'question' | 'answer',
    value: string,
  ) => {
    const item = faqs.find((f) => f.id === id)
    if (!item) return
    update(id, { [field]: setLocalized(item[field], locale, value) })
  }

  const addFaq = () => {
    const item = createEmptyFaq()
    onChange([...faqs, item])
    setOpenId(item.id)
  }

  const removeFaq = async (id: string) => {
    if (faqs.length <= 1) {
      await swalAlert({
        title: 'Cannot remove',
        text: 'Keep at least one FAQ item, or hide the section instead.',
        icon: 'info',
      })
      return
    }
    const ok = await swalConfirm({
      title: 'Remove FAQ item?',
      text: 'This question will be removed from the home page after you save.',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      danger: true,
    })
    if (!ok) return
    const next = faqs.filter((f) => f.id !== id)
    onChange(next)
    if (openId === id) setOpenId(next[0]?.id ?? null)
  }

  const reorder = (id: string, direction: 'up' | 'down') => {
    onChange(moveFaq(faqs, id, direction))
  }

  return (
    <div className="rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-3.5 sm:p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
            <CircleHelp className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--a-muted)]">
              FAQ items
            </h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--a-text-secondary)]">
              Add, edit, hide, or reorder questions in the public accordion.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="admin-btn-primary inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          Add FAQ
        </button>
      </div>

      <div className="space-y-2">
        {faqs.map((item, index) => {
          const open = openId === item.id
          const qPreview =
            getLocalized(item.question, locale, '') ||
            getLocalized(item.question, 'en', '') ||
            `Question ${index + 1}`
          const aPreview = getLocalized(item.answer, locale, '')

          return (
            <div
              key={item.id}
              className={cn(
                'overflow-hidden rounded-xl border transition',
                open
                  ? 'border-[var(--a-primary)] shadow-sm'
                  : 'border-[var(--a-border)] bg-[var(--a-surface-2)]',
                item.enabled === false && !open && 'opacity-60',
              )}
            >
              <div className="flex items-stretch gap-0.5">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left"
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white',
                      item.enabled === false
                        ? 'bg-slate-400'
                        : 'bg-gradient-to-br from-indigo-500 to-violet-600',
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold text-[var(--a-text)]">
                      {qPreview}
                    </span>
                    <span className="block truncate text-[10px] text-[var(--a-muted)]">
                      {item.enabled === false ? 'Hidden' : 'Visible'}
                      {aPreview ? ` · ${aPreview.slice(0, 48)}${aPreview.length > 48 ? '…' : ''}` : ''}
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
                    onClick={() => reorder(item.id, 'up')}
                    className="rounded p-0.5 text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)] disabled:opacity-25"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={index === faqs.length - 1}
                    onClick={() => reorder(item.id, 'down')}
                    className="rounded p-0.5 text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-text)] disabled:opacity-25"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                <button
                  type="button"
                  title="Remove FAQ"
                  onClick={() => removeFaq(item.id)}
                  className="mr-1.5 self-center rounded-lg p-1.5 text-[var(--a-muted)] hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {open && (
                <div className="space-y-3 border-t border-[var(--a-border)] bg-[var(--a-surface)] p-3 sm:p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[var(--a-primary-soft)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--a-primary-soft-text)]">
                      Editing · {locale.toUpperCase()}
                    </span>
                    <label className="flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-[var(--a-text-secondary)]">
                      <input
                        type="checkbox"
                        checked={item.enabled !== false}
                        onChange={(e) => update(item.id, { enabled: e.target.checked })}
                        className="h-3.5 w-3.5 accent-[var(--a-primary)]"
                      />
                      Show on site
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                      Question
                    </span>
                    <input
                      className="login-input w-full rounded-lg border px-3 py-2 text-sm outline-none transition"
                      value={getLocalized(item.question, locale, '')}
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      placeholder="e.g. How do I file a claim?"
                      onChange={(e) =>
                        updateLocalized(item.id, 'question', e.target.value)
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--a-muted)]">
                      Answer
                    </span>
                    <textarea
                      className="login-input min-h-[100px] w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none transition"
                      value={getLocalized(item.answer, locale, '')}
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      placeholder="Write a clear, helpful answer…"
                      onChange={(e) =>
                        updateLocalized(item.id, 'answer', e.target.value)
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {faqs.length === 0 && (
        <p className="py-6 text-center text-xs text-[var(--a-muted)]">
          No FAQ items yet. Add your first question.
        </p>
      )}
    </div>
  )
}
