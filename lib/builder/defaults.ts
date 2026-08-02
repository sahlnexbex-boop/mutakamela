import type { FormSchema, FormSettings, PageBlock, PageContent, PageSettings } from './types'
import { createId } from './utils'

export function defaultPageContent(): PageContent {
  return {
    version: 1,
    blocks: [
      {
        id: 'hero-1',
        type: 'container',
        props: {
          backgroundImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
          backgroundOverlay: 'rgba(15, 23, 42, 0.45)',
          minHeight: '420px',
          align: 'center',
        },
        styles: {
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
          textAlign: 'center',
        },
        children: [
          {
            id: 'hero-heading',
            type: 'heading',
            props: { text: 'Welcome to Our Page Builder', level: 1 },
            styles: {
              color: '#ffffff',
              fontSize: 42,
              fontWeight: 700,
              margin: { top: 0, right: 0, bottom: 12, left: 0 },
            },
          },
          {
            id: 'hero-sub',
            type: 'paragraph',
            props: { text: 'Subheading for some of customers, and horien.' },
            styles: {
              color: 'rgba(255,255,255,0.88)',
              fontSize: 18,
              margin: { top: 0, right: 0, bottom: 28, left: 0 },
            },
          },
          {
            id: 'hero-btn',
            type: 'button',
            props: { text: 'Get Started', href: '#contact', variant: 'primary' },
            styles: {
              padding: { top: 12, right: 28, bottom: 12, left: 28 },
            },
          },
        ],
      },
      {
        id: 'features-row',
        type: 'row',
        props: { columns: 3, gap: 24, title: 'Our Features' },
        styles: {
          padding: { top: 56, right: 24, bottom: 56, left: 24 },
          background: '#ffffff',
        },
        children: [
          {
            id: 'feat-1',
            type: 'card',
            props: {
              icon: 'gauge',
              title: 'Fast Performance',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy nibh.',
            },
            styles: {},
          },
          {
            id: 'feat-2',
            type: 'card',
            props: {
              icon: 'mouse-pointer-click',
              title: 'Easy Drag & Drop',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy nibh.',
            },
            styles: {},
          },
          {
            id: 'feat-3',
            type: 'card',
            props: {
              icon: 'monitor-smartphone',
              title: 'Responsive Design',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy nibh.',
            },
            styles: {},
          },
        ],
      },
    ],
  }
}

export function defaultPageSettings(): PageSettings {
  return {
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: '',
    canonicalUrl: '',
    noIndex: false,
    favicon: '',
    showHeader: true,
    showFooter: true,
    showInHeaderMenu: false,
    headerMenuLabel: '',
    headerMenuOrder: 0,
  }
}

/** Header/footer default on unless explicitly disabled */
export function pageShowsHeader(settings?: PageSettings | null): boolean {
  return settings?.showHeader !== false
}

export function pageShowsFooter(settings?: PageSettings | null): boolean {
  return settings?.showFooter !== false
}

export function defaultFormSchema(): FormSchema {
  return {
    version: 1,
    sections: [
      {
        id: 'sec-personal',
        title: '1. Personal Information',
        fields: [
          {
            id: 'first-name',
            type: 'short_text',
            label: 'First Name',
            placeholder: 'First Name',
            required: true,
            width: 'half',
          },
          {
            id: 'last-name',
            type: 'short_text',
            label: 'Last Name',
            placeholder: 'Last Name',
            required: true,
            width: 'half',
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Email',
            required: true,
            width: 'half',
          },
          {
            id: 'phone',
            type: 'number',
            label: 'Phone Number',
            placeholder: 'Phone Number',
            required: false,
            width: 'half',
          },
          {
            id: 'email-alt',
            type: 'email',
            label: 'Email',
            placeholder: 'Email',
            required: false,
            width: 'half',
          },
          {
            id: 'state',
            type: 'dropdown',
            label: 'State',
            placeholder: 'State',
            required: true,
            width: 'half',
            options: [
              { label: 'California', value: 'california' },
              { label: 'New York', value: 'new-york' },
              { label: 'New Jersey', value: 'new-jersey' },
              { label: 'Washington', value: 'washington' },
              { label: 'Wellington', value: 'wellington' },
            ],
          },
        ],
      },
      {
        id: 'sec-address',
        title: '2. Address Details',
        fields: [
          {
            id: 'addr-state',
            type: 'dropdown',
            label: 'State',
            placeholder: 'State',
            required: false,
            width: 'half',
            options: [
              { label: 'California', value: 'california' },
              { label: 'New York', value: 'new-york' },
              { label: 'Texas', value: 'texas' },
            ],
          },
        ],
      },
    ],
  }
}

export function defaultFormSettings(): FormSettings {
  return {
    submitLabel: 'Submit',
    successMessage: 'Thank you! Your response has been recorded.',
    redirectUrl: '',
    emailNotification: {
      enabled: false,
      to: '',
      cc: '',
      subject: 'New submission: {formTitle}',
      includeAllFields: true,
      replyToFieldId: '',
    },
    googleSheet: {
      enabled: false,
      spreadsheetId: '',
      sheetName: 'Sheet1',
      includeTimestamp: true,
      includeSubmissionId: true,
    },
  }
}

export function createBlock(type: PageBlock['type']): PageBlock {
  const id = createId(type)
  switch (type) {
    case 'container':
      return {
        id,
        type,
        props: { minHeight: '200px', align: 'center' },
        styles: { padding: { top: 40, right: 24, bottom: 40, left: 24 } },
        children: [],
      }
    case 'row':
      return {
        id,
        type,
        props: { columns: 2, gap: 16, title: 'Row' },
        styles: { padding: { top: 24, right: 16, bottom: 24, left: 16 } },
        children: [],
      }
    case 'heading':
      return {
        id,
        type,
        props: { text: 'New Heading', level: 2 },
        styles: { fontSize: 28, fontWeight: 700, margin: { top: 0, right: 0, bottom: 12, left: 0 } },
      }
    case 'paragraph':
      return {
        id,
        type,
        props: { text: 'Write your paragraph text here…' },
        styles: { fontSize: 16, color: '#475569', margin: { top: 0, right: 0, bottom: 12, left: 0 } },
      }
    case 'button':
      return {
        id,
        type,
        props: {
          text: 'Click Me',
          href: '#',
          variant: 'primary',
          size: 'md',
          fullWidth: false,
          openInNewTab: false,
        },
        // Padding comes from size variants on the button element itself
        styles: { margin: { top: 0, right: 0, bottom: 8, left: 0 } },
      }
    case 'link':
      return {
        id,
        type,
        props: {
          text: 'Learn more',
          href: '#',
          openInNewTab: false,
          underline: true,
        },
        styles: {
          color: 'var(--a-primary, #6366f1)',
          fontSize: 16,
          margin: { top: 0, right: 0, bottom: 8, left: 0 },
        },
      }
    case 'list':
      return {
        id,
        type,
        props: {
          style: 'bullet',
          items: [
            { text: 'First item' },
            { text: 'Second item' },
            { text: 'Third item' },
          ],
        },
        styles: {
          fontSize: 16,
          color: '#475569',
          margin: { top: 0, right: 0, bottom: 12, left: 0 },
        },
      }
    case 'badge':
      return {
        id,
        type,
        props: { text: 'New', variant: 'primary' },
        styles: {},
      }
    case 'icon':
      return {
        id,
        type,
        props: { icon: 'sparkles', size: 32 },
        styles: {
          color: 'var(--a-primary, #6366f1)',
          margin: { top: 0, right: 0, bottom: 8, left: 0 },
        },
      }
    case 'quote':
      return {
        id,
        type,
        props: {
          text: 'A memorable quote that captures your message.',
          cite: '',
        },
        styles: {
          fontSize: 18,
          color: '#334155',
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
          padding: { top: 16, right: 20, bottom: 16, left: 20 },
          background: '#f8fafc',
          borderRadius: 12,
        },
      }
    case 'image':
      return {
        id,
        type,
        props: {
          src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          alt: 'Image',
        },
        styles: { borderRadius: 12 },
      }
    case 'card':
      return {
        id,
        type,
        props: {
          icon: 'sparkles',
          title: 'Card Title',
          description: 'Short description for this feature card.',
        },
        styles: {},
      }
    case 'video':
      return {
        id,
        type,
        props: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Video' },
        styles: { borderRadius: 12 },
      }
    case 'separator':
      return {
        id,
        type,
        props: { style: 'solid' },
        styles: { margin: { top: 16, right: 0, bottom: 16, left: 0 } },
      }
    case 'form':
      return {
        id,
        type,
        props: { formSlug: '', title: 'Embedded Form' },
        styles: { padding: { top: 24, right: 16, bottom: 24, left: 16 } },
      }
    case 'spacer':
      return {
        id,
        type,
        props: { height: 40 },
        styles: {},
      }
    case 'accordion':
      return {
        id,
        type,
        props: {
          items: [
            {
              title: 'What is this section about?',
              body: 'Add a short answer. Visitors can expand each panel.',
            },
            {
              title: 'How do I get started?',
              body: 'Explain the next step clearly and keep it concise.',
            },
            {
              title: 'Who can I contact?',
              body: 'Share support channels or a contact link.',
            },
          ],
          allowMultiple: false,
        },
        styles: {
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
        },
      }
    case 'tabs':
      return {
        id,
        type,
        props: {
          tabs: [
            { label: 'Overview', content: 'Overview content goes here.' },
            { label: 'Details', content: 'More details and specifications.' },
            { label: 'FAQ', content: 'Common questions and answers.' },
          ],
        },
        styles: {
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
        },
      }
    case 'alert':
      return {
        id,
        type,
        props: {
          variant: 'info',
          title: 'Good to know',
          text: 'This is a callout message. Use it for tips, warnings, or announcements.',
        },
        styles: {
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
          borderRadius: 12,
        },
      }
    case 'embed':
      return {
        id,
        type,
        props: {
          url: 'https://www.openstreetmap.org/export/embed.html?bbox=46.6,24.6,46.8,24.8&layer=mapnik',
          title: 'Map embed',
          height: 360,
          aspectRatio: '',
        },
        styles: {
          borderRadius: 12,
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
        },
      }
    case 'gallery':
      return {
        id,
        type,
        props: {
          columns: 3,
          gap: 12,
          images: [
            {
              src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
              alt: 'Gallery image 1',
            },
            {
              src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
              alt: 'Gallery image 2',
            },
            {
              src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
              alt: 'Gallery image 3',
            },
          ],
        },
        styles: {
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
        },
      }
    case 'cta':
      return {
        id,
        type,
        props: {
          title: 'Ready to get started?',
          description: 'Join thousands of customers who trust us with their coverage.',
          buttonText: 'Contact us',
          buttonHref: '#contact',
          openInNewTab: false,
          align: 'center',
        },
        styles: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          padding: { top: 48, right: 32, bottom: 48, left: 32 },
          borderRadius: 16,
          textAlign: 'center',
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
      }
    case 'table':
      return {
        id,
        type,
        props: {
          headers: ['Feature', 'Basic', 'Pro'],
          rows: [
            ['Users', '1', 'Unlimited'],
            ['Storage', '5 GB', '100 GB'],
            ['Support', 'Email', 'Priority'],
          ],
          striped: true,
        },
        styles: {
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
          borderRadius: 12,
        },
      }
    case 'social':
      return {
        id,
        type,
        props: {
          links: [
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' },
          ],
          size: 36,
        },
        styles: {
          margin: { top: 8, right: 0, bottom: 8, left: 0 },
          textAlign: 'center',
        },
      }
    case 'hero':
      return {
        id,
        type,
        props: {
          eyebrow: 'Welcome',
          title: 'Build beautiful pages faster',
          subtitle:
            'Drop ready-made sections, customize the copy, and publish in minutes.',
          buttonText: 'Get started',
          buttonHref: '#',
          secondaryButtonText: 'Learn more',
          secondaryButtonHref: '#features',
          backgroundImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
          backgroundOverlay: 'rgba(15, 23, 42, 0.5)',
          minHeight: '420px',
          openInNewTab: false,
        },
        styles: {
          textAlign: 'center',
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
          color: '#ffffff',
        },
      }
    case 'stats':
      return {
        id,
        type,
        props: {
          title: 'Trusted by teams everywhere',
          items: [
            { value: '10k+', label: 'Customers' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
            { value: '50+', label: 'Countries' },
          ],
        },
        styles: {
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
          background: '#ffffff',
          textAlign: 'center',
        },
      }
    case 'testimonial':
      return {
        id,
        type,
        props: {
          quote:
            'This product completely transformed how we work. Setup was simple and the results were immediate.',
          name: 'Sarah Ahmed',
          role: 'Head of Operations',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
        },
        styles: {
          padding: { top: 40, right: 24, bottom: 40, left: 24 },
          background: '#f8fafc',
          borderRadius: 16,
          textAlign: 'center',
        },
      }
    case 'pricing':
      return {
        id,
        type,
        props: {
          title: 'Simple, transparent pricing',
          subtitle: 'Choose the plan that fits your team.',
          plans: [
            {
              name: 'Starter',
              price: '$19',
              period: '/mo',
              features: ['1 project', 'Basic analytics', 'Email support'],
              buttonText: 'Choose Starter',
              buttonHref: '#',
              highlighted: false,
            },
            {
              name: 'Pro',
              price: '$49',
              period: '/mo',
              features: [
                'Unlimited projects',
                'Advanced analytics',
                'Priority support',
              ],
              buttonText: 'Choose Pro',
              buttonHref: '#',
              highlighted: true,
            },
            {
              name: 'Business',
              price: '$99',
              period: '/mo',
              features: ['Everything in Pro', 'SSO', 'Dedicated manager'],
              buttonText: 'Contact sales',
              buttonHref: '#',
              highlighted: false,
            },
          ],
        },
        styles: {
          padding: { top: 56, right: 24, bottom: 56, left: 24 },
          background: '#ffffff',
          textAlign: 'center',
        },
      }
    case 'faq':
      return {
        id,
        type,
        props: {
          title: 'Frequently asked questions',
          subtitle: 'Everything you need to know before getting started.',
          items: [
            {
              title: 'How do I get started?',
              body: 'Create a page, drop a section from the palette, edit the text, and publish when ready.',
            },
            {
              title: 'Can I customize styles?',
              body: 'Yes. Select any block and use the properties panel for spacing, colors, and typography.',
            },
            {
              title: 'Is Arabic supported?',
              body: 'Most text fields support English and Arabic so you can build bilingual pages.',
            },
          ],
          allowMultiple: false,
        },
        styles: {
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
          background: '#ffffff',
        },
      }
    case 'split':
      return {
        id,
        type,
        props: {
          imageSrc:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80',
          imageAlt: 'Feature image',
          imagePosition: 'left',
          eyebrow: 'Featured',
          title: 'A better way to present your product',
          body: 'Combine a strong visual with clear messaging. Perfect for product highlights, about sections, and story blocks.',
          buttonText: 'Explore more',
          buttonHref: '#',
          openInNewTab: false,
        },
        styles: {
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
          background: '#ffffff',
        },
      }
    case 'logos':
      return {
        id,
        type,
        props: {
          title: 'Trusted by leading brands',
          logos: [
            {
              src: 'https://placehold.co/140x48/e2e8f0/64748b?text=Brand+A',
              alt: 'Brand A',
              href: '',
            },
            {
              src: 'https://placehold.co/140x48/e2e8f0/64748b?text=Brand+B',
              alt: 'Brand B',
              href: '',
            },
            {
              src: 'https://placehold.co/140x48/e2e8f0/64748b?text=Brand+C',
              alt: 'Brand C',
              href: '',
            },
            {
              src: 'https://placehold.co/140x48/e2e8f0/64748b?text=Brand+D',
              alt: 'Brand D',
              href: '',
            },
          ],
        },
        styles: {
          padding: { top: 40, right: 24, bottom: 40, left: 24 },
          background: '#f8fafc',
          textAlign: 'center',
        },
      }
    case 'newsletter':
      return {
        id,
        type,
        props: {
          title: 'Stay in the loop',
          description: 'Get product updates and tips delivered to your inbox.',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
          note: 'No spam. Unsubscribe anytime.',
        },
        styles: {
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          textAlign: 'center',
          borderRadius: 16,
        },
      }
    case 'steps':
      return {
        id,
        type,
        props: {
          title: 'How it works',
          subtitle: 'Three simple steps to get value fast.',
          items: [
            {
              title: 'Create a page',
              description: 'Start from a blank canvas or drop a ready section.',
            },
            {
              title: 'Customize content',
              description: 'Edit text, images, and styles in the properties panel.',
            },
            {
              title: 'Publish',
              description: 'Go live and share your page with the world.',
            },
          ],
        },
        styles: {
          padding: { top: 56, right: 24, bottom: 56, left: 24 },
          background: '#ffffff',
          textAlign: 'center',
        },
      }
    case 'contact':
      return {
        id,
        type,
        props: {
          title: 'Get in touch',
          subtitle: 'We are here to help with any questions.',
          items: [
            { icon: 'mail', label: 'Email', value: 'hello@example.com' },
            { icon: 'phone', label: 'Phone', value: '+966 11 000 0000' },
            {
              icon: 'map-pin',
              label: 'Address',
              value: 'Riyadh, Saudi Arabia',
            },
            { icon: 'clock', label: 'Hours', value: 'Sun–Thu, 9am–6pm' },
          ],
        },
        styles: {
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
          background: '#ffffff',
          textAlign: 'center',
        },
      }
    default:
      return { id, type: 'paragraph', props: { text: '' }, styles: {} }
  }
}

export function createField(
  type: import('./types').FormFieldType,
): import('./types').FormField {
  const id = createId(type)
  const base = { id, type, label: fieldLabel(type), width: 'half' as const, required: false }
  switch (type) {
    case 'short_text':
      return { ...base, placeholder: 'Short text', label: 'Short Text' }
    case 'paragraph':
      return { ...base, placeholder: 'Long text…', label: 'Paragraph', width: 'full' }
    case 'email':
      return { ...base, placeholder: 'Email', label: 'Email', required: true }
    case 'number':
      return { ...base, placeholder: '0', label: 'Number' }
    case 'date':
      return { ...base, label: 'Date' }
    case 'radio':
      return {
        ...base,
        label: 'Single Choice',
        options: [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ],
        width: 'full',
      }
    case 'checkbox':
      return {
        ...base,
        label: 'Multiple Choice',
        options: [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ],
        width: 'full',
      }
    case 'dropdown':
      return {
        ...base,
        label: 'Dropdown',
        placeholder: 'Select…',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
      }
    case 'file':
      return { ...base, label: 'File Upload', width: 'full' }
    case 'section_break':
      return { ...base, label: 'Section Break', width: 'full' }
    default:
      return base
  }
}

function fieldLabel(type: string) {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
