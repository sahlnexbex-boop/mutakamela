'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { PageDocument } from '@/components/builder/page/block-renderer'
import I18nProvider from '@/components/i18n-provider'
import { mediaUrl } from '@/lib/api/media.api'
import { pagesApi } from '@/lib/api/pages.api'
import { ApiError } from '@/lib/api/types'
import {
  pageShowsFooter,
  pageShowsHeader,
} from '@/lib/builder/defaults'
import {
  getLocalized,
  toBuilderLocale,
  type BuilderLocale,
} from '@/lib/builder/i18n'
import type { PageDetail, PageSettings } from '@/lib/builder/types'
import { normalizePageContent } from '@/lib/builder/utils'

export default function PublicPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <I18nProvider>
      <PublicPageInner params={params} />
    </I18nProvider>
  )
}

function PublicPageInner({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { i18n } = useTranslation()
  const locale = toBuilderLocale(i18n.language)
  const [page, setPage] = useState<PageDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await pagesApi.getPublic(slug)
        if (!cancelled) setPage(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Page not found')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!page) return
    applySeo(page.title, page.slug, page.settings, locale)
  }, [page, locale])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading…
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-slate-50">
        <p className="text-sm font-semibold text-slate-700">{error || 'Page not found'}</p>
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          Back home
        </Link>
      </div>
    )
  }

  // Marketing home is managed at `/admin/home-page` and rendered on `/`
  const contentRaw = page.content as { kind?: string } | null
  if (page.slug === 'home' || contentRaw?.kind === 'home') {
    if (typeof window !== 'undefined') {
      window.location.replace('/')
    }
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50 text-sm text-slate-500">
        Redirecting to home…
      </div>
    )
  }

  const blocks = normalizePageContent(page.content).blocks
  const showHeader = pageShowsHeader(page.settings)
  const showFooter = pageShowsFooter(page.settings)

  return (
    <main className="min-h-svh bg-white">
      <PageDocument
        blocks={blocks}
        editable={false}
        showHeader={showHeader}
        showFooter={showFooter}
        locale={locale}
      />
    </main>
  )
}

function applySeo(
  pageTitle: string,
  pageSlug: string,
  settings: PageSettings | null,
  locale: BuilderLocale,
) {
  const s = settings ?? {}
  const title =
    getLocalized(s.seoTitle, locale, '').trim() || pageTitle
  document.title = title

  setMeta('description', getLocalized(s.seoDescription, locale, ''))
  setMeta('keywords', getLocalized(s.seoKeywords, locale, ''))
  setMeta('robots', s.noIndex ? 'noindex, nofollow' : 'index, follow')

  setMetaProperty('og:title', title)
  setMetaProperty('og:description', getLocalized(s.seoDescription, locale, ''))
  if (s.ogImage) setMetaProperty('og:image', mediaUrl(s.ogImage))
  setMetaProperty('og:type', 'website')
  setMetaProperty('og:locale', locale === 'ar' ? 'ar_SA' : 'en_US')

  const canonical = s.canonicalUrl?.trim() || `${window.location.origin}/p/${pageSlug}`
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = canonical

  if (s.favicon) {
    let icon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
    if (!icon) {
      icon = document.createElement('link')
      icon.rel = 'icon'
      document.head.appendChild(icon)
    }
    icon.href = mediaUrl(s.favicon)
  }
}

function setMeta(name: string, content: string) {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.name = name
    document.head.appendChild(el)
  }
  el.content = content
}

function setMetaProperty(property: string, content: string) {
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.content = content
}
