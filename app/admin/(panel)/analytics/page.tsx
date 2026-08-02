'use client'

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import {
  Activity,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Globe2,
  KeyRound,
  Laptop,
  Link2,
  Monitor,
  MousePointerClick,
  Settings2,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { swalToast } from '@/lib/swal'
import {
  analyticsApi,
  type AnalyticsMetric,
  type AnalyticsOverview,
  type AnalyticsRange,
  type BreakdownItem,
  type EventTypeStat,
  type GaConfig,
  type LandingPage,
  type TopReferrer,
} from '@/lib/api/analytics.api'
import { ApiError } from '@/lib/api/types'
import {
  AnalyticsWorldMap,
  regionIntensityColor,
} from '@/components/admin/analytics-world-map'

/* ─── Types ─── */

type DateRange = AnalyticsRange
type MetricKey = 'visits' | 'unique' | 'duration' | 'bounce'

type MetricView = AnalyticsMetric & {
  icon: ComponentType<{ className?: string }>
  tone: 'violet' | 'sky' | 'emerald' | 'amber'
}

type GeoRegionView = {
  id: string
  name: string
  visitors: string
  intensity: number
}

const defaultGaConfig: GaConfig = {
  measurementId: '',
  propertyName: 'Mutakamela Website',
  streamUrl: 'https://mutakamela.com',
  enabled: false,
  anonymizeIp: true,
  enhancedMeasurement: true,
  trackOutbound: true,
  debugMode: false,
}

const metricMeta: Record<
  MetricKey,
  { icon: ComponentType<{ className?: string }>; tone: MetricView['tone'] }
> = {
  visits: { icon: Eye, tone: 'violet' },
  unique: { icon: Users, tone: 'sky' },
  duration: { icon: Clock, tone: 'emerald' },
  bounce: { icon: MousePointerClick, tone: 'amber' },
}

/** Region ids aligned with backend analytics geo buckets */
const REGION_IDS = ['na', 'sa', 'eu', 'af', 'as', 'me', 'oc'] as const

const REGION_NAMES: Record<string, string> = {
  na: 'North America',
  sa: 'South America',
  eu: 'Europe',
  af: 'Africa',
  as: 'Asia',
  me: 'Middle East',
  oc: 'Oceania',
}

/* ─── Mock analytics data (shown when tracking is off) ─── */

const rangeLabels: Record<DateRange, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  '12m': 'Last 12 Months',
}

const demoVisitsOverTime = [
  { d: '12/11', total: 28, unique: 22 },
  { d: '12/13', total: 52, unique: 38 },
  { d: '12/15', total: 41, unique: 30 },
  { d: '12/17', total: 68, unique: 48 },
  { d: '12/19', total: 55, unique: 40 },
  { d: '12/21', total: 92, unique: 58 },
  { d: '12/22', total: 118, unique: 72 },
  { d: '12/23', total: 78, unique: 50 },
  { d: '12/24', total: 48, unique: 32 },
  { d: '12/25', total: 42, unique: 28 },
  { d: '12/26', total: 58, unique: 38 },
  { d: '12/27', total: 72, unique: 45 },
  { d: '12/28', total: 64, unique: 42 },
  { d: '12/29', total: 85, unique: 55 },
  { d: '12/30', total: 70, unique: 48 },
  { d: '01/01', total: 58, unique: 40 },
  { d: '01/03', total: 62, unique: 44 },
  { d: '01/05', total: 54, unique: 38 },
]

const demoKeyMetrics: MetricView[] = [
  {
    key: 'visits',
    label: 'Total Visits',
    value: 125.4,
    suffix: 'K',
    decimals: 1,
    delta: '+12.4%',
    up: true,
    icon: Eye,
    tone: 'violet',
  },
  {
    key: 'unique',
    label: 'Unique Visitors',
    value: 92.1,
    suffix: 'K',
    decimals: 1,
    delta: '+8.2%',
    up: true,
    icon: Users,
    tone: 'sky',
  },
  {
    key: 'duration',
    label: 'Avg. Session Duration',
    display: '3m 45s',
    value: 225,
    delta: '+4.1%',
    up: true,
    icon: Clock,
    tone: 'emerald',
  },
  {
    key: 'bounce',
    label: 'Bounce Rate',
    value: 42.1,
    suffix: '%',
    decimals: 1,
    delta: '−2.3%',
    up: false,
    goodWhenDown: true,
    icon: MousePointerClick,
    tone: 'amber',
  },
]

const demoTopPages = [
  { page: '/home', views: '125.4K', engagement: 96 },
  { page: '/about-us', views: '92.1K', engagement: 78 },
  { page: '/contact', views: '23.1K', engagement: 54 },
  { page: '/home/iscontr', views: '14.5K', engagement: 42 },
  { page: '/products', views: '12.9K', engagement: 38 },
  { page: '/claims', views: '9.4K', engagement: 31 },
]

const demoTrafficSources = [
  { label: 'Direct', value: 28, display: '35.4K', color: '#3b82f6' },
  { label: 'Organic Search', value: 38, display: '92.1K', color: '#1e40af' },
  { label: 'Social Media', value: 24, display: '42%', color: '#10b981' },
  { label: 'Referral', value: 10, display: '4.1%', color: '#22d3ee' },
]

const demoGeoRegions: GeoRegionView[] = [
  { id: 'na', name: 'North America', visitors: '48.2K', intensity: 0.95 },
  { id: 'sa', name: 'South America', visitors: '12.4K', intensity: 0.45 },
  { id: 'eu', name: 'Europe', visitors: '28.6K', intensity: 0.72 },
  { id: 'af', name: 'Africa', visitors: '8.1K', intensity: 0.35 },
  { id: 'as', name: 'Asia', visitors: '22.8K', intensity: 0.62 },
  { id: 'me', name: 'Middle East', visitors: '18.4K', intensity: 0.88 },
  { id: 'oc', name: 'Oceania', visitors: '4.2K', intensity: 0.28 },
]

const demoDevices: BreakdownItem[] = [
  { label: 'Desktop', value: 48, display: '48%', color: '#3b82f6', count: 60200 },
  { label: 'Mobile', value: 42, display: '42%', color: '#10b981', count: 52600 },
  { label: 'Tablet', value: 10, display: '10%', color: '#f59e0b', count: 12600 },
]

const demoBrowsers: BreakdownItem[] = [
  { label: 'Chrome', value: 54, display: '67.8K', color: '#4285f4', count: 67800 },
  { label: 'Safari', value: 22, display: '27.6K', color: '#5ac8fa', count: 27600 },
  { label: 'Edge', value: 12, display: '15.0K', color: '#0078d4', count: 15000 },
  { label: 'Firefox', value: 8, display: '10.0K', color: '#ff7139', count: 10000 },
  { label: 'Other', value: 4, display: '5.0K', color: '#94a3b8', count: 5000 },
]

const demoHourlyTraffic: BreakdownItem[] = Array.from({ length: 24 }, (_, hour) => {
  // Peak mid-morning and early evening (demo shape)
  const base =
    hour < 6
      ? 8 + hour * 2
      : hour < 11
        ? 28 + (hour - 6) * 12
        : hour < 14
          ? 72 - (hour - 11) * 6
          : hour < 18
            ? 58 + (hour - 14) * 8
            : hour < 22
              ? 78 - (hour - 18) * 10
              : 28 - (hour - 22) * 6
  const count = Math.max(4, Math.round(base + (hour % 3) * 3))
  const peak = 90
  return {
    label: `${String(hour).padStart(2, '0')}:00`,
    value: Math.round((count / peak) * 100),
    display: String(count),
    color: '#8b5cf6',
    count,
  }
})

const demoTopReferrers: TopReferrer[] = [
  { host: 'google.com', visits: '42.1K', visitsRaw: 42100, share: 38 },
  { host: 'linkedin.com', visits: '18.4K', visitsRaw: 18400, share: 17 },
  { host: 'bing.com', visits: '12.2K', visitsRaw: 12200, share: 11 },
  { host: 'twitter.com', visits: '9.8K', visitsRaw: 9800, share: 9 },
  { host: 'facebook.com', visits: '8.1K', visitsRaw: 8100, share: 7 },
  { host: 't.co', visits: '5.4K', visitsRaw: 5400, share: 5 },
]

const demoLandingPages: LandingPage[] = [
  { page: '/home', sessions: '38.2K', sessionsRaw: 38200, share: 34 },
  { page: '/products', sessions: '22.1K', sessionsRaw: 22100, share: 20 },
  { page: '/about-us', sessions: '14.6K', sessionsRaw: 14600, share: 13 },
  { page: '/claims', sessions: '11.2K', sessionsRaw: 11200, share: 10 },
  { page: '/contact', sessions: '9.4K', sessionsRaw: 9400, share: 8 },
  { page: '/home/iscontr', sessions: '6.8K', sessionsRaw: 6800, share: 6 },
]

const demoEventTypes: EventTypeStat[] = [
  { type: 'pageview', label: 'Pageviews', count: 125400, display: '125.4K', color: '#3b82f6' },
  { type: 'engagement', label: 'Engagement', count: 48200, display: '48.2K', color: '#8b5cf6' },
  { type: 'session_start', label: 'Session starts', count: 38600, display: '38.6K', color: '#10b981' },
  { type: 'outbound', label: 'Outbound clicks', count: 9200, display: '9.2K', color: '#f59e0b' },
]

const demoSessions = 38600
const demoPagesPerSession = 3.2

function mapMetrics(list: AnalyticsMetric[]): MetricView[] {
  return list.map((m) => ({
    ...m,
    icon: metricMeta[m.key]?.icon ?? Eye,
    tone: metricMeta[m.key]?.tone ?? 'violet',
  }))
}

function mapGeoRegions(
  list: AnalyticsOverview['geoRegions'] | undefined,
): GeoRegionView[] {
  if (!list?.length) return demoGeoRegions
  return REGION_IDS.map((id) => {
    const row = list.find((r) => r.id === id)
    return {
      id,
      name: row?.name ?? REGION_NAMES[id] ?? id,
      visitors: row?.visitors ?? '0',
      intensity: row?.intensity ?? 0.08,
    }
  })
}

/* ─── Motion helpers ─── */

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

function useCountUp(value: number, duration = 1100, decimals = 0) {
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setN(value)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - p, 3)
      setN(value * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, reduced])

  if (decimals > 0) return (reduced ? value : n).toFixed(decimals)
  return Math.round(reduced ? value : n).toLocaleString()
}

function useStrokeDraw(
  ref: RefObject<SVGGeometryElement | null>,
  {
    delayMs = 0,
    durationMs = 900,
    deps = [] as unknown[],
  }: { delayMs?: number; durationMs?: number; deps?: unknown[] } = {},
) {
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const len = el.getTotalLength()
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    el.style.opacity = reduced ? '1' : '0.35'
    el.style.transition = 'none'

    if (reduced) {
      el.style.strokeDashoffset = '0'
      el.style.opacity = '1'
      return
    }

    let startRaf = 0
    let endTimer = 0
    const startTimer = window.setTimeout(() => {
      void el.getBoundingClientRect()
      el.style.transition = [
        `stroke-dashoffset ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        `opacity ${Math.min(400, durationMs * 0.45)}ms ease`,
      ].join(', ')
      startRaf = requestAnimationFrame(() => {
        el.style.strokeDashoffset = '0'
        el.style.opacity = '1'
      })
    }, delayMs)

    endTimer = window.setTimeout(() => {
      el.style.strokeDasharray = `${len}`
      el.style.strokeDashoffset = '0'
    }, delayMs + durationMs + 40)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(endTimer)
      cancelAnimationFrame(startRaf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, delayMs, durationMs, ref, ...deps])
}

/* ─── Chart components ─── */

/** Shared floating chart tooltip — only mount while hovering (avoids stuck-visible tips) */
function ChartTip({
  title,
  rows,
  className,
  style,
}: {
  title: string
  rows: { label: string; value: string; color?: string }[]
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn('admin-ga-tip is-open pointer-events-none z-40 min-w-[148px]', className)}
      style={style}
      role="tooltip"
    >
      <p className="admin-ga-tip-title">{title}</p>
      <ul className="mt-1 space-y-0.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-3 text-[11px]">
            <span
              className="inline-flex items-center gap-1.5 font-medium"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              {row.color ? (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: row.color }} />
              ) : null}
              {row.label}
            </span>
            <span className="font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DualAreaChart({
  data,
  showTotal,
  showUnique,
}: {
  data: { d: string; total: number; unique: number }[]
  showTotal: boolean
  showUnique: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const totalRef = useRef<SVGPathElement>(null)
  const uniqueRef = useRef<SVGPathElement>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const W = 640
  const H = 220
  const padL = 12
  const padR = 12
  const padT = 18
  const padB = 32

  const maxY = Math.max(1, ...data.map((p) => Math.max(p.total, p.unique))) * 1.15
  const xs = data.map((_, i) =>
    padL + (i / Math.max(1, data.length - 1)) * (W - padL - padR),
  )
  const totalYs = data.map((p) => padT + (1 - p.total / maxY) * (H - padT - padB))
  const uniqueYs = data.map((p) => padT + (1 - p.unique / maxY) * (H - padT - padB))

  const lineOf = (ys: number[]) =>
    xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const areaOf = (ys: number[]) => {
    const line = lineOf(ys)
    return `${line} L${xs[xs.length - 1]},${H - padB} L${xs[0]},${H - padB} Z`
  }

  const totalLine = lineOf(totalYs)
  const uniqueLine = lineOf(uniqueYs)
  const totalArea = areaOf(totalYs)
  const uniqueArea = areaOf(uniqueYs)

  useStrokeDraw(totalRef, { delayMs: 200, durationMs: 1300, deps: [totalLine, showTotal] })
  useStrokeDraw(uniqueRef, { delayMs: 320, durationMs: 1300, deps: [uniqueLine, showUnique] })

  const labelEvery = Math.ceil(data.length / 8)
  const hoverPoint = hoverIdx !== null ? data[hoverIdx] : null

  const handleMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (data.length === 0) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * W
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < xs.length; i++) {
      const dist = Math.abs(xs[i] - x)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    }
    setHoverIdx(best)
  }

  const tipLeftPct =
    hoverIdx !== null ? Math.min(88, Math.max(8, (xs[hoverIdx] / W) * 100)) : 50

  return (
    <div className="admin-cx-chart-wrap admin-ga-chart relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[180px] w-full cursor-crosshair sm:h-[210px]"
        role="img"
        aria-label="Visits over time"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={`ga-total-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`ga-unique-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`ga-tl-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id={`ga-ul-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id={`ga-glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padT + (1 - p) * (H - padT - padB)
          return (
            <line
              key={p}
              x1={padL}
              x2={W - padR}
              y1={y}
              y2={y}
              className="admin-cx-chart-grid"
              strokeDasharray="3 5"
              style={{ animationDelay: `${0.05 + i * 0.04}s` }}
            />
          )
        })}

        {showTotal ? (
          <path d={totalArea} fill={`url(#ga-total-${uid})`} className="admin-cx-chart-area" />
        ) : null}
        {showUnique ? (
          <path
            d={uniqueArea}
            fill={`url(#ga-unique-${uid})`}
            className="admin-cx-chart-area"
            style={{ animationDelay: '0.5s' } as CSSProperties}
          />
        ) : null}

        {showTotal ? (
          <path
            ref={totalRef}
            d={totalLine}
            fill="none"
            stroke={`url(#ga-tl-${uid})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#ga-glow-${uid})`}
            className="admin-cx-chart-line"
          />
        ) : null}
        {showUnique ? (
          <path
            ref={uniqueRef}
            d={uniqueLine}
            fill="none"
            stroke={`url(#ga-ul-${uid})`}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="admin-cx-chart-line"
          />
        ) : null}

        {/* Always render points; enlarge active */}
        {data.map((p, i) => {
          const active = hoverIdx === i
          return (
            <g key={`pts-${p.d}`} className="admin-cx-chart-point" style={{ animationDelay: `${0.55 + i * 0.03}s` }}>
              {showTotal ? (
                <circle
                  cx={xs[i]}
                  cy={totalYs[i]}
                  r={active ? 5.5 : 3}
                  fill="var(--a-surface)"
                  stroke="#10b981"
                  strokeWidth={active ? 2.5 : 1.75}
                  opacity={active || hoverIdx === null ? 1 : 0.35}
                />
              ) : null}
              {showUnique ? (
                <circle
                  cx={xs[i]}
                  cy={uniqueYs[i]}
                  r={active ? 5 : 2.8}
                  fill="var(--a-surface)"
                  stroke="#2563eb"
                  strokeWidth={active ? 2.5 : 1.75}
                  opacity={active || hoverIdx === null ? 1 : 0.35}
                />
              ) : null}
            </g>
          )
        })}

        {/* Hover guide */}
        {hoverIdx !== null ? (
          <g className="pointer-events-none">
            <line
              x1={xs[hoverIdx]}
              x2={xs[hoverIdx]}
              y1={padT}
              y2={H - padB}
              stroke="var(--a-primary)"
              strokeOpacity="0.35"
              strokeWidth="1.25"
              strokeDasharray="3 4"
            />
          </g>
        ) : null}

        {data.map((p, i) =>
          i % labelEvery === 0 || i === data.length - 1 ? (
            <text
              key={`l-${p.d}`}
              x={xs[i]}
              y={H - 10}
              textAnchor="middle"
              className="admin-cx-chart-label"
              style={{ animationDelay: `${0.2 + i * 0.03}s` }}
            >
              {p.d}
            </text>
          ) : null,
        )}
      </svg>

      {hoverPoint ? (
        <ChartTip
          className="absolute top-1 -translate-x-1/2"
          style={{ left: `${tipLeftPct}%` }}
          title={hoverPoint.d}
          rows={[
            ...(showTotal
              ? [{ label: 'Total visits', value: String(hoverPoint.total), color: '#10b981' }]
              : []),
            ...(showUnique
              ? [{ label: 'Unique visits', value: String(hoverPoint.unique), color: '#2563eb' }]
              : []),
            {
              label: 'Unique share',
              value:
                hoverPoint.total > 0
                  ? `${Math.round((hoverPoint.unique / hoverPoint.total) * 100)}%`
                  : '—',
            },
          ]}
        />
      ) : null}
    </div>
  )
}

function DonutChart({
  segments,
  hover,
  onHover,
}: {
  segments: { label: string; value: number; color: string; display: string }[]
  hover: number | null
  onHover: (index: number | null) => void
}) {
  const size = 156
  const stroke = 16
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const reduced = usePrefersReducedMotion()
  const [play, setPlay] = useState(false)

  const arcs = useMemo(() => {
    const lengths = segments.map((seg) => (seg.value / 100) * c)
    return segments.map((seg, i) => ({
      ...seg,
      len: lengths[i],
      offset: lengths.slice(0, i).reduce((sum, len) => sum + len, 0),
    }))
  }, [segments, c])

  useEffect(() => {
    const t = window.setTimeout(() => setPlay(true), reduced ? 0 : 100)
    return () => window.clearTimeout(t)
  }, [reduced])

  const active = hover !== null ? segments[hover] : null
  const centerValue = active ? active.display : `${segments.reduce((s, x) => s + x.value, 0)}%`
  const centerLabel = active ? active.label : 'Sources'

  return (
    <div
      className={cn('admin-cx-donut relative mx-auto h-[156px] w-[156px]', play && 'is-play')}
      onMouseLeave={() => onHover(null)}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="admin-cx-donut-svg h-full w-full -rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--a-surface-2)"
          strokeWidth={stroke}
        />
        {arcs.map((seg, i) => (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={hover === i ? stroke + 3 : stroke}
            strokeDasharray={play ? `${seg.len} ${c - seg.len}` : `0 ${c}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
            className="admin-cx-donut-seg cursor-pointer"
            style={
              {
                transitionDelay: `${0.12 + i * 0.1}s`,
                opacity: hover === null || hover === i ? 1 : 0.35,
              } as CSSProperties
            }
            onMouseEnter={() => onHover(i)}
          />
        ))}
      </svg>
      <div className="admin-cx-donut-center pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
        <p className="text-[1.2rem] font-bold tabular-nums tracking-tight" style={{ color: 'var(--a-text)' }}>
          {centerValue}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--a-muted)' }}>
          {centerLabel}
        </p>
      </div>
      {active ? (
        <ChartTip
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[110%]"
          title={active.label}
          rows={[
            { label: 'Share', value: `${active.value}%`, color: active.color },
            { label: 'Volume', value: active.display, color: active.color },
          ]}
        />
      ) : null}
    </div>
  )
}

type MetricTipState = {
  key: MetricKey
  title: string
  rows: { label: string; value: string; color?: string }[]
  /** Anchor rect in viewport coords for fixed portal placement */
  rect: { top: number; bottom: number; left: number; width: number; height: number }
  place: 'above' | 'below'
}

function MetricCardsGrid({ metrics }: { metrics: MetricView[] }) {
  const [tip, setTip] = useState<MetricTipState | null>(null)
  const cardRefs = useRef<Map<MetricKey, HTMLElement>>(new Map())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const clearTip = useCallback(() => setTip(null), [])

  const openTip = useCallback((m: MetricView, index: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const spaceAbove = rect.top
    const place: 'above' | 'below' =
      index >= 2 || spaceAbove < 96 ? 'below' : 'above'
    const valueText =
      'display' in m && m.display
        ? m.display
        : `${'decimals' in m && m.decimals ? m.value.toFixed(m.decimals) : m.value}${
            'suffix' in m && m.suffix ? m.suffix : ''
          }`
    const positive = m.goodWhenDown ? !m.up : m.up
    setTip({
      key: m.key,
      title: m.label,
      place,
      rect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      rows: [
        { label: 'Value', value: valueText },
        { label: 'Change', value: m.delta },
        {
          label: 'Trend',
          value: m.goodWhenDown
            ? positive
              ? 'Improving'
              : 'Worsening'
            : positive
              ? 'Up'
              : 'Down',
        },
      ],
    })
  }, [])

  // Keep portal tip aligned on scroll/resize while open
  useLayoutEffect(() => {
    if (!tip) return
    const el = cardRefs.current.get(tip.key)
    if (!el) return

    const sync = () => {
      const rect = el.getBoundingClientRect()
      setTip((prev) =>
        prev
          ? {
              ...prev,
              rect: {
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              },
            }
          : null,
      )
    }

    window.addEventListener('scroll', sync, true)
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync, true)
      window.removeEventListener('resize', sync)
    }
  }, [tip?.key])

  if (metrics.length === 0) {
    return (
      <p className="py-6 text-center text-[12px]" style={{ color: 'var(--a-muted)' }}>
        Select at least one metric to display.
      </p>
    )
  }

  const tipLeft = tip ? tip.rect.left + tip.rect.width / 2 : 0
  const tipTop = tip
    ? tip.place === 'below'
      ? tip.rect.bottom + 10
      : tip.rect.top - 10
    : 0

  return (
    <>
      <div
        className={cn('relative grid grid-cols-2 gap-2.5', tip && 'admin-ga-metrics-hot')}
        data-tip-open={tip ? tip.key : undefined}
      >
        {metrics.map((m, i) => {
          const Icon = m.icon
          const positive = m.goodWhenDown ? !m.up : m.up
          const open = tip?.key === m.key

          return (
            <article
              key={m.key}
              ref={(node) => {
                if (node) cardRefs.current.set(m.key, node)
                else cardRefs.current.delete(m.key)
              }}
              className="admin-ga-metric relative overflow-visible rounded-xl border p-3"
              style={
                {
                  borderColor: open
                    ? 'color-mix(in srgb, var(--a-primary) 40%, var(--a-border))'
                    : 'var(--a-border)',
                  background: 'var(--a-surface-2)',
                  animationDelay: `${0.08 + i * 0.06}s`,
                  zIndex: open ? 5 : 1,
                } as CSSProperties
              }
              onMouseEnter={(e) => openTip(m, i, e.currentTarget)}
              onMouseLeave={clearTip}
              onFocus={(e) => openTip(m, i, e.currentTarget)}
              onBlur={clearTip}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg',
                    m.tone === 'violet' && 'admin-cx-tone-violet',
                    m.tone === 'sky' && 'admin-cx-tone-sky',
                    m.tone === 'emerald' && 'admin-cx-tone-emerald',
                    m.tone === 'amber' && 'admin-cx-tone-amber',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-[11px] font-bold',
                    positive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400',
                  )}
                >
                  {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {m.delta}
                </span>
              </div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.06em]"
                style={{ color: 'var(--a-muted)' }}
              >
                {m.label}
              </p>
              <p
                className="mt-0.5 text-[1.35rem] font-bold tracking-tight tabular-nums sm:text-[1.45rem]"
                style={{ color: 'var(--a-text)' }}
              >
                {'display' in m && m.display ? (
                  m.display
                ) : (
                  <>
                    <MetricCount value={m.value} decimals={'decimals' in m ? m.decimals : 0} />
                    {'suffix' in m && m.suffix ? m.suffix : ''}
                  </>
                )}
              </p>
            </article>
          )
        })}
      </div>

      {mounted && tip
        ? createPortal(
            <div
              className="admin-ga-tip-portal-wrap"
              style={
                {
                  position: 'fixed',
                  left: tipLeft,
                  top: tip.place === 'below' ? tipTop : undefined,
                  bottom:
                    tip.place === 'above'
                      ? window.innerHeight - tip.rect.top + 10
                      : undefined,
                  transform: 'translateX(-50%)',
                  zIndex: 10000,
                  width: 'min(200px, calc(100vw - 24px))',
                  pointerEvents: 'none',
                } as CSSProperties
              }
            >
              <ChartTip
                className="admin-ga-metric-tip admin-ga-tip-portal w-full"
                title={tip.title}
                rows={tip.rows}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function TopPagesList({
  pages,
  isLive,
}: {
  pages: { page: string; views: string; engagement: number }[]
  isLive: boolean
}) {
  const [hoverPage, setHoverPage] = useState<string | null>(null)

  if (pages.length === 0) {
    return (
      <p className="py-6 text-center text-[12px]" style={{ color: 'var(--a-muted)' }}>
        {isLive
          ? 'No pageviews yet — visit the public site to start collecting data.'
          : 'No pages to show.'}
      </p>
    )
  }

  return (
    <ul className="space-y-1">
      {pages.map((row, i) => {
        const open = hoverPage === row.page
        return (
          <li
            key={row.page}
            className={cn(
              'admin-ga-page-row relative grid grid-cols-[1fr_auto_minmax(4.5rem,1fr)] items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors',
              open && 'bg-[var(--a-primary-soft)]',
            )}
            style={
              {
                animationDelay: `${0.12 + i * 0.05}s`,
                zIndex: open ? 15 : 1,
              } as CSSProperties
            }
            onMouseEnter={() => setHoverPage(row.page)}
            onMouseLeave={() => setHoverPage(null)}
          >
            <span
              className="truncate font-mono text-[12px] font-medium"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              {row.page}
            </span>
            <span className="text-right text-[12px] font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
              {row.views}
            </span>
            <div className="admin-cx-hbar-track h-2 overflow-hidden rounded-full">
              <div
                className="admin-cx-hbar-fill admin-ga-engage h-full rounded-full"
                style={
                  {
                    width: `${row.engagement}%`,
                    animationDelay: `${0.2 + i * 0.08}s`,
                  } as CSSProperties
                }
              />
            </div>
            {open ? (
              <ChartTip
                className="absolute bottom-[calc(100%+6px)] left-1/2 w-[min(220px,80vw)] -translate-x-1/2"
                title={row.page}
                rows={[
                  { label: 'Page views', value: row.views },
                  { label: 'Engagement', value: `${row.engagement}%` },
                  { label: 'Rank', value: `#${i + 1}` },
                ]}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function GeoRegionChips({ regions }: { regions: GeoRegionView[] }) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const sorted = useMemo(
    () => regions.slice().sort((a, b) => b.intensity - a.intensity).slice(0, 4),
    [regions],
  )

  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {sorted.map((r) => {
        const open = hoverId === r.id
        return (
          <span
            key={r.id}
            className="relative inline-flex cursor-default items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
            style={{
              borderColor: open
                ? 'color-mix(in srgb, #3b82f6 45%, var(--a-border))'
                : 'color-mix(in srgb, #3b82f6 25%, var(--a-border))',
              background: 'color-mix(in srgb, #3b82f6 8%, var(--a-surface))',
              color: 'var(--a-text-secondary)',
              zIndex: open ? 20 : 1,
            }}
            onMouseEnter={() => setHoverId(r.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: regionIntensityColor(r.intensity) }}
            />
            {r.name.split(' ')[0]} · {r.visitors}
            {open ? (
              <ChartTip
                className="absolute bottom-[calc(100%+8px)] left-1/2 w-[150px] -translate-x-1/2"
                title={r.name}
                rows={[
                  { label: 'Visitors', value: r.visitors },
                  { label: 'Intensity', value: `${Math.round(r.intensity * 100)}%` },
                ]}
              />
            ) : null}
          </span>
        )
      })}
    </div>
  )
}

function TrafficSourcesPanel({
  segments,
}: {
  segments: { label: string; value: number; color: string; display: string }[]
}) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div className="admin-cx-panel admin-anim-in admin-delay-3 overflow-visible lg:col-span-4">
      <div className="mb-1">
        <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
          Top Traffic Sources
        </h3>
        <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
          Channel mix · hover for detail
        </p>
      </div>
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <DonutChart segments={segments} hover={hover} onHover={setHover} />
        <ul className="w-full flex-1 space-y-1.5">
          {segments.map((seg, i) => {
            const active = hover === i
            return (
              <li
                key={seg.label}
                className={cn(
                  'admin-cx-legend relative flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[12px] transition-colors',
                  active && 'bg-[var(--a-primary-soft)]',
                )}
                style={
                  {
                    animationDelay: `${0.25 + i * 0.05}s`,
                    zIndex: active ? 12 : 1,
                  } as CSSProperties
                }
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <span
                  className="inline-flex items-center gap-2 font-medium"
                  style={{ color: 'var(--a-text-secondary)' }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ background: seg.color }}
                  />
                  {seg.label}
                </span>
                <span className="font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                  {seg.display}
                </span>
                {active ? (
                  <ChartTip
                    className="absolute right-0 top-full mt-1.5 w-[160px]"
                    title={seg.label}
                    rows={[
                      { label: 'Share', value: `${seg.value}%`, color: seg.color },
                      { label: 'Volume', value: seg.display, color: seg.color },
                    ]}
                  />
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function deviceIcon(label: string) {
  if (label === 'Mobile') return Smartphone
  if (label === 'Tablet') return Tablet
  return Monitor
}

function BreakdownBars({
  items,
  emptyLabel,
  valueSuffix = '%',
}: {
  items: BreakdownItem[]
  emptyLabel: string
  valueSuffix?: string
}) {
  const [hover, setHover] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-[12px]" style={{ color: 'var(--a-muted)' }}>
        {emptyLabel}
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const open = hover === item.label
        const Icon = deviceIcon(item.label)
        return (
          <li
            key={item.label}
            className={cn(
              'admin-ga-page-row relative rounded-lg px-1.5 py-1.5 transition-colors',
              open && 'bg-[var(--a-primary-soft)]',
            )}
            style={{ animationDelay: `${0.1 + i * 0.05}s`, zIndex: open ? 15 : 1 } as CSSProperties}
            onMouseEnter={() => setHover(item.label)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
                style={{ color: 'var(--a-text-secondary)' }}
              >
                {item.label === 'Desktop' || item.label === 'Mobile' || item.label === 'Tablet' ? (
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: item.color }} />
                ) : (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                )}
                {item.label}
              </span>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                {item.display}
                {valueSuffix === '%' && !item.display.endsWith('%') ? valueSuffix : ''}
              </span>
            </div>
            <div className="admin-cx-hbar-track h-2 overflow-hidden rounded-full">
              <div
                className="admin-cx-hbar-fill h-full rounded-full"
                style={
                  {
                    width: `${Math.min(100, Math.max(2, item.value))}%`,
                    background: item.color,
                    animationDelay: `${0.15 + i * 0.06}s`,
                  } as CSSProperties
                }
              />
            </div>
            {open ? (
              <ChartTip
                className="absolute bottom-[calc(100%+6px)] left-1/2 w-[160px] -translate-x-1/2"
                title={item.label}
                rows={[
                  { label: 'Share', value: `${item.value}%`, color: item.color },
                  { label: 'Count', value: item.count.toLocaleString(), color: item.color },
                ]}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function HourlyTrafficChart({ items }: { items: BreakdownItem[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const maxCount = Math.max(1, ...items.map((i) => i.count))

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-[12px]" style={{ color: 'var(--a-muted)' }}>
        No hourly data yet.
      </p>
    )
  }

  const peakIdx = items.reduce(
    (best, item, i) => (item.count > items[best].count ? i : best),
    0,
  )

  return (
    <div className="relative">
      <div className="flex h-[140px] items-end gap-[3px] sm:h-[160px] sm:gap-1">
        {items.map((item, i) => {
          const h = Math.max(4, Math.round((item.count / maxCount) * 100))
          const active = hover === i
          return (
            <button
              key={item.label}
              type="button"
              className="group relative flex min-w-0 flex-1 flex-col items-center justify-end"
              style={{ height: '100%' }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              aria-label={`${item.label}: ${item.count} visits`}
            >
              <div
                className="w-full max-w-[14px] rounded-t-sm transition-all duration-200 sm:max-w-[18px]"
                style={{
                  height: `${h}%`,
                  background: active
                    ? 'linear-gradient(180deg, #a78bfa, #7c3aed)'
                    : i === peakIdx
                      ? 'linear-gradient(180deg, #8b5cf6, #6d28d9)'
                      : 'linear-gradient(180deg, color-mix(in srgb, #8b5cf6 55%, transparent), color-mix(in srgb, #8b5cf6 25%, transparent))',
                  boxShadow: active
                    ? '0 0 0 1px color-mix(in srgb, #8b5cf6 40%, transparent)'
                    : undefined,
                }}
              />
            </button>
          )
        })}
      </div>
      <div className="mt-1.5 flex justify-between px-0.5 text-[9px] font-semibold tabular-nums" style={{ color: 'var(--a-muted)' }}>
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>23</span>
      </div>
      {hover !== null && items[hover] ? (
        <ChartTip
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[105%]"
          title={items[hover].label}
          rows={[
            { label: 'Visits', value: items[hover].count.toLocaleString(), color: '#8b5cf6' },
            {
              label: 'vs peak',
              value: `${items[hover].value}%`,
              color: '#8b5cf6',
            },
          ]}
        />
      ) : null}
      <p className="mt-2 text-[11px]" style={{ color: 'var(--a-muted)' }}>
        Peak hour · <span className="font-semibold" style={{ color: 'var(--a-text-secondary)' }}>{items[peakIdx]?.label}</span>
        {' · '}
        {items[peakIdx]?.count.toLocaleString()} visits
      </p>
    </div>
  )
}

function TopReferrersList({
  items,
  isLive,
}: {
  items: TopReferrer[]
  isLive: boolean
}) {
  const [hover, setHover] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-[12px]" style={{ color: 'var(--a-muted)' }}>
        {isLive ? 'No external referrers in this period.' : 'No referrers to show.'}
      </p>
    )
  }

  return (
    <ul className="space-y-1">
      {items.map((row, i) => {
        const open = hover === row.host
        return (
          <li
            key={row.host}
            className={cn(
              'admin-ga-page-row relative grid grid-cols-[1fr_auto_minmax(3.5rem,auto)] items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors',
              open && 'bg-[var(--a-primary-soft)]',
            )}
            style={{ animationDelay: `${0.1 + i * 0.05}s`, zIndex: open ? 15 : 1 } as CSSProperties}
            onMouseEnter={() => setHover(row.host)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className="truncate font-mono text-[12px] font-medium"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              {row.host}
            </span>
            <span className="text-right text-[12px] font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
              {row.visits}
            </span>
            <span className="text-right text-[11px] font-semibold tabular-nums" style={{ color: 'var(--a-muted)' }}>
              {row.share}%
            </span>
            {open ? (
              <ChartTip
                className="absolute bottom-[calc(100%+6px)] left-1/2 w-[180px] -translate-x-1/2"
                title={row.host}
                rows={[
                  { label: 'Visits', value: row.visits },
                  { label: 'Share', value: `${row.share}%` },
                  { label: 'Rank', value: `#${i + 1}` },
                ]}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function LandingPagesList({
  items,
  isLive,
}: {
  items: LandingPage[]
  isLive: boolean
}) {
  const [hover, setHover] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-[12px]" style={{ color: 'var(--a-muted)' }}>
        {isLive ? 'No landing pages yet.' : 'No landing pages to show.'}
      </p>
    )
  }

  return (
    <ul className="space-y-1">
      {items.map((row, i) => {
        const open = hover === row.page
        return (
          <li
            key={row.page}
            className={cn(
              'admin-ga-page-row relative grid grid-cols-[1fr_auto_minmax(4rem,1fr)] items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors',
              open && 'bg-[var(--a-primary-soft)]',
            )}
            style={{ animationDelay: `${0.1 + i * 0.05}s`, zIndex: open ? 15 : 1 } as CSSProperties}
            onMouseEnter={() => setHover(row.page)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className="truncate font-mono text-[12px] font-medium"
              style={{ color: 'var(--a-text-secondary)' }}
            >
              {row.page}
            </span>
            <span className="text-right text-[12px] font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
              {row.sessions}
            </span>
            <div className="admin-cx-hbar-track h-2 overflow-hidden rounded-full">
              <div
                className="admin-cx-hbar-fill h-full rounded-full"
                style={
                  {
                    width: `${Math.min(100, Math.max(4, row.share))}%`,
                    background: 'linear-gradient(90deg, #34d399, #059669)',
                    animationDelay: `${0.15 + i * 0.06}s`,
                  } as CSSProperties
                }
              />
            </div>
            {open ? (
              <ChartTip
                className="absolute bottom-[calc(100%+6px)] left-1/2 w-[190px] -translate-x-1/2"
                title={row.page}
                rows={[
                  { label: 'Sessions', value: row.sessions },
                  { label: 'Share', value: `${row.share}%` },
                  { label: 'Rank', value: `#${i + 1}` },
                ]}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function EventTypesPanel({ items }: { items: EventTypeStat[] }) {
  const [hover, setHover] = useState<string | null>(null)
  const total = Math.max(1, items.reduce((s, x) => s + x.count, 0))

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-[12px]" style={{ color: 'var(--a-muted)' }}>
        No events in this period.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const open = hover === item.type
        const pct = Math.round((item.count / total) * 100)
        return (
          <li
            key={item.type}
            className={cn(
              'relative rounded-lg border px-2.5 py-2 transition-colors',
              open && 'bg-[var(--a-primary-soft)]',
            )}
            style={
              {
                borderColor: open
                  ? 'color-mix(in srgb, var(--a-primary) 35%, var(--a-border))'
                  : 'var(--a-border)',
                background: open ? undefined : 'var(--a-surface-2)',
                animationDelay: `${0.08 + i * 0.05}s`,
                zIndex: open ? 12 : 1,
              } as CSSProperties
            }
            onMouseEnter={() => setHover(item.type)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold" style={{ color: 'var(--a-text)' }}>
                <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                {item.label}
              </span>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                {item.display}
              </span>
            </div>
            <div className="mt-1.5 admin-cx-hbar-track h-1.5 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(3, pct))}%`, background: item.color }}
              />
            </div>
            {open ? (
              <ChartTip
                className="absolute bottom-[calc(100%+6px)] left-1/2 w-[160px] -translate-x-1/2"
                title={item.label}
                rows={[
                  { label: 'Events', value: item.count.toLocaleString(), color: item.color },
                  { label: 'Share', value: `${pct}%`, color: item.color },
                ]}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function SessionStatsStrip({
  sessions,
  pagesPerSession,
  rangeLabel,
}: {
  sessions: number
  pagesPerSession: number
  rangeLabel: string
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <div
        className="admin-anim-in rounded-xl border px-3 py-2.5"
        style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-2)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: 'var(--a-muted)' }}>
          Sessions · {rangeLabel}
        </p>
        <p className="mt-0.5 text-[1.35rem] font-bold tabular-nums tracking-tight" style={{ color: 'var(--a-text)' }}>
          <MetricCount value={sessions >= 1000 ? sessions / 1000 : sessions} decimals={sessions >= 1000 ? 1 : 0} />
          {sessions >= 1000 ? 'K' : ''}
        </p>
      </div>
      <div
        className="admin-anim-in rounded-xl border px-3 py-2.5"
        style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-2)', animationDelay: '0.06s' } as CSSProperties}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: 'var(--a-muted)' }}>
          Pages / session
        </p>
        <p className="mt-0.5 text-[1.35rem] font-bold tabular-nums tracking-tight" style={{ color: 'var(--a-text)' }}>
          <MetricCount value={pagesPerSession} decimals={1} />
        </p>
      </div>
    </div>
  )
}

/* ─── Small UI bits ─── */

function RangeSelect({
  value,
  onChange,
}: {
  value: DateRange
  onChange: (v: DateRange) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="admin-ga-select inline-flex h-9 min-w-[9.75rem] items-center justify-between gap-2 whitespace-nowrap rounded-xl border px-3 text-[12px] font-semibold transition-all sm:min-w-[10.5rem]"
        style={{
          borderColor: open ? 'var(--a-primary)' : 'var(--a-border)',
          background: 'var(--a-surface)',
          color: 'var(--a-text)',
          boxShadow: open ? '0 0 0 2px color-mix(in srgb, var(--a-primary) 22%, transparent)' : undefined,
        }}
      >
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--a-muted)' }} />
          <span className="truncate">{rangeLabels[value]}</span>
        </span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')}
          style={{ color: 'var(--a-muted)' }}
        />
      </button>
      {open ? (
        <div
          className="admin-ga-dropdown absolute left-0 z-50 mt-1.5 w-full min-w-[10.5rem] overflow-hidden rounded-xl border p-1 shadow-xl sm:left-auto sm:right-0"
          style={{
            background: 'var(--a-surface)',
            borderColor: 'var(--a-border)',
          }}
        >
          {(Object.keys(rangeLabels) as DateRange[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onChange(key)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition-colors',
                value === key ? 'bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)]' : 'hover:bg-[var(--a-surface-2)]',
              )}
              style={{ color: value === key ? undefined : 'var(--a-text)' }}
            >
              {rangeLabels[key]}
              {value === key ? <Check className="h-3.5 w-3.5" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label
      className="admin-card-hover flex cursor-pointer items-start justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors"
      style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface-2)' }}
    >
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold" style={{ color: 'var(--a-text)' }}>
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[11px] leading-relaxed" style={{ color: 'var(--a-text-secondary)' }}>
            {description}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-[var(--a-primary)]' : 'bg-slate-300 dark:bg-slate-600',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  )
}

/* ─── Page ─── */

export default function AdminGoogleAnalyticsPage() {
  const [range, setRange] = useState<DateRange>('30d')
  const [compareRange, setCompareRange] = useState<DateRange>('30d')
  const [showTotal, setShowTotal] = useState(true)
  const [showUnique, setShowUnique] = useState(true)
  const [editMetrics, setEditMetrics] = useState(false)
  const [visibleMetrics, setVisibleMetrics] = useState<Record<MetricKey, boolean>>({
    visits: true,
    unique: true,
    duration: true,
    bounce: true,
  })
  const [configOpen, setConfigOpen] = useState(false)
  const [config, setConfig] = useState<GaConfig>(defaultGaConfig)
  const [draft, setDraft] = useState<GaConfig>(defaultGaConfig)
  const [hydrated, setHydrated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingLive, setLoadingLive] = useState(false)
  const [liveError, setLiveError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'live' | 'demo'>('demo')
  const [totalEvents, setTotalEvents] = useState(0)
  const [keyMetrics, setKeyMetrics] = useState<MetricView[]>(demoKeyMetrics)
  const [visitsOverTime, setVisitsOverTime] = useState(demoVisitsOverTime)
  const [topPages, setTopPages] = useState(demoTopPages)
  const [trafficSources, setTrafficSources] = useState(demoTrafficSources)
  const [geoRegions, setGeoRegions] = useState<GeoRegionView[]>(demoGeoRegions)
  const [devices, setDevices] = useState<BreakdownItem[]>(demoDevices)
  const [browsers, setBrowsers] = useState<BreakdownItem[]>(demoBrowsers)
  const [hourlyTraffic, setHourlyTraffic] = useState<BreakdownItem[]>(demoHourlyTraffic)
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>(demoTopReferrers)
  const [landingPages, setLandingPages] = useState<LandingPage[]>(demoLandingPages)
  const [eventTypes, setEventTypes] = useState<EventTypeStat[]>(demoEventTypes)
  const [sessions, setSessions] = useState(demoSessions)
  const [pagesPerSession, setPagesPerSession] = useState(demoPagesPerSession)

  const applyDemoData = useCallback(() => {
    setDataSource('demo')
    setTotalEvents(0)
    setKeyMetrics(demoKeyMetrics)
    setVisitsOverTime(demoVisitsOverTime)
    setTopPages(demoTopPages)
    setTrafficSources(demoTrafficSources)
    setGeoRegions(demoGeoRegions)
    setDevices(demoDevices)
    setBrowsers(demoBrowsers)
    setHourlyTraffic(demoHourlyTraffic)
    setTopReferrers(demoTopReferrers)
    setLandingPages(demoLandingPages)
    setEventTypes(demoEventTypes)
    setSessions(demoSessions)
    setPagesPerSession(demoPagesPerSession)
    setLiveError(null)
  }, [])

  const applyLiveOverview = useCallback((overview: AnalyticsOverview) => {
    setDataSource('live')
    setTotalEvents(overview.totalEvents)
    setKeyMetrics(mapMetrics(overview.metrics))
    setVisitsOverTime(
      overview.visitsOverTime.length > 0 ? overview.visitsOverTime : demoVisitsOverTime,
    )
    setTopPages(
      overview.topPages.length > 0
        ? overview.topPages.map((p) => ({
            page: p.page,
            views: p.views,
            engagement: p.engagement,
          }))
        : [],
    )
    setTrafficSources(
      overview.trafficSources.length > 0 ? overview.trafficSources : demoTrafficSources,
    )
    setGeoRegions(mapGeoRegions(overview.geoRegions))
    setDevices(overview.devices?.length ? overview.devices : [])
    setBrowsers(overview.browsers?.length ? overview.browsers : [])
    setHourlyTraffic(overview.hourlyTraffic?.length ? overview.hourlyTraffic : [])
    setTopReferrers(overview.topReferrers?.length ? overview.topReferrers : [])
    setLandingPages(overview.landingPages?.length ? overview.landingPages : [])
    setEventTypes(overview.eventTypes?.length ? overview.eventTypes : [])
    setSessions(typeof overview.sessions === 'number' ? overview.sessions : 0)
    setPagesPerSession(
      typeof overview.pagesPerSession === 'number' ? overview.pagesPerSession : 0,
    )
    setLiveError(null)
  }, [])

  const fetchLiveOverview = useCallback(
    async (selectedRange: DateRange) => {
      setLoadingLive(true)
      setLiveError(null)
      try {
        const overview = await analyticsApi.getOverview(selectedRange)
        applyLiveOverview(overview)
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to load live analytics'
        setLiveError(message)
        // Keep last live dataset if we already had one; otherwise fall back demo
        setDataSource((prev) => prev)
      } finally {
        setLoadingLive(false)
      }
    },
    [applyLiveOverview],
  )

  // Load settings from API
  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const settings = await analyticsApi.getSettings()
        if (cancelled) return
        setConfig(settings)
        setDraft(settings)
        setHydrated(true)
        if (settings.enabled) {
          await fetchLiveOverview(range)
        } else {
          applyDemoData()
        }
      } catch {
        if (cancelled) return
        setHydrated(true)
        applyDemoData()
        setLiveError('Could not load analytics settings from server')
      }
    })()
    return () => {
      cancelled = true
    }
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refetch live data when range changes (only if tracking enabled)
  useEffect(() => {
    if (!hydrated || !config.enabled) return
    void fetchLiveOverview(range)
  }, [range, config.enabled, hydrated, fetchLiveOverview])

  const metrics = keyMetrics.filter((m) => visibleMetrics[m.key])

  const isLive = hydrated && config.enabled
  const hasGaId = /^G-[A-Z0-9]+$/i.test(config.measurementId.trim())

  const handleSaveConfig = useCallback(async () => {
    const id = draft.measurementId.trim()
    if (id && !/^G-[A-Z0-9]+$/i.test(id)) {
      swalToast('Measurement ID should look like G-XXXXXXXX', 'warning')
      return
    }
    setSaving(true)
    try {
      const saved = await analyticsApi.updateSettings({
        measurementId: draft.measurementId,
        propertyName: draft.propertyName,
        streamUrl: draft.streamUrl,
        enabled: draft.enabled,
        anonymizeIp: draft.anonymizeIp,
        enhancedMeasurement: draft.enhancedMeasurement,
        trackOutbound: draft.trackOutbound,
        debugMode: draft.debugMode,
      })
      setConfig(saved)
      setDraft(saved)
      if (saved.enabled) {
        await fetchLiveOverview(range)
        swalToast(
          hasGaId || saved.measurementId
            ? 'Tracking enabled — loading live data'
            : 'First-party tracking enabled',
          'success',
        )
      } else {
        applyDemoData()
        swalToast('Tracking disabled — showing demo data', 'success')
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to save analytics settings'
      swalToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }, [draft, range, fetchLiveOverview, applyDemoData, hasGaId])

  const handleTest = useCallback(async () => {
    try {
      const publicCfg = await analyticsApi.getPublicConfig()
      if (!publicCfg.enabled) {
        swalToast('Enable tracking and save first', 'warning')
        return
      }
      swalToast(
        publicCfg.measurementId
          ? `Live tracking OK · ${publicCfg.measurementId}`
          : 'First-party tracking is active',
        'success',
      )
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Connection test failed'
      swalToast(message, 'error')
    }
  }, [])

  return (
    <div className="admin-cx-page admin-ga-page relative flex flex-col gap-3.5 pb-1">
      <div className="admin-cx-dots pointer-events-none absolute -right-4 top-0 h-36 w-36 opacity-30" aria-hidden />
      <div className="admin-cx-mesh pointer-events-none absolute inset-x-0 top-0 h-48 opacity-55" aria-hidden />

      {/* ═══ Header ═══ */}
      <header className="admin-cx-header admin-anim-scale admin-ga-header relative z-20 overflow-visible rounded-2xl px-4 py-4 sm:px-5">
        {/* Decorative layers clipped so glow/shine never hide controls */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
          <div className="admin-cx-header-glow absolute -right-10 -top-16 h-44 w-44 rounded-full blur-3xl" />
          <div className="admin-cx-header-glow-b absolute -bottom-16 left-1/3 h-36 w-36 rounded-full blur-3xl" />
          <div className="admin-cx-header-shine absolute inset-0" />
        </div>

        <div className="relative z-10 flex flex-col gap-3.5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="admin-cx-kicker text-[10px] font-bold uppercase tracking-[0.14em]">
                  Site Analytics · Performance
                </p>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    isLive ? 'admin-cx-live' : 'admin-cx-chip !py-0.5',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      isLive ? 'admin-dot-live bg-emerald-500' : 'bg-amber-400',
                    )}
                  />
                  {loadingLive
                    ? 'Loading live…'
                    : isLive
                      ? dataSource === 'live'
                        ? hasGaId
                          ? `Live · ${totalEvents} events`
                          : `Live tracking · ${totalEvents} events`
                        : 'Live (waiting for traffic)'
                      : 'Demo data'}
                </span>
              </div>
              <h2 className="mt-1 text-[1.25rem] font-bold tracking-tight sm:text-[1.4rem]" style={{ color: 'var(--a-text)' }}>
                Analytics Overview
              </h2>
              <p className="mt-0.5 max-w-xl text-[12px] leading-relaxed" style={{ color: 'var(--a-text-secondary)' }}>
                {isLive
                  ? 'Showing real traffic from first-party tracking (and GA4 when a Measurement ID is set).'
                  : 'Demo charts until you enable tracking under Configure GA.'}
              </p>
              {liveError ? (
                <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {liveError}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {isLive ? (
                <button
                  type="button"
                  onClick={() => void fetchLiveOverview(range)}
                  disabled={loadingLive}
                  className="admin-btn-ghost h-9 shrink-0 gap-1.5 px-3 text-[12px] font-semibold disabled:opacity-60"
                >
                  <Activity className={cn('h-3.5 w-3.5', loadingLive && 'animate-pulse')} />
                  Refresh
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setConfigOpen((v) => !v)}
                className="admin-btn-primary h-9 shrink-0 gap-1.5 px-3 text-[12px] font-semibold"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Configure GA
              </button>
            </div>
          </div>

          {/* Date ranges on their own row so labels stay fully visible */}
          <div className="admin-ga-range-bar flex flex-wrap items-center gap-2 border-t pt-3" style={{ borderColor: 'var(--a-border)' }}>
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--a-muted)' }}>
              Period
            </span>
            <RangeSelect value={range} onChange={setRange} />
            <span className="text-[11px] font-semibold" style={{ color: 'var(--a-muted)' }}>
              vs
            </span>
            <RangeSelect value={compareRange} onChange={setCompareRange} />
          </div>
        </div>
      </header>

      {/* ═══ GA Configuration ═══ */}
      {configOpen ? (
        <section className="admin-cx-panel admin-anim-in admin-ga-config relative overflow-hidden">
          <div className="admin-cx-panel-glow pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl" aria-hidden />
          <div className="relative mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #3b25b0, #5b42ec)' }}
              >
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--a-text)' }}>
                  Google Analytics configuration
                </h3>
                <p className="mt-0.5 text-[12px]" style={{ color: 'var(--a-text-secondary)' }}>
                  Enable tracking to collect real site traffic. Optional GA4 Measurement ID also loads gtag.js on public pages.
                </p>
              </div>
            </div>
            <span className="admin-cx-chip">
              <Sparkles className="h-3 w-3" />
              GA4
            </span>
          </div>

          <div className="relative grid gap-3 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--a-muted)' }}>
                    <KeyRound className="h-3 w-3" />
                    Measurement ID
                  </span>
                  <input
                    value={draft.measurementId}
                    onChange={(e) => setDraft((d) => ({ ...d, measurementId: e.target.value.toUpperCase() }))}
                    placeholder="G-XXXXXXXXXX"
                    className="admin-ga-input h-10 w-full rounded-xl border px-3 text-[13px] font-semibold outline-none transition-shadow focus:ring-2 focus:ring-[color-mix(in_srgb,var(--a-primary)_35%,transparent)]"
                    style={{
                      borderColor: 'var(--a-border)',
                      background: 'var(--a-surface)',
                      color: 'var(--a-text)',
                    }}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--a-muted)' }}>
                    <Globe2 className="h-3 w-3" />
                    Property name
                  </span>
                  <input
                    value={draft.propertyName}
                    onChange={(e) => setDraft((d) => ({ ...d, propertyName: e.target.value }))}
                    placeholder="Website property"
                    className="admin-ga-input h-10 w-full rounded-xl border px-3 text-[13px] font-medium outline-none transition-shadow focus:ring-2 focus:ring-[color-mix(in_srgb,var(--a-primary)_35%,transparent)]"
                    style={{
                      borderColor: 'var(--a-border)',
                      background: 'var(--a-surface)',
                      color: 'var(--a-text)',
                    }}
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--a-muted)' }}>
                  <Link2 className="h-3 w-3" />
                  Stream URL
                </span>
                <input
                  value={draft.streamUrl}
                  onChange={(e) => setDraft((d) => ({ ...d, streamUrl: e.target.value }))}
                  placeholder="https://example.com"
                  className="admin-ga-input h-10 w-full rounded-xl border px-3 text-[13px] font-medium outline-none transition-shadow focus:ring-2 focus:ring-[color-mix(in_srgb,var(--a-primary)_35%,transparent)]"
                  style={{
                    borderColor: 'var(--a-border)',
                    background: 'var(--a-surface)',
                    color: 'var(--a-text)',
                  }}
                />
              </label>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={saving}
                  className="admin-btn-primary h-9 gap-1.5 px-4 text-[12px] font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save configuration'}
                </button>
                <button
                  type="button"
                  onClick={handleTest}
                  className="admin-btn-ghost h-9 gap-1.5 px-3 text-[12px] font-semibold"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Test connection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(config)
                    setConfigOpen(false)
                  }}
                  className="admin-btn-ghost h-9 px-3 text-[12px] font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="space-y-2 lg:col-span-5">
              <Toggle
                checked={draft.enabled}
                onChange={(v) => setDraft((d) => ({ ...d, enabled: v }))}
                label="Enable tracking"
                description="Inject gtag.js on public pages when Measurement ID is set."
              />
              <Toggle
                checked={draft.anonymizeIp}
                onChange={(v) => setDraft((d) => ({ ...d, anonymizeIp: v }))}
                label="Anonymize IP"
                description="Recommended for privacy compliance (GDPR / PDPL)."
              />
              <Toggle
                checked={draft.enhancedMeasurement}
                onChange={(v) => setDraft((d) => ({ ...d, enhancedMeasurement: v }))}
                label="Enhanced measurement"
                description="Scrolls, outbound clicks, site search, and file downloads."
              />
              <Toggle
                checked={draft.trackOutbound}
                onChange={(v) => setDraft((d) => ({ ...d, trackOutbound: v }))}
                label="Track outbound links"
              />
              <Toggle
                checked={draft.debugMode}
                onChange={(v) => setDraft((d) => ({ ...d, debugMode: v }))}
                label="Debug mode"
                description="Log events to the console — use only while testing."
              />
            </div>
          </div>

          {config.enabled ? (
            <div
              className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5 text-[12px]"
              style={{
                borderColor: 'color-mix(in srgb, var(--a-success) 25%, var(--a-border))',
                background: 'var(--a-success-soft)',
                color: 'var(--a-success)',
              }}
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="font-semibold">
                Tracking on
                {config.measurementId ? ` · ${config.measurementId}` : ' · first-party only'}
                {config.propertyName ? ` · ${config.propertyName}` : ''}
              </span>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ═══ Main grid: Key metrics + Visits chart ═══ */}
      <section className="grid gap-3 xl:grid-cols-12">
        {/* Key Metrics — elevated stacking so sibling panels don't cover tips */}
        <div className="admin-cx-panel admin-anim-in admin-delay-1 admin-ga-metrics-panel relative overflow-visible xl:col-span-4">
          <div className="admin-cx-panel-glow pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full blur-2xl" aria-hidden />
          <div className="relative mb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                Key Metrics
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
                {rangeLabels[range]} snapshot
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditMetrics((v) => !v)}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors',
                editMetrics
                  ? 'bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)]'
                  : 'text-[var(--a-primary-soft-text)] hover:bg-[var(--a-primary-soft)]',
              )}
            >
              <Star className={cn('h-3 w-3', editMetrics && 'fill-current')} />
              Edit Metrics
            </button>
          </div>

          {editMetrics ? (
            <div className="mb-3 grid grid-cols-2 gap-1.5">
              {keyMetrics.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() =>
                    setVisibleMetrics((prev) => ({
                      ...prev,
                      [m.key]: !prev[m.key],
                    }))
                  }
                  className={cn(
                    'rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition-all',
                    visibleMetrics[m.key]
                      ? 'border-[var(--a-primary)] bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)]'
                      : 'border-[var(--a-border)] text-[var(--a-muted)]',
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          ) : null}

          <MetricCardsGrid metrics={metrics} />
        </div>

        {/* Visits over Time */}
        <div className="admin-cx-panel admin-anim-in admin-delay-2 relative overflow-visible xl:col-span-8">
          <div className="admin-cx-panel-glow pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl" aria-hidden />
          <div className="relative flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                  Visits over Time
                </h3>
              </div>
              <p className="mt-0.5 text-[11px]" style={{ color: 'var(--a-muted)' }}>
                Dual-series area chart · animated draw
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowTotal((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all',
                  showTotal
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-[var(--a-border)] text-[var(--a-muted)]',
                )}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Total Visits
              </button>
              <button
                type="button"
                onClick={() => setShowUnique((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all',
                  showUnique
                    ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-[var(--a-border)] text-[var(--a-muted)]',
                )}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Unique Visits
              </button>
            </div>
          </div>

          <div className="mt-2">
            <DualAreaChart data={visitsOverTime} showTotal={showTotal} showUnique={showUnique} />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-4 text-[10px] font-semibold" style={{ color: 'var(--a-muted)' }}>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500" />
              Total Visits
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-gradient-to-r from-sky-300 to-blue-600" />
              Unique Visits
            </span>
            <span className="ml-auto tabular-nums">
              Peak {Math.max(0, ...visitsOverTime.map((p) => p.total))} · {rangeLabels[range]}
            </span>
          </div>
        </div>
      </section>

      {/* ═══ Bottom row ═══ */}
      <section className="grid gap-3 lg:grid-cols-12">
        {/* Top Pages */}
        <div className="admin-cx-panel admin-anim-in admin-delay-2 overflow-visible lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                Top Pages
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
                Views · engagement score
              </p>
            </div>
          </div>
          <div className="mb-1.5 grid grid-cols-[1fr_auto_minmax(4.5rem,1fr)] gap-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--a-muted)' }}>
            <span>Page</span>
            <span className="text-right">Views</span>
            <span className="text-right">Engagement</span>
          </div>
          <TopPagesList pages={topPages} isLive={isLive} />
        </div>

        {/* Traffic sources */}
        <TrafficSourcesPanel segments={trafficSources} />

        {/* Geo */}
        <div className="admin-cx-panel admin-anim-in admin-delay-3 relative overflow-visible lg:col-span-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                Geographic Distribution
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
                Global visitors · hover a region
              </p>
            </div>
            <span className="admin-cx-chip !px-2 !py-0.5">
              <Globe2 className="h-3 w-3 text-blue-500" />
              World
            </span>
          </div>
          <AnalyticsWorldMap regions={geoRegions} />
          <GeoRegionChips regions={geoRegions} />
        </div>
      </section>

      {/* ═══ Devices · Browsers · Hourly ═══ */}
      <section className="grid gap-3 lg:grid-cols-12">
        <div className="admin-cx-panel admin-anim-in overflow-visible lg:col-span-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                Devices
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
                Desktop · mobile · tablet
              </p>
            </div>
            <span className="admin-cx-chip !px-2 !py-0.5">
              <Laptop className="h-3 w-3 text-sky-500" />
              Tech
            </span>
          </div>
          <BreakdownBars
            items={devices}
            emptyLabel={isLive ? 'No device data yet.' : 'No devices to show.'}
          />
        </div>

        <div className="admin-cx-panel admin-anim-in overflow-visible lg:col-span-3">
          <div className="mb-3">
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
              Browsers
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
              Top clients by pageviews
            </p>
          </div>
          <BreakdownBars
            items={browsers}
            emptyLabel={isLive ? 'No browser data yet.' : 'No browsers to show.'}
            valueSuffix=""
          />
        </div>

        <div className="admin-cx-panel admin-anim-in relative overflow-visible lg:col-span-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-violet-500" />
                <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                  Traffic by Hour
                </h3>
              </div>
              <p className="mt-0.5 text-[11px]" style={{ color: 'var(--a-muted)' }}>
                Pageviews across 24 hours · hover a bar
              </p>
            </div>
          </div>
          <HourlyTrafficChart items={hourlyTraffic} />
        </div>
      </section>

      {/* ═══ Referrers · Landings · Events ═══ */}
      <section className="grid gap-3 lg:grid-cols-12">
        <div className="admin-cx-panel admin-anim-in overflow-visible lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                Top Referrers
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
                External hosts driving traffic
              </p>
            </div>
          </div>
          <div
            className="mb-1.5 grid grid-cols-[1fr_auto_minmax(3.5rem,auto)] gap-2 text-[10px] font-bold uppercase tracking-wide"
            style={{ color: 'var(--a-muted)' }}
          >
            <span>Host</span>
            <span className="text-right">Visits</span>
            <span className="text-right">Share</span>
          </div>
          <TopReferrersList items={topReferrers} isLive={isLive} />
        </div>

        <div className="admin-cx-panel admin-anim-in overflow-visible lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                Landing Pages
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
                First page in each session
              </p>
            </div>
          </div>
          <div
            className="mb-1.5 grid grid-cols-[1fr_auto_minmax(4rem,1fr)] gap-2 text-[10px] font-bold uppercase tracking-wide"
            style={{ color: 'var(--a-muted)' }}
          >
            <span>Page</span>
            <span className="text-right">Sessions</span>
            <span className="text-right">Share</span>
          </div>
          <LandingPagesList items={landingPages} isLive={isLive} />
        </div>

        <div className="admin-cx-panel admin-anim-in overflow-visible lg:col-span-4">
          <div className="mb-3">
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
              Event Mix & Sessions
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
              Captured event types · engagement depth
            </p>
          </div>
          <SessionStatsStrip
            sessions={sessions}
            pagesPerSession={pagesPerSession}
            rangeLabel={rangeLabels[range]}
          />
          <div className="mt-3">
            <EventTypesPanel items={eventTypes} />
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCount({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const display = useCountUp(value, 1000, decimals)
  return <span className="tabular-nums">{display}</span>
}
