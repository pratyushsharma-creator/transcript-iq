import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  // ── Ensure an admin user exists so Pratyush can log in ──
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.docs.length === 0) {
    console.log('Creating default admin user pratyush.sharma@nextyn.com...')
    await payload.create({
      collection: 'users',
      data: {
        email: 'pratyush.sharma@nextyn.com',
        password: 'TranscriptIQ2026!',
        name: 'Pratyush Sharma',
        role: 'admin',
      },
    })
    console.log('  → Admin user created. Login with TranscriptIQ2026! and change password from /admin.')
  } else {
    // bump first user to admin if not already
    const u = existingUsers.docs[0] as { id: string | number; role?: string; email?: string }
    if (u.role !== 'admin') {
      await payload.update({ collection: 'users', id: u.id, data: { role: 'admin' } })
      console.log(`  → ${u.email} promoted to admin.`)
    }
  }

  // ── Seed 13 sectors as Industries ──
  const SECTORS = [
    'Technology / SaaS',
    'Healthcare / Pharma',
    'Financial Services',
    'Energy / Utilities',
    'Consumer',
    'Industrials / Manufacturing',
    'Telecommunications',
    'Chemicals',
    'Metals & Mining',
    'Professional Services',
    'Space Economy',
    'Transportation / Logistics',
    'Real Estate / Infrastructure',
  ]
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  for (const name of SECTORS) {
    const slug = slugify(name)
    const existing = await payload.find({ collection: 'industries', where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'industries', data: { name, slug } })
    }
  }
  console.log(`✓ ${SECTORS.length} sectors ensured in Industries collection.`)

  // ── Seed Home page with 10 sections matching live site ──
  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  const homeLayout = [
    // 1. Hero
    {
      blockType: 'hero',
      variant: 'mockup',
      eyebrow: 'On Demand · No Subscription',
      eyebrowStyle: 'pulse',
      heading: 'Primary research.\nWithout the\nplatform tax.',
      subheading:
        'Verbatim expert call transcripts from C-suite executives, VPs, and directors across 13 sectors — from $349. Comprehensive earnings analyses covering the companies your portfolio follows, from $99. Portable PDF, instant delivery, no subscription required.',
      ctas: [
        { label: 'Browse Transcripts', url: '/expert-transcripts', variant: 'primary' },
        { label: 'Get a Free Transcript', url: '/free-transcript', variant: 'secondary' },
      ],
      visual: {
        mockupType: 'callRecording',
      },
      stats: [
        { label: 'Sectors covered', value: '13' },
        { label: 'Geographies', value: 'NA · EU · APAC' },
        { label: 'Expert levels', value: 'C-suite · VP · Director' },
        { label: 'Compliance', value: 'MNPI · PII · Anonymised' },
        { label: 'Turnaround', value: '36 hours' },
      ],
      background: 'glow',
      spacing: 'spacious',
    },
    // 1b. Stats Bar — 5 trust signals (between hero and how-it-works)
    {
      blockType: 'trustNumbers',
      stats: [
        { value: '13', label: 'Sectors covered', sublabel: 'Across all major verticals' },
        { value: 'NA · **EU** · APAC', label: 'Geographies', sublabel: 'Global expert coverage' },
        { value: 'C-suite+', label: 'Expert levels', sublabel: 'VP · Director · Former operator' },
        { value: '**MNPI** · PII', label: 'Compliance', sublabel: 'Screened · Redacted · Anonymised' },
        { value: '36hr', label: 'Turnaround', sublabel: 'Custom transcript delivery' },
      ],
      animateOnScroll: true,
      background: 'clean',
      spacing: 'compact',
    },
    // 2. How It Works
    {
      blockType: 'processSteps',
      variant: 'horizontal',
      eyebrow: 'How it works',
      heading: 'Three steps. **No sales calls.**',
      description:
        'Search the library, buy what you need, read the verbatim transcript. No subscription, no platform fee, no annual commitment.',
      numbering: 'iconAndNumber',
      steps: [
        {
          title: 'Browse the library',
          description: 'Filter by sector, ticker, geography, or expert role. Every transcript has a preview of the key exchange.',
          icon: 'search',
          visualRows: [
            { label: 'APAC · Technology / SaaS', tag: '$NVDA', tone: 'accent' },
            { label: 'NA · Industrials · EXP-198', tag: '$CAT', tone: 'accent' },
            { label: 'EU · Financials · C-suite', tag: '$HSBC', tone: 'accent' },
          ],
        },
        {
          title: 'Purchase individually',
          description: 'Pay per transcript from $349. No subscription, no platform fee. Delivered to your inbox in under 60 seconds.',
          icon: 'credit-card',
          visualRows: [
            { label: 'Base price', tag: '$599', tone: 'muted' },
            { label: 'Price today', tag: '$449', tone: 'accent' },
            { label: 'Instant delivery', tag: '✓', tone: 'accent' },
          ],
        },
        {
          title: 'Read the verbatim',
          description: 'Get the full Q&A, executive summary, key themes, and tagged companies — citation-ready and MNPI-screened.',
          icon: 'file-text',
          visualRows: [
            { label: 'Executive summary · Key themes', tone: 'neutral' },
            { label: 'Full verbatim Q&A · 47 mins', tone: 'neutral' },
            { label: 'Tagged companies · Sectors', tone: 'neutral' },
          ],
        },
      ],
      background: 'clean',
      spacing: 'default',
    },
    // 3. Latest Transcripts (auto-fetched featured)
    {
      blockType: 'featuredProducts',
      eyebrow: 'This week',
      heading: 'Latest Transcripts',
      description: 'New expert call transcripts published in the last week.',
      productSource: 'expert-transcripts',
      mode: 'auto',
      autoFilters: { onlyFeatured: false, sortBy: 'newest' },
      limit: 3,
      layout: 'grid-3',
      cardHover: 'moving-border',
      showAllCta: { enabled: true, label: 'View All Transcripts', url: '/expert-transcripts' },
      background: 'clean',
      spacing: 'default',
    },
    // 4. Earnings Analysis section
    {
      blockType: 'featuredProducts',
      eyebrow: 'Earnings analysis',
      heading: 'Earnings calls, **dissected.**',
      description:
        'Comprehensive earnings analysis — buy-side ready, $99 flat, instant PDF. Same-day delivery on the day of the call.',
      productSource: 'earnings-analyses',
      mode: 'auto',
      autoFilters: { onlyFeatured: true, sortBy: 'newest' },
      limit: 2,
      layout: 'grid-2',
      cardHover: 'moving-border',
      showAllCta: { enabled: true, label: 'Browse All Analyses', url: '/earnings-analysis' },
      background: 'mesh',
      spacing: 'default',
    },
    // 5. Who This Is For — bento with featured PE persona + transcript snippet
    {
      blockType: 'personaGrid',
      eyebrow: 'Built for',
      heading: 'Primary research for every **decision-maker.**',
      description:
        'Anonymized expert call transcripts serve every stakeholder group whose decisions move money.',
      layout: 'standard',
      columns: '4',
      cardHover: 'lift',
      cards: [
        {
          icon: 'diamond',
          title: 'Private Equity',
          description:
            'Validate deal theses, screen targets, build conviction from operator perspectives — before requesting a CIM.',
          bullets: [
            { item: 'Operator-level intel pre-management meeting' },
            { item: 'Validate revenue assumptions with primary sources' },
            { item: 'Spot management and operational red flags early' },
          ],
        },
        {
          icon: 'diamondOpen',
          title: 'Hedge Funds',
          description:
            'Move faster than the street. Surface insights unavailable in earnings calls or sell-side notes.',
          bullets: [
            { item: 'Trends 3-6 weeks ahead of consensus' },
            { item: 'Channel checks across NA, EU, APAC' },
            { item: 'Same-day delivery on custom requests' },
          ],
        },
        {
          icon: 'grid',
          title: 'Consulting Firms',
          description:
            'Anchor commercial due diligence and strategy deliverables in primary operator perspective.',
          bullets: [
            { item: 'Citation-ready, MNPI-screened verbatims' },
            { item: 'Tagged by sector, company, work-stream' },
            { item: 'Client-safe — no platform credentials needed' },
          ],
        },
        {
          icon: 'triangle',
          title: 'Corporate Strategy',
          description:
            'Benchmark competitors, evaluate vendors, validate market sizing — without alerting anyone.',
          bullets: [
            { item: 'Quietly assess acquisition targets' },
            { item: 'Customer sentiment + operational risk' },
            { item: 'No direct contact, no RFI signal' },
          ],
        },
      ],
      background: 'clean',
      spacing: 'default',
    },
    // 5b. Trust strip marquee — 8 signals
    {
      blockType: 'marqueeText',
      variant: 'text',
      speedSeconds: 32,
      items: [
        { label: '✓ 2,400+ transcripts published' },
        { label: '✓ 50,000+ expert network' },
        { label: '✓ MNPI screened · PII redacted' },
        { label: '✓ 36hr custom delivery' },
        { label: '✓ 13 sectors covered' },
        { label: '✓ NA · EU · APAC coverage' },
        { label: '✓ 100+ buyers last 30 days' },
        { label: '✓ No subscription required' },
      ],
    },
    // 6. Resources V2 — featured + aside + 3-card row
    {
      blockType: 'latestArticles',
      eyebrow: 'Resources',
      heading: 'Insights, frameworks, **and deep-dives**',
      limit: 4,
      layout: 'featured-with-aside',
      cardHover: 'none',
      showAllCta: { enabled: true, label: 'Browse all resources', url: '/resources' },
      aside: {
        asideLabel: 'From the article',
        pullQuote: "The edge isn't in having the data. It's in being two calls ahead of the model.",
        pullQuoteAttr: '— FORMER VP, ASIA-PACIFIC EQUITY RESEARCH',
        stats: [
          { value: '3-5×', label: 'Faster thesis validation vs sell-side' },
          { value: '83%', label: 'Of signals validated by operator testimony' },
        ],
      },
      background: 'clean',
      spacing: 'default',
    },
    // 7. Free Guidebook — Competitive advantage section, left text+CTA, right stacked persona cards
    {
      blockType: 'personaGrid',
      eyebrow: 'Free guidebook',
      heading: 'Learn how your competitors **use our transcripts.**',
      description:
        "The firms outperforming you in due diligence, deal sourcing, and market intelligence aren't working harder. They're reading expert transcripts before making every major decision.",
      layout: 'guidebook',
      guidebookCta: { label: 'Download Free Guidebook', url: '/free-transcript' },
      cards: [
        {
          title: 'PE Firms — Screen 30+ targets in a week',
          description:
            'Fund associates pull sector-specific transcripts to validate revenue assumptions, benchmark margins, and identify red flags before requesting a CIM.',
        },
        {
          title: 'Hedge Funds — Build conviction before consensus',
          description:
            'Research analysts read expert transcripts to identify emerging trends 3-6 weeks before they appear in earnings calls or sell-side notes.',
        },
        {
          title: 'Strategy Consultants — Ground every recommendation in primary evidence',
          description:
            "Engagement managers use transcripts to anchor client deliverables with firsthand operator perspectives. It's the difference between 'our analysis suggests' and 'according to a former VP of Operations at the market leader'.",
        },
        {
          title: 'Corporate M&A Teams — Validate targets without tipping off the market',
          description:
            'Corporate development teams use transcripts to quietly assess competitive positioning, customer sentiment, and operational risks of acquisition targets — without initiating direct contact or alerting competitors.',
        },
      ],
      background: 'clean',
      spacing: 'default',
    },
    // 8. Custom Research band
    {
      blockType: 'featureSpotlight',
      eyebrow: 'Custom research',
      heading: 'Commission a transcript built for **your exact question.**',
      description:
        "When the library doesn't cover your specific angle, we build it for you. Sourced, conducted, and delivered by our research team. One flat fee. No subscription.",
      spotlight: {
        title: 'Custom Transcript — $599 per transcript',
        description:
          '1 expert call · custom discussion guide · MNPI-screened · 36-hour turnaround available · expert and guide approval before the call · follow-up calls from $300/hour. Volume pricing from $499 per transcript for 5+ commissions.',
        ctas: [
          { label: 'Commission a Custom Transcript', url: '/custom-reports', variant: 'primary' },
          { label: 'Talk to our research team', url: '/contact', variant: 'secondary' },
        ],
      },
      supporting: [
        { icon: 'edit', title: 'You define the brief', description: 'Tell us industry, topic, expert profile, key questions.' },
        { icon: 'users', title: 'We source and vet', description: 'MNPI screening, cooling-off verification, conflict checks.' },
        { icon: 'phone', title: 'We conduct and deliver', description: 'Edited, tagged, formatted transcript in 5–10 days.' },
      ],
      cardHover: 'lift',
      background: 'flood',
      spacing: 'default',
    },
    // 9. Free Transcript Offer
    {
      blockType: 'ctaSplit',
      eyebrow: 'On us',
      heading: 'One free expert transcript. **Every month.**',
      body: "Sign up, choose your sector, and we'll send you a complimentary MNPI-screened transcript. Plus our weekly sector digest with every new addition.",
      ctas: [
        { label: 'Claim Your Free Transcript', url: '/free-transcript', variant: 'primary' },
      ],
      rightSide: 'newsletter',
      formProof: '2,400+ analysts have claimed theirs',
      background: 'mesh',
      spacing: 'default',
    },
    // 10. FAQ
    {
      blockType: 'faq',
      variant: 'hairline',
      eyebrow: 'FAQ',
      heading: 'Frequently asked questions',
      description:
        'The most common questions from analysts, portfolio managers, and consultants who use Transcript IQ as part of their research workflow.',
      defaultOpen: 'first',
      items: [
        {
          question: 'What exactly is an expert call transcript?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'A verbatim record of a one-on-one conversation between an analyst and a subject matter expert — typically a former C-suite, VP, or director. Each document includes an executive summary, key themes, tagged companies, and the full Q&A.',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          question: 'How is this different from subscribing to an expert network?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Library subscriptions sell access; we sell output. No platform fees, no hour minimums, no scheduling logistics. Buy exactly the transcript you need, instant PDF delivery, no commitment.',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          question: 'Are transcripts MNPI-screened and safe to use in investment research?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Every transcript goes through a compliance review before listing. We screen for MNPI, forward-looking statements, and insider language. Expert identities are anonymized. We recommend customers also apply their own firm’s compliance protocols.',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          question: 'Who are the experts and how are they verified?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Experts come from Nextyn Advisory’s network — used by PE firms, hedge funds, and consulting firms across Asia, Europe, and the US. Each expert is verified against their stated professional history before the call. They appear in transcripts under anonymized designations like "Former VP at Tier-1 Semiconductor Firm".',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          question: 'What do I receive when I purchase a transcript?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Immediate downloadable PDF after payment. Contents: executive summary, key themes and findings, full verbatim Q&A, tagged companies and tickers, sector and geography metadata, compliance certification. No subscription or portal login required — it goes to your inbox.',
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      background: 'clean',
      spacing: 'default',
    },
    // Final CTA — animated beams + compliance note
    {
      blockType: 'cta',
      eyebrow: 'Get started today',
      heading: 'Your next insight **is already written.**',
      subheading:
        '2,400+ expert call transcripts on demand. No subscription. No sales call. Buy what you need, when you need it.',
      ctas: [
        { label: 'Browse the library', url: '/expert-transcripts', variant: 'primary' },
        { label: 'Get a free transcript', url: '/free-transcript', variant: 'secondary' },
      ],
      alignment: 'center',
      visualBg: 'beams',
      complianceNote: 'MNPI SCREENED · PII REDACTED · ANONYMISED · 36HR DELIVERY',
      spacing: 'default',
    },
  ]

  if (existingHome.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout: homeLayout,
        _status: 'published',
      } as never,
    })
    console.log('✓ Home page created with 11 sections.')
  } else {
    await payload.update({
      collection: 'pages',
      id: existingHome.docs[0].id as never,
      data: {
        layout: homeLayout,
        _status: 'published',
      } as never,
    })
    console.log('✓ Home page updated with 11 sections.')
  }

  console.log('\nAll done. Visit / to see the rendered home, or /admin/collections/pages to edit.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
