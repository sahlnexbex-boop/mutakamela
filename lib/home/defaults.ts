import type { PageSettings } from '@/lib/builder/types'
import type {
  HomeFaqItem,
  HomePageContent,
  HomeSection,
  HomeSectionKey,
  HomeSectionMeta,
  HomeStory,
} from './types'
import { HOME_SECTION_KEYS } from './types'

export const HOME_SECTION_META: Record<HomeSectionKey, HomeSectionMeta> = {
  hero: {
    key: 'hero',
    label: 'Hero',
    description: 'Main headline, trust badge, and quote form',
    accent: 'from-violet-500 to-indigo-600',
  },
  'quick-actions': {
    key: 'quick-actions',
    label: 'Quick Actions',
    description: 'Renew, track claims, pay bills, medical tiles',
    accent: 'from-sky-500 to-cyan-600',
  },
  products: {
    key: 'products',
    label: 'Products',
    description: 'Insurance products showcase grid',
    accent: 'from-blue-500 to-indigo-600',
  },
  'why-us': {
    key: 'why-us',
    label: 'Why Mutakamela',
    description: 'Trust pillars and brand differentiators',
    accent: 'from-indigo-600 to-violet-700',
  },
  'claim-services': {
    key: 'claim-services',
    label: 'Claim Services',
    description: 'Submit and track claims CTA banner',
    accent: 'from-fuchsia-500 to-purple-600',
  },
  'how-it-works': {
    key: 'how-it-works',
    label: 'How It Works',
    description: 'Four-step coverage process',
    accent: 'from-emerald-500 to-teal-600',
  },
  'app-experience': {
    key: 'app-experience',
    label: 'App Experience',
    description: 'Mobile app copy, store links & download CTA',
    accent: 'from-violet-500 to-purple-600',
  },
  testimonials: {
    key: 'testimonials',
    label: 'Testimonials',
    description: 'Customer stories carousel — add, edit, reorder',
    accent: 'from-amber-500 to-orange-600',
  },
  faq: {
    key: 'faq',
    label: 'FAQ',
    description: 'FAQ accordion — add, edit, reorder items',
    accent: 'from-slate-500 to-slate-700',
  },
}

/** Default bilingual marketing copy for each section (matches current site EN/AR) */
function defaultCopy(key: HomeSectionKey): HomeSection['copy'] {
  switch (key) {
    case 'hero':
      return {
        badge: { en: 'Trusted Protection', ar: 'حماية موثوقة' },
        title: {
          en: 'Protection for today, peace of mind for ',
          ar: 'حماية لليوم، وراحة بال لـ ',
        },
        titleHighlight: { en: 'tomorrow', ar: 'الغد' },
        subtitle: {
          en: 'Comprehensive insurance solutions for you, your family and your business.',
          ar: 'حلول تأمينية شاملة لك ولعائلتك ولأعمالك.',
        },
        imageUrl: '/images/home.png',
      }
    case 'quick-actions':
      return {
        title: {
          en: 'What would you like to do today?',
          ar: 'ماذا ترغب أن تفعل اليوم؟',
        },
      }
    case 'products':
      return {
        title: {
          en: 'Our Insurance Products',
          ar: 'منتجاتنا التأمينية',
        },
        subtitle: {
          en: 'Tailored insurance plans for every stage of your life and business',
          ar: 'خطط تأمينية مصممة لكل مرحلة من حياتك وأعمالك',
        },
      }
    case 'why-us':
      return {
        badge: { en: 'Why Mutakamela', ar: 'لماذا متكاملة' },
        title: {
          en: 'Why Choose Mutakamela?',
          ar: 'لماذا تختار متكاملة؟',
        },
        subtitle: {
          en: 'Leading insurance platform in Saudi Arabia with trusted protection and seamless digital experience',
          ar: 'منصة تأمين رائدة في المملكة بحماية موثوقة وتجربة رقمية سلسة',
        },
      }
    case 'claim-services':
      return {
        badge: { en: 'Hassle-Free Claims', ar: 'مطالبات بلا عناء' },
        title: {
          en: 'Need to Submit or Track a Claim?',
          ar: 'هل تحتاج تقديم أو متابعة مطالبة؟',
        },
        subtitle: {
          en: 'Submit claims online in under 3 minutes with real-time status tracking.',
          ar: 'قدّم المطالبات إلكترونيًا في أقل من 3 دقائق مع تتبع مباشر للحالة.',
        },
      }
    case 'how-it-works':
      return {
        badge: { en: 'Simple Process', ar: 'عملية بسيطة' },
        title: {
          en: 'Get Covered in 4 Easy Steps',
          ar: 'احصل على تغطيتك في 4 خطوات سهلة',
        },
      }
    case 'app-experience':
      return {
        badge: { en: 'Mobile App', ar: 'تطبيق الجوال' },
        title: {
          en: 'Insurance at Your Fingertips',
          ar: 'التأمين بين يديك',
        },
        subtitle: {
          en: 'Download the Mutakamela mobile app to manage your active policies, file claims instantly, view digital insurance cards, and access 24/7 assistance.',
          ar: 'حمّل تطبيق متكاملة لإدارة وثائقك، وتقديم المطالبات فورًا، وعرض البطاقات الرقمية، والحصول على المساعدة على مدار الساعة.',
        },
        ctaLabel: { en: 'Download App', ar: 'تحميل التطبيق' },
        ctaUrl: '#app',
        appStoreUrl: 'https://apps.apple.com/',
        playStoreUrl: 'https://play.google.com/store',
        scanTitle: {
          en: 'Scan to Download Mutakamela App',
          ar: 'امسح الكود لتحميل تطبيق متكاملة',
        },
        availableOnLabel: { en: 'Available on', ar: 'متوفر على' },
        imageUrl: '/images/app_exp.png',
      }
    case 'testimonials':
      return {
        badge: { en: 'Customer Stories', ar: 'قصص العملاء' },
        title: {
          en: 'What Our Clients Say',
          ar: 'ماذا يقول عملاؤنا',
        },
      }
    case 'faq':
      return {
        badge: { en: 'FAQs', ar: 'الأسئلة الشائعة' },
        title: {
          en: 'Frequently Asked Questions',
          ar: 'الأسئلة الشائعة',
        },
        subtitle: {
          en: 'Everything you need to know about Mutakamela Insurance products and services',
          ar: 'كل ما تحتاج معرفته عن منتجات وخدمات تأمين متكاملة',
        },
        imageUrl: '/images/faq.png',
      }
    default:
      return {}
  }
}

/** Default customer stories matching the current public site */
export function defaultHomeStories(): HomeStory[] {
  return [
    {
      id: 'story-1',
      name: { en: 'Abdullah Al-Qahtani', ar: 'عبدالله القحطاني' },
      role: { en: 'Motor Policy Holder', ar: 'حامل وثيقة مركبات' },
      quote: {
        en: 'The fastest insurance renewal I have ever experienced. My policy was synced with Absher within 2 minutes of payment!',
        ar: 'أسرع تجديد تأمين جربته على الإطلاق. تم ربط وثيقتي مع أبشر خلال دقيقتين من الدفع!',
      },
      avatar: '/images/user_01.png',
      rating: 5,
      enabled: true,
    },
    {
      id: 'story-2',
      name: { en: 'Sarah Mansour', ar: 'سارة المنصور' },
      role: { en: 'Travel Policy Holder', ar: 'حاملة وثيقة سفر' },
      quote: {
        en: 'Submitting a flight delay claim was effortless through the mobile app. Money was transferred smoothly.',
        ar: 'تقديم مطالبة تأخير الرحلة كان سهلاً للغاية عبر التطبيق. تم تحويل المبلغ بسلاسة.',
      },
      avatar: '/images/user_02.png',
      rating: 5,
      enabled: true,
    },
    {
      id: 'story-3',
      name: { en: 'Mohammed Al-Zahrani', ar: 'محمد الزهراني' },
      role: { en: 'Corporate Fleet Client', ar: 'عميل أسطول شركات' },
      quote: {
        en: 'Mutakamela provided us with competitive corporate rates and dedicated account management for our entire fleet.',
        ar: 'قدمت لنا متكاملة أسعاراً تنافسية للشركات وإدارة حساب مخصصة لأسطولنا بالكامل.',
      },
      avatar: '/images/user_03.png',
      rating: 5,
      enabled: true,
    },
  ]
}

export function createEmptyStory(): HomeStory {
  const id = `story-${Math.random().toString(36).slice(2, 9)}`
  return {
    id,
    name: { en: '', ar: '' },
    role: { en: '', ar: '' },
    quote: { en: '', ar: '' },
    avatar: '/images/user_01.png',
    rating: 5,
    enabled: true,
  }
}

/** Default FAQ items matching the current public site */
export function defaultHomeFaqs(): HomeFaqItem[] {
  return [
    {
      id: 'faq-1',
      question: {
        en: 'How quickly will my Motor policy sync with Najm & Absher?',
        ar: 'ما هي السرعة التي تلزم لربط وثيقة المركبات مع نجم وأبشر؟',
      },
      answer: {
        en: 'Your policy is automatically synced with Najm and Absher databases within 2-5 minutes after successful payment.',
        ar: 'يتم ربط وثيقتك تلقائياً مع قواعد بيانات نجم وأبشر خلال 2-5 دقائق بعد الدفع الناجح.',
      },
      enabled: true,
    },
    {
      id: 'faq-2',
      question: {
        en: 'What documents are needed for Visit Visa Insurance?',
        ar: 'ما هي المستندات المطلوبة لتأمين تأشيرة الزيارة؟',
      },
      answer: {
        en: "You only need the visitor's valid Passport Number and Visa Application Number to issue the policy.",
        ar: 'تحتاج فقط إلى رقم جواز السفر الساري ورقم طلب التأشيرة لإصدار الوثيقة.',
      },
      enabled: true,
    },
    {
      id: 'faq-3',
      question: {
        en: 'How do I file a claim using the app?',
        ar: 'كيف يمكنني تقديم مطالبة باستخدام التطبيق؟',
      },
      answer: {
        en: "Log in to the app or portal, select 'Submit Claim', upload photos/reports, and submit. You can track status live.",
        ar: "سجّل الدخول إلى التطبيق أو البوابة، واختر 'تقديم مطالبة'، وقم برفع الصور/التقارير وسجل الطلب. يمكنك متابعة الحالة مباشرة.",
      },
      enabled: true,
    },
    {
      id: 'faq-4',
      question: {
        en: 'Can I upgrade or amend my policy mid-term?',
        ar: 'هل يمكنني تعديل الوثيقة أو ترقيتها في منتصف المدة؟',
      },
      answer: {
        en: 'Yes, you can easily add driver coverage, expand territory, or adjust limits via Customer Support or portal.',
        ar: 'نعم، يمكنك بسهولة إضافة سائقين أو توسيع التغطية الجغرافية من خلال خدمة العملاء أو البوابة.',
      },
      enabled: true,
    },
  ]
}

export function createEmptyFaq(): HomeFaqItem {
  const id = `faq-${Math.random().toString(36).slice(2, 9)}`
  return {
    id,
    question: { en: '', ar: '' },
    answer: { en: '', ar: '' },
    enabled: true,
  }
}

export function defaultHomeSections(): HomeSection[] {
  return HOME_SECTION_KEYS.map((key) => ({
    key,
    enabled: true,
    copy: defaultCopy(key),
    ...(key === 'testimonials' ? { stories: defaultHomeStories() } : {}),
    ...(key === 'faq' ? { faqs: defaultHomeFaqs() } : {}),
  }))
}

export function defaultHomePageContent(): HomePageContent {
  return {
    version: 1,
    kind: 'home',
    sections: defaultHomeSections(),
  }
}

export function defaultHomeSeoSettings(): PageSettings {
  return {
    seoTitle: {
      en: 'Mutakamela Insurance | Protection for today, peace of mind for tomorrow',
      ar: 'متكاملة للتأمين | حماية لليوم وراحة بال للغد',
    },
    seoDescription: {
      en: 'Comprehensive insurance solutions for you, your family and your business. Motor, travel, life, visit visa and corporate coverage in Saudi Arabia.',
      ar: 'حلول تأمينية شاملة لك ولعائلتك ولأعمالك. تأمين مركبات وسفر وحياة وتأشيرة زيارة وتأمين شركات في المملكة العربية السعودية.',
    },
    seoKeywords: {
      en: 'insurance, mutakamela, motor insurance, travel insurance, Saudi Arabia, claims',
      ar: 'تأمين, متكاملة, تأمين مركبات, تأمين سفر, السعودية, مطالبات',
    },
    ogImage: '/images/home.png',
    canonicalUrl: '',
    noIndex: false,
    favicon: '',
    showHeader: true,
    showFooter: true,
  }
}
