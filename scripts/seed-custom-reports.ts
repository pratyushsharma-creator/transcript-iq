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

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'custom-reports' } },
    limit: 1,
  })

  const layout = [
    // ── 1. Hero ──────────────────────────────────────────────────────────────
    {
      blockType: 'customTranscriptHero',
      eyebrow: 'Bespoke Expert Research',
      heading: "Can't find what\\n~~you need?~~\\n**We'll build it.**",
      subtitle:
        "Commission a bespoke expert call on any topic. You define the questions — we source the expert, moderate the call, transcribe it, and deliver an MNPI-screened PDF tailored to your thesis.",
      processSteps: [
        { stepLabel: 'Step 01', title: 'Submit your brief', timing: 'Takes < 5 minutes' },
        { stepLabel: 'Step 02', title: 'Expert matched & confirmed', timing: 'Within 12 hours' },
        { stepLabel: 'Step 03', title: 'Call conducted by our team', timing: '45–60 min · custom discussion guide' },
        { stepLabel: 'Step 04', title: 'MNPI-screened transcript delivered', timing: 'Within 36 hours of call' },
      ],
      ctas: [
        { label: 'Submit Research Brief', url: '#brief-form', variant: 'primary' },
        { label: 'Browse the library instead', url: '/expert-transcripts', variant: 'secondary' },
      ],
      formCard: {
        cardTitle: 'Research Brief',
        cardBadge: 'Confidential',
        detailsLabel: 'Your details',
        briefLabel: 'Research Brief',
        submitLabel: 'Submit Research Brief',
        formNote: 'Confidential · Coordinator responds within 24 hours',
        successTitle: 'Brief received',
        successMessage:
          'A coordinator will respond within 24 hours with expert match options and feasibility confirmation.',
        formEndpoint: '',
      },
      trustStats: [
        { value: '$899', label: 'Starting\nflat fee' },
        { value: '135K+', label: 'Expert\nnetwork' },
        { value: '36hr', label: 'Max\nturnaround' },
        { value: '40+', label: 'Sectors\ncovered' },
      ],
      background: 'clean',
      spacing: 'default',
    },

    // ── 2. Trust Marquee ─────────────────────────────────────────────────────
    {
      blockType: 'marqueeText',
      variant: 'text',
      items: [
        { label: '✓ 135,000+ expert network' },
        { label: '✓ MNPI screened · PII redacted' },
        { label: '✓ 36hr turnaround from call' },
        { label: '✓ 40+ sectors globally' },
        { label: '✓ Same institutional quality as library' },
        { label: '✓ USA · EMEA · APAC coverage' },
        { label: '✓ $899 flat · one-time fee' },
        { label: '✓ C-suite · VP · Director experts' },
      ],
      speedSeconds: 24,
      background: 'clean',
      spacing: 'compact',
    },

    // ── 3. How It Works ───────────────────────────────────────────────────────
    {
      blockType: 'commissioningSteps',
      eyebrow: 'How commissioning works',
      heading: 'From brief to transcript **in four steps**',
      description:
        'No scheduling, no expert network fees, no compliance headaches. You submit the brief — we handle everything else.',
      steps: [
        {
          stepNumber: '01',
          stepLabel: 'Submit',
          iconKey: 'submit',
          title: 'Submit your brief',
          description:
            'Tell us the topic, expert profile, seniority level, geography, and key questions. Our research team reviews feasibility within 24 hours.',
          timing: 'Takes < 5 minutes',
        },
        {
          stepNumber: '02',
          stepLabel: 'Match',
          iconKey: 'match',
          title: 'Expert matched & confirmed',
          description:
            "We identify the right expert from Nextyn's network of 135,000+ professionals. You don't need to search, schedule, or negotiate.",
          timing: 'Within 12 hours',
        },
        {
          stepNumber: '03',
          stepLabel: 'Call',
          iconKey: 'call',
          title: 'Call conducted for you',
          description:
            "Moderated by experienced analysts who ensure depth, relevance, and compliance. Structured around your specific questions. You don't need to attend.",
          timing: '45–60 minute call',
        },
        {
          stepNumber: '04',
          stepLabel: 'Deliver',
          iconKey: 'deliver',
          title: 'Transcript delivered',
          description:
            'Full verbatim PDF with executive summary, expert profile, and MNPI compliance certification. Same institutional quality as our library.',
          timing: 'Within 36 hours of call',
        },
      ],
      background: 'clean',
      spacing: 'spacious',
    },

    // ── 4. What's Included ────────────────────────────────────────────────────
    {
      blockType: 'deliverablesGrid',
      eyebrow: 'Custom report deliverables',
      heading: "What's included in **every custom transcript**",
      description:
        'Every custom commission includes the same institutional-grade deliverables as our library transcripts — plus additional customisation unique to your brief.',
      columns: '3',
      items: [
        {
          iconKey: 'document',
          title: 'Full verbatim transcript',
          description:
            '45–60 minute expert call with timestamps, speaker labels, and topic markers. Verbatim transcription with AI-assisted accuracy checks.',
          badge: '⚡ PDF included',
          badgeTone: 'amber',
        },
        {
          iconKey: 'clock',
          title: 'Executive summary',
          description:
            '150–300 word structured overview highlighting key insights, data points, and actionable takeaways. Written by our research team, not AI-generated.',
          badge: '',
          badgeTone: 'amber',
        },
        {
          iconKey: 'profile',
          title: 'Expert profile & context',
          description:
            'Anonymised expert background including seniority, tenure, functional area, and relevance context for your compliance records and IC materials.',
          badge: '',
          badgeTone: 'amber',
        },
        {
          iconKey: 'compliance',
          title: 'Compliance certification',
          description:
            'MNPI screening certificate, PII redaction confirmation, and methodology disclosure. Built for institutional compliance workflows and IC memo citation.',
          badge: '✓ MNPI + PII certified',
          badgeTone: 'amber',
        },
        {
          iconKey: 'custom',
          title: 'Your questions answered',
          description:
            'Unlike library transcripts, custom calls are structured entirely around your specific research questions. The moderator ensures every key question is addressed.',
          badge: 'Custom to your brief',
          badgeTone: 'mint',
        },
        {
          iconKey: 'expedited',
          title: 'Expedited delivery option',
          description:
            'Standard turnaround is 36 hours from call completion. Need it faster? Fast-track delivery available for time-sensitive research and pre-earnings needs.',
          badge: '⚡ 36hr standard',
          badgeTone: 'amber',
        },
      ],
      background: 'clean',
      spacing: 'spacious',
    },

    // ── 5. Who Commissions ────────────────────────────────────────────────────
    {
      blockType: 'useCasesBento',
      eyebrow: 'Built for institutional research',
      heading: 'Who commissions **custom research?**',
      description:
        "Custom transcripts are typically commissioned when the library doesn't cover your specific angle, company, or market timing.",
      cases: [
        {
          persona: 'PE / VC',
          title: 'Pre-deal due diligence',
          description:
            'PE and VC teams commissioning expert calls on specific acquisition targets, portfolio companies, or market segments ahead of IC decisions. Get the operator perspective before your first management meeting — without tipping off the market.',
          colSpan: '5',
          featured: true,
        },
        {
          persona: 'Hedge Funds',
          title: 'Earnings-driven research',
          description:
            'Hedge fund analysts commissioning channel checks and competitive intelligence ahead of earnings reports for specific public companies. Extract edge data points before consensus moves.',
          colSpan: '4',
          featured: false,
        },
        {
          persona: 'Consulting',
          title: 'Client engagement support',
          description:
            'Consulting teams commissioning expert perspectives to validate hypotheses, source benchmarks, and add primary research depth to client deliverables.',
          colSpan: '3',
          featured: false,
        },
        {
          persona: 'Corporate Strategy',
          title: 'Market entry analysis',
          description:
            'Corporate strategy teams commissioning expert views on new geographies, adjacencies, or regulatory landscapes before making market entry decisions.',
          colSpan: '4',
          featured: false,
        },
        {
          persona: 'Research Analysts',
          title: 'Thesis development',
          description:
            'Research analysts building conviction on emerging themes — AI infrastructure, energy transition, digital health — where published research is thin or biased toward sell-side consensus.',
          colSpan: '4',
          featured: false,
        },
        {
          persona: 'Strategy Teams',
          title: 'Competitive benchmarking',
          description:
            'Strategy and product teams commissioning expert calls with former employees of competitors to map positioning, pricing, and go-to-market strategies.',
          colSpan: '4',
          featured: false,
        },
      ],
      background: 'clean',
      spacing: 'spacious',
    },

    // ── 6. Pricing Comparison ─────────────────────────────────────────────────
    {
      blockType: 'pricingComparison',
      eyebrow: 'Pricing',
      heading: 'Simple, **flat-fee pricing**',
      description:
        'One price. No platform fee. No subscription. No minimum volume. Compare to what you\'d pay on a traditional expert network.',
      leftPanel: {
        panelLabel: 'Custom Transcript — Starting price',
        amount: '$899',
        period: '· one-time',
        note: 'One flat fee per commissioned transcript. No platform fee, no annual commitment, no expert network membership required. Volume pricing from $699/transcript for 5+ commissions.',
        features: [
          { text: 'Full verbatim transcript (PDF)' },
          { text: 'Executive summary & compliance cert' },
          { text: '36hr turnaround from call' },
          { text: 'Internal distribution licence' },
        ],
      },
      rightPanel: {
        panelLabel: 'vs. Traditional expert networks',
        amount: '$15K+',
        period: '· per user / year',
        amountColor: 'warning',
        note: 'GLG, AlphaSights, Tegus, and Third Bridge require annual subscriptions before you can access a single transcript. Plus $400–$1,500 per expert call hour on top.',
        features: [
          { text: 'Annual subscription $15K–$50K per user' },
          { text: '$400–$1,500 per expert call hour' },
          { text: 'You manage scheduling and compliance' },
          { text: 'Platform lock-in, proprietary reader' },
        ],
      },
      ctaPanel: {
        overline: 'Ready to commission?',
        heading: 'Submit your brief in under 5 minutes',
        body: 'A coordinator responds within 24 hours with feasibility confirmation and expert match options.',
        primaryLabel: 'Submit Research Brief',
        primaryUrl: '#brief-form',
        browseLinkLabel: 'browse the library for immediate PDF access',
        browseLinkUrl: '/expert-transcripts',
      },
      background: 'clean',
      spacing: 'spacious',
    },

    // ── 7. FAQ ────────────────────────────────────────────────────────────────
    {
      blockType: 'faq',
      eyebrow: 'FAQ',
      heading: 'Common questions',
      description:
        'Everything you need to know about commissioning a custom transcript through Transcript IQ.',
      defaultOpen: 'first',
      contactLabel: 'Still have questions?',
      contactEmail: 'research@transcript-iq.com',
      items: [
        {
          question: 'How quickly can you source the right expert?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: 'We confirm feasibility and expert match options within 24 hours of receiving your brief. For most topics, we can identify 2–3 qualified candidates from Nextyn\'s network of 135,000+ professionals. For highly specific or niche briefs, the process may take an additional 12–24 hours. You\'ll receive expert profiles for approval before we proceed to scheduling.' },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: "Do I need to attend the expert call?",
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: 'No — you never need to attend. Our experienced analysts moderate the entire call using a custom discussion guide built from your brief. They ensure every key question is addressed and probe for the data points most relevant to your thesis. You receive the full verbatim transcript after, not a summary of what you missed.' },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: 'How is the $899 price structured — are there additional fees?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: '$899 is the all-in starting price for a standard custom transcript. There are no platform fees, no expert network membership fees, no subscription, and no per-hour charges on top. The price includes: expert sourcing, call moderation, verbatim transcription, MNPI screening, PII redaction, executive summary, and compliance certification. Complex briefs requiring C-suite experts or very specific geographies may be priced higher — we\'ll confirm before you commit. Volume pricing from $699/transcript is available for commissions of 5 or more.' },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: 'How is MNPI compliance handled on a custom call?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: 'Every expert undergoes a pre-call compliance pre-screen. Our moderators are trained to redirect away from MNPI-risk territory during the call itself. After transcription, the document undergoes structured MNPI screening before delivery. You receive a compliance certificate documenting the screening date and methodology — the same standard as our library transcripts, aligned with SEC and FCA expert network guidelines.' },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: "Can I see the expert's profile before the call?",
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: "Yes — always. We present anonymised expert profiles (seniority, sector, relevant tenure, functional area) for your approval before scheduling. You can request a different profile if the match isn't right. We don't proceed to scheduling without your confirmation." },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: "What if the expert doesn't address my key questions?",
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: "Our moderators use a custom discussion guide built from your brief and are specifically tasked with ensuring every key question is answered. In the rare case an expert is unable to address a specific question (e.g. due to NDA or active employment constraints), we flag this in the transcript and, where possible, schedule a follow-up with a different expert at no additional charge." },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
        {
          question: 'Can I commission multiple transcripts on the same topic?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: 'Yes. Multi-transcript commissions on the same thesis are common — typically used to triangulate across 2–3 experts from different vantage points (e.g. supply side vs. demand side, or different geographies). Volume pricing from $699/transcript is available for 5 or more custom commissions. Mention this in your brief and we\'ll include pricing options in our response.' },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
      ],
      background: 'clean',
      spacing: 'spacious',
    },

    // ── 8. Final CTA ──────────────────────────────────────────────────────────
    {
      blockType: 'cta',
      eyebrow: 'Ready to commission',
      heading: "Can't find what you need? **We'll build it.**",
      subheading:
        'Submit your brief in under 5 minutes. A coordinator responds within 24 hours with expert match options and feasibility confirmation.',
      ctas: [
        { label: 'Submit Research Brief', url: '#brief-form', variant: 'primary' },
        { label: 'Browse library instead', url: '/expert-transcripts', variant: 'secondary' },
      ],
      complianceNote: '$899 flat · No subscription · MNPI screened · 36hr turnaround',
      background: 'glow',
      spacing: 'spacious',
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageData: any = {
    title: 'Commission a Custom Transcript',
    slug: 'custom-reports',
    layout,
    _status: 'published',
  }

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: pageData,
    })
    console.log('✓ Updated existing custom-reports page')
  } else {
    await payload.create({
      collection: 'pages',
      data: pageData,
    })
    console.log('✓ Created custom-reports page')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
