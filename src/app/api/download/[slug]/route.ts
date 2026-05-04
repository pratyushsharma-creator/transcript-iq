import { NextRequest, NextResponse } from 'next/server'
import { verifyDownloadToken } from '@/lib/downloadToken'
// @vercel/blob is available but we fetch private blobs directly with the token header

// ── GET /api/download/[slug]?token=...&exp=...&type=... ────────────────────────
// Verifies the signed download token, then streams the PDF from Vercel Blob.
// No auth session required — token is self-verifying (HMAC + expiry).

export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)

  const token = searchParams.get('token') ?? ''
  const expStr = searchParams.get('exp') ?? '0'
  const type = (searchParams.get('type') ?? 'transcript') as 'transcript' | 'earnings'
  const exp = parseInt(expStr, 10)

  // ── Verify token ──────────────────────────────────────────────────────────
  const { valid, reason } = verifyDownloadToken(slug, type, token, exp)
  if (!valid) {
    return NextResponse.json({ error: reason ?? 'Invalid or expired download link.' }, { status: 403 })
  }

  // ── Look up the PDF blob URL from Payload ─────────────────────────────────
  // We fetch the document via the Payload REST API to get the pdfFile.url
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://transcript-iq.com'
    const collection = type === 'earnings' ? 'earnings-analyses' : 'expert-transcripts'

    const docRes = await fetch(
      `${siteUrl}/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
      { next: { revalidate: 0 } }
    )

    if (!docRes.ok) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    const docData = await docRes.json()
    const doc = docData?.docs?.[0]

    if (!doc) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    // pdfFile is a relationship — it may be populated as an object with a `url` field
    const pdfUrl: string | undefined =
      typeof doc.pdfFile === 'object' ? doc.pdfFile?.url : undefined

    if (!pdfUrl) {
      // PDF not yet uploaded — return a friendly error
      return NextResponse.json(
        { error: 'PDF is being prepared. You will receive an email when it is ready.' },
        { status: 202 }
      )
    }

    // ── Stream from Vercel Blob ───────────────────────────────────────────────
    // Private blobs require the token in the Authorization header
    const blobRes = await fetch(pdfUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    if (!blobRes.ok) {
      return NextResponse.json({ error: 'Failed to retrieve file.' }, { status: 502 })
    }

    const filename = `${slug}.pdf`

    // Stream the PDF back to the client with download headers
    return new NextResponse(blobRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('[download]', err)
    return NextResponse.json({ error: 'Download failed. Please try again.' }, { status: 500 })
  }
}
