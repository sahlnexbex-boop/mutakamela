/** Shared visual builder types (page + form) */

export type { BuilderLocale, LocalizedText } from './i18n'

export type SpacingBox = {
  top: number
  right: number
  bottom: number
  left: number
}

export type BlockStyles = {
  padding?: Partial<SpacingBox>
  margin?: Partial<SpacingBox>
  background?: string
  color?: string
  fontSize?: number
  fontWeight?: number | string
  textAlign?: 'left' | 'center' | 'right'
  borderRadius?: number
  width?: string
  maxWidth?: string
}

export type PageBlockType =
  | 'container'
  | 'row'
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'link'
  | 'list'
  | 'badge'
  | 'icon'
  | 'quote'
  | 'image'
  | 'card'
  | 'video'
  | 'separator'
  | 'form'
  | 'spacer'
  | 'accordion'
  | 'tabs'
  | 'alert'
  | 'embed'
  | 'gallery'
  | 'cta'
  | 'table'
  | 'social'
  | 'hero'
  | 'stats'
  | 'testimonial'
  | 'pricing'
  | 'faq'
  | 'split'
  | 'logos'
  | 'newsletter'
  | 'steps'
  | 'contact'

export type PageBlock = {
  id: string
  type: PageBlockType
  props: Record<string, unknown>
  styles: BlockStyles
  children?: PageBlock[]
}

export type PageContent = {
  version: number
  blocks: PageBlock[]
}

export type PageSettings = {
  /** May be plain string (EN) or { en, ar } */
  seoTitle?: import('./i18n').LocalizedText
  seoDescription?: import('./i18n').LocalizedText
  seoKeywords?: import('./i18n').LocalizedText
  ogImage?: string
  canonicalUrl?: string
  noIndex?: boolean
  favicon?: string
  /** Include public marketing site navbar (default: true) */
  showHeader?: boolean
  /** Include public marketing site footer (default: true) */
  showFooter?: boolean
  /**
   * When true and the page is published, add a link in the public site header menu.
   * Default: false (opt-in).
   */
  showInHeaderMenu?: boolean
  /** Optional bilingual label for the header link (falls back to page title). */
  headerMenuLabel?: import('./i18n').LocalizedText
  /** Sort order among header menu links (lower first). Default: 0. */
  headerMenuOrder?: number
}

/** Lightweight public nav item for CMS pages linked into the header. */
export type HeaderMenuItem = {
  id: number
  title: string
  slug: string
  label: import('./i18n').LocalizedText | null
  order: number
}

export type PageStatus = 'draft' | 'published'

export type PageListItem = {
  id: number
  title: string
  slug: string
  status: PageStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PageDetail = PageListItem & {
  content: PageContent
  settings: PageSettings | null
  createdById: number | null
}

/* ── Form builder ── */

export type FormFieldType =
  | 'short_text'
  | 'paragraph'
  | 'email'
  | 'number'
  | 'date'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'file'
  | 'section_break'

export type FormFieldOption = {
  /** May be plain string (EN) or { en, ar } */
  label: import('./i18n').LocalizedText
  value: string
}

export type FormField = {
  id: string
  type: FormFieldType
  /** May be plain string (EN) or { en, ar } */
  label: import('./i18n').LocalizedText
  placeholder?: import('./i18n').LocalizedText
  required?: boolean
  width?: 'full' | 'half'
  options?: FormFieldOption[]
  validation?: {
    min?: number | string
    max?: number | string
    pattern?: string
  }
  helpText?: import('./i18n').LocalizedText
}

export type FormSection = {
  id: string
  /** May be plain string (EN) or { en, ar } */
  title: import('./i18n').LocalizedText
  fields: FormField[]
}

export type FormSchema = {
  version: number
  sections: FormSection[]
}

/** Advanced: email all submission field data to configured recipients */
export type FormEmailNotification = {
  /** When true, each submission is emailed with form field data */
  enabled: boolean
  /** Comma-separated recipient addresses */
  to: string
  /** Optional CC addresses (comma-separated) */
  cc?: string
  /** Email subject; supports {formTitle} placeholder */
  subject?: string
  /**
   * Include every submitted field (label + value) in the message body.
   * Defaults to true when omitted.
   */
  includeAllFields?: boolean
  /**
   * Optional form field id whose value is used as Reply-To
   * (e.g. the submitter's email field).
   */
  replyToFieldId?: string
}

/** Advanced: store each submission as a row in a Google Sheet */
export type FormGoogleSheet = {
  /** When true, each submission is appended to the configured spreadsheet */
  enabled: boolean
  /**
   * Spreadsheet id or full Google Sheets URL
   * (https://docs.google.com/spreadsheets/d/{id}/edit)
   */
  spreadsheetId: string
  /** Tab / sheet name (default Sheet1) */
  sheetName?: string
  /** Prepend ISO timestamp column (default true) */
  includeTimestamp?: boolean
  /** Prepend submission id column (default true) */
  includeSubmissionId?: boolean
}

export type FormSettings = {
  submitLabel?: import('./i18n').LocalizedText
  successMessage?: import('./i18n').LocalizedText
  redirectUrl?: string
  /** Advanced: send submission data by email */
  emailNotification?: FormEmailNotification
  /** Advanced: append submission data to a Google Sheet */
  googleSheet?: FormGoogleSheet
}

export type FormStatus = 'draft' | 'published'

export type FormListItem = {
  id: number
  title: string
  slug: string
  status: FormStatus
  description: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  submissionCount?: number
}

export type FormDetail = FormListItem & {
  schema: FormSchema
  settings: FormSettings | null
  createdById: number | null
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'
