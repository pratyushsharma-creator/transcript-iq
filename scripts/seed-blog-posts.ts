/**
 * seed-blog-posts.ts
 * Seeds the blog-posts collection with all 6 articles from the live site.
 * Article 1 has full body content; Articles 2-6 are seeded with rich excerpts
 * and placeholder body (ready for full content to be added via admin later).
 *
 * Usage: npx tsx scripts/seed-blog-posts.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

// ── Lexical helpers ───────────────────────────────────────────────────────

function paragraph(text: string): object {
  return {
    type: 'paragraph',
    children: [{ type: 'text', text, format: 0 }],
    version: 1,
  }
}

function h2(text: string): object {
  return {
    type: 'heading',
    tag: 'h2',
    children: [{ type: 'text', text, format: 0 }],
    version: 1,
  }
}

function h3(text: string): object {
  return {
    type: 'heading',
    tag: 'h3',
    children: [{ type: 'text', text, format: 0 }],
    version: 1,
  }
}

function ul(items: string[]): object {
  return {
    type: 'list',
    tag: 'ul',
    listType: 'bullet',
    children: items.map((item) => ({
      type: 'listitem',
      children: [{ type: 'text', text: item, format: 0 }],
      version: 1,
    })),
    version: 1,
  }
}

function blockquote(text: string): object {
  return {
    type: 'quote',
    children: [{ type: 'text', text, format: 0 }],
    version: 1,
  }
}

function body(...nodes: object[]): object {
  return {
    root: {
      type: 'root',
      children: nodes,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// ── Article 1: Full body ──────────────────────────────────────────────────

const article1Body = body(
  h2('The Direct Answer: What an Expert Call Transcript Is'),
  paragraph(
    'An expert call transcript is a verbatim written record of a structured conversation between an institutional researcher and an industry practitioner. The practitioner is typically a former executive, a senior operating professional, or a sector specialist who held a decision-making role at a relevant company. The conversation is facilitated through an expert network, and the resulting document captures not just the answers but the full exchange, including the questions that produced them.',
  ),
  paragraph(
    'These transcripts have been among the most closely guarded research assets in institutional finance for over two decades. Until now, accessing them required either a six-figure annual subscription to a platform like Tegus or Third Bridge, or the budget and internal bandwidth to commission fresh calls through networks like GLG, AlphaSights, or Guidepoint. There was no retail market. There was no per-document access. Transcripts existed behind walled gardens that smaller funds, independent analysts, and institutional teams in emerging markets could not access. Transcript IQ is built to change that.',
  ),
  h2('What Is Actually Inside an Expert Call Transcript'),
  paragraph(
    'A high-quality expert call transcript is a structured document, not a raw dump of audio. Understanding its components helps researchers extract value quickly and assess what they are buying before committing.',
  ),
  h3('The Expert Profile'),
  paragraph(
    'Every transcript opens with an anonymised description of the expert who participated in the call. At Transcript IQ, this follows the format: Former [Title], [Company Type]. For example: Former VP of Product Strategy, Tier 1 Semiconductor Manufacturer. The specific name and employer are withheld to protect identity and comply with confidentiality obligations, but the role, seniority level, and institutional context are always disclosed clearly.',
  ),
  paragraph(
    'This matters because the credibility of information in the transcript is directly tied to the vantage point of the source. A former CFO discussing capital allocation priorities carries different evidentiary weight than a former analyst at the same organisation covering the same period. Researchers assess source quality before investing time in the full content.',
  ),
  h3('The Call Date and Sector Classification'),
  paragraph(
    'Transcripts are dated. The call date matters because practitioner knowledge is time-sensitive. A former head of procurement at a contract manufacturer who left in 2021 has excellent insight into supply chain dynamics as they existed through that period, but may not reflect post-pandemic restructuring. Researchers use the call date to contextualise the information appropriately.',
  ),
  paragraph(
    'Every transcript is also classified by sector. Transcript IQ uses a thirteen-category taxonomy: Technology, Healthcare, Financial Services, Consumer, Industrials, Energy, Real Estate, Materials, Telecommunications, Media, Transportation, Retail, and Emerging Markets.',
  ),
  h3('The Verbatim Dialogue'),
  paragraph(
    'The body of the transcript is the verbatim exchange between interviewer and expert. This is not a summary or a set of bullet points. It is the full dialogue, question by question, in the order it occurred. This matters for several reasons.',
  ),
  paragraph(
    'First, nuance is preserved. A practitioner\'s answer to a direct question about pricing pressure is different from their unprompted comment about pricing during a broader operational discussion. The verbatim format captures both the content and the context in which it was offered.',
  ),
  paragraph(
    'Second, the questioning line is visible. Experienced researchers read not just the answers but the questions. The quality of the interviewer\'s framing, what follow-up questions were asked and not asked, and what threads were pursued versus dropped all affect how a researcher interprets the information.',
  ),
  h2('Why Expert Call Transcripts Have the Value They Do'),
  h3('The Information That Does Not Appear in Public Sources'),
  paragraph(
    'Public market research has one fundamental limitation: it is, by definition, public. Sell-side equity research, management earnings transcripts, investor presentations, trade press coverage — all of it is available to every market participant simultaneously. They are a shared starting point, not an information advantage.',
  ),
  paragraph(
    'Expert call transcripts capture the practitioner layer of knowledge that sits between public information and regulated insider information. A former VP of Sales at a target company knows things about the sales cycle, customer retention patterns, pricing strategy, and go-to-market efficiency that are not available anywhere in the public domain, but that also do not constitute material non-public information in the regulatory sense.',
  ),
  blockquote(
    'An expert call transcript is not a research shortcut. It is a structured record of practitioner knowledge that does not appear anywhere in the public domain. That is why institutional researchers pay what they pay for it.',
  ),
  h3('Speed and Availability at the Point of Need'),
  paragraph(
    'The traditional alternative to buying a transcript is commissioning a fresh expert call. The problem is that commissioning takes time: typically three to seven business days from brief submission to call completion, even with a well-resourced network. In deal diligence, earnings season preparation, or fast-moving sector analysis, that timeline is frequently incompatible with the research need.',
  ),
  paragraph(
    'A transcript purchased from a library is available immediately. The researcher can be reading within minutes of identifying the need. For teams working to compressed timelines, this immediacy has direct economic value that is independent of the content quality.',
  ),
  h2('The MNPI Question: Compliance and Screening'),
  paragraph(
    'Every transcript in the Transcript IQ library has been screened for material non-public information before publication. MNPI screening is the process by which a compliance team reviews the content of an expert call before it is distributed to ensure that the expert did not inadvertently disclose information that could constitute insider information under applicable securities laws.',
  ),
  paragraph(
    'At Transcript IQ, every transcript is reviewed against this standard before it enters the library. Each document comes with a compliance certification that can be filed with an institutional compliance team. This makes Transcript IQ transcripts suitable for use in regulated investment processes.',
  ),
  h2('Who Uses Expert Call Transcripts'),
  h3('Private Equity Deal Teams'),
  paragraph(
    'PE deal teams use expert call transcripts as a first-pass research tool during deal diligence. Before committing resources to a full primary research programme, a deal team will often buy two to four transcripts covering the target sector to calibrate their understanding of operational dynamics, competitive positioning, and industry structure.',
  ),
  h3('Equity Analysts at Hedge Funds'),
  paragraph(
    'Hedge fund analysts covering a broad universe of names use transcript libraries to maintain what amounts to a permanent channel check programme. Rather than scheduling fresh calls before each earnings season, they keep a small library of relevant transcripts for their core positions and refresh it quarterly.',
  ),
  h3('Management Consultants and Strategy Teams'),
  paragraph(
    'Consulting teams use expert call transcripts in the research phase of strategy engagements. The advantage over commissioned calls in this context is that transcripts can be purchased, reviewed, and assessed for relevance before a client engagement formally begins.',
  ),
  h2('Transcript IQ: Why This Is the First Platform Built for Retail Access'),
  paragraph(
    'For more than a decade, the expert call transcript market was organised around institutional subscriptions priced for the largest research operations in the world. A seat on a platform like Tegus or Third Bridge started at approximately fifteen thousand dollars per year. Transcript IQ changes the economics entirely: documents are priced per transcript, there is no subscription, and there is no platform fee.',
  ),
  paragraph(
    'The compliance infrastructure that institutional researchers require — MNPI screening, compliance certificates, documented sourcing — is built into every document as a standard feature, not an add-on.',
  ),
  h2('How to Get Started'),
  paragraph(
    'The fastest way to experience the value of an expert call transcript is to read one. Transcript IQ offers a free transcript matched to your sector — no credit card, no subscription, just a work email and a sector selection. Browse the library to explore 77+ published transcripts across 13 sectors. Each listing includes the executive summary preview, expert seniority level, geography, and tagged companies.',
  ),
)

// ── Article stubs (2-6) ───────────────────────────────────────────────────

function stubBody(title: string, excerpt: string): object {
  return body(
    paragraph(excerpt),
    h2('Coming Soon'),
    paragraph(
      `This article — "${title}" — is currently being finalised. Full content will be published shortly. Subscribe to the research newsletter to be notified when it goes live.`,
    ),
  )
}

// ── Main seed ─────────────────────────────────────────────────────────────

const articles = [
  {
    title: 'What Are Expert Call Transcripts and Why Do They Matter',
    slug: 'what-are-expert-call-transcripts',
    contentType: 'educational',
    excerpt:
      'Expert call transcripts are verbatim records of structured conversations with former executives and industry practitioners. This guide explains what they contain, why research teams pay hundreds of dollars per document, and why Transcript IQ offers them without a subscription.',
    body: article1Body,
    readTime: 10,
    publishedAt: new Date('2026-04-15').toISOString(),
    featured: true,
  },
  {
    title: 'From Expert Call to Investment Memo: A Workflow Guide for Research Analysts',
    slug: 'expert-call-to-investment-memo',
    contentType: 'thought-leadership',
    excerpt:
      'A step-by-step process for extracting and documenting insights from expert call transcripts into actionable investment research deliverables — from the first read through to the IC memo.',
    body: stubBody(
      'From Expert Call to Investment Memo',
      'A step-by-step process for extracting and documenting insights from expert call transcripts into actionable investment research deliverables — from the first read through to the IC memo.',
    ),
    readTime: 9,
    publishedAt: new Date('2026-04-20').toISOString(),
    featured: false,
  },
  {
    title: '5 Ways Hedge Fund Analysts Use Expert Call Transcripts for Earnings Season Research',
    slug: 'hedge-fund-analysts-earnings-season',
    contentType: 'use-case',
    excerpt:
      'How systematic equity researchers use pre-screened expert transcripts to run channel checks, validate thesis assumptions, and model competitive dynamics before earnings — without burning a week on scheduling.',
    body: stubBody(
      '5 Ways Hedge Fund Analysts Use Expert Call Transcripts for Earnings Season Research',
      'How systematic equity researchers use pre-screened expert transcripts to run channel checks, validate thesis assumptions, and model competitive dynamics before earnings — without burning a week on scheduling.',
    ),
    readTime: 7,
    publishedAt: new Date('2026-04-25').toISOString(),
    featured: false,
  },
  {
    title: 'MNPI Compliance in Expert Networks: What Every Analyst Needs to Know',
    slug: 'mnpi-compliance-expert-networks',
    contentType: 'educational',
    excerpt:
      'A practical guide to MNPI screening in expert network research, covering SEC and FCA standards, how major platforms approach compliance, and what institutional compliance teams look for when approving expert network use.',
    body: stubBody(
      'MNPI Compliance in Expert Networks',
      'A practical guide to MNPI screening in expert network research, covering SEC and FCA standards, how major platforms approach compliance, and what institutional compliance teams look for when approving expert network use.',
    ),
    readTime: 11,
    publishedAt: new Date('2026-04-28').toISOString(),
    featured: false,
  },
  {
    title: 'Tegus vs Third Bridge vs Transcript-IQ: A Practical Cost Comparison',
    slug: 'tegus-third-bridge-cost-comparison',
    contentType: 'educational',
    excerpt:
      'A no-nonsense breakdown of what PE firms, hedge funds, and consulting teams actually spend on primary research — subscription platforms versus per-transcript pricing — and when each model makes economic sense.',
    body: stubBody(
      'Tegus vs Third Bridge vs Transcript-IQ: A Practical Cost Comparison',
      'A no-nonsense breakdown of what PE firms, hedge funds, and consulting teams actually spend on primary research — subscription platforms versus per-transcript pricing — and when each model makes economic sense.',
    ),
    readTime: 8,
    publishedAt: new Date('2026-04-30').toISOString(),
    featured: false,
  },
  {
    title: 'How PE Firms Use Expert Networks for Deal Diligence — And Why Transcripts Are Changing the Game',
    slug: 'pe-firms-expert-networks-deal-diligence',
    contentType: 'industry-deep-dive',
    excerpt:
      'How leading PE funds have restructured primary research workflows — replacing expensive ad-hoc expert network calls with pre-screened transcript libraries. What\'s driving the shift and what it means for diligence quality.',
    body: stubBody(
      'How PE Firms Use Expert Networks for Deal Diligence',
      "How leading PE funds have restructured primary research workflows — replacing expensive ad-hoc expert network calls with pre-screened transcript libraries. What's driving the shift and what it means for diligence quality.",
    ),
    readTime: 12,
    publishedAt: new Date('2026-05-01').toISOString(),
    featured: false,
  },
]

async function main() {
  const payload = await getPayload({ config: await payloadConfig })

  console.log('\n📚 Seeding blog posts...\n')

  for (const article of articles) {
    // Check for existing
    const existing = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: article.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const id = existing.docs[0]!.id
      await payload.update({
        collection: 'blog-posts',
        id,
        data: {
          title: article.title,
          slug: article.slug,
          contentType: article.contentType as
            | 'educational'
            | 'industry-deep-dive'
            | 'use-case'
            | 'thought-leadership'
            | 'whitepaper'
            | 'case-study'
            | 'pillar',
          excerpt: article.excerpt,
          body: article.body as any,
          readTime: article.readTime,
          publishedAt: article.publishedAt,
          featured: article.featured,
          _status: 'published',
        },
      })
      console.log(`✓ Updated: ${article.slug}`)
    } else {
      await payload.create({
        collection: 'blog-posts',
        data: {
          title: article.title,
          slug: article.slug,
          contentType: article.contentType as
            | 'educational'
            | 'industry-deep-dive'
            | 'use-case'
            | 'thought-leadership'
            | 'whitepaper'
            | 'case-study'
            | 'pillar',
          excerpt: article.excerpt,
          body: article.body as any,
          readTime: article.readTime,
          publishedAt: article.publishedAt,
          featured: article.featured,
          _status: 'published',
        },
      })
      console.log(`✓ Created: ${article.slug}`)
    }
  }

  console.log('\n✅ Blog posts seeded successfully!\n')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
