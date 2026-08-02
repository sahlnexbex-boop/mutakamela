import { mediaUrl } from '@/lib/api/media.api'
import { getLocalized, type BuilderLocale } from '@/lib/builder/i18n'
import type { PageSettings } from '@/lib/builder/types'

/** Apply home / page SEO tags in the browser (client-side public pages) */
export function applyPageSeo(
  pageTitle: string,
  path: string,
  settings: PageSettings | null | undefined,
  locale: BuilderLocale,
) {
  const s = settings ?? {}
  const title = getLocalized(s.seoTitle, locale, '').trim() || pageTitle
  document.title = title

  setMeta('description', getLocalized(s.seoDescription, locale, ''))
  setMeta('keywords', getLocalized(s.seoKeywords, locale, ''))
  setMeta('robots', s.noIndex ? 'noindex, nofollow' : 'index, follow')

  setMetaProperty('og:title', title)
  setMetaProperty('og:description', getLocalized(s.seoDescription, locale, ''))
  if (s.ogImage) setMetaProperty('og:image', mediaUrl(s.ogImage))
  setMetaProperty('og:type', 'website')
  setMetaProperty('og:locale', locale === 'ar' ? 'ar_SA' : 'en_US')

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const canonical = s.canonicalUrl?.trim() || `${origin}${path}`
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
