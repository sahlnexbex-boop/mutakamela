'use client'

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  ClipboardList,
  Download,
  FileText,
  HardHat,
  History,
  Info,
  Lock,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { cn } from '@/lib/utils'

/* ─── Mock data ─── */

const snapshotKpis = [
  {
    label: 'Policies today',
    value: 342,
    decimals: 0,
    delta: '+18%',
    up: true,
    spark: [18, 24, 22, 31, 28, 36, 42, 38, 48, 52, 46, 58],
    accent: 'violet' as const,
  },
  {
    label: 'Pay success',
    value: 98.4,
    suffix: '%',
    decimals: 1,
    delta: '+0.6%',
    up: true,
    spark: [94, 95, 96, 95.5, 97, 97.2, 98, 97.8, 98.2, 98.4, 98.1, 98.4],
    accent: 'emerald' as const,
  },
  {
    label: 'Open tickets',
    value: 127,
    decimals: 0,
    delta: '−8%',
    up: false,
    spark: [168, 155, 162, 148, 142, 138, 145, 132, 128, 135, 130, 127],
    accent: 'amber' as const,
  },
  {
    label: 'App NPS',
    value: 61,
    decimals: 0,
    prefix: '+',
    delta: '+4',
    up: true,
    spark: [48, 50, 52, 51, 54, 55, 56, 57, 58, 59, 60, 61],
    accent: 'sky' as const,
  },
]

const weeklyProduction = [
  { day: 'Mon', gwp: 4.2, policies: 280 },
  { day: 'Tue', gwp: 5.1, policies: 312 },
  { day: 'Wed', gwp: 4.8, policies: 298 },
  { day: 'Thu', gwp: 6.4, policies: 365 },
  { day: 'Fri', gwp: 7.1, policies: 402 },
  { day: 'Sat', gwp: 3.6, policies: 210 },
  { day: 'Sun', gwp: 2.9, policies: 168 },
]

const lobMix = [
  { label: 'Motor Insurance', value: 38, color: '#5b42ec' },
  { label: 'Travel Insurance', value: 18, color: '#0284c7' },
  { label: 'Life Insurance', value: 16, color: '#10b981' },
  { label: 'Visit Visa Insurance', value: 14, color: '#f59e0b' },
  { label: 'General & Property Insurance', value: 14, color: '#94a3b8' },
]

const paymentChannels = [
  { name: 'MyFatoorah', pct: 48, color: '#5b42ec' },
  { name: 'SADAD', pct: 31, color: '#0284c7' },
  { name: 'STC Pay', pct: 15, color: '#10b981' },
  { name: 'Card / Other', pct: 6, color: '#f59e0b' },
]

const governanceModules: {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  metric: string
  metricLabel: string
  trend?: string
  up?: boolean
  spark: number[]
  tone: 'violet' | 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo'
}[] = [
  {
    title: 'Production & Transactions',
    description: 'GWP · policy count · LOB drill-down',
    icon: HardHat,
    metric: 'SAR 48.2M',
    metricLabel: 'MTD GWP',
    trend: '+12.4%',
    up: true,
    spark: [32, 40, 38, 48, 52, 50, 62, 70],
    tone: 'violet',
  },
  {
    title: 'Policy Management',
    description: 'Audit trail · NIC · plate · phone search',
    icon: FileText,
    metric: '18,426',
    metricLabel: 'Active policies',
    trend: '+3.1%',
    up: true,
    spark: [44, 46, 48, 47, 50, 52, 54, 55],
    tone: 'sky',
  },
  {
    title: 'Complaints & Enquiries',
    description: 'Logs & audit history by customer',
    icon: MessageSquareText,
    metric: '127',
    metricLabel: 'Open tickets',
    trend: '−8%',
    up: false,
    spark: [70, 65, 62, 58, 55, 52, 48, 45],
    tone: 'amber',
  },
  {
    title: 'Payment History',
    description: 'MyFatoorah · SADAD · STC · refunds',
    icon: History,
    metric: '94.8%',
    metricLabel: 'Success rate',
    trend: '+1.2%',
    up: true,
    spark: [88, 90, 91, 92, 93, 94, 94.5, 95],
    tone: 'emerald',
  },
  {
    title: 'Failed Transactions',
    description: 'Abandon · IMS/API · resolution tags',
    icon: AlertTriangle,
    metric: '34',
    metricLabel: 'Unresolved today',
    trend: '−22%',
    up: false,
    spark: [55, 50, 48, 42, 40, 38, 35, 32],
    tone: 'rose',
  },
  {
    title: 'User & Access',
    description: 'RBAC · Nafath · 2FA · lock / unlock',
    icon: Users,
    metric: '86',
    metricLabel: 'Admin seats',
    spark: [60, 62, 64, 66, 68, 70, 72, 74],
    tone: 'indigo',
  },
  {
    title: 'Campaign Manager',
    description: 'Renewal · cross-sell · conversion',
    icon: Megaphone,
    metric: '12',
    metricLabel: 'Live campaigns',
    trend: '+4',
    up: true,
    spark: [20, 28, 35, 40, 48, 55, 62, 70],
    tone: 'violet',
  },
  {
    title: 'Notification Center',
    description: 'Push · SMS · WhatsApp · Email AR/EN',
    icon: Bell,
    metric: '2.4M',
    metricLabel: 'Sends (30d)',
    trend: '98.1%',
    up: true,
    spark: [40, 48, 52, 60, 68, 75, 82, 88],
    tone: 'sky',
  },
  {
    title: 'BI Reports',
    description: 'Grafana KPIs · CSV · Excel · PDF',
    icon: BarChart3,
    metric: '24',
    metricLabel: 'Scheduled reports',
    spark: [30, 35, 40, 42, 48, 52, 55, 58],
    tone: 'emerald',
  },
]

const storeRatings = [
  {
    name: 'Google Business',
    reviews: '1,240+',
    score: 4.2,
    delta: '+0.3 Q',
    brand: 'google' as const,
    filled: 4,
  },
  {
    name: 'App Store iOS',
    reviews: '830+',
    score: 4.5,
    delta: '+0.2 Q',
    brand: 'apple' as const,
    filled: 5,
  },
  {
    name: 'Play Store Android',
    reviews: '1,090+',
    score: 4.4,
    delta: '+0.1 Q',
    brand: 'android' as const,
    filled: 4,
  },
]

const cxScores = [
  {
    title: 'Post-Quote',
    badge: 'CSAT' as const,
    value: '4.6',
    numeric: 4.6,
    max: 5,
    subtitle: 'After issuance',
    badgeClass: 'admin-cx-badge-csat',
  },
  {
    title: 'Renewal',
    badge: 'CSAT' as const,
    value: '4.4',
    numeric: 4.4,
    max: 5,
    subtitle: 'On confirm',
    badgeClass: 'admin-cx-badge-csat',
  },
  {
    title: 'Claims',
    badge: 'NPS' as const,
    value: '+52',
    numeric: 52,
    max: 100,
    subtitle: 'At closure',
    badgeClass: 'admin-cx-badge-nps',
  },
  {
    title: 'Service',
    badge: 'CSAT' as const,
    value: '4.3',
    numeric: 4.3,
    max: 5,
    subtitle: 'Within 30 min',
    badgeClass: 'admin-cx-badge-csat-alt',
  },
  {
    title: 'Overall App',
    badge: 'NPS' as const,
    value: '+61',
    numeric: 61,
    max: 100,
    subtitle: '30-day prompt',
    badgeClass: 'admin-cx-badge-nps',
  },
]

const cxTools = [
  {
    title: 'Customer Search',
    description: 'NIC · mobile · policy · plate',
    icon: Search,
  },
  {
    title: 'Interaction Log',
    description: 'Quotes · claims · chats',
    icon: ClipboardList,
  },
  {
    title: 'Survey Viewer',
    description: 'CSAT/NPS + verbatim',
    icon: Star,
  },
  {
    title: 'Chat Transcripts',
    description: 'WhatsApp / AI threads',
    icon: MessageCircle,
  },
  {
    title: 'Export & Digest',
    description: 'CSV · Excel · scheduled',
    icon: Download,
  },
]

const activityFeed = [
  { t: '2m', text: 'Policy POL-92841 issued · Motor', tone: 'ok' as const },
  { t: '8m', text: 'Payment failed · STC Pay · retry queued', tone: 'warn' as const },
  { t: '14m', text: 'CSAT 2.1 escalated · Claims #4412', tone: 'alert' as const },
  { t: '22m', text: 'Campaign “Renewal Q2” sent · 18.4k', tone: 'info' as const },
  { t: '31m', text: 'Admin seat unlocked · Nafath re-verify', tone: 'ok' as const },
]

/* ─── Hooks & helpers ─── */

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
}

function useCountUp(value: number, duration = 1100, decimals = 0) {
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) return
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

  const display = reduced ? value : n
  if (decimals > 0) return display.toFixed(decimals)
  return Math.round(display).toLocaleString()
}

function CountValue({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
}: {
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
}) {
  const display = useCountUp(value, 1000, decimals)
  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

function sparkPath(values: number[], w = 64, h = 24, pad = 1) {
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function sparkArea(values: number[], w = 64, h = 24, pad = 1) {
  const line = sparkPath(values, w, h, pad)
  if (!line) return ''
  return `${line} L${w - pad},${h - pad} L${pad},${h - pad} Z`
}

/** Draw SVG stroke path left→right when the page mounts (reliable page-open animation). */
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
      // force layout so the hidden state is committed before transition
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
      // keep final dasharray stable after draw
      el.style.strokeDasharray = `${len}`
      el.style.strokeDashoffset = '0'
    }, delayMs + durationMs + 40)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(endTimer)
      cancelAnimationFrame(startRaf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed by caller
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

function nearestIndex(x: number, xs: number[]) {
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < xs.length; i++) {
    const dist = Math.abs(xs[i] - x)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

function formatSparkValue(v: number) {
  if (Number.isInteger(v)) return String(v)
  return v.toFixed(v < 10 ? 1 : 0)
}

function Sparkline({
  values,
  className,
  stroke = 'url(#spark-grad)',
  fill = true,
  delay = 0,
  tipTitle,
  tipPlace = 'above',
  formatValue = formatSparkValue,
}: {
  values: number[]
  className?: string
  stroke?: string
  fill?: boolean
  delay?: number
  tipTitle?: string
  tipPlace?: 'above' | 'below'
  formatValue?: (v: number) => string
}) {
  const uid = useId().replace(/:/g, '')
  const pathRef = useRef<SVGPathElement>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const w = 72
  const h = 28
  const pad = 1
  const line = sparkPath(values, w, h)
  const area = sparkArea(values, w, h)
  const pathKey = values.join(',')
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const xs = values.map((_, i) => pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2))
  const ys = values.map((v) => h - pad - ((v - min) / range) * (h - pad * 2))

  useStrokeDraw(pathRef, {
    delayMs: Math.round(delay * 1000),
    durationMs: 850,
    deps: [pathKey],
  })

  const handleMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (values.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * w
    setHoverIdx(nearestIndex(x, xs))
  }

  const hoverVal = hoverIdx !== null ? values[hoverIdx] : null
  const tipLeftPct =
    hoverIdx !== null ? Math.min(92, Math.max(8, (xs[hoverIdx] / w) * 100)) : 50

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className={cn('admin-cx-spark cursor-crosshair overflow-visible', className)}
        aria-hidden
        style={{ ['--spark-delay' as string]: `${delay}s` } as CSSProperties}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={`sg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`sl-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        {fill ? (
          <path d={area} fill={`url(#sg-${uid})`} className="admin-cx-spark-area" />
        ) : null}
        <path
          ref={pathRef}
          d={line}
          fill="none"
          stroke={stroke === 'url(#spark-grad)' ? `url(#sl-${uid})` : stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="admin-cx-spark-line"
        />
        {hoverIdx !== null ? (
          <g className="pointer-events-none">
            <line
              x1={xs[hoverIdx]}
              x2={xs[hoverIdx]}
              y1={pad}
              y2={h - pad}
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx={xs[hoverIdx]}
              cy={ys[hoverIdx]}
              r="3"
              fill="var(--a-surface)"
              stroke="currentColor"
              strokeWidth="1.75"
            />
          </g>
        ) : null}
      </svg>
      {hoverVal !== null && hoverIdx !== null ? (
        <ChartTip
          className={cn(
            'absolute z-30 min-w-[110px] -translate-x-1/2',
            tipPlace === 'below' ? 'top-[calc(100%+4px)]' : 'bottom-[calc(100%+4px)]',
          )}
          style={{ left: `${tipLeftPct}%` }}
          title={tipTitle ?? `Point ${hoverIdx + 1}`}
          rows={[{ label: 'Value', value: formatValue(hoverVal) }]}
        />
      ) : null}
    </div>
  )
}

function AreaChart({
  data,
}: {
  data: { day: string; gwp: number; policies: number }[]
}) {
  const uid = useId().replace(/:/g, '')
  const lineRef = useRef<SVGPathElement>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const W = 560
  const H = 168
  const padL = 8
  const padR = 8
  const padT = 16
  const padB = 28
  const maxGwp = Math.max(...data.map((d) => d.gwp)) * 1.12
  const xs = data.map((_, i) => padL + (i / (data.length - 1)) * (W - padL - padR))
  const ys = data.map((d) => padT + (1 - d.gwp / maxGwp) * (H - padT - padB))
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const area = `${line} L${xs[xs.length - 1]},${H - padB} L${xs[0]},${H - padB} Z`
  const barMax = Math.max(...data.map((d) => d.policies))

  useStrokeDraw(lineRef, {
    delayMs: 180,
    durationMs: 1200,
    deps: [line],
  })

  const handleMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (data.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * W
    setHoverIdx(nearestIndex(x, xs))
  }

  const hoverPoint = hoverIdx !== null ? data[hoverIdx] : null
  const tipLeftPct =
    hoverIdx !== null ? Math.min(88, Math.max(8, (xs[hoverIdx] / W) * 100)) : 50

  return (
    <div className="admin-cx-chart-wrap relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[148px] w-full cursor-crosshair sm:h-[168px]"
        role="img"
        aria-label="Weekly GWP and policies"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={`ag-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b42ec" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#5b42ec" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`al-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b7aef" />
            <stop offset="50%" stopColor="#5b42ec" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* grid */}
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

        {/* policy bars (secondary series) */}
        {data.map((d, i) => {
          const bw = ((W - padL - padR) / data.length) * 0.38
          const x = xs[i] - bw / 2
          const bh = (d.policies / barMax) * (H - padT - padB) * 0.42
          const y = H - padB - bh
          const active = hoverIdx === i
          return (
            <rect
              key={`b-${d.day}`}
              x={x}
              y={y}
              width={bw}
              height={bh}
              rx={3}
              className="admin-cx-chart-bar"
              opacity={hoverIdx === null || active ? 1 : 0.35}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            />
          )
        })}

        <path d={area} fill={`url(#ag-${uid})`} className="admin-cx-chart-area" />
        <path
          ref={lineRef}
          d={line}
          fill="none"
          stroke={`url(#al-${uid})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${uid})`}
          className="admin-cx-chart-line"
        />

        {data.map((d, i) => {
          const active = hoverIdx === i
          return (
            <g
              key={d.day}
              className="admin-cx-chart-point"
              style={{ animationDelay: `${0.55 + i * 0.08}s` }}
              opacity={hoverIdx === null || active ? 1 : 0.35}
            >
              <circle
                cx={xs[i]}
                cy={ys[i]}
                r={active ? 5.5 : 4.5}
                fill="var(--a-surface)"
                stroke="#5b42ec"
                strokeWidth={active ? 2.5 : 2}
              />
              <circle
                cx={xs[i]}
                cy={ys[i]}
                r="1.8"
                fill="#5b42ec"
                className="admin-cx-chart-dot-pulse"
                style={{ animationDelay: `${1.1 + i * 0.12}s` }}
              />
            </g>
          )
        })}

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

        {data.map((d, i) => (
          <text
            key={`l-${d.day}`}
            x={xs[i]}
            y={H - 8}
            textAnchor="middle"
            className="admin-cx-chart-label"
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          >
            {d.day}
          </text>
        ))}
      </svg>

      {hoverPoint ? (
        <ChartTip
          className="absolute top-1 z-30 -translate-x-1/2"
          style={{ left: `${tipLeftPct}%` }}
          title={hoverPoint.day}
          rows={[
            { label: 'GWP', value: `SAR ${hoverPoint.gwp.toFixed(1)}M`, color: '#5b42ec' },
            { label: 'Policies', value: String(hoverPoint.policies), color: '#0284c7' },
          ]}
        />
      ) : null}
    </div>
  )
}

function DonutChart({
  segments,
  centerLabel,
  centerValue,
  hover,
  onHover,
}: {
  segments: { label: string; value: number; color: string }[]
  centerLabel: string
  centerValue: string
  hover: number | null
  onHover: (index: number | null) => void
}) {
  const size = 148
  const stroke = 14
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
    const t = window.setTimeout(() => setPlay(true), reduced ? 0 : 80)
    return () => window.clearTimeout(t)
  }, [reduced])

  const active = hover !== null ? segments[hover] : null
  const shownValue = active ? `${active.value}%` : centerValue
  const shownLabel = active ? active.label : centerLabel

  return (
    <div
      className={cn('admin-cx-donut relative mx-auto h-[148px] w-[148px]', play && 'is-play')}
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
      <div className="admin-cx-donut-center pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <p className="text-[1.35rem] font-bold tabular-nums tracking-tight" style={{ color: 'var(--a-text)' }}>
          {shownValue}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--a-muted)' }}>
          {shownLabel}
        </p>
      </div>
      {active ? (
        <ChartTip
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[110%]"
          title={active.label}
          rows={[
            { label: 'Share', value: `${active.value}%`, color: active.color },
            { label: 'Rank', value: `#${(hover ?? 0) + 1}`, color: active.color },
          ]}
        />
      ) : null}
    </div>
  )
}

function RadialGauge({
  pct,
  value,
  label,
  badge,
  badgeClass,
  delay = 0,
  subtitle,
}: {
  pct: number
  value: string
  label: string
  badge: string
  badgeClass: string
  delay?: number
  subtitle?: string
}) {
  const uid = useId().replace(/:/g, '')
  const size = 88
  const stroke = 7
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, pct)) / 100
  const dash = circumference * clamped
  const gap = circumference - dash
  const reduced = usePrefersReducedMotion()
  const [play, setPlay] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setPlay(true), reduced ? 0 : 60 + delay * 70)
    return () => window.clearTimeout(t)
  }, [reduced, delay])

  return (
    <article
      className="admin-cx-gauge group relative"
      style={{ animationDelay: `${0.08 + delay * 0.06}s`, zIndex: open ? 20 : 1 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="truncate text-[11px] font-semibold" style={{ color: 'var(--a-text-secondary)' }}>
          {label}
        </p>
        <span className={cn('admin-cx-badge', badgeClass)}>{badge}</span>
      </div>
      <div className="relative mx-auto mt-1.5 h-[88px] w-[88px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden>
          <defs>
            <linearGradient id={`gg-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b7aef" />
              <stop offset="50%" stopColor="#5b42ec" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--a-surface-2)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#gg-${uid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={play ? `${dash} ${gap}` : `0 ${circumference}`}
            className="admin-cx-gauge-ring"
            style={
              {
                transitionDelay: `${0.1 + delay * 0.07}s`,
              } as CSSProperties
            }
          />
        </svg>
        <div className="admin-cx-gauge-value absolute inset-0 flex flex-col items-center justify-center">
          <span className="admin-cx-score-value text-[1.15rem] font-bold tabular-nums leading-none">
            {value}
          </span>
        </div>
      </div>
      {open ? (
        <ChartTip
          className="absolute left-1/2 top-0 z-30 w-[150px] -translate-x-1/2 -translate-y-[105%]"
          title={label}
          rows={[
            { label: badge, value },
            { label: 'Of target', value: `${Math.round(pct)}%` },
            ...(subtitle ? [{ label: 'When', value: subtitle }] : []),
          ]}
        />
      ) : null}
    </article>
  )
}

function RatingRing({ score, delay = 0 }: { score: number; delay?: number }) {
  const size = 44
  const stroke = 3.5
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const clamped = Math.min(1, Math.max(0, score / 5))
  const dash = circumference * clamped
  const gap = circumference - dash
  const reduced = usePrefersReducedMotion()
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setPlay(true), reduced ? 0 : 100 + delay * 90)
    return () => window.clearTimeout(t)
  }, [reduced, delay])

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-11 w-11 -rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--a-surface-2)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={play ? `${dash} ${gap}` : `0 ${circumference}`}
        className="admin-cx-gauge-ring"
        style={{ transitionDelay: `${0.15 + delay * 0.08}s` } as CSSProperties}
      />
    </svg>
  )
}

function StarRow({ filled, score }: { filled: number; score: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3 transition-transform duration-300',
            i < filled
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600',
          )}
          style={
            i < filled
              ? ({ animationDelay: `${0.05 + i * 0.05}s` } as CSSProperties)
              : undefined
          }
        />
      ))}
    </div>
  )
}

function BrandIcon({ brand }: { brand: 'google' | 'apple' | 'android' }) {
  if (brand === 'google') {
    return (
      <span className="admin-cx-brand admin-cx-brand-google flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-md">
        G
      </span>
    )
  }
  if (brand === 'apple') {
    return (
      <span className="admin-cx-brand flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-md dark:bg-slate-100 dark:text-slate-900">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      </span>
    )
  }
  return (
    <span className="admin-cx-brand flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24A11.46 11.46 0 0 0 12 8.5c-1.6 0-3.11.32-4.47.91L5.65 6.17c-.18-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.13 11.25 2.75 13.76 2.75 16.5h18.5c0-2.74-1.38-5.25-3.65-7.02zM7.5 14.25a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
      </svg>
    </span>
  )
}

const toneIcon: Record<string, string> = {
  violet: 'admin-cx-tone-violet',
  sky: 'admin-cx-tone-sky',
  emerald: 'admin-cx-tone-emerald',
  amber: 'admin-cx-tone-amber',
  rose: 'admin-cx-tone-rose',
  indigo: 'admin-cx-tone-indigo',
}

const accentText: Record<string, string> = {
  violet: 'text-[#5b42ec] dark:text-[#a599f5]',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  amber: 'text-amber-600 dark:text-amber-400',
  sky: 'text-sky-600 dark:text-sky-400',
}

/* ─── Page ─── */

export default function AdminDashboardPage() {
  const { admin, status } = useAuth()
  const firstName = admin?.name?.trim().split(/\s+/)[0]
  const [lobHover, setLobHover] = useState<number | null>(null)
  const [channelHover, setChannelHover] = useState<string | null>(null)
  const [storeHover, setStoreHover] = useState<string | null>(null)

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const totalGwp = weeklyProduction.reduce((s, d) => s + d.gwp, 0)

  return (
    <div className="admin-cx-page relative flex flex-col gap-3.5 pb-1">
      <div className="admin-cx-dots pointer-events-none absolute -right-4 top-0 h-36 w-36 opacity-35" aria-hidden />
      <div className="admin-cx-dots pointer-events-none absolute -left-4 bottom-16 h-28 w-28 opacity-20" aria-hidden />
      <div className="admin-cx-mesh pointer-events-none absolute inset-x-0 top-0 h-48 opacity-60" aria-hidden />

      {/* ════════ HEADER ════════ */}
      <header className="admin-cx-header admin-anim-scale relative overflow-visible rounded-2xl px-4 py-4 sm:px-5 sm:py-4.5">
        <div className="admin-cx-header-glow pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full blur-3xl" aria-hidden />
        <div className="admin-cx-header-glow-b pointer-events-none absolute -bottom-16 left-1/4 h-36 w-36 rounded-full blur-3xl" aria-hidden />
        <div className="admin-cx-header-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="admin-cx-kicker text-[10px] font-bold uppercase tracking-[0.14em]">
                Admin Portal · Command Center
              </p>
              <span className="admin-cx-live inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                <span className="admin-dot-live h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>
            <h2 className="mt-1 text-[1.25rem] font-bold tracking-tight sm:text-[1.45rem]" style={{ color: 'var(--a-text)' }}>
              {greeting}
              {firstName ? `, ${firstName}` : ''}
            </h2>
            <p className="mt-0.5 max-w-xl text-[12px] leading-relaxed" style={{ color: 'var(--a-text-secondary)' }}>
              Governance · CX scores · store ratings · real-time production pulse
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <span className="admin-cx-chip">
              <Shield className="h-3 w-3" />
              {admin?.role ?? 'Admin'}
            </span>
            <span className="admin-cx-chip capitalize">
              <span className="admin-dot-live h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {status}
            </span>
            <span className="admin-cx-chip">
              <Sparkles className="h-3 w-3" />
              MIC DXP
            </span>
          </div>
        </div>

        {/* KPI strip */}
        <div className="admin-stagger relative mt-3.5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {snapshotKpis.map((k, i) => (
            <div key={k.label} className="admin-cx-snap group relative overflow-visible">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.07em]" style={{ color: 'var(--a-muted)' }}>
                    {k.label}
                  </p>
                  <p className="mt-0.5 text-lg font-bold tracking-tight sm:text-xl" style={{ color: 'var(--a-text)' }}>
                    <CountValue
                      value={k.value}
                      decimals={k.decimals}
                      suffix={'suffix' in k ? k.suffix : ''}
                      prefix={'prefix' in k ? k.prefix : ''}
                    />
                  </p>
                  <p
                    className={cn(
                      'mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-semibold',
                      k.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
                    )}
                  >
                    {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {k.delta}
                  </p>
                </div>
                <div className={cn('relative z-10 mt-0.5 h-7 w-[72px] shrink-0', accentText[k.accent])}>
                  <Sparkline
                    values={k.spark}
                    delay={0.08 + i * 0.05}
                    tipTitle={k.label}
                    tipPlace="below"
                    formatValue={(v) =>
                      k.decimals > 0 || !Number.isInteger(v)
                        ? `${v.toFixed(k.decimals || 1)}${'suffix' in k && k.suffix ? k.suffix : ''}`
                        : `${'prefix' in k && k.prefix ? k.prefix : ''}${v}${'suffix' in k && k.suffix ? k.suffix : ''}`
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ════════ INSIGHTS ROW ════════ */}
      <section className="grid gap-3 xl:grid-cols-12">
        {/* Weekly production */}
        <div className="admin-cx-panel admin-anim-in admin-delay-1 relative overflow-visible xl:col-span-5">
          <div className="admin-cx-panel-glow pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl" aria-hidden />
          <div className="relative flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#5b42ec]" />
                <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                  Weekly production
                </h3>
              </div>
              <p className="mt-0.5 text-[11px]" style={{ color: 'var(--a-muted)' }}>
                GWP (area) · policies (bars) · hover for detail
              </p>
            </div>
            <div className="text-right">
              <p className="text-[1.15rem] font-bold tabular-nums tracking-tight" style={{ color: 'var(--a-text)' }}>
                SAR {totalGwp.toFixed(1)}M
              </p>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">+9.2% vs last week</p>
            </div>
          </div>
          <div className="mt-2">
            <AreaChart data={weeklyProduction} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] font-semibold" style={{ color: 'var(--a-muted)' }}>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-gradient-to-r from-[#8b7aef] to-[#0284c7]" />
              GWP (SAR M)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-sm bg-[#5b42ec]/25" />
              Policies
            </span>
          </div>
        </div>

        {/* LOB mix */}
        <div className="admin-cx-panel admin-anim-in admin-delay-2 relative overflow-visible xl:col-span-3">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-[#0284c7]" />
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
              LOB mix
            </h3>
          </div>
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--a-muted)' }}>
            GWP share · MTD · hover for detail
          </p>
          <div className="mt-3">
            <DonutChart
              segments={lobMix}
              centerLabel="Products"
              centerValue="5"
              hover={lobHover}
              onHover={setLobHover}
            />
          </div>
          <ul className="mt-3 space-y-1.5">
            {lobMix.map((seg, i) => {
              const active = lobHover === i
              return (
                <li
                  key={seg.label}
                  className={cn(
                    'admin-cx-legend relative flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1.5 py-1 text-[11px] transition-colors',
                    active && 'bg-[var(--a-primary-soft)]',
                  )}
                  style={{ animationDelay: `${0.25 + i * 0.05}s`, zIndex: active ? 12 : 1 }}
                  onMouseEnter={() => setLobHover(i)}
                  onMouseLeave={() => setLobHover(null)}
                >
                  <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: 'var(--a-text-secondary)' }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
                    {seg.label}
                  </span>
                  <span className="font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                    {seg.value}%
                  </span>
                  {active ? (
                    <ChartTip
                      className="absolute right-0 top-full mt-1.5 w-[150px]"
                      title={seg.label}
                      rows={[
                        { label: 'Share', value: `${seg.value}%`, color: seg.color },
                        { label: 'Rank', value: `#${i + 1}`, color: seg.color },
                      ]}
                    />
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Channels + activity */}
        <div className="flex flex-col gap-3 xl:col-span-4">
          <div className="admin-cx-panel admin-anim-in admin-delay-2 flex-1 overflow-visible">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                  Payment channels
                </h3>
                <p className="text-[11px]" style={{ color: 'var(--a-muted)' }}>
                  Success mix · last 7 days · hover for detail
                </p>
              </div>
              <span className="admin-cx-chip !px-2 !py-0.5 text-[10px]">94.8%</span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {paymentChannels.map((ch, i) => {
                const open = channelHover === ch.name
                return (
                  <li
                    key={ch.name}
                    className={cn(
                      'relative rounded-lg px-1 py-0.5 transition-colors',
                      open && 'bg-[var(--a-primary-soft)]',
                    )}
                    style={{ zIndex: open ? 15 : 1 }}
                    onMouseEnter={() => setChannelHover(ch.name)}
                    onMouseLeave={() => setChannelHover(null)}
                  >
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="font-medium" style={{ color: 'var(--a-text-secondary)' }}>
                        {ch.name}
                      </span>
                      <span className="font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                        {ch.pct}%
                      </span>
                    </div>
                    <div className="admin-cx-hbar-track h-1.5 overflow-hidden rounded-full">
                      <div
                        className="admin-cx-hbar-fill h-full rounded-full"
                        style={
                          {
                            width: `${ch.pct}%`,
                            background: `linear-gradient(90deg, ${ch.color}, color-mix(in srgb, ${ch.color} 70%, white))`,
                            animationDelay: `${0.2 + i * 0.08}s`,
                          } as CSSProperties
                        }
                      />
                    </div>
                    {open ? (
                      <ChartTip
                        className="absolute bottom-[calc(100%+6px)] left-1/2 w-[160px] -translate-x-1/2"
                        title={ch.name}
                        rows={[
                          { label: 'Share', value: `${ch.pct}%`, color: ch.color },
                          { label: 'Rank', value: `#${i + 1}`, color: ch.color },
                          {
                            label: 'Status',
                            value: ch.pct >= 30 ? 'Primary' : ch.pct >= 10 ? 'Secondary' : 'Niche',
                          },
                        ]}
                      />
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="admin-cx-panel admin-anim-in admin-delay-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[13px] font-bold" style={{ color: 'var(--a-text)' }}>
                Live activity
              </h3>
              <span className="admin-dot-live h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <ul className="space-y-0">
              {activityFeed.map((item, i) => (
                <li
                  key={item.t + item.text}
                  className="admin-cx-activity flex gap-2.5 border-t py-1.5 first:border-t-0 first:pt-0"
                  style={{ borderColor: 'var(--a-border)', animationDelay: `${0.2 + i * 0.06}s` }}
                >
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      item.tone === 'ok' && 'bg-emerald-500',
                      item.tone === 'warn' && 'bg-amber-500',
                      item.tone === 'alert' && 'bg-rose-500',
                      item.tone === 'info' && 'bg-sky-500',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium leading-snug" style={{ color: 'var(--a-text)' }}>
                      {item.text}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold tabular-nums" style={{ color: 'var(--a-muted)' }}>
                    {item.t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ════════ GOVERNANCE ════════ */}
      <section>
        <div className="admin-cx-ribbon admin-anim-in admin-delay-2 mb-2.5 flex flex-wrap items-center gap-2 px-3.5 py-2">
          <Shield className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-[0.06em]">Admin Governance</span>
          <span className="hidden text-[11px] font-medium opacity-70 sm:inline">—</span>
          <span className="hidden text-[11px] font-medium opacity-80 sm:inline">
            Transactions · Policies · Payments · Users · Campaigns · BI
          </span>
          <span className="ml-auto hidden items-center gap-1 text-[10px] font-semibold opacity-70 sm:inline-flex">
            <ArrowUpRight className="h-3 w-3" />
            9 modules
          </span>
        </div>

        <div className="admin-stagger-extended grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {governanceModules.map((mod, i) => {
            const Icon = mod.icon
            return (
              <article
                key={mod.title}
                className="admin-cx-module group relative overflow-visible"
                style={{ animationDelay: `${0.04 + i * 0.035}s` }}
              >
                <div className="admin-cx-module-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex gap-3">
                  <span
                    className={cn(
                      'admin-cx-module-icon admin-stat-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                      toneIcon[mod.tone],
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 h-[17px] w-[17px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--a-text)' }}>
                        {mod.title}
                      </h3>
                      {mod.trend ? (
                        <span
                          className={cn(
                            'admin-cx-trend shrink-0',
                            mod.up === false && 'admin-cx-trend-down',
                          )}
                        >
                          {mod.trend}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed" style={{ color: 'var(--a-text-secondary)' }}>
                      {mod.description}
                    </p>
                    <div
                      className="mt-2 flex items-end justify-between gap-2 border-t pt-2"
                      style={{ borderColor: 'var(--a-border)' }}
                    >
                      <div>
                        <p className="text-[14px] font-bold tabular-nums tracking-tight" style={{ color: 'var(--a-text)' }}>
                          {mod.metric}
                        </p>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.07em]" style={{ color: 'var(--a-muted)' }}>
                          {mod.metricLabel}
                        </p>
                      </div>
                      <div className={cn('relative z-10 h-6 w-16 shrink-0 opacity-90', accentText.violet)}>
                        <Sparkline
                          values={mod.spark}
                          delay={0.2 + i * 0.03}
                          tipTitle={mod.title}
                          formatValue={(v) => String(v)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ════════ CX INTELLIGENCE ════════ */}
      <section>
        <div className="admin-cx-ribbon admin-cx-ribbon-blue admin-anim-in admin-delay-3 mb-2.5 flex flex-wrap items-center gap-2 px-3.5 py-2">
          <Star className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-[0.06em]">CX Intelligence</span>
          <span className="hidden text-[11px] font-medium opacity-70 sm:inline">—</span>
          <span className="hidden text-[11px] font-medium opacity-80 sm:inline">
            CSAT · NPS · Stores · Search &amp; Interaction Log
          </span>
        </div>

        <div className="grid gap-2.5 xl:grid-cols-12">
          {/* Store ratings */}
          <div className="admin-cx-panel admin-anim-in admin-delay-3 overflow-visible xl:col-span-3">
            <h3 className="mb-1 text-[12px] font-bold" style={{ color: 'var(--a-text)' }}>
              Store ratings
            </h3>
            <ul className="divide-y" style={{ borderColor: 'var(--a-border)' }}>
              {storeRatings.map((store, i) => {
                const open = storeHover === store.name
                return (
                  <li
                    key={store.name}
                    className={cn(
                      'admin-cx-store relative flex items-center gap-2.5 rounded-lg py-2.5 first:pt-1 last:pb-0',
                      open && 'bg-[var(--a-primary-soft)]/60',
                    )}
                    style={{
                      animationDelay: `${0.12 + i * 0.07}s`,
                      borderColor: 'var(--a-border)',
                      zIndex: open ? 15 : 1,
                    }}
                    onMouseEnter={() => setStoreHover(store.name)}
                    onMouseLeave={() => setStoreHover(null)}
                  >
                    <div className="relative shrink-0">
                      <RatingRing score={store.score} delay={i} />
                      <div className="absolute inset-0 flex items-center justify-center scale-75">
                        <BrandIcon brand={store.brand} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <div>
                          <p className="text-[12px] font-semibold" style={{ color: 'var(--a-text)' }}>
                            {store.name}
                          </p>
                          <p className="text-[10px]" style={{ color: 'var(--a-muted)' }}>
                            {store.reviews} reviews
                          </p>
                        </div>
                        <span className="admin-cx-delta inline-flex items-center gap-0.5 text-[10px] font-bold">
                          <TrendingUp className="h-2.5 w-2.5" />
                          {store.delta}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <StarRow filled={store.filled} score={store.score} />
                        <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                          {store.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {open ? (
                      <ChartTip
                        className="absolute bottom-[calc(100%+4px)] left-1/2 w-[170px] -translate-x-1/2"
                        title={store.name}
                        rows={[
                          { label: 'Score', value: store.score.toFixed(1), color: '#f59e0b' },
                          { label: 'Reviews', value: store.reviews },
                          { label: 'Trend', value: store.delta },
                          { label: 'Stars', value: `${store.filled}/5` },
                        ]}
                      />
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Gauges + tools */}
          <div className="flex flex-col gap-2.5 xl:col-span-9">
            <div className="admin-stagger-extended grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {cxScores.map((score, i) => {
                const pct =
                  score.badge === 'NPS'
                    ? Math.min(100, (score.numeric / score.max) * 100)
                    : (score.numeric / score.max) * 100
                return (
                  <RadialGauge
                    key={score.title}
                    pct={pct}
                    value={score.value}
                    label={score.title}
                    badge={score.badge}
                    badgeClass={score.badgeClass}
                    delay={i}
                    subtitle={score.subtitle}
                  />
                )
              })}
            </div>

            <div className="admin-stagger grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {cxTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button key={tool.title} type="button" className="admin-cx-tool group text-left">
                    <span className="admin-cx-tool-icon admin-stat-icon flex h-9 w-9 items-center justify-center rounded-lg">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mt-2 text-[11px] font-semibold leading-snug" style={{ color: 'var(--a-text)' }}>
                      {tool.title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed" style={{ color: 'var(--a-muted)' }}>
                      {tool.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="admin-anim-in admin-delay-5 flex flex-col gap-1.5 border-t pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="inline-flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--a-muted)' }}>
          <Lock className="h-3 w-3 shrink-0" />
          All admin actions are role-gated &amp; audit-logged
        </p>
        <p className="inline-flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--a-muted)' }}>
          <Info className="h-3 w-3 shrink-0" />
          CX scores auto-aggregated · low-score alerts escalated to CX manager
        </p>
      </footer>
    </div>
  )
}
