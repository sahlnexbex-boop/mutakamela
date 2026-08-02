import type { LucideIcon } from 'lucide-react'
import {
  Box,
  Columns2,
  Heading,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  CreditCard,
  PlayCircle,
  Minus,
  FileInput,
  Space,
  AlignLeft,
  Mail,
  Hash,
  Calendar,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Upload,
  SeparatorHorizontal,
  Link,
  List,
  Tag,
  Shapes,
  Quote,
  ListCollapse,
  LayoutPanelTop,
  AlertTriangle,
  AppWindow,
  Images,
  Megaphone,
  Table,
  Share2,
  PanelTop,
  BarChart3,
  MessageSquareQuote,
  BadgeDollarSign,
  CircleHelp,
  PanelLeft,
  Building2,
  Newspaper,
  ListOrdered,
  Contact,
} from 'lucide-react'
import type { FormFieldType, PageBlockType } from './types'

export type PaletteItem<T extends string> = {
  type: T
  label: string
  icon: LucideIcon
  description?: string
  category?: 'sections' | 'layout' | 'content' | 'media' | 'advanced'
  accent?: string
}

export const pagePalette: PaletteItem<PageBlockType>[] = [
  // Ready-made sections — fastest path to a full page
  { type: 'hero', label: 'Hero', icon: PanelTop, description: 'Title, text & CTA band', category: 'sections', accent: '#6366f1' },
  { type: 'stats', label: 'Stats', icon: BarChart3, description: 'Key metrics row', category: 'sections', accent: '#22d3ee' },
  { type: 'split', label: 'Image + Text', icon: PanelLeft, description: 'Side-by-side split', category: 'sections', accent: '#a78bfa' },
  { type: 'steps', label: 'Steps', icon: ListOrdered, description: 'How it works process', category: 'sections', accent: '#34d399' },
  { type: 'pricing', label: 'Pricing', icon: BadgeDollarSign, description: 'Pricing plan cards', category: 'sections', accent: '#fbbf24' },
  { type: 'testimonial', label: 'Testimonial', icon: MessageSquareQuote, description: 'Customer quote', category: 'sections', accent: '#f472b6' },
  { type: 'faq', label: 'FAQ', icon: CircleHelp, description: 'Questions & answers', category: 'sections', accent: '#818cf8' },
  { type: 'logos', label: 'Logo Cloud', icon: Building2, description: 'Partner / client logos', category: 'sections', accent: '#94a3b8' },
  { type: 'newsletter', label: 'Newsletter', icon: Newspaper, description: 'Email signup band', category: 'sections', accent: '#fb923c' },
  { type: 'contact', label: 'Contact Info', icon: Contact, description: 'Phone, email, address', category: 'sections', accent: '#38bdf8' },
  { type: 'cta', label: 'CTA Band', icon: Megaphone, description: 'Call-to-action banner', category: 'sections', accent: '#f97316' },

  // Layout
  { type: 'container', label: 'Container', icon: Box, description: 'Full-width section', category: 'layout', accent: '#38bdf8' },
  { type: 'row', label: 'Row', icon: Columns2, description: 'Multi-column layout', category: 'layout', accent: '#818cf8' },

  // Content
  { type: 'heading', label: 'Heading', icon: Heading, description: 'H1–H6 titles', category: 'content', accent: '#a78bfa' },
  { type: 'paragraph', label: 'Paragraph', icon: Type, description: 'Body copy', category: 'content', accent: '#c084fc' },
  { type: 'button', label: 'Button', icon: MousePointerClick, description: 'Call to action', category: 'content', accent: '#2dd4bf' },
  { type: 'link', label: 'Link', icon: Link, description: 'Text hyperlink', category: 'content', accent: '#22d3ee' },
  { type: 'list', label: 'List', icon: List, description: 'Bulleted or numbered', category: 'content', accent: '#67e8f9' },
  { type: 'badge', label: 'Badge', icon: Tag, description: 'Label pill', category: 'content', accent: '#f9a8d4' },
  { type: 'quote', label: 'Quote', icon: Quote, description: 'Blockquote', category: 'content', accent: '#c4b5fd' },
  { type: 'card', label: 'Card', icon: CreditCard, description: 'Feature card', category: 'content', accent: '#34d399' },

  // Media
  { type: 'icon', label: 'Icon', icon: Shapes, description: 'Standalone icon', category: 'media', accent: '#fcd34d' },
  { type: 'image', label: 'Image', icon: ImageIcon, description: 'Photo or graphic', category: 'media', accent: '#fb7185' },
  { type: 'video', label: 'Video', icon: PlayCircle, description: 'Embed video', category: 'media', accent: '#f472b6' },
  { type: 'gallery', label: 'Gallery', icon: Images, description: 'Multi-image grid', category: 'media', accent: '#f9a8d4' },

  // Advanced
  { type: 'separator', label: 'Divider', icon: Minus, description: 'Horizontal rule', category: 'advanced', accent: '#94a3b8' },
  { type: 'form', label: 'Form', icon: FileInput, description: 'Embed a form', category: 'advanced', accent: '#fbbf24' },
  { type: 'spacer', label: 'Spacer', icon: Space, description: 'Vertical space', category: 'advanced', accent: '#64748b' },
  { type: 'accordion', label: 'Accordion', icon: ListCollapse, description: 'Expandable panels', category: 'advanced', accent: '#a5b4fc' },
  { type: 'tabs', label: 'Tabs', icon: LayoutPanelTop, description: 'Tabbed content panels', category: 'advanced', accent: '#7dd3fc' },
  { type: 'alert', label: 'Alert', icon: AlertTriangle, description: 'Notice / callout box', category: 'advanced', accent: '#fbbf24' },
  { type: 'embed', label: 'Embed', icon: AppWindow, description: 'Iframe embed (maps, etc.)', category: 'advanced', accent: '#86efac' },
  { type: 'table', label: 'Table', icon: Table, description: 'Simple data table', category: 'advanced', accent: '#94a3b8' },
  { type: 'social', label: 'Social', icon: Share2, description: 'Social media links', category: 'advanced', accent: '#38bdf8' },
]

export const pagePaletteCategories: {
  id: NonNullable<PaletteItem<PageBlockType>['category']>
  label: string
}[] = [
  { id: 'sections', label: 'Sections' },
  { id: 'layout', label: 'Layout' },
  { id: 'content', label: 'Content' },
  { id: 'media', label: 'Media' },
  { id: 'advanced', label: 'Advanced' },
]

export function blockTypeLabel(type: PageBlockType | string): string {
  return pagePalette.find((p) => p.type === type)?.label ?? type
}

export const formFieldPalette: PaletteItem<FormFieldType>[] = [
  { type: 'short_text', label: 'Short Text', icon: AlignLeft },
  { type: 'paragraph', label: 'Paragraph', icon: Type },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'radio', label: 'Single Choice (Radio)', icon: CircleDot },
  { type: 'checkbox', label: 'Multiple Choice (Checkbox)', icon: CheckSquare },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'section_break', label: 'Section Break', icon: SeparatorHorizontal },
]
