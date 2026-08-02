'use client'

import { Monitor, Tablet, Smartphone } from 'lucide-react'
import type { DeviceMode } from '@/lib/builder/types'
import { cn } from '@/lib/utils'

const devices: { id: DeviceMode; icon: typeof Monitor; label: string }[] = [
  { id: 'desktop', icon: Monitor, label: 'Desktop' },
  { id: 'tablet', icon: Tablet, label: 'Tablet' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
]

export function DeviceSwitcher({
  value,
  onChange,
}: {
  value: DeviceMode
  onChange: (mode: DeviceMode) => void
}) {
  return (
    <div className="builder-device-switch flex items-center gap-0.5 rounded-md p-0.5">
      {devices.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          title={label}
          onClick={() => onChange(id)}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md transition-all',
            value === id
              ? 'bg-[var(--b-accent)] text-white shadow-sm'
              : 'text-[var(--b-muted)] hover:bg-[var(--a-primary-soft)] hover:text-[var(--a-primary-soft-text)]',
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  )
}
