import { apiRequest } from '@/lib/api/client'
import type {
  FormDetail,
  FormListItem,
  FormSchema,
  FormSettings,
  FormStatus,
} from '@/lib/builder/types'

export type CreateFormPayload = {
  title: string
  slug?: string
  description?: string
  schema?: FormSchema
  settings?: FormSettings
}

export type UpdateFormPayload = {
  title?: string
  slug?: string
  description?: string | null
  schema?: FormSchema
  settings?: FormSettings
  status?: FormStatus
}

export type SubmissionStatus = 'new' | 'reviewed' | 'archived'

export type FormSubmission = {
  id: number
  status: SubmissionStatus
  data: Record<string, unknown>
  meta: unknown
  createdAt: string
  updatedAt: string
}

export const formsApi = {
  list(): Promise<FormListItem[]> {
    return apiRequest<FormListItem[]>('/api/forms', { auth: true })
  },

  get(id: number): Promise<FormDetail> {
    return apiRequest<FormDetail>(`/api/forms/${id}`, { auth: true })
  },

  getPublic(slug: string): Promise<FormDetail> {
    return apiRequest<FormDetail>(`/api/forms/public/${encodeURIComponent(slug)}`)
  },

  create(payload: CreateFormPayload): Promise<FormDetail> {
    return apiRequest<FormDetail>('/api/forms', {
      method: 'POST',
      auth: true,
      body: payload,
    })
  },

  update(id: number, payload: UpdateFormPayload): Promise<FormDetail> {
    return apiRequest<FormDetail>(`/api/forms/${id}`, {
      method: 'PUT',
      auth: true,
      body: payload,
    })
  },

  publish(id: number): Promise<FormDetail> {
    return apiRequest<FormDetail>(`/api/forms/${id}/publish`, {
      method: 'POST',
      auth: true,
    })
  },

  delete(id: number): Promise<{ deleted: true }> {
    return apiRequest<{ deleted: true }>(`/api/forms/${id}`, {
      method: 'DELETE',
      auth: true,
    })
  },

  submit(
    slug: string,
    data: Record<string, unknown>,
    meta?: Record<string, unknown>,
  ): Promise<{ id: number; message: string; createdAt: string }> {
    return apiRequest(`/api/forms/public/${encodeURIComponent(slug)}/submit`, {
      method: 'POST',
      body: { data, meta },
    })
  },

  listSubmissions(id: number): Promise<FormSubmission[]> {
    return apiRequest<FormSubmission[]>(`/api/forms/${id}/submissions`, {
      auth: true,
    })
  },

  updateSubmission(
    formId: number,
    submissionId: number,
    payload: { status: SubmissionStatus },
  ): Promise<FormSubmission> {
    return apiRequest<FormSubmission>(
      `/api/forms/${formId}/submissions/${submissionId}`,
      {
        method: 'PATCH',
        auth: true,
        body: payload,
      },
    )
  },

  deleteSubmission(
    formId: number,
    submissionId: number,
  ): Promise<{ deleted: true }> {
    return apiRequest<{ deleted: true }>(
      `/api/forms/${formId}/submissions/${submissionId}`,
      {
        method: 'DELETE',
        auth: true,
      },
    )
  },
}
