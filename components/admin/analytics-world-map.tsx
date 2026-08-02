'use client'

import { useId, useMemo, useState, type CSSProperties } from 'react'
import worldRegions from '@/lib/admin/world-map-regions.json'
import { cn } from '@/lib/utils'

export type WorldMapRegionStat = {
  id: string
  name: string
  visitors: string
  intensity: number
}

type MapShape = {
  id: string
  name: string
  cx: number
  cy: number
  paths: string[]
}

const SHAPES = worldRegions as MapShape[]

function regionFill(intensity: number, hovered: boolean): string {
  const t = Math.min(1, Math.max(0, intensity))
  if (t < 0.12) return hovered ? '#93c5fd' : '#bfdbfe'
  if (t < 0.3) return hovered ? '#60a5fa' : '#93c5fd'
  if (t < 0.5) return hovered ? '#3b82f6' : '#60a5fa'
  if (t < 0.7) return hovered ? '#2563eb' : '#3b82f6'
  if (t < 0.88) return hovered ? '#1d4ed8' : '#2563eb'
  return hovered ? '#1e3a8a' : '#1d4ed8'
}

export function regionIntensityColor(intensity: number): string {
  return regionFill(intensity, false)
}

/**
 * Real Natural Earth–based world choropleth (110m countries),
 * grouped into analytics regions.
 */
export function AnalyticsWorldMap({ regions }: { regions: WorldMapRegionStat[] }) {
  const uid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<string | null>(null)
  const byId = useMemo(() => new Map(regions.map((r) => [r.id, r])), [regions])
  const active = hover ? byId.get(hover) : undefined
  const activeShape = SHAPES.find((s) => s.id === hover)

  return (
    <div className="admin-ga-map relative overflow-hidden rounded-xl">
      <svg
        viewBox="0 0 1000 500"
        className="admin-ga-world h-[180px] w-full sm:h-[210px]"
        role="img"
        aria-label="Geographic distribution of visitors — world map"
      >
        <defs>
          <linearGradient id={`ocean-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="50%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <radialGradient id={`sheen-${uid}`} cx="32%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
          </radialGradient>
          <filter id={`glow-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={`clip-${uid}`}>
            <rect x="0" y="0" width="1000" height="500" rx="16" />
          </clipPath>
        </defs>

        <g clipPath={`url(#clip-${uid})`}>
          <rect width="1000" height="500" fill={`url(#ocean-${uid})`} />
          <rect width="1000" height="500" fill={`url(#sheen-${uid})`} />

          {/* Parallels / meridians */}
          {[83.3, 166.7, 250, 333.3, 416.7].map((y) => (
            <line
              key={`lat-${y}`}
              x1="8"
              x2="992"
              y1={y}
              y2={y}
              stroke="#93c5fd"
              strokeOpacity="0.22"
              strokeWidth="0.8"
              strokeDasharray="2 7"
            />
          ))}
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
            <line
              key={`lon-${x}`}
              x1={x}
              x2={x}
              y1="8"
              y2="492"
              stroke="#93c5fd"
              strokeOpacity="0.16"
              strokeWidth="0.8"
              strokeDasharray="2 9"
            />
          ))}

          {SHAPES.map((shape, i) => {
            const data = byId.get(shape.id)
            const intensity = data?.intensity ?? 0.08
            const isHot = hover === shape.id
            const fill = regionFill(intensity, isHot)
            return (
              <g
                key={shape.id}
                className={cn('admin-ga-region cursor-pointer')}
                style={{ animationDelay: `${0.08 + i * 0.05}s` } as CSSProperties}
                filter={isHot ? `url(#glow-${uid})` : undefined}
                onMouseEnter={() => setHover(shape.id)}
                onMouseLeave={() => setHover(null)}
              >
                {shape.paths.map((d, pi) => (
                  <path
                    key={`${shape.id}-${pi}`}
                    d={d}
                    fill={fill}
                    stroke={isHot ? '#0f172a' : '#ffffff'}
                    strokeOpacity={isHot ? 0.28 : 0.75}
                    strokeWidth={isHot ? 0.9 : 0.45}
                    strokeLinejoin="round"
                    className="admin-ga-land"
                  >
                    <title>
                      {data?.name ?? shape.name}: {data?.visitors ?? '0'} visitors
                    </title>
                  </path>
                ))}
              </g>
            )
          })}

          {active && activeShape ? (
            <g
              className="pointer-events-none"
              transform={`translate(${activeShape.cx} ${activeShape.cy})`}
            >
              <circle r="14" fill="#2563eb" fillOpacity="0.15" className="admin-ga-map-pulse" />
              <circle r="4.5" fill="#1d4ed8" stroke="#fff" strokeWidth="1.6" />
            </g>
          ) : null}
        </g>
      </svg>

      {active ? (
        <div className="admin-ga-map-tip admin-ga-tip is-open pointer-events-none absolute left-1/2 top-2.5 z-20 min-w-[150px] -translate-x-1/2">
          <p className="admin-ga-tip-title text-center">{active.name}</p>
          <ul className="mt-1 space-y-0.5">
            <li className="flex justify-between gap-3 text-[11px]">
              <span style={{ color: 'var(--a-text-secondary)' }}>Visitors</span>
              <span className="font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {active.visitors}
              </span>
            </li>
            <li className="flex justify-between gap-3 text-[11px]">
              <span style={{ color: 'var(--a-text-secondary)' }}>Intensity</span>
              <span className="font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                {Math.round(active.intensity * 100)}%
              </span>
            </li>
            <li className="flex justify-between gap-3 text-[11px]">
              <span style={{ color: 'var(--a-text-secondary)' }}>Share of top</span>
              <span className="font-bold tabular-nums" style={{ color: 'var(--a-text)' }}>
                {active.intensity >= 0.85
                  ? 'Very high'
                  : active.intensity >= 0.55
                    ? 'High'
                    : active.intensity >= 0.3
                      ? 'Medium'
                      : 'Low'}
              </span>
            </li>
          </ul>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-white/85 px-2 py-1 text-[9px] font-semibold shadow-sm backdrop-blur dark:bg-slate-900/75">
        <span style={{ color: 'var(--a-muted)' }}>Low</span>
        <span className="flex h-1.5 w-16 overflow-hidden rounded-full">
          <span className="flex-1 bg-[#bfdbfe]" />
          <span className="flex-1 bg-[#93c5fd]" />
          <span className="flex-1 bg-[#3b82f6]" />
          <span className="flex-1 bg-[#1d4ed8]" />
        </span>
        <span style={{ color: 'var(--a-muted)' }}>High</span>
      </div>
    </div>
  )
}
