'use client'

import { useState, useRef } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────

type CollectionType = 'transcripts' | 'earnings'

interface ImportResult {
  total: number
  created: number
  failed: number
  validationErrors: Array<{ row: number; field: string; message: string }>
  sectorErrors: Array<{ row: number; sectors: string[] }>
  runtimeErrors: Array<{ row: number; message: string }>
  createdSlugs: string[]
  message: string
}

// ── Helper: download sample CSV ───────────────────────────────────────────

function downloadSample(type: CollectionType) {
  const url = `/api/bulk-import/sample?type=${type}`
  const a = document.createElement('a')
  a.href = url
  a.download = `bulk-import-sample-${type}.csv`
  a.click()
}

// ── Sub-components ────────────────────────────────────────────────────────

function StatusPill({ label, color }: { label: string; color: 'green' | 'red' | 'yellow' | 'mist' }) {
  const cls = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    mist: 'bg-white/5 text-white/40 border-white/10',
  }[color]
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${cls}`}>
      {label}
    </span>
  )
}

function ErrorTable({
  title,
  rows,
}: {
  title: string
  rows: Array<{ row: number; field?: string; message: string; sectors?: string[] }>
}) {
  if (rows.length === 0) return null
  return (
    <div className="mt-4">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-red-400">{title}</div>
      <div className="overflow-hidden rounded-lg border border-red-500/20 bg-red-500/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-red-500/20">
              <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-red-400/60">Row</th>
              {rows[0].field !== undefined && (
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-red-400/60">Field</th>
              )}
              <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-red-400/60">Problem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={i} className="border-t border-red-500/10">
                <td className="px-3 py-2 font-mono text-[11px] text-red-300">{e.row}</td>
                {e.field !== undefined && (
                  <td className="px-3 py-2 font-mono text-[11px] text-red-300">{e.field}</td>
                )}
                <td className="px-3 py-2 text-[12px] text-red-200">
                  {e.message}
                  {e.sectors && (
                    <span className="ml-1 text-red-400">({e.sectors.join(', ')})</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export function BulkUploaderPage() {
  const [activeTab, setActiveTab] = useState<CollectionType>('transcripts')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const collectionLabel = activeTab === 'transcripts' ? 'Expert Transcripts' : 'Earnings Analyses'

  function handleFileSelect(f: File | null) {
    if (!f) return
    if (!f.name.endsWith('.csv')) {
      setErrorMessage('Please upload a .csv file')
      return
    }
    setFile(f)
    setResult(null)
    setStatus('idle')
    setErrorMessage('')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    handleFileSelect(dropped ?? null)
  }

  async function handleUpload() {
    if (!file) return
    setStatus('uploading')
    setResult(null)
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', activeTab)

    try {
      const res = await fetch('/api/bulk-import', { method: 'POST', body: formData })
      const data: ImportResult = await res.json()

      if (res.status === 401) {
        setStatus('error')
        setErrorMessage('Not authenticated. Please log in to the admin panel.')
        return
      }

      setResult(data)
      setStatus(res.ok || res.status === 207 ? 'done' : 'error')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  function reset() {
    setFile(null)
    setResult(null)
    setStatus('idle')
    setErrorMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const allErrors = [
    ...(result?.validationErrors ?? []),
    ...(result?.sectorErrors?.map((e) => ({
      row: e.row,
      field: 'sectors',
      message: 'Sector(s) not found in Industries collection',
      sectors: e.sectors,
    })) ?? []),
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--theme-bg, #0d1117)',
        color: 'var(--theme-text, #e6edf3)',
        fontFamily: 'system-ui, sans-serif',
        padding: '40px 32px',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#10d98a',
              marginBottom: 8,
            }}
          >
            Transcript IQ Admin
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
            Bulk Import
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(230,237,243,0.55)', lineHeight: 1.6, margin: 0 }}>
            Download the sample CSV for the collection you want to populate, fill in your data,
            then upload it here. All records will be created as <strong style={{ color: '#10d98a' }}>Drafts</strong> — review and publish in the admin.
          </p>
        </div>

        {/* ── Collection tabs ───────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            marginBottom: 28,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 4,
          }}
        >
          {(['transcripts', 'earnings'] as CollectionType[]).map((t) => (
            <button
              key={t}
              onClick={() => { setActiveTab(t); reset() }}
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: 7,
                border: 'none',
                fontFamily: 'monospace',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: activeTab === t ? 'rgba(16,217,138,0.12)' : 'transparent',
                color: activeTab === t ? '#10d98a' : 'rgba(230,237,243,0.45)',
                fontWeight: activeTab === t ? 600 : 400,
                outline: activeTab === t ? '1px solid rgba(16,217,138,0.25)' : 'none',
              }}
            >
              {t === 'transcripts' ? 'Expert Transcripts' : 'Earnings Analyses'}
            </button>
          ))}
        </div>

        {/* ── Step 1: Download sample ───────────────────────────────────── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(230,237,243,0.35)',
                  marginBottom: 4,
                }}
              >
                Step 1
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
                Download sample CSV
              </div>
              <div style={{ fontSize: 13, color: 'rgba(230,237,243,0.5)', marginTop: 4 }}>
                Contains all {collectionLabel} column headers + one example row with instructions.
              </div>
            </div>
            <button
              onClick={() => downloadSample(activeTab)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 18px',
                background: 'rgba(16,217,138,0.10)',
                border: '1px solid rgba(16,217,138,0.25)',
                borderRadius: 8,
                color: '#10d98a',
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <DownloadIcon />
              Download sample
            </button>
          </div>
        </div>

        {/* ── Step 2: Upload CSV ────────────────────────────────────────── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(230,237,243,0.35)',
              marginBottom: 4,
            }}
          >
            Step 2
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 16 }}>
            Upload your filled CSV
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'rgba(16,217,138,0.5)' : file ? 'rgba(16,217,138,0.3)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 10,
              padding: '28px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
              background: isDragging ? 'rgba(16,217,138,0.04)' : 'transparent',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div>
                <div style={{ fontSize: 22, marginBottom: 6 }}>📄</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#10d98a' }}>{file.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(230,237,243,0.4)', marginTop: 4 }}>
                  {(file.size / 1024).toFixed(1)} KB · Click to change
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(230,237,243,0.7)' }}>
                  Drop your CSV here, or click to browse
                </div>
                <div style={{ fontSize: 12, color: 'rgba(230,237,243,0.35)', marginTop: 4 }}>
                  .csv files only
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 14px',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 8,
                color: '#fca5a5',
                fontSize: 13,
              }}
            >
              {errorMessage}
            </div>
          )}

          {file && status !== 'uploading' && (
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button
                onClick={handleUpload}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  background: '#10d98a',
                  border: 'none',
                  borderRadius: 8,
                  color: '#022c1e',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                }}
              >
                Validate &amp; Import {collectionLabel}
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '11px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: 'rgba(230,237,243,0.5)',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
          )}

          {status === 'uploading' && (
            <div
              style={{
                marginTop: 16,
                padding: '14px',
                background: 'rgba(16,217,138,0.05)',
                border: '1px solid rgba(16,217,138,0.15)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                color: '#10d98a',
              }}
            >
              <SpinnerIcon />
              Validating and importing… do not close this page.
            </div>
          )}
        </div>

        {/* ── Step 3: Results ───────────────────────────────────────────── */}
        {result && (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${result.failed === 0 ? 'rgba(16,217,138,0.2)' : 'rgba(248,113,113,0.25)'}`,
              borderRadius: 12,
              padding: '20px 24px',
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(230,237,243,0.35)',
                marginBottom: 4,
              }}
            >
              Step 3 — Results
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: 14,
                color: result.failed === 0 ? '#10d98a' : '#fca5a5',
              }}
            >
              {result.message}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <StatBox label="Total rows" value={result.total} color="mist" />
              <StatBox label="Created" value={result.created} color="green" />
              {result.failed > 0 && <StatBox label="Failed" value={result.failed} color="red" />}
            </div>

            {/* Validation errors */}
            {allErrors.length > 0 && (
              <ErrorTable
                title={`Validation errors (${allErrors.length})`}
                rows={allErrors}
              />
            )}

            {/* Runtime errors */}
            {result.runtimeErrors.length > 0 && (
              <ErrorTable
                title={`Runtime errors (${result.runtimeErrors.length})`}
                rows={result.runtimeErrors}
              />
            )}

            {/* Created slugs */}
            {result.createdSlugs.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(16,217,138,0.6)',
                    marginBottom: 8,
                  }}
                >
                  Created drafts — review before publishing
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.createdSlugs.map((slug) => (
                    <a
                      key={slug}
                      href={`/admin/collections/${activeTab === 'transcripts' ? 'expert-transcripts' : 'earnings-analyses'}?where[slug][equals]=${slug}`}
                      style={{
                        display: 'inline-block',
                        fontFamily: 'monospace',
                        fontSize: 11,
                        padding: '3px 10px',
                        background: 'rgba(16,217,138,0.08)',
                        border: '1px solid rgba(16,217,138,0.2)',
                        borderRadius: 5,
                        color: '#10d98a',
                        textDecoration: 'none',
                      }}
                    >
                      {slug}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={reset}
              style={{
                marginTop: 18,
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 7,
                color: 'rgba(230,237,243,0.5)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Import another file
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Small helper components ───────────────────────────────────────────────

function StatBox({ label, value, color }: { label: string; value: number; color: 'green' | 'red' | 'mist' }) {
  const bg = color === 'green' ? 'rgba(16,217,138,0.08)' : color === 'red' ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.04)'
  const border = color === 'green' ? 'rgba(16,217,138,0.2)' : color === 'red' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.08)'
  const textColor = color === 'green' ? '#10d98a' : color === 'red' ? '#fca5a5' : 'rgba(230,237,243,0.5)'
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: '10px 16px',
        minWidth: 90,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: textColor, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: textColor, opacity: 0.7, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M6 1v7M3 5l3 3 3-3M2 10h8" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="8" cy="8" r="6" strokeOpacity="0.2" />
      <path d="M14 8A6 6 0 0 0 8 2" />
    </svg>
  )
}
