import { apiRequest } from '@/lib/api/client'
import type {
  HeaderMenuItem,
  PageContent,
  PageDetail,
  PageListItem,
  PageSettings,
  PageStatus,
} from '@/lib/builder/types'

export type CreatePagePayload = {
  title: string
  slug?: string
  content?: PageContent
  settings?: PageSettings
}

export type UpdatePagePayload = {
  title?: string
  slug?: string
  content?: PageContent
  settings?: PageSettings
  status?: PageStatus
}

export const pagesApi = {
  list(): Promise<PageListItem[]> {
    return apiRequest<PageListItem[]>('/api/pages', { auth: true })
  },

  get(id: number): Promise<PageDetail> {
    return apiRequest<PageDetail>(`/api/pages/${id}`, { auth: true })
  },

  getPublic(slug: string): Promise<PageDetail> {
    return apiRequest<PageDetail>(`/api/pages/public/${encodeURIComponent(slug)}`)
  },

  /** Published pages opted into the public header menu. */
  listHeaderMenu(): Promise<HeaderMenuItem[]> {
    return apiRequest<HeaderMenuItem[]>('/api/pages/header-menu')
  },

  create(payload: CreatePagePayload): Promise<PageDetail> {
    return apiRequest<PageDetail>('/api/pages', {
      method: 'POST',
      auth: true,
      body: payload,
    })
  },

  update(id: number, payload: UpdatePagePayload): Promise<PageDetail> {
    return apiRequest<PageDetail>(`/api/pages/${id}`, {
      method: 'PUT',
      auth: true,
      body: payload,
    })
  },

  publish(id: number): Promise<PageDetail> {
    return apiRequest<PageDetail>(`/api/pages/${id}/publish`, {
      method: 'POST',
      auth: true,
    })
  },

  delete(id: number): Promise<{ deleted: true }> {
    return apiRequest<{ deleted: true }>(`/api/pages/${id}`, {
      method: 'DELETE',
      auth: true,
    })
  },
}
