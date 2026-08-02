/** Marketing home page (public `/`) section CMS model */

import type { LocalizedText } from '@/lib/builder/i18n'
import type { PageSettings } from '@/lib/builder/types'

export const HOME_SECTION_KEYS = [
  'hero',
  'quick-actions',
  'products',
  'why-us',
  'claim-services',
  'how-it-works',
  'app-experience',
  'testimonials',
  'faq',
] as const

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number]

/** Editable copy for a marketing section (empty = fall back to i18n defaults) */
export type HomeSectionCopy = {
  badge?: LocalizedText
  title?: LocalizedText
  titleHighlight?: LocalizedText
  subtitle?: LocalizedText
  ctaLabel?: LocalizedText
  /** Primary download CTA href (App Experience) */
  ctaUrl?: string
  /** App Store listing URL */
  appStoreUrl?: string
  /** Google Play listing URL */
  playStoreUrl?: string
  /** “Scan to download…” card title */
  scanTitle?: LocalizedText
  /** “Available on” label under scan card */
  availableOnLabel?: LocalizedText
  imageUrl?: string
}

/** Customer story card (Testimonials section) */
export type HomeStory = {
  id: string
  name: LocalizedText
  role: LocalizedText
  quote: LocalizedText
  avatar?: string
  /** 0–5, default 5 */
  rating?: number
  enabled?: boolean
}

/** FAQ accordion item */
export type HomeFaqItem = {
  id: string
  question: LocalizedText
  answer: LocalizedText
  enabled?: boolean
}

export type HomeSection = {
  key: HomeSectionKey
  enabled: boolean
  copy: HomeSectionCopy
  /** Customer stories — used by testimonials section */
  stories?: HomeStory[]
  /** FAQ items — used by faq section */
  faqs?: HomeFaqItem[]
}

export type HomePageContent = {
  version: 1
  kind: 'home'
  sections: HomeSection[]
}

export type HomeSeoSettings = PageSettings

export type HomeSectionMeta = {
  key: HomeSectionKey
  label: string
  description: string
  accent: string
}
