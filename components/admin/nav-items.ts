import {
  LayoutDashboard,
  FileText,
  Settings,
  List,
  ChartColumn,
  ClipboardList,
  Home,
  type LucideIcon,
} from 'lucide-react'

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  description?: string
  children?: AdminNavItem[]
}

export type AdminNavGroup = {
  title: string
  items: AdminNavItem[]
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'Session overview and quick stats',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        label: 'Pages',
        href: '/admin/page-builder',
        icon: FileText,
        description: 'Visual page builder',
        children: [
          {
            label: 'Home Page',
            href: '/admin/home-page',
            icon: Home,
            description: 'Manage public home sections & SEO',
          },
          {
            label: 'Page Builder',
            href: '/admin/page-builder',
            icon: List,
            description: 'Browse and open the page builder',
          },
        ],
      },
      {
        label: 'Forms',
        href: '/admin/forms',
        icon: ClipboardList,
        description: 'Visual form builder & submissions',
      },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        label: 'Google Analytics',
        href: '/admin/analytics',
        icon: ChartColumn,
        description: 'Traffic and engagement metrics',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        description: 'Account and CMS preferences',
      },
    ],
  },
]

function flattenNavItems(items: AdminNavItem[]): AdminNavItem[] {
  return items.flatMap((item) =>
    item.children?.length ? [item, ...flattenNavItems(item.children)] : [item],
  )
}

export function getAdminNavItem(pathname: string): AdminNavItem | undefined {
  const flat = adminNavGroups.flatMap((g) => flattenNavItems(g.items))

  if (pathname === '/admin') {
    return flat.find((i) => i.href === '/admin')
  }

  // Prefer the deepest (most specific) match — children over parents
  const matches = flat
    .filter((i) => i.href !== '/admin' && pathname.startsWith(i.href))
    .sort((a, b) => b.href.length - a.href.length)

  return matches[0]
}
