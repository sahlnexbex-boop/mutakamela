'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminTheme } from '@/lib/auth/admin-theme-context'
import {
  adminNavGroups,
  type AdminNavItem,
} from '@/components/admin/nav-items'

const LOGO_COLOR = '/images/logo_navbar.png'
const LOGO_WHITE = '/images/mutakamelawhitelogo.png'

type AdminSidebarProps = {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

function isActivePath(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function isItemOrChildActive(pathname: string, item: AdminNavItem) {
  if (isActivePath(pathname, item.href)) return true
  return item.children?.some((child) => isActivePath(pathname, child.href)) ?? false
}

export function AdminSidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { resolvedTheme } = useAdminTheme()
  const logoSrc =
    resolvedTheme === 'dark' ? LOGO_WHITE : LOGO_COLOR
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Auto-expand groups that contain the active route
  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev }
      for (const group of adminNavGroups) {
        for (const item of group.items) {
          if (item.children?.length && isItemOrChildActive(pathname, item)) {
            next[item.href] = true
          }
        }
      }
      return next
    })
  }, [pathname])

  const toggleExpanded = (href: string) => {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }))
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        style={{ background: 'var(--a-overlay)' }}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          'admin-anim-slide fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-[width,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:z-0 lg:translate-x-0 lg:shadow-none',
          collapsed ? 'lg:w-[72px]' : 'lg:w-[248px]',
          open
            ? 'translate-x-0 shadow-2xl shadow-slate-900/20'
            : '-translate-x-full',
          'w-[248px]',
        )}
        style={{
          background: 'var(--a-sidebar-bg)',
          borderColor: 'var(--a-sidebar-border)',
        }}
      >
        {/* Brand — overflow visible so logo glow/orbs are not clipped */}
        <div
          className={cn(
            'relative shrink-0 border-b',
            collapsed ? 'lg:px-2 lg:py-3' : 'px-3 py-3.5',
          )}
          style={{ borderColor: 'var(--a-sidebar-border)' }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(120% 80% at 0% 0%, var(--a-primary-soft), transparent 60%)',
            }}
            aria-hidden
          />

          <div
            className={cn(
              'relative flex items-center gap-2',
              collapsed && 'lg:flex-col lg:justify-center',
            )}
          >
            <Link
              href="/admin"
              onClick={onClose}
              className={cn(
                'group flex min-w-0 flex-1 items-center outline-none',
                collapsed ? 'lg:flex-col lg:gap-1' : 'gap-0',
              )}
            >
              {/* Collapsed mark — spinning ring + float */}
              <div
                className={cn(
                  'admin-logo-mark hidden h-11 w-11 shrink-0',
                  collapsed ? 'lg:block' : 'lg:hidden',
                )}
              >
                <span className="admin-logo-mark-ring" aria-hidden />
                <span className="admin-logo-mark-face">
                  <Image
                    src={logoSrc}
                    alt="Mutakamela"
                    width={36}
                    height={36}
                    priority
                    className="admin-logo-img h-8 w-8 object-contain"
                  />
                </span>
              </div>

              {/* Expanded brand — orbs, gradient border, shine, sparks */}
              <div
                className={cn(
                  'admin-logo-wrap min-w-0 flex-1',
                  collapsed && 'lg:hidden',
                )}
              >
                <span className="admin-logo-orb admin-logo-orb--a" aria-hidden />
                <span className="admin-logo-orb admin-logo-orb--b" aria-hidden />

                <div className="admin-logo-card">
                  <span className="admin-logo-spark admin-logo-spark--1" aria-hidden />
                  <span className="admin-logo-spark admin-logo-spark--2" aria-hidden />
                  <span className="admin-logo-spark admin-logo-spark--3" aria-hidden />
                  <div className="admin-logo-inner">
                    <Image
                      src={logoSrc}
                      alt="Mutakamela Insurance"
                      width={168}
                      height={42}
                      priority
                      className="admin-logo-img h-9 w-auto max-w-full object-contain object-left sm:h-[2.4rem]"
                    />
                  </div>
                </div>

                <div className="relative z-[1] mt-2 flex items-center justify-between gap-2 px-0.5">
                  <p
                    className="flex items-center gap-1 text-[11px] font-semibold tracking-wide"
                    style={{ color: 'var(--a-primary-soft-text)' }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    CMS Admin
                  </p>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                    style={{ background: 'var(--a-primary)' }}
                  >
                    <span className="admin-dot-live h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Live
                  </span>
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="admin-btn-ghost h-8 w-8 shrink-0 lg:!hidden"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3.5 overflow-y-auto px-2.5 py-3">
          {adminNavGroups.map((group, gi) => (
            <div
              key={group.title}
              className="admin-anim-in"
              style={{ animationDelay: `${0.05 + gi * 0.04}s` }}
            >
              <p
                className={cn(
                  'mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em]',
                  collapsed && 'lg:hidden',
                )}
                style={{ color: 'var(--a-sidebar-muted)' }}
              >
                {group.title}
              </p>
              {collapsed && (
                <div
                  className="mx-auto mb-1.5 hidden h-px w-8 lg:block"
                  style={{ background: 'var(--a-sidebar-border)' }}
                />
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const hasChildren = Boolean(item.children?.length)
                  const childActive =
                    item.children?.some((child) =>
                      isActivePath(pathname, child.href),
                    ) ?? false
                  const active =
                    !hasChildren && isActivePath(pathname, item.href)
                  const parentHighlight = hasChildren && childActive
                  const isOpen = Boolean(expanded[item.href])
                  const Icon = item.icon

                  return (
                    <li key={item.href}>
                      {hasChildren ? (
                        <>
                          {collapsed ? (
                            <Link
                              href={item.href}
                              onClick={onClose}
                              title={item.label}
                              className={cn(
                                'admin-nav-link lg:justify-center lg:px-1',
                                (parentHighlight ||
                                  isActivePath(pathname, item.href)) &&
                                  'is-active',
                              )}
                            >
                              <span className="admin-nav-icon">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(item.href)}
                              className={cn(
                                'admin-nav-link w-full',
                                parentHighlight && 'is-active',
                              )}
                              aria-expanded={isOpen}
                            >
                              <span className="admin-nav-icon">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="truncate">{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  'ml-auto h-3.5 w-3.5 shrink-0 transition-transform duration-200',
                                  isOpen && 'rotate-180',
                                )}
                                style={{ color: 'var(--a-sidebar-muted)' }}
                              />
                            </button>
                          )}

                          {!collapsed && isOpen && (
                            <ul className="mt-0.5 space-y-0.5 border-l pl-2 ml-4" style={{ borderColor: 'var(--a-sidebar-border)' }}>
                              {item.children!.map((child) => {
                                const childIsActive = isActivePath(
                                  pathname,
                                  child.href,
                                )
                                const ChildIcon = child.icon
                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className={cn(
                                        'admin-nav-link',
                                        childIsActive && 'is-active',
                                      )}
                                    >
                                      <span className="admin-nav-icon">
                                        <ChildIcon className="h-3.5 w-3.5" />
                                      </span>
                                      <span className="truncate">
                                        {child.label}
                                      </span>
                                      {childIsActive && (
                                        <span
                                          className="ml-auto h-1.5 w-1.5 rounded-full"
                                          style={{
                                            background: 'var(--a-primary)',
                                            boxShadow:
                                              '0 0 0 3px var(--a-primary-soft)',
                                          }}
                                        />
                                      )}
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            'admin-nav-link',
                            active && 'is-active',
                            collapsed && 'lg:justify-center lg:px-1',
                          )}
                        >
                          <span className="admin-nav-icon">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span
                            className={cn(
                              'truncate',
                              collapsed && 'lg:hidden',
                            )}
                          >
                            {item.label}
                          </span>
                          {active && !collapsed && (
                            <span
                              className="ml-auto h-1.5 w-1.5 rounded-full"
                              style={{
                                background: 'var(--a-primary)',
                                boxShadow: '0 0 0 3px var(--a-primary-soft)',
                              }}
                            />
                          )}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse */}
        <div
          className="hidden border-t p-2 lg:block"
          style={{ borderColor: 'var(--a-sidebar-border)' }}
        >
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'admin-btn-ghost h-8 w-full text-[12px] font-medium',
              collapsed && 'px-0',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-3.5 w-3.5" />
            ) : (
              <>
                <PanelLeftClose className="h-3.5 w-3.5" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
