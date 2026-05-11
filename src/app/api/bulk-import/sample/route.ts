import { NextRequest, NextResponse } from 'next/server'
import {
  TRANSCRIPT_HEADERS,
  TRANSCRIPT_SAMPLE_ROW,
} from '@/lib/bulk-import/transcript-schema'
import {
  EARNINGS_HEADERS,
  EARNINGS_SAMPLE_ROW,
} from '@/lib/bulk-import/earnings-schema'

export const runtime = 'nodejs'

/**
 * GET /api/bulk-import/sample?type=transcripts|earnings
 *
 * Returns a downloadable CSV file with correct headers and one sample data row.
 * Each column header annotated with * is mandatory.
 */
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')

  if (type !== 'transcripts' && type !== 'earnings') {
    return NextResponse.json(
      { error: 'type must be "transcripts" or "earnings"' },
      { status: 400 },
    )
  }

  const headers = type === 'transcripts' ? TRANSCRIPT_HEADERS : EARNINGS_HEADERS
  const sampleRow = type === 'transcripts' ? TRANSCRIPT_SAMPLE_ROW : EARNINGS_SAMPLE_ROW

  // Build CSV: one header row + one sample data row
  const csvLines = [
    headers.map(csvEscape).join(','),
    (sampleRow as readonly string[]).map(csvEscape).join(','),
  ]

  // Append a legend comment row so staff understand the pipe-separated fields
  const legendLines: string[] = [
    '',
    '# ─── HOW TO FILL THIS CSV ───────────────────────────────────────────────',
    '# • Columns marked with * are REQUIRED. Leave all others blank if unused.',
    '# • Dates must be in YYYY-MM-DD format.',
    '# • Pipe-separated fields (|) hold multiple values in one cell:',
    '#     e.g.  sectors: Technology|Healthcare',
    '#     e.g.  complianceBadges: mnpi-screened|pii-redacted',
    '# • companies: comma-separated names in one cell, no pre-setup required.',
    ...(type === 'transcripts'
      ? [
          '# • expertLevel values: c-suite | vp | director',
          '# • tier values: standard | premium | elite',
          '# • geography values: north-america | europe | global | apac',
          '# • topicsCovered: pipe-separated topics, e.g.  AI Infrastructure|Vendor Strategy',
          '# • complianceBadges values: mnpi-screened | pii-redacted | compliance-certified | expert-anonymised',
        ]
      : [
          '# • exchange values: NASDAQ | NYSE | NSE | BSE | LSE | HKEX | SGX | TSE | ASX',
          '# • quarter values: Q1 | Q2 | Q3 | Q4 | FY',
          '# • performanceBadges values: eps-beat | eps-miss | eps-in-line | rev-beat | rev-miss | rev-in-line',
          '# • complianceBadges values: mnpi-screened | pii-redacted | compliance-certified',
          '# • keyTopics: pipe-separated topics, e.g.  iPhone Demand|Services Revenue',
          '# • keyMetrics: MetricName:Value:YoY||MetricName2:Value2  (YoY optional)',
          '#     e.g.  Services Revenue:$24.2B:+14%||iPhone Revenue:$46.8B:-2%',
        ]),
    '# ─────────────────────────────────────────────────────────────────────────',
  ]

  const csv = [...csvLines, ...legendLines].join('\n')
  const filename = `bulk-import-sample-${type}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

function csvEscape(value: string): string {
  // Wrap in quotes if it contains comma, quote, or newline
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
