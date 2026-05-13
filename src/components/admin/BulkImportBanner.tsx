'use client'

import { useRouter } from 'next/navigation'

/**
 * BulkImportBanner
 *
 * Rendered via admin.components.beforeList on the expert-transcripts and
 * earnings-analyses collection list views.  Gives editors a one-click route
 * to the CSV bulk-import tool without having to know the /admin/bulk-import URL.
 */
export function BulkImportBanner() {
  const router = useRouter()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        marginBottom: '16px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', flexGrow: 1 }}>
        Have multiple records to add at once?
      </span>
      <button
        type="button"
        onClick={() => router.push('/admin/bulk-import')}
        style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          padding: '6px 14px',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.20)',
          background: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.80)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'
        }}
      >
        Import via CSV →
      </button>
    </div>
  )
}
