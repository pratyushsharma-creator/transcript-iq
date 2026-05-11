import { wrapPlainTextAsLexical } from './lexical'

// ── Column definitions ────────────────────────────────────────────────────

/**
 * Ordered CSV headers for the ExpertTranscripts sample sheet.
 * Headers marked with * are mandatory.
 */
export const TRANSCRIPT_HEADERS = [
  'title*',
  'expertFormerTitle*',
  'expertLevel*',
  'dateConducted*',
  'tier*',
  'priceUsd*',
  'slug',
  'duration',
  'pageCount',
  'summary',
  'executiveSummaryPreview',
  'sampleQA_question',
  'sampleQA_answer',
  'topicsCovered',
  'originalPriceUsd',
  'discountPercent',
  'priceInr',
  'metaTitle',
  'metaDescription',
  'complianceBadges',
  'engagementCopy',
  'featured',
  'sectors',
  'geography',
  'companies',
] as const

export const TRANSCRIPT_SAMPLE_ROW = [
  'CFO Perspective on AI-Driven FP&A Transformation',
  'Former CFO, Major Enterprise SaaS (2018–2023)',
  'c-suite',
  '2026-04-15',
  'elite',
  '599',
  '',
  '75',
  '22',
  'One-paragraph public summary shown on the listing page.',
  'This section is shown blurred before purchase. It previews the depth of the analysis.',
  'What drove the decision to accelerate cloud migration in 2022?',
  'The decision was driven primarily by the need to reduce infrastructure costs and improve scalability...',
  'Cloud Migration|Cost Optimisation|Vendor Strategy|Enterprise SaaS',
  '',
  '',
  '',
  '',
  '',
  'mnpi-screened|pii-redacted|compliance-certified|expert-anonymised',
  '',
  'false',
  'Technology|Software',
  'north-america',
  'SAP SE, Oracle Corp., Workday Inc.',
]

// ── Allowed values ────────────────────────────────────────────────────────

export const EXPERT_LEVELS = ['c-suite', 'vp', 'director'] as const
export const TIERS = ['standard', 'premium', 'elite'] as const
export const GEOGRAPHY_VALUES = ['north-america', 'europe', 'global', 'apac'] as const
export const COMPLIANCE_BADGE_VALUES = [
  'mnpi-screened',
  'pii-redacted',
  'compliance-certified',
  'expert-anonymised',
] as const

// ── Validation ────────────────────────────────────────────────────────────

export interface RowError {
  row: number
  field: string
  message: string
}

export interface ValidatedTranscriptRow {
  title: string
  expertFormerTitle: string
  expertLevel: string
  dateConducted: string
  tier: string
  priceUsd: number
  slug?: string
  duration?: number
  pageCount?: number
  summary?: string
  executiveSummaryPreview?: string
  sampleQA_question?: string
  sampleQA_answer?: string
  topicsCovered?: string[]
  originalPriceUsd?: number
  discountPercent?: number
  priceInr?: number
  metaTitle?: string
  metaDescription?: string
  complianceBadges?: string[]
  engagementCopy?: string
  featured: boolean
  sectors?: string[]    // names — caller resolves to IDs
  geography?: string[]
  companies?: string    // stored as plain text
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

export function validateTranscriptRow(
  row: Record<string, string>,
  rowNum: number,
): { valid: false; errors: RowError[] } | { valid: true; data: ValidatedTranscriptRow } {
  const errors: RowError[] = []

  // ── Required fields ───────────────────────────────────────────────────

  const title = row['title']?.trim()
  if (!title) errors.push({ row: rowNum, field: 'title', message: 'Required' })

  const expertFormerTitle = row['expertFormerTitle']?.trim()
  if (!expertFormerTitle)
    errors.push({ row: rowNum, field: 'expertFormerTitle', message: 'Required' })

  const expertLevel = row['expertLevel']?.trim()
  if (!expertLevel) {
    errors.push({ row: rowNum, field: 'expertLevel', message: 'Required' })
  } else if (!EXPERT_LEVELS.includes(expertLevel as typeof EXPERT_LEVELS[number])) {
    errors.push({
      row: rowNum,
      field: 'expertLevel',
      message: `Must be one of: ${EXPERT_LEVELS.join(', ')}`,
    })
  }

  const dateConducted = row['dateConducted']?.trim()
  if (!dateConducted) {
    errors.push({ row: rowNum, field: 'dateConducted', message: 'Required' })
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateConducted) || isNaN(Date.parse(dateConducted))) {
    errors.push({ row: rowNum, field: 'dateConducted', message: 'Must be a valid YYYY-MM-DD date' })
  }

  const tier = row['tier']?.trim()
  if (!tier) {
    errors.push({ row: rowNum, field: 'tier', message: 'Required' })
  } else if (!TIERS.includes(tier as typeof TIERS[number])) {
    errors.push({ row: rowNum, field: 'tier', message: `Must be one of: ${TIERS.join(', ')}` })
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

  const geoParts = splitPipe(row['geography'])
  for (const g of geoParts) {
    if (!GEOGRAPHY_VALUES.includes(g as typeof GEOGRAPHY_VALUES[number])) {
      errors.push({
        row: rowNum,
        field: 'geography',
        message: `"${g}" is not valid. Must be one of: ${GEOGRAPHY_VALUES.join(', ')}`,
      })
    }
  }

  const badgeParts = splitPipe(row['complianceBadges'])
  for (const b of badgeParts) {
    if (!COMPLIANCE_BADGE_VALUES.includes(b as typeof COMPLIANCE_BADGE_VALUES[number])) {
      errors.push({
        row: rowNum,
        field: 'complianceBadges',
        message: `"${b}" is not valid. Must be one of: ${COMPLIANCE_BADGE_VALUES.join(', ')}`,
      })
    }
  }

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    data: {
      title: title!,
      expertFormerTitle: expertFormerTitle!,
      expertLevel: expertLevel!,
      dateConducted: dateConducted!,
      tier: tier!,
      priceUsd,
      slug: row['slug']?.trim() || undefined,
      duration: num(row['duration']),
      pageCount: int(row['pageCount']),
      summary: row['summary']?.trim() || undefined,
      executiveSummaryPreview: row['executiveSummaryPreview']?.trim() || undefined,
      sampleQA_question: row['sampleQA_question']?.trim() || undefined,
      sampleQA_answer: row['sampleQA_answer']?.trim() || undefined,
      topicsCovered: splitPipe(row['topicsCovered']).length > 0
        ? splitPipe(row['topicsCovered'])
        : undefined,
      originalPriceUsd: num(row['originalPriceUsd']),
      discountPercent: num(row['discountPercent']),
      priceInr: num(row['priceInr']),
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      complianceBadges: badgeParts.length > 0 ? badgeParts : undefined,
      engagementCopy: row['engagementCopy']?.trim() || undefined,
      featured: row['featured']?.trim().toLowerCase() === 'true',
      sectors: splitPipe(row['sectors']).length > 0 ? splitPipe(row['sectors']) : undefined,
      geography: geoParts.length > 0 ? geoParts : undefined,
      companies: row['companies']?.trim() || undefined,
    },
  }
}

// ── Payload document builder ──────────────────────────────────────────────

/**
 * Converts a validated transcript row to a Payload-ready create payload.
 * `sectorIds` must be pre-resolved by the API route (name → ID lookup).
 */
export function buildTranscriptPayload(
  row: ValidatedTranscriptRow,
  sectorIds: string[],
): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    title: row.title,
    expertFormerTitle: row.expertFormerTitle,
    expertLevel: row.expertLevel,
    dateConducted: row.dateConducted,
    tier: row.tier,
    priceUsd: row.priceUsd,
    _status: 'draft',
  }

  if (row.slug) doc.slug = row.slug
  if (row.duration != null) doc.duration = row.duration
  if (row.pageCount != null) doc.pageCount = row.pageCount
  if (row.summary) doc.summary = row.summary
  if (row.executiveSummaryPreview)
    doc.executiveSummaryPreview = wrapPlainTextAsLexical(row.executiveSummaryPreview)

  if (row.sampleQA_question || row.sampleQA_answer) {
    doc.sampleQA = {
      question: row.sampleQA_question ?? '',
      answer: row.sampleQA_answer ?? '',
    }
  }

  if (row.topicsCovered?.length) {
    doc.topicsCovered = row.topicsCovered.map((topic) => ({ topic }))
  }

  if (row.originalPriceUsd != null) doc.originalPriceUsd = row.originalPriceUsd
  if (row.discountPercent != null) doc.discountPercent = row.discountPercent
  if (row.priceInr != null) doc.priceInr = row.priceInr
  if (row.metaTitle) doc.metaTitle = row.metaTitle
  if (row.metaDescription) doc.metaDescription = row.metaDescription
  if (row.complianceBadges?.length) doc.complianceBadges = row.complianceBadges
  if (row.engagementCopy) doc.engagementCopy = row.engagementCopy
  doc.featured = row.featured

  if (sectorIds.length > 0) doc.sectors = sectorIds
  if (row.geography?.length) doc.geography = row.geography
  if (row.companies) doc.companies = row.companies

  return doc
}
