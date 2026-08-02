'use client'

import { use } from 'react'
import { FormBuilder } from '@/components/builder/form/form-builder'

export default function FormBuilderRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const formId = Number(id)

  if (!Number.isFinite(formId)) {
    return (
      <div className="flex h-svh items-center justify-center text-sm text-slate-400">
        Invalid form id
      </div>
    )
  }

  return <FormBuilder formId={formId} />
}
