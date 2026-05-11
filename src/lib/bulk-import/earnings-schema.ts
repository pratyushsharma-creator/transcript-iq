import { wrapPlainTextAsLexical } from './lexical'

// ── Column definitions ────────────────────────────────────────────────────

export const EARNINGS_HEADERS = [
  'title*',
  'companyName*',
  'ticker*',
  'exchange*',
  'quarter*',
  'fiscalYear*',
  'reportDate*',
  'priceUsd*',
  'slug',
  'featured',
  'originalPriceUsd',
  'discountPercent',
  'priceInr',
  'pageCount',
  'metaTitle',
  'metaDescription',
  'performanceBadges',
  'complianceBadges',
  'engagementCopy',
  'summary',
  'executiveSummaryPreview',
  'keyTopics',
  'keyMetrics',
  'sampleQA_question',
  'sampleQA_answer',
  'sectors',
  'companies',
] as const

/**
 * keyMetrics encoding: "MetricName:Value:YoY||MetricName2:Value2"
 * Each metric is colon-separated; YoY is optional (just omit it).
 * Multiple metrics are separated by ||
 * Example: "Services Revenue:$24.2B:+14%||iPhone Revenue:$46.8B:-2%"
 */
export const EARNINGS_SAMPLE_ROW = [
  'Apple — Q2 FY2026 Earnings Analysis',
  'Apple Inc.',
  'AAPL',
  'NASDAQ',
  'Q2',
  '2026',
  '2026-05-01',
  '99',
  '',
  'false',
  '',
  '',
  '',
  '',
  '',
  '',
  'eps-beat|rev-beat',
  'mnpi-screened|pii-redacted|compliance-certified',
  'Same-day delivery · Buy-side ready',
  'One-paragraph summary shown on the listing and in search results.',
  'This executive summary preview is shown blurred before purchase.',
  'iPhone Demand|Services Revenue|India Growth|AI Investment',
  'Services Revenue:$24.2B:+14%||iPhone Revenue:$46.8B:-2%||EPS:$1.65:+8%',
  'What drove the Services outperformance this quarter?',
  'Services delivered record revenue driven by App Store, advertising, and financial services...',
  'Technology',
  'NVIDIA Corp., Microsoft Corp., Alphabet Inc.',
]

// ── Allowed values ────────────────────────────────────────────────────────

export const EXCHANGE_VALUES = [
  'NASDAQ', 'NYSE', 'NSE', 'BSE', 'LSE', 'HKEX', 'SGX', 'TSE', 'ASX',
] as const

export const QUARTER_VALUES = ['Q1', 'Q2', 'Q3', 'Q4', 'FY'] as const

export const PERFORMANCE_BADGE_VALUES = [
  'eps-beat', 'eps-miss', 'eps-in-line',
  'rev-beat', 'rev-miss', 'rev-in-line',
] as const

export const EARNINGS_COMPLIANCE_BADGE_VALUES = [
  'mnpi-screened', 'pii-redacted', 'compliance-certified',
] as const

// ── Validation ────────────────────────────────────────────────────────────

export interface RowError {
  row: number
  field: string
  message: string
}

export interface ValidatedEarningsRow {
  title: string
  companyName: string
  ticker: string
  exchange: string
  quarter: string
  fiscalYear: number
  reportDate: string
  priceUsd: number
  slug?: string
  featured: boolean
  originalPriceUsd?: number
  discountPercent?: number
  priceInr?: number
  pageCount?: number
  metaTitle?: string
  metaDescription?: string
  performanceBadges?: string[]
  complianceBadges?: string[]
  engagementCopy?: string
  summary?: string
  executiveSummaryPreview?: string
  keyTopics?: string[]
  keyMetrics?: Array<{ metric: string; value: string; yoyChange?: string }>
  sampleQA_question?: string
  sampleQA_answer?: string
  sectors?: string[]    // names — caller resolves to IDs
  companies?: string    // plain text
}

function num(s: string | undefined): number | undefined {
  if (!s?.trim()) return undefined
  const n = parseFloat(s)
  return isNaN(n) ? undefined : n
}

function int(s: string | undefined): number | undefined {
  if (!s?.trim()) return undefined
  const n = parseInt(s, 10)
  return isNaN(n) ? undefined : n
}

function splitPipe(s: string | undefined): string[] {
  if (!s?.trim()) return []
  return s.split('|').map((x) => x.trim()).filter(Boolean)
}

function parseKeyMetrics(
  s: string | undefined,
): Array<{ metric: string; value: string; yoyChange?: string }> {
  if (!s?.trim()) return []
  return s.split('||').map((part) => {
    const [metric, value, yoyChange] = part.split(':').map((x) => x.trim())
    return {
      metric: metric ?? '',
      value: value ?? '',
      yoyChange: yoyChange || undefined,
    }
  }).filter((m) => m.metric && m.value)
}

export function validateEarningsRow(
  row: Record<string, string>,
  rowNum: number,
): { valid: false; errors: RowError[] } | { valid: true; data: ValidatedEarningsRow } {
  const errors: RowError[] = []

  // ── Required ──────────────────────────────────────────────────────────

  const title = row['title']?.trim()
  if (!title) errors.push({ row: rowNum, field: 'title', message: 'Required' })

  const companyName = row['companyName']?.trim()
  if (!companyName) errors.push({ row: rowNum, field: 'companyName', message: 'Required' })

  const ticker = row['ticker']?.trim().toUpperCase()
  if (!ticker) errors.push({ row: rowNum, field: 'ticker', message: 'Required' })

  const exchange = row['exchange']?.trim().toUpperCase()
  if (!exchange) {
    errors.push({ row: rowNum, field: 'exchange', message: 'Required' })
  } else if (!EXCHANGE_VALUES.includes(exchange as typeof EXCHANGE_VALUES[number])) {
    errors.push({
      row: rowNum,
      field: 'exchange',
      message: `Must be one of: ${EXCHANGE_VALUES.join(', ')}`,
    })
  }

  const quarter = row['quarter']?.trim().toUpperCase()
  if (!quarter) {
    errors.push({ row: rowNum, field: 'quarter', message: 'Required' })
  } else if (!QUARTER_VALUES.includes(quarter as typeof QUARTER_VALUES[number])) {
    errors.push({
      row: rowNum,
      field: 'quarter',
      message: `Must be one of: ${QUARTER_VALUES.join(', ')}`,
    })
  }

  const fiscalYearRaw = row['fiscalYear']?.trim()
  let fiscalYear = 0
  if (!fiscalYearRaw) {
    errors.push({ row: rowNum, field: 'fiscalYear', message: 'Required' })
  } else {
    fiscalYear = parseInt(fiscalYearRaw, 10)
    if (isNaN(fiscalYear) || fiscalYear < 2000 || fiscalYear > 2100) {
      errors.push({
        row: rowNum,
        field: 'fiscalYear',
        message: 'Must be a valid 4-digit fiscal year (e.g. 2026)',
      })
    }
  }

  const reportDate = row['reportDate']?.trim()
  if (!reportDate) {
    errors.push({ row: rowNum, field: 'reportDate', message: 'Required' })
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate) || isNaN(Date.parse(reportDate))) {
    errors.push({ row: rowNum, field: 'reportDate', message: 'Must be a valid YYYY-MM-DD date' })
  }

  const priceUsdRaw = row['priceUsd']?.trim()
  let priceUsd = 0
  if (!priceUsdRaw) {
    errors.push({ row: rowNum, field: 'priceUsd', message: 'Required' })
  } else {
    priceUsd = parseFloat(priceUsdRaw)
    if (isNaN(priceUsd) || priceUsd <= 0) {
      errors.push({ row: rowNum, field: 'priceUsd', message: 'Must be a positive number' })
    }
  }

  // ── Optional with constraints ─────────────────────────────────────────

  const discountRaw = row['discountPercent']?.trim()
  if (discountRaw) {
    const d = parseFloat(discountRaw)
    if (isNaN(d) || d < 0 || d > 90) {
      errors.push({
        row: rowNum,
        field: 'discountPercent',
        message: 'Must be a number between 0 and 90',
      })
    }
  }

  const metaTitle = row['metaTitle']?.trim()
  if (metaTitle && metaTitle.length > 120) {
    errors.push({ row: rowNum, field: 'metaTitle', message: 'Must be 120 characters or fewer' })
  }

  const metaDescription = row['metaDescription']?.trim()
  if (metaDescription && metaDescription.length > 300) {
    errors.push({
      row: rowNum,
      field: 'metaDescription',
      message: 'Must be 300 characters or fewer',
    })
  }

  const perfBadges = splitPipe(row['performanceBadges'])
  for (const b of perfBadges) {
    if (!PERFORMANCE_BADGE_VALUES.includes(b as typeof PERFORMANCE_BADGE_VALUES[number])) {
      errors.push({
        row: rowNum,
        field: 'performanceBadges',
        message: `"${b}" is not valid. Must be one of: ${PERFORMANCE_BADGE_VALUES.join(', ')}`,
      })
    }
  }

  const compBadges = splitPipe(row['complianceBadges'])
  for (const b of compBadges) {
    if (
      !EARNINGS_COMPLIANCE_BADGE_VALUES.includes(b as typeof EARNINGS_COMPLIANCE_BADGE_VALUES[number])
    ) {
      errors.push({
        row: rowNum,
        field: 'complianceBadges',
        message: `"${b}" is not valid. Must be one of: ${EARNINGS_COMPLIANCE_BADGE_VALUES.join(', ')}`,
      })
    }
  }

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    data: {
      title: title!,
      companyName: companyName!,
      ticker: ticker!,
      exchange: exchange!,
      quarter: quarter!,
      fiscalYear,
      reportDate: reportDate!,
      priceUsd,
      slug: row['slug']?.trim() || undefined,
      featured: row['featured']?.trim().toLowerCase() === 'true',
      originalPriceUsd: num(row['originalPriceUsd']),
      discountPercent: num(row['discountPercent']),
      priceInr: num(row['priceInr']),
      pageCount: int(row['pageCount']),
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      performanceBadges: perfBadges.length > 0 ? perfBadges : undefined,
      complianceBadges: compBadges.length > 0 ? compBadges : undefined,
      engagementCopy: row['engagementCopy']?.trim() || undefined,
      summary: row['summary']?.trim() || undefined,
      executiveSummaryPreview: row['executiveSummaryPreview']?.trim() || undefined,
      keyTopics: splitPipe(row['keyTopics']).length > 0 ? splitPipe(row['keyTopics']) : undefined,
      keyMetrics: parseKeyMetrics(row['keyMetrics']).length > 0
        ? parseKeyMetrics(row['keyMetrics'])
        : undefined,
      sampleQA_question: row['sampleQA_question']?.trim() || undefined,
      sampleQA_answer: row['sampleQA_answer']?.trim() || undefined,
      sectors: splitPipe(row['sectors']).length > 0 ? splitPipe(row['sectors']) : undefined,
      companies: row['companies']?.trim() || undefined,
    },
  }
}

// ── Payload document builder ──────────────────────────────────────────────

export function buildEarningsPayload(
  row: ValidatedEarningsRow,
  sectorIds: string[],
): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    title: row.title,
    companyName: row.companyName,
    ticker: row.ticker,
    exchange: row.exchange,
    quarter: row.quarter,
    fiscalYear: row.fiscalYear,
    reportDate: row.reportDate,
    priceUsd: row.priceUsd,
    _status: 'draft',
  }

  if (row.slug) doc.slug = row.slug
  doc.featured = row.featured
  if (row.originalPriceUsd != null) doc.originalPriceUsd = row.originalPriceUsd
  if (row.discountPercent != null) doc.discountPercent = row.discountPercent
  if (row.priceInr != null) doc.priceInr = row.priceInr
  if (row.pageCount != null) doc.pageCount = row.pageCount
  if (row.metaTitle) doc.metaTitle = row.metaTitle
  if (row.metaDescription) doc.metaDescription = row.metaDescription
  if (row.performanceBadges?.length) doc.performanceBadges = row.performanceBadges
  if (row.complianceBadges?.length) doc.complianceBadges = row.complianceBadges
  if (row.engagementCopy) doc.engagementCopy = row.engagementCopy
  if (row.summary) doc.summary = row.summary
  if (row.executiveSummaryPreview)
    doc.executiveSummaryPreview = wrapPlainTextAsLexical(row.executiveSummaryPreview)

  if (row.keyTopics?.length) {
    doc.keyTopics = row.keyTopics.map((topic) => ({ topic }))
  }
  if (row.keyMetrics?.length) {
    doc.keyMetrics = row.keyMetrics
  }

  if (row.sampleQA_question || row.sampleQA_answer) {
    doc.sampleQA = {
      question: row.sampleQA_question ?? '',
      answer: row.sampleQA_answer ?? '',
    }
  }

  if (sectorIds.length > 0) doc.sectors = sectorIds
  if (row.companies) doc.companies = row.companies

  return doc
}
