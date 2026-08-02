import { apiRequest } from '@/lib/api/client'
import type { BuilderLocale } from '@/lib/builder/i18n'

export type TranslateDirection = 'en-ar' | 'ar-en'

export type TranslateResult = {
  text: string
  source: BuilderLocale
  target: BuilderLocale
  provider: string
}

export function directionFromLocales(
  from: BuilderLocale,
  to: BuilderLocale,
): TranslateDirection | null {
  if (from === 'en' && to === 'ar') return 'en-ar'
  if (from === 'ar' && to === 'en') return 'ar-en'
  return null
}

export const translateApi = {
  translate(
    text: string,
    direction: TranslateDirection,
  ): Promise<TranslateResult> {
    return apiRequest<TranslateResult>('/api/translate', {
      method: 'POST',
      auth: true,
      body: { text, direction },
    })
  },
}
