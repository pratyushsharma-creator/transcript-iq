import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { parseCSV } from '@/lib/bulk-import/csv-parse'
import {
  validateTranscriptRow,
  buildTranscriptPayload,
  type ValidatedTranscriptRow,
} from '@/lib/bulk-import/transcript-schema'
import {
  validateEarningsRow,
  buildEarningsPayload,
  type ValidatedEarningsRow,
} from '@/lib/bulk-import/earnings-schema'

export const runtime = 'nodejs'
export const maxDuration = 60

// ── Types ─────────────────────────────────────────────────────────────────

interface ImportResult {
  total: number
  created: number
  failed: number
  validationErrors: Array<{ row: number; field: string; message: string }>
  sectorErrors: Array<{ row: number; sectors: string[] }>
  runtimeErrors: Array<{ row: number; message: string }>
  createdSlugs: string[]
}

// ── Auth ──────────────────────────────────────────────────────────────────

async function verifyAuth(req: NextRequest): Promise<boolean> {
  // Allow PAYLOAD_SECRET Bearer tokens (e.g. from scripts)
  const authHeader = req.headers.get('Authorization') ?? ''
  if (
    authHeader.startsWith('Bearer ') &&
    authHeader.slice(7) === process.env.PAYLOAD_SECRET
  ) {
    return true
  }

  // Allow logged-in admin/editor sessions via Payload's JWT cookie
  try {
    const payload = await getPayload({ config: await config })
    const headersList = await nextHeaders()
    const { user } = await payload.auth({ headers: headersList })
    if (user && ['admin', 'editor'].includes((user as { role?: string }).role ?? '')) {
      return true
    }
  } catch {
    // Fall through
  }

  return false
}

// ── Sector resolver ───────────────────────────────────────────────────────

/**
 * Given a list of sector names from the CSV, returns a map of
 * { name → id } for all that exist, and a list of names that don't.
 */
async function resolveSectors(
  names: string[],
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<{ found: Record<string, string>; missing: string[] }> {
  if (names.length === 0) return { found: {}, missing: [] }

  const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))]
  const result = await payload.find({
    collection: 'industries',
    where: { name: { in: unique } },
    limit: unique.length,
    overrideAccess: true,
  })

  const found: Record<string, string> = {}
  for (const doc of result.docs) {
    found[doc.name] = String(doc.id)
  }

  const missing = unique.filter((n) => !found[n])
  return { found, missing }
}

// ── Route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse multipart form data
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Request must be multipart/form-data' }, { status: 400 })
  }

  const type = formData.get('type')
  if (type !== 'transcripts' && type !== 'earnings') {
    return NextResponse.json(
      { error: 'type must be "transcripts" or "earnings"' },
      { status: 400 },
    )
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  let csvText: string
  try {
    csvText = await file.text()
  } catch {
    return NextResponse.json({ error: 'Could not read uploaded file' }, { status: 400 })
  }

  // Skip comment lines (lines starting with #) before parsing
  const cleanedCsv = csvText
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'))
    .join('\n')

  const rows = parseCSV(cleanedCsv)
  if (rows.length === 0) {
    return NextResponse.json({ error: 'CSV is empty or has no data rows' }, { status: 400 })
  }

  // ── Pass 1: Validate all rows ─────────────────────────────────────────

  const validationErrors: ImportResult['validationErrors'] = []
  const validatedRows: Array<ValidatedTranscriptRow | ValidatedEarningsRow> = []

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2 // +1 for header, +1 for 1-based

    if (type === 'transcripts') {
      const result = validateTranscriptRow(rows[i], rowNum)
      if (!result.valid) {
        validationErrors.push(...result.errors)
      } else {
        validatedRows.push(result.data)
      }
    } else {
      const result = validateEarningsRow(rows[i], rowNum)
      if (!result.valid) {
        validationErrors.push(...result.errors)
      } else {
        validatedRows.push(result.data)
      }
    }
  }

  // Reject the entire batch if any row fails validation
  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        total: rows.length,
        created: 0,
        failed: validationErrors.length,
        validationErrors,
        sectorErrors: [],
        runtimeErrors: [],
        createdSlugs: [],
        message: 'Validation failed — no records were created. Fix the errors and re-upload.',
      },
      { status: 422 },
    )
  }

  // ── Pass 2: Resolve all sector names to IDs ───────────────────────────

  const payload = await getPayload({ config: await config })

  // Collect all unique sector names across the batch
  const allSectorNames = new Set<string>()
  for (const row of validatedRows) {
    row.sectors?.forEach((n) => allSectorNames.add(n))
  }

  const { found: sectorMap, missing: missingSectors } = await resolveSectors(
    [...allSectorNames],
    payload,
  )

  // Map missing sectors back to which rows they appear in
  const sectorErrors: ImportResult['sectorErrors'] = []
  if (missingSectors.length > 0) {
    for (let i = 0; i < validatedRows.length; i++) {
      const row = validatedRows[i]
      const rowMissing = (row.sectors ?? []).filter((n) => missingSectors.includes(n))
      if (rowMissing.length > 0) {
        sectorErrors.push({ row: i + 2, sectors: rowMissing })
      }
    }
  }

  if (sectorErrors.length > 0) {
    return NextResponse.json(
      {
        total: rows.length,
        created: 0,
        failed: sectorErrors.length,
        validationErrors: [],
        sectorErrors,
        runtimeErrors: [],
        createdSlugs: [],
        message: `Sector name(s) not found in the Industries collection. Create them first, then re-upload. Missing: ${missingSectors.join(', ')}`,
      },
      { status: 422 },
    )
  }

  // ── Pass 3: Create records ────────────────────────────────────────────

  const runtimeErrors: ImportResult['runtimeErrors'] = []
  const createdSlugs: string[] = []

  for (let i = 0; i < validatedRows.length; i++) {
    const row = validatedRows[i]
    const rowNum = i + 2
    const sectorIds = (row.sectors ?? []).map((n) => sectorMap[n]).filter(Boolean)

    try {
      let doc: { slug?: string }

      if (type === 'transcripts') {
        const data = buildTranscriptPayload(row as ValidatedTranscriptRow, sectorIds)
        doc = await payload.create({
          collection: 'expert-transcripts',
          data: data as never,
          overrideAccess: true,
        })
      } else {
        const data = buildEarningsPayload(row as ValidatedEarningsRow, sectorIds)
        doc = await payload.create({
          collection: 'earnings-analyses',
          data: data as never,
          overrideAccess: true,
        })
      }

      if (doc.slug) createdSlugs.push(doc.slug)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      runtimeErrors.push({ row: rowNum, message })
    }
  }

  const created = createdSlugs.length
  const failed = runtimeErrors.length

  return NextResponse.json(
    {
      total: rows.length,
      created,
      failed,
      validationErrors: [],
      sectorErrors: [],
      runtimeErrors,
      createdSlugs,
      message:
        failed === 0
          ? `${created} record${created !== 1 ? 's' : ''} created as drafts. Review in the Payload admin before publishing.`
          : `${created} created, ${failed} failed. See runtimeErrors for details.`,
    },
    { status: failed === 0 ? 200 : 207 },
  )
}
