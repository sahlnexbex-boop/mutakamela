'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Link2, Loader2, Upload, X } from 'lucide-react'
import { mediaUrl, uploadImage } from '@/lib/api/media.api'
import { ApiError } from '@/lib/api/types'
import { cn } from '@/lib/utils'

type Mode = 'link' | 'upload'

type Props = {
  label: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  helpText?: string
}

/**
 * Image field with Link (URL) or Upload tabs for the page builder.
 */
export function ImageSourceField({
  label,
  value,
  onChange,
  placeholder = 'https://… or /uploads/…',
  helpText,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>(
    value && !value.startsWith('http') && value.startsWith('/uploads/')
      ? 'upload'
      : 'link',
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const preview = mediaUrl(value)

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be under 8 MB')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const result = await uploadImage(file)
      // Store absolute URL so canvas/public pages resolve without extra helpers
      onChange(mediaUrl(result.url))
      setMode('upload')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--b-muted)]">
          {label}
        </span>
        <div className="flex rounded-lg bg-[var(--a-surface-2)] p-0.5">
          <ModeBtn
            active={mode === 'link'}
            onClick={() => setMode('link')}
            icon={Link2}
            label="Link"
          />
          <ModeBtn
            active={mode === 'upload'}
            onClick={() => setMode('upload')}
            icon={Upload}
            label="Upload"
          />
        </div>
      </div>

      {mode === 'link' ? (
        <input
          className="builder-input"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setError(null)
          }}
          placeholder={placeholder}
        />
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            void handleFile(e.dataTransfer.files?.[0])
          }}
          className={cn(
            'relative rounded-xl border border-dashed px-3 py-4 text-center transition',
            dragOver
              ? 'border-[var(--a-primary)] bg-[var(--a-primary-soft)]'
              : 'border-[var(--b-border)] bg-[var(--a-surface-2)] hover:border-[color-mix(in_srgb,var(--a-primary)_40%,transparent)]',
            uploading && 'pointer-events-none opacity-70',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/avif"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-1 text-[var(--b-muted)]">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--a-primary-soft-text)]" />
              <span className="text-[11px] font-medium">Uploading…</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center gap-1.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--a-primary-soft)] text-[var(--a-primary-soft-text)]">
                <ImagePlus className="h-4 w-4" />
              </span>
              <span className="text-[11px] font-semibold text-[var(--b-text)]">
                Click to upload or drag & drop
              </span>
              <span className="text-[10px] text-[var(--b-muted)]">
                PNG, JPG, WebP, GIF · max 8 MB
              </span>
            </button>
          )}
        </div>
      )}

      {helpText && (
        <p className="text-[10px] leading-relaxed text-[var(--b-muted)]">{helpText}</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/10 px-2 py-1.5 text-[11px] text-red-300">
          {error}
        </p>
      )}

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-[var(--b-border)] bg-[var(--a-surface-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.opacity = '0.3'
            }}
          />
          <button
            type="button"
            title="Clear image"
            onClick={() => onChange('')}
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white/80 backdrop-blur hover:bg-red-500/80 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="truncate border-t border-[var(--b-border)] px-2 py-1 font-mono text-[9px] text-[var(--b-muted)]">
            {value}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function ModeBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Link2
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition',
        active
          ? 'bg-[var(--a-primary)] text-white shadow-sm'
          : 'text-[var(--b-muted)] hover:text-[var(--b-text)]',
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  )
}
