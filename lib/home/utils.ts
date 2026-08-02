import type { PageSettings } from '@/lib/builder/types'
import { getLocalized, type BuilderLocale, type LocalizedText } from '@/lib/builder/i18n'
import {
  defaultHomeFaqs,
  defaultHomePageContent,
  defaultHomeSections,
  defaultHomeSeoSettings,
  defaultHomeStories,
} from './defaults'
import {
  HOME_SECTION_KEYS,
  type HomeFaqItem,
  type HomePageContent,
  type HomeSection,
  type HomeSectionCopy,
  type HomeSectionKey,
  type HomeStory,
} from './types'

export function isHomePageContent(value: unknown): value is HomePageContent {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return v.kind === 'home' && Array.isArray(v.sections)
}

/** Normalize any stored JSON into a complete HomePageContent */
export function normalizeHomeContent(raw: unknown): HomePageContent {
  const defaults = defaultHomePageContent()
  if (!isHomePageContent(raw)) return defaults

  const byKey = new Map<string, HomeSection>()
  for (const s of raw.sections) {
    if (s && typeof s === 'object' && typeof (s as HomeSection).key === 'string') {
      byKey.set((s as HomeSection).key, s as HomeSection)
    }
  }

  const sections: HomeSection[] = []
  const seen = new Set<HomeSectionKey>()

  // Preserve saved order first
  for (const s of raw.sections) {
    if (!s || typeof s !== 'object') continue
    const key = (s as HomeSection).key
    if (!HOME_SECTION_KEYS.includes(key as HomeSectionKey) || seen.has(key as HomeSectionKey)) {
      continue
    }
    seen.add(key as HomeSectionKey)
    const def = defaults.sections.find((d) => d.key === key)!
    sections.push(mergeSection(def, s as HomeSection))
  }

  // Append any missing default sections
  for (const key of HOME_SECTION_KEYS) {
    if (seen.has(key)) continue
    const existing = byKey.get(key)
    const def = defaults.sections.find((d) => d.key === key)!
    sections.push(existing ? mergeSection(def, existing) : { ...def, copy: { ...def.copy } })
  }

  return { version: 1, kind: 'home', sections }
}

function mergeSection(def: HomeSection, raw: HomeSection): HomeSection {
  const base: HomeSection = {
    key: def.key,
    enabled: raw.enabled !== false,
    copy: {
      ...def.copy,
      ...(raw.copy && typeof raw.copy === 'object' ? sanitizeCopy(raw.copy) : {}),
    },
  }

  if (def.key === 'testimonials') {
    const rawStories = Array.isArray(raw.stories) ? raw.stories : null
    base.stories = rawStories?.length
      ? (rawStories.map(sanitizeStory).filter(Boolean) as HomeStory[])
      : defaultHomeStories()
  }

  if (def.key === 'faq') {
    const rawFaqs = Array.isArray(raw.faqs) ? raw.faqs : null
    base.faqs = rawFaqs?.length
      ? (rawFaqs.map(sanitizeFaq).filter(Boolean) as HomeFaqItem[])
      : defaultHomeFaqs()
  }

  return base
}

function sanitizeCopy(copy: HomeSectionCopy): HomeSectionCopy {
  const next: HomeSectionCopy = {}
  if (copy.badge !== undefined) next.badge = copy.badge
  if (copy.title !== undefined) next.title = copy.title
  if (copy.titleHighlight !== undefined) next.titleHighlight = copy.titleHighlight
  if (copy.subtitle !== undefined) next.subtitle = copy.subtitle
  if (copy.ctaLabel !== undefined) next.ctaLabel = copy.ctaLabel
  if (typeof copy.ctaUrl === 'string') next.ctaUrl = copy.ctaUrl
  if (typeof copy.appStoreUrl === 'string') next.appStoreUrl = copy.appStoreUrl
  if (typeof copy.playStoreUrl === 'string') next.playStoreUrl = copy.playStoreUrl
  if (copy.scanTitle !== undefined) next.scanTitle = copy.scanTitle
  if (copy.availableOnLabel !== undefined) next.availableOnLabel = copy.availableOnLabel
  if (typeof copy.imageUrl === 'string') next.imageUrl = copy.imageUrl
  return next
}

function sanitizeStory(raw: unknown): HomeStory | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Partial<HomeStory>
  const id =
    typeof s.id === 'string' && s.id.trim()
      ? s.id.trim()
      : `story-${Math.random().toString(36).slice(2, 9)}`
  let rating = typeof s.rating === 'number' ? s.rating : 5
  if (!Number.isFinite(rating)) rating = 5
  rating = Math.min(5, Math.max(0, Math.round(rating * 10) / 10))

  return {
    id,
    name: s.name ?? { en: '' },
    role: s.role ?? { en: '' },
    quote: s.quote ?? { en: '' },
    avatar: typeof s.avatar === 'string' ? s.avatar : '/images/user_01.png',
    rating,
    enabled: s.enabled !== false,
  }
}

function sanitizeFaq(raw: unknown): HomeFaqItem | null {
  if (!raw || typeof raw !== 'object') return null
  const f = raw as Partial<HomeFaqItem>
  const id =
    typeof f.id === 'string' && f.id.trim()
      ? f.id.trim()
      : `faq-${Math.random().toString(36).slice(2, 9)}`
  return {
    id,
    question: f.question ?? { en: '' },
    answer: f.answer ?? { en: '' },
    enabled: f.enabled !== false,
  }
}

export function normalizeHomeSettings(raw: unknown): PageSettings {
  const defaults = defaultHomeSeoSettings()
  if (!raw || typeof raw !== 'object') return defaults
  const s = raw as PageSettings
  return {
    ...defaults,
    ...s,
    seoTitle: s.seoTitle ?? defaults.seoTitle,
    seoDescription: s.seoDescription ?? defaults.seoDescription,
    seoKeywords: s.seoKeywords ?? defaults.seoKeywords,
    ogImage: s.ogImage ?? defaults.ogImage,
    canonicalUrl: s.canonicalUrl ?? defaults.canonicalUrl,
    noIndex: !!s.noIndex,
    favicon: s.favicon ?? defaults.favicon,
    showHeader: s.showHeader !== false,
    showFooter: s.showFooter !== false,
  }
}

/** Resolve a localized copy field; empty string falls back to i18n via caller */
export function resolveCopy(
  value: LocalizedText | undefined,
  locale: BuilderLocale,
): string {
  return getLocalized(value, locale, '').trim()
}

export type SectionDisplayCopy = {
  badge?: string
  title?: string
  titleHighlight?: string
  subtitle?: string
  ctaLabel?: string
  ctaUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  scanTitle?: string
  availableOnLabel?: string
  imageUrl?: string
}

export type DisplayStory = {
  id: string
  name: string
  role: string
  quote: string
  avatar: string
  rating: number
}

/** Resolve enabled customer stories for public display */
export function resolveStories(
  section: HomeSection | undefined,
  locale: BuilderLocale,
): DisplayStory[] {
  const list =
    section?.stories && section.stories.length > 0
      ? section.stories
      : defaultHomeStories()

  return list
    .filter((s) => s.enabled !== false)
    .map((s) => ({
      id: s.id,
      name: resolveCopy(s.name, locale) || 'Customer',
      role: resolveCopy(s.role, locale) || '',
      quote: resolveCopy(s.quote, locale) || '',
      avatar: s.avatar?.trim() || '/images/user_01.png',
      rating: typeof s.rating === 'number' ? s.rating : 5,
    }))
    .filter((s) => s.quote || s.name)
}

export function moveStory(
  stories: HomeStory[],
  id: string,
  direction: 'up' | 'down',
): HomeStory[] {
  const idx = stories.findIndex((s) => s.id === id)
  if (idx < 0) return stories
  const target = direction === 'up' ? idx - 1 : idx + 1
  if (target < 0 || target >= stories.length) return stories
  const next = [...stories]
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

export type DisplayFaq = {
  id: string
  question: string
  answer: string
}

/** Resolve enabled FAQ items for public display */
export function resolveFaqs(
  section: HomeSection | undefined,
  locale: BuilderLocale,
): DisplayFaq[] {
  const list =
    section?.faqs && section.faqs.length > 0 ? section.faqs : defaultHomeFaqs()

  return list
    .filter((f) => f.enabled !== false)
    .map((f) => ({
      id: f.id,
      question: resolveCopy(f.question, locale) || '',
      answer: resolveCopy(f.answer, locale) || '',
    }))
    .filter((f) => f.question)
}

export function moveFaq(
  faqs: HomeFaqItem[],
  id: string,
  direction: 'up' | 'down',
): HomeFaqItem[] {
  const idx = faqs.findIndex((f) => f.id === id)
  if (idx < 0) return faqs
  const target = direction === 'up' ? idx - 1 : idx + 1
  if (target < 0 || target >= faqs.length) return faqs
  const next = [...faqs]
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

/** Resolve section copy for the active locale (empty fields omitted → UI uses i18n) */
export function resolveSectionCopy(
  section: HomeSection,
  locale: BuilderLocale,
): SectionDisplayCopy {
  const out: SectionDisplayCopy = {}
  const badge = resolveCopy(section.copy.badge, locale)
  const title = resolveCopy(section.copy.title, locale)
  const titleHighlight = resolveCopy(section.copy.titleHighlight, locale)
  const subtitle = resolveCopy(section.copy.subtitle, locale)
  const ctaLabel = resolveCopy(section.copy.ctaLabel, locale)
  const scanTitle = resolveCopy(section.copy.scanTitle, locale)
  const availableOnLabel = resolveCopy(section.copy.availableOnLabel, locale)
  const ctaUrl = section.copy.ctaUrl?.trim()
  const appStoreUrl = section.copy.appStoreUrl?.trim()
  const playStoreUrl = section.copy.playStoreUrl?.trim()
  const imageUrl = section.copy.imageUrl?.trim()
  if (badge) out.badge = badge
  if (title) out.title = title
  if (titleHighlight) out.titleHighlight = titleHighlight
  if (subtitle) out.subtitle = subtitle
  if (ctaLabel) out.ctaLabel = ctaLabel
  if (ctaUrl) out.ctaUrl = ctaUrl
  if (appStoreUrl) out.appStoreUrl = appStoreUrl
  if (playStoreUrl) out.playStoreUrl = playStoreUrl
  if (scanTitle) out.scanTitle = scanTitle
  if (availableOnLabel) out.availableOnLabel = availableOnLabel
  if (imageUrl) out.imageUrl = imageUrl
  return out
}

export function enabledOrderedSections(content: HomePageContent): HomeSection[] {
  return content.sections.filter((s) => s.enabled)
}

export function sectionCount(content: HomePageContent) {
  const total = content.sections.length
  const enabled = content.sections.filter((s) => s.enabled).length
  return { total, enabled, disabled: total - enabled }
}

export function moveSection(
  sections: HomeSection[],
  key: HomeSectionKey,
  direction: 'up' | 'down',
): HomeSection[] {
  const idx = sections.findIndex((s) => s.key === key)
  if (idx < 0) return sections
  const target = direction === 'up' ? idx - 1 : idx + 1
  if (target < 0 || target >= sections.length) return sections
  const next = [...sections]
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

export function resetSectionsToDefault(): HomeSection[] {
  return defaultHomeSections()
}
