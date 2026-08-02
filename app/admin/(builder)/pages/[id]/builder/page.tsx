'use client'

import { use } from 'react'
import { PageBuilder } from '@/components/builder/page/page-builder'

export default function PageBuilderRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const pageId = Number(id)

  if (!Number.isFinite(pageId)) {
    return (
      <div className="flex h-svh items-center justify-center text-sm text-slate-400">
        Invalid page id
      </div>
    )
  }

  return <PageBuilder pageId={pageId} />
}
