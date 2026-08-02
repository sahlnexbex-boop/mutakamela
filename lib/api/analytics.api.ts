import { apiRequest } from '@/lib/api/client'

export type AnalyticsRange = '7d' | '30d' | '90d' | '12m'

export type GaConfig = {
  measurementId: string
  propertyName: string
  streamUrl: string
  enabled: boolean
  anonymizeIp: boolean
  enhancedMeasurement: boolean
  trackOutbound: boolean
  debugMode: boolean
  updatedAt?: string | null
}

export type AnalyticsMetric = {
  key: 'visits' | 'unique' | 'duration' | 'bounce'
  label: string
  value: number
  display?: string
  suffix?: string
  decimals?: number
  delta: string
  up: boolean
  goodWhenDown?: boolean
}

export type BreakdownItem = {
  label: string
  value: number
  display: string
  color: string
  count: number
}

export type TopReferrer = {
  host: string
  visits: string
  visitsRaw: number
  share: number
}

export type LandingPage = {
  page: string
  sessions: string
  sessionsRaw: number
  share: number
}

export type EventTypeStat = {
  type: string
  label: string
  count: number
  display: string
  color: string
}

export type AnalyticsOverview = {
  source: 'live' | 'demo'
  range: AnalyticsRange
  generatedAt: string
  totalEvents: number
  metrics: AnalyticsMetric[]
  visitsOverTime: { d: string; total: number; unique: number }[]
  topPages: {
    page: string
    views: string
    viewsRaw: number
    engagement: number
  }[]
  trafficSources: {
    label: string
    value: number
    display: string
    color: string
  }[]
  geoRegions: {
    id: string
    name: string
    visitors: string
    visitorsRaw: number
    intensity: number
  }[]
  devices: BreakdownItem[]
  browsers: BreakdownItem[]
  hourlyTraffic: BreakdownItem[]
  topReferrers: TopReferrer[]
  landingPages: LandingPage[]
  eventTypes: EventTypeStat[]
  sessions: number
  pagesPerSession: number
}

export type PublicAnalyticsConfig = {
  enabled: boolean
  measurementId: string | null
  trackOutbound: boolean
  anonymizeIp: boolean
  enhancedMeasurement: boolean
  debugMode: boolean
}

export type CollectEventPayload = {
  type?: 'pageview' | 'session_start' | 'outbound' | 'engagement'
  path: string
  title?: string
  referrer?: string
  sessionId: string
  visitorId: string
  durationMs?: number
}

export const analyticsApi = {
  getSettings(): Promise<GaConfig> {
    return apiRequest<GaConfig>('/api/analytics/settings', { auth: true })
  },

  updateSettings(payload: Partial<GaConfig>): Promise<GaConfig> {
    return apiRequest<GaConfig>('/api/analytics/settings', {
      method: 'PUT',
      auth: true,
      body: payload,
    })
  },

  getOverview(range: AnalyticsRange = '30d'): Promise<AnalyticsOverview> {
    return apiRequest<AnalyticsOverview>(
      `/api/analytics/overview?range=${encodeURIComponent(range)}`,
      { auth: true },
    )
  },

  getPublicConfig(): Promise<PublicAnalyticsConfig> {
    return apiRequest<PublicAnalyticsConfig>('/api/analytics/public-config')
  },

  collect(payload: CollectEventPayload): Promise<{ accepted: boolean }> {
    return apiRequest<{ accepted: boolean }>('/api/analytics/collect', {
      method: 'POST',
      body: payload,
    })
  },
}
