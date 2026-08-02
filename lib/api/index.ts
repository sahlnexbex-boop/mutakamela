/**
 * API integrations barrel.
 * Keep each domain in its own file (auth.api.ts, …) and re-export here.
 */
export { apiRequest } from '@/lib/api/client'
export { authApi } from '@/lib/api/auth.api'
export { pagesApi } from '@/lib/api/pages.api'
export { formsApi } from '@/lib/api/forms.api'
export { analyticsApi } from '@/lib/api/analytics.api'
export { settingsApi } from '@/lib/api/settings.api'
export type {
  MailSettings,
  UpdateMailSettingsPayload,
  GoogleSheetsSettings,
  UpdateGoogleSheetsSettingsPayload,
} from '@/lib/api/settings.api'
export { translateApi, directionFromLocales } from '@/lib/api/translate.api'
export type { TranslateDirection, TranslateResult } from '@/lib/api/translate.api'
export { uploadImage, mediaUrl } from '@/lib/api/media.api'
export { ApiError } from '@/lib/api/types'
export type {
  AdminUser,
  ApiFailure,
  ApiResponse,
  ApiSuccess,
  LoginData,
  LoginPayload,
  LogoutData,
  MeData,
} from '@/lib/api/types'
