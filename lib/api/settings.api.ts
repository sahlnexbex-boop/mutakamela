import { apiRequest } from '@/lib/api/client'

export type MailSettings = {
  enabled: boolean
  host: string
  port: number
  secure: boolean
  username: string
  hasPassword: boolean
  mailFrom: string
  configured: boolean
  source: 'database' | 'env' | 'none'
  updatedAt: string | null
}

export type UpdateMailSettingsPayload = {
  enabled?: boolean
  host?: string
  port?: number
  secure?: boolean
  username?: string
  /** Omit or leave empty to keep existing password */
  password?: string
  mailFrom?: string
}

export type GoogleSheetsSettings = {
  enabled: boolean
  clientEmail: string
  hasPrivateKey: boolean
  configured: boolean
  source: 'database' | 'env' | 'none'
  updatedAt: string | null
}

export type UpdateGoogleSheetsSettingsPayload = {
  enabled?: boolean
  clientEmail?: string
  /** Omit or leave empty to keep existing private key */
  privateKey?: string
}

export const settingsApi = {
  getMailSettings(): Promise<MailSettings> {
    return apiRequest<MailSettings>('/api/settings/mail', { auth: true })
  },

  updateMailSettings(payload: UpdateMailSettingsPayload): Promise<MailSettings> {
    return apiRequest<MailSettings>('/api/settings/mail', {
      method: 'PUT',
      auth: true,
      body: payload,
    })
  },

  getGoogleSheetsSettings(): Promise<GoogleSheetsSettings> {
    return apiRequest<GoogleSheetsSettings>('/api/settings/google-sheets', {
      auth: true,
    })
  },

  updateGoogleSheetsSettings(
    payload: UpdateGoogleSheetsSettingsPayload,
  ): Promise<GoogleSheetsSettings> {
    return apiRequest<GoogleSheetsSettings>('/api/settings/google-sheets', {
      method: 'PUT',
      auth: true,
      body: payload,
    })
  },
}
