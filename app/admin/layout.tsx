import type { Metadata } from 'next'
import { AdminProviders } from '@/components/admin/admin-providers'

export const metadata: Metadata = {
  title: 'CMS Admin | Mutakamela',
  description: 'Mutakamela Insurance content management system',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminProviders>{children}</AdminProviders>
}
