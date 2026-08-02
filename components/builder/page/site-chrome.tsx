'use client'

import type { ReactNode } from 'react'
import Footer from '@/components/footer'
import I18nProvider from '@/components/i18n-provider'
import Navbar from '@/components/navbar'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  /**
   * Editor / preview mode: chrome is non-interactive and labeled
   * so it doesn’t steal block selection.
   */
  previewChrome?: boolean
  className?: string
}

/**
 * Public marketing header + footer around built page content.
 * Matches the main site chrome (Navbar / Footer).
 */
export function SiteChrome({
  children,
  showHeader = true,
  showFooter = true,
  previewChrome = false,
  className,
}: Props) {
  if (!showHeader && !showFooter) {
    return <div className={className}>{children}</div>
  }

  return (
    <I18nProvider>
      <div className={cn('flex min-h-full flex-col bg-[#F8F9FE]', className)}>
        {showHeader && (
          <div
            className={cn(
              'relative shrink-0',
              previewChrome && 'pointer-events-none select-none',
            )}
            data-site-chrome="header"
          >
            {previewChrome && (
              <ChromeBadge label="Site header" position="top" />
            )}
            <Navbar />
          </div>
        )}

        <div className="min-h-0 flex-1">{children}</div>

        {showFooter && (
          <div
            className={cn(
              'relative shrink-0',
              previewChrome && 'pointer-events-none select-none',
            )}
            data-site-chrome="footer"
          >
            {previewChrome && (
              <ChromeBadge label="Site footer" position="bottom" />
            )}
            <Footer />
          </div>
        )}
      </div>
    </I18nProvider>
  )
}

function ChromeBadge({
  label,
  position,
}: {
  label: string
  position: 'top' | 'bottom'
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute left-3 z-50 rounded-md bg-[var(--a-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md',
        position === 'top' ? 'top-2' : 'bottom-2',
      )}
    >
      {label}
    </div>
  )
}
