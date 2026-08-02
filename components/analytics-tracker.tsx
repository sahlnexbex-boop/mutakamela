'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { analyticsApi } from '@/lib/api/analytics.api'

const VISITOR_KEY = 'mutakamela_vid'
const SESSION_KEY = 'mutakamela_sid'
const SESSION_TS_KEY = 'mutakamela_sid_ts'
const SESSION_TTL_MS = 30 * 60 * 1000

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 32)
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`
}

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = randomId()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}

function getSessionId(): string {
  try {
    const now = Date.now()
    const ts = Number(sessionStorage.getItem(SESSION_TS_KEY) || 0)
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id || !ts || now - ts > SESSION_TTL_MS) {
      id = randomId()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    sessionStorage.setItem(SESSION_TS_KEY, String(now))
    return id
  } catch {
    return randomId()
  }
}

function loadGtag(measurementId: string, anonymizeIp: boolean, debug: boolean) {
  if (typeof window === 'undefined') return
  const w = window as Window & {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
  if (w.gtag) return

  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer?.push(args)
  }
  w.gtag('js', new Date())
  w.gtag('config', measurementId, {
    anonymize_ip: anonymizeIp,
    debug_mode: debug || undefined,
    send_page_view: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
}

/**
 * Silent first-party + optional GA4 tracker for public pages.
 * Only runs when admin has Enable tracking turned on.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const enabledRef = useRef(false)
  const gtagIdRef = useRef<string | null>(null)
  const readyRef = useRef(false)
  const lastPathRef = useRef<string | null>(null)
  const enteredAtRef = useRef(Date.now())

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const cfg = await analyticsApi.getPublicConfig()
        if (cancelled) return
        enabledRef.current = cfg.enabled
        readyRef.current = true
        if (cfg.enabled && cfg.measurementId && /^G-[A-Z0-9]+$/i.test(cfg.measurementId)) {
          gtagIdRef.current = cfg.measurementId
          loadGtag(cfg.measurementId, cfg.anonymizeIp, cfg.debugMode)
        }
      } catch {
        // Tracker is best-effort — never break the public site
        readyRef.current = true
        enabledRef.current = false
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!pathname) return
    // Skip admin CMS routes
    if (pathname.startsWith('/admin')) return

    let cancelled = false
    const path = pathname
    const title = typeof document !== 'undefined' ? document.title : undefined
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined

    const send = async () => {
      // Wait briefly for public-config if still loading
      for (let i = 0; i < 20 && !readyRef.current; i++) {
        await new Promise((r) => setTimeout(r, 50))
      }
      if (cancelled || !enabledRef.current) return
      if (lastPathRef.current === path) return
      lastPathRef.current = path

      // Send engagement for previous page
      const spent = Date.now() - enteredAtRef.current
      enteredAtRef.current = Date.now()

      const visitorId = getVisitorId()
      const sessionId = getSessionId()

      try {
        if (spent > 1500 && lastPathRef.current) {
          // previous path engagement already advanced lastPath — skip
        }
        await analyticsApi.collect({
          type: 'pageview',
          path,
          title,
          referrer: referrer || undefined,
          sessionId,
          visitorId,
        })
        if (spent > 2000) {
          void analyticsApi.collect({
            type: 'engagement',
            path,
            title,
            sessionId,
            visitorId,
            durationMs: spent,
          })
        }
      } catch {
        // ignore network errors
      }

      const mid = gtagIdRef.current
      if (mid && typeof window !== 'undefined') {
        const w = window as Window & { gtag?: (...args: unknown[]) => void }
        w.gtag?.('event', 'page_view', {
          page_path: path,
          page_title: title,
          send_to: mid,
        })
      }
    }

    void send()

    return () => {
      cancelled = true
    }
  }, [pathname])

  return null
}
