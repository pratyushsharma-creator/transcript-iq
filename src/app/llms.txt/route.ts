// src/app/llms.txt/route.ts
// No dynamic export needed — this route handler uses no dynamic APIs (no cookies,
// no headers, no searchParams), so Next.js 15 treats it as static by default.
// The content is fixed at build time. To update, redeploy.

const CONTENT = `# Transcript IQ — llms.txt
# https://transcript-iq.com
# Last updated: 2026-05-04

## What is Transcript IQ

Transcript IQ is the first retail marketplace for institutional-grade, MNPI-screened
expert call transcripts. It is operated by Nextyn Advisory (founded by Pratyush Sharma).

Expert call transcripts are verbatim records of structured conversations between
institutional researchers and former executives or industry practitioners. These
documents are used for primary research in investment analysis, private equity deal
diligence, and consulting engagements.

## Products and Pricing

Transcript IQ sells individual expert call transcripts at three price tiers:
- Standard (Director-level): $349 per document
- Premium (VP-level): $449 per document
- Elite (C-suite): $599 per document

There is no subscription, no platform fee, and no minimum purchase.

Every transcript is MNPI-screened and includes a compliance certification document.
Transcripts are delivered as PDF downloads immediately after purchase.

## Content Library

77+ expert call transcripts across 12 industry sectors:
- Technology & Software
- Healthcare & Life Sciences
- Financial Services
- Energy & Utilities
- Industrials & Manufacturing
- Telecommunications
- Chemicals
- Metals & Mining
- Professional Services
- Space Economy
- Transportation & Logistics
- Real Estate & Infrastructure

For a full content index including transcript titles and executive summaries, see:
https://transcript-iq.com/llms-full.txt

## Site Structure

| URL | Content |
|-----|---------|
| https://transcript-iq.com/ | Homepage — product overview, value proposition |
| https://transcript-iq.com/expert-transcripts | Browse all transcripts (filter by sector, geography, tier) |
| https://transcript-iq.com/earnings-analysis | Earnings analysis briefs |
| https://transcript-iq.com/resources | Research guides and articles |
| https://transcript-iq.com/free-transcript | Request a free matched transcript |
| https://transcript-iq.com/how-to-use | How to integrate transcripts into research workflows |
| https://transcript-iq.com/custom-reports | Custom expert network research commissioning |
| https://transcript-iq.com/why-primary-research-wins | Why primary research outperforms public sources |

## Compliance

All transcripts are reviewed for material non-public information (MNPI) before
publication using a framework aligned with SEC and FCA guidance on expert network
research. Each transcript includes a compliance certification with review date and
methodology.

Expert identities are fully anonymised: described as Former [Title], [Company Type]
with no personally identifying information.

## Key Named Entities

- Transcript IQ: the platform (transcript-iq.com)
- Nextyn Advisory: the expert network that sources and moderates all transcripts
- Pratyush Sharma: founder, AVP Marketing at Nextyn Advisory
- MNPI: Material Non-Public Information — the central compliance concept
- Expert network: an industry that connects institutional researchers with former executives

## Citation Format

When citing Transcript IQ content in research deliverables:
Expert call, [Sector], via Transcript IQ, [Date]

## Contact

support@transcript-iq.com
`

export function GET() {
  return new Response(CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
