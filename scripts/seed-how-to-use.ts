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
    where: { slug: { equals: 'how-to-use' } },
    limit: 1,
  })

  const layout = [
    // ── 1. Hero ──────────────────────────────────────────────────────────────
    {
      blockType: 'howToUseHero',
      eyebrow: 'Research Workflow Guide',
      heading: 'How to use an expert call **transcript**',
      subheading:
        'From PDF download to investment memo. A practical guide for analysts, portfolio managers, and consultants who want to extract maximum value from every transcript they purchase.',
      stats: [
        { value: '4', label: 'Sections per\ntranscript document' },
        { value: '12–15', label: 'Extractable data\npoints per call' },
        { value: '100%', label: 'MNPI-screened\nbefore delivery' },
        { value: '60–90', suffix: 'min', label: 'From PDF to\ndeliverable' },
      ],
      background: 'clean',
      spacing: 'spacious',
    },

    // ── 2. Transcript Anatomy ─────────────────────────────────────────────────
    {
      blockType: 'transcriptAnatomy',
      eyebrow: 'Transcript Anatomy',
      heading: "What's inside **every transcript**",
      description:
        'Every document follows a standardised four-part structure designed for institutional research workflows.',
      sections: [
        {
          sectionNumber: 'Section 01',
          sectionKey: 'exec',
          title: 'Executive Summary',
          description:
            "A 150–300 word structured overview written by our research team. Designed for quick scanning before you commit to the full deep-dive. Covers the expert's core thesis, key data points, and contrarian insights.",
        },
        {
          sectionNumber: 'Section 02',
          sectionKey: 'verbatim',
          title: 'Full Verbatim Transcript',
          description:
            'The complete Q&A dialogue between our moderator and the expert — typically 45–60 minutes. Verbatim transcription with AI-assisted accuracy checks, speaker labels, and topic markers for navigation.',
        },
        {
          sectionNumber: 'Section 03',
          sectionKey: 'profile',
          title: 'Expert Profile & Context',
          description:
            "Anonymised background on the expert — seniority level, industry tenure, functional area, and why their perspective is relevant. You'll know exactly who you're hearing from without compromising identity.",
        },
        {
          sectionNumber: 'Section 04',
          sectionKey: 'compliance',
          title: 'Compliance & Methodology',
          description:
            'Full transparency on how the call was conducted, screened, and processed. Includes our MNPI screening certificate, PII redaction confirmation, and methodology disclosure for your compliance records.',
        },
      ],
      background: 'clean',
      spacing: 'default',
    },

    // ── 3. Research Applications ──────────────────────────────────────────────
    {
      blockType: 'researchApplications',
      eyebrow: 'Research Applications',
      heading: "Five ways to use **your transcript**",
      description:
        "Transcripts aren't just reading material — they're research tools. Here are the highest-value applications across our institutional client base.",
      applications: [
        {
          number: '01 — Investment Research',
          title: 'Investment thesis validation',
          description:
            "Test your assumptions against an insider's perspective before committing capital. Cross-reference the expert's views on unit economics, competitive positioning, and market dynamics against your financial model. The highest-value insight in any transcript is the one that challenges your base case.",
          tag: 'Investment Research',
          featured: true,
          insights: [
            { label: 'Unit economics view', percentage: 91 },
            { label: 'Competitive moat signals', percentage: 84 },
            { label: 'Variant perception data', percentage: 76 },
          ],
        },
        {
          number: '02 — Competitive Intel',
          title: 'Competitive intelligence mapping',
          description:
            "Experts who've operated inside an industry reveal competitive dynamics that never appear in 10-Ks or sell-side research. Map pricing strategies, distribution advantages, and customer switching costs from someone who's lived them.",
          tag: '↗ Pricing · Switching costs · Distribution',
          featured: false,
        },
        {
          number: '03 — Due Diligence',
          title: 'Due diligence acceleration',
          description:
            'Supplement your DD process with primary data points on operations, management culture, and market position. Transcripts compress weeks of expert network scheduling into an immediate download.',
          tag: '↗ Weeks → hours',
          featured: false,
        },
        {
          number: '04 — Forecasting',
          title: 'Market sizing & forecasting',
          description:
            "Extract TAM/SAM estimates, adoption curves, pricing benchmarks, and growth trajectories that aren't available in published research. Bottom-up data points grounded in operational reality — not top-down estimates.",
          tag: '↗ TAM · Pricing · Growth',
          featured: false,
        },
        {
          number: '05 — Triangulation',
          title: 'Cross-transcript expert benchmarking',
          description:
            'Compare perspectives across multiple transcripts on the same topic. Where three experts agree, you have consensus. Where they diverge, you have an information edge.',
          tag: '↗ Consensus vs. edge',
          featured: false,
        },
      ],
      background: 'clean',
      spacing: 'default',
    },

    // ── 4. Workflow Steps ─────────────────────────────────────────────────────
    {
      blockType: 'workflowSteps',
      eyebrow: 'From PDF to Deliverable',
      heading: 'Your workflow: **download to deliverable**',
      description:
        'A practical five-step process for turning a raw transcript into actionable research output. Most analysts complete this in 60–90 minutes.',
      steps: [
        {
          stepNumber: 'Step 01',
          title: 'Download',
          subtitle: 'Instant PDF delivery',
          panelHeading: 'Instant PDF delivery',
          panelBody:
            "Every transcript is delivered as a PDF document immediately after purchase. Unlike platforms that lock transcripts behind proprietary readers, Transcript IQ gives you a portable PDF you own outright — no login required after purchase, no platform dependency.",
          tipsLabel: 'What you receive',
          tips: [
            { tip: 'Executive summary with structured overview and key data points' },
            { tip: 'Full verbatim Q&A with speaker labels and topic markers' },
            { tip: 'Expert profile with anonymised background context' },
            { tip: 'MNPI compliance certificate with screening methodology' },
          ],
        },
        {
          stepNumber: 'Step 02',
          title: 'Scan',
          subtitle: 'Read exec summary first',
          panelHeading: 'How to scan effectively',
          panelBody:
            "Start with the executive summary to decide if the full transcript is relevant. Look at companies mentioned, expert level, and key takeaways. If 2+ bullet points align with your thesis, proceed to the full Q&A. This scan should take under 5 minutes.",
          tipsLabel: 'Scanning checklist',
          tips: [
            { tip: 'Check companies tagged — do they match your thesis targets?' },
            { tip: 'Read expert seniority level — is the perspective strategic or operational?' },
            { tip: 'Scan key takeaways — does 2+ align with your current questions?' },
            { tip: 'Check call length and tier — longer Elite calls have more depth' },
          ],
        },
        {
          stepNumber: 'Step 03',
          title: 'Deep-dive',
          subtitle: 'Navigate relevant Q&A',
          panelHeading: 'Navigating the deep-dive',
          panelBody:
            "Don't read linearly. Use topic section headers to jump to relevant areas. Mark passages where the expert provides specific numbers, timelines, or competitive comparisons — these are your highest-value extraction points. Focus on the moments of friction in the Q&A.",
          tipsLabel: 'High-value signals to mark',
          tips: [
            { tip: 'Specific numbers: percentages, timelines, cost structures' },
            { tip: 'Competitive comparisons: "compared to X, they…"' },
            { tip: 'Forecasts with ranges: "we expected X but seeing Y"' },
            { tip: 'Pushback moments: where expert disagrees with the premise' },
          ],
        },
        {
          stepNumber: 'Step 04',
          title: 'Extract',
          subtitle: 'Pull key data points',
          panelHeading: 'Pulling key data points',
          panelBody:
            "Extract quantitative data points first — numbers, percentages, timelines, cost figures. Then extract qualitative signals — management quality observations, competitive dynamics, structural changes. Tag each extracted point with its relevance to your thesis or model.",
          tipsLabel: 'Extraction categories',
          tips: [
            { tip: 'Model inputs: TAM, unit economics, pricing, margins, growth rates' },
            { tip: 'Conviction signals: confirms or challenges your base case' },
            { tip: 'Follow-up questions: gaps to address in custom transcript' },
            { tip: 'Quotable evidence: anonymised passages for IC memos' },
          ],
        },
        {
          stepNumber: 'Step 05',
          title: 'Deliver',
          subtitle: 'Build your memo or deck',
          panelHeading: 'Building the deliverable',
          panelBody:
            'For IC memos: lead with the 3 strongest data points and cite the transcript. For financial models: slot specific numbers directly into your assumptions tab. For client decks: use anonymised quotes as evidence anchors. Citation format: "Expert call, [Sector], via Transcript-IQ, [Date]"',
          tipsLabel: 'By deliverable type',
          tips: [
            { tip: 'IC memo: 3 strongest data points + transcript citation' },
            { tip: 'Financial model: quantitative inputs into assumptions tab' },
            { tip: 'Client deck: anonymised quotes as evidence anchors' },
            { tip: 'CDD report: primary research section with compliance note' },
          ],
        },
      ],
      background: 'clean',
      spacing: 'default',
    },

    // ── 5. By Role ────────────────────────────────────────────────────────────
    {
      blockType: 'roleCards',
      eyebrow: 'Built for Your Workflow',
      heading: 'Tailored **by role**',
      description:
        "Different buyers extract different value. Here's how each role typically uses Transcript IQ in their research workflow.",
      cards: [
        {
          persona: 'PE / Growth Equity Analyst',
          title: 'Build conviction before the first management meeting.',
          workflow: [
            { step: 'Deal screening' },
            { step: 'IC memo' },
            { step: 'Portfolio monitoring' },
          ],
          description:
            "Use transcripts to build conviction on target companies before the first management meeting. Focus on unit economics, customer retention dynamics, competitive moats, and management quality signals that don't appear in CIMs.",
        },
        {
          persona: 'Hedge Fund Portfolio Manager',
          title: 'Extract edge data points before consensus moves.',
          workflow: [
            { step: 'Idea generation' },
            { step: 'Earnings preview' },
            { step: 'Position sizing' },
          ],
          description:
            'Extract edge data points for earnings models and identify variant perception — where your view differs from consensus. Use transcripts to calibrate conviction on timing, magnitude, and catalysts that sell-side research misses.',
        },
        {
          persona: 'Management Consultant',
          title: 'Add primary research depth without scheduling expert calls.',
          workflow: [
            { step: 'Hypothesis validation' },
            { step: 'Benchmarking' },
            { step: 'Client delivery' },
          ],
          description:
            'Add primary research depth to client engagements without scheduling your own expert calls. Use transcripts to validate strategic hypotheses, source industry benchmarks, and bring operational specificity to recommendations.',
        },
        {
          persona: 'Corporate Strategy Team',
          title: 'Benchmark against competitors with insider perspective.',
          workflow: [
            { step: 'Competitive analysis' },
            { step: 'M&A screening' },
            { step: 'Board prep' },
          ],
          description:
            'Benchmark your company against competitors using insider perspective. Inform M&A screening with expert views on adjacencies, technology shifts, and regulatory dynamics that shape strategic options.',
        },
      ],
      background: 'clean',
      spacing: 'default',
    },

    // ── 6. Compliance Strip ───────────────────────────────────────────────────
    {
      blockType: 'complianceStrip',
      eyebrow: 'Institutional-Grade Compliance',
      heading: 'Compliance & **handling guidelines**',
      description:
        "Every transcript is built for institutional compliance standards. Here's how to handle, store, and cite responsibly.",
      pillars: [
        {
          title: 'MNPI-screened',
          description:
            'Every transcript undergoes structured screening for material non-public information. The screening certificate is included in your PDF with date and methodology.',
        },
        {
          title: 'PII-redacted',
          description:
            'All personally identifiable information is removed. Expert identities are anonymised to role and company type. Names, emails, and phone numbers are redacted.',
        },
        {
          title: 'Internal distribution',
          description:
            'Share freely within your organisation — with colleagues, investment committees, and deal teams. External redistribution requires prior written consent from Transcript IQ.',
        },
        {
          title: 'Citation guidance',
          description:
            'Use the standard citation format in all IC memos and presentations. Do not attribute quotes to named individuals. This format satisfies audit trail requirements.',
        },
      ],
      citationLabel: 'Standard citation format',
      citationFormat: 'Expert call, [Sector], via Transcript-IQ, [Date]',
      citationNote: 'For IC memos & investment presentations',
      background: 'clean',
      spacing: 'default',
    },

    // ── 7. FAQ ────────────────────────────────────────────────────────────────
    {
      blockType: 'faq',
      eyebrow: 'FAQ',
      heading: '**Common questions**',
      description:
        'Everything you need to know about purchasing, accessing, and operationalising transcripts in your research workflow.',
      defaultOpen: 'first',
      items: [
        {
          question: 'What format are transcripts delivered in?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Every transcript is delivered as a PDF document immediately after purchase. The PDF includes the executive summary, full verbatim Q&A with timestamps and topic markers, expert profile, and compliance metadata. Transcript IQ gives you a portable PDF you own outright — no login required after purchase, no platform dependency.',
                    },
                  ],
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
          question: 'How long is a typical transcript?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Most transcripts are based on 45 to 60 minute expert calls, producing 15 to 25 pages of verbatim dialogue. Standard-tier transcripts run 40 to 50 minutes, while Elite-tier C-suite transcripts often run 55 to 65 minutes.',
                    },
                  ],
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
          question: 'Can I share transcripts with my team?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Yes. Transcripts are licensed for internal distribution within your organisation. Share freely with colleagues, investment committees, and deal teams. External redistribution requires prior written consent.',
                    },
                  ],
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
          question: 'How do I know the transcript is MNPI-compliant?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: "Every transcript includes a compliance certificate documenting the MNPI screening date and methodology. The screening process aligns with SEC and FCA guidance on expert network usage. Your compliance team will find the certificate sufficient for internal approval workflows.",
                    },
                  ],
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
          question: 'Who are the experts and how are they vetted?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: "Experts are sourced through Nextyn Advisory's proprietary network of 50,000+ professionals across 40+ sectors globally. Each expert undergoes identity verification, employment confirmation, and a compliance pre-screen before the call. No NDA conflicts, no active employment that would create MNPI risk.",
                    },
                  ],
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
          question: 'What is the difference between Standard, Premium, and Elite tiers?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'The tiers reflect expert seniority and content depth. Standard ($349): Director-level experts. Premium ($449): VP-level experts with broader strategic perspective. Elite ($599): C-suite executives with the deepest insider perspective. All tiers receive the same MNPI compliance standards.',
                    },
                  ],
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
          question: 'Can I request a transcript on a specific company or topic?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Yes. Beyond the Transcript IQ library, Nextyn offers custom expert call commissioning from $599. You define the company, sector, expert profile, and research questions. Nextyn sources the expert, conducts the call, transcribes it, runs compliance screening, and delivers the PDF within 5 to 7 business days.',
                    },
                  ],
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
          question: 'How does per-transcript pricing compare to annual subscriptions?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: "Transcript IQ operates on a per-transcript model from $349 with no platform fee. Annual subscription services typically run $15,000 to $50,000 per user per year. If your team needs fewer than 20 to 30 transcripts per year, per-transcript purchasing is almost always more cost-effective. For high-volume teams we offer volume pricing and enterprise arrangements.",
                    },
                  ],
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
          question: 'Can I use transcripts in internal AI research tools?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Transcripts are licensed for internal research use, which includes feeding into internal AI-assisted analysis tools, RAG pipelines, and research management systems within your organisation. Commercial redistribution or resale of transcript content requires a separate licensing agreement. Contact research@transcript-iq.com to discuss enterprise data licensing.',
                    },
                  ],
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
          question: 'How should I cite transcripts in IC presentations?',
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Use the format: "Expert call, [Sector], via Transcript-IQ, [Date]" for internal memos and IC presentations. This provides sufficient attribution for audit trails while maintaining expert anonymity.',
                    },
                  ],
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
      spacing: 'default',
    },

    // ── 8. Final CTA ──────────────────────────────────────────────────────────
    {
      blockType: 'cta',
      eyebrow: 'Ready to put this into practice?',
      heading: 'Your next insight is already **written.**',
      subheading:
        'Browse 100+ expert transcripts on demand, or commission a bespoke call on any topic you need.',
      ctas: [
        { label: 'Browse Transcript Library →', url: '/transcripts', variant: 'primary' },
        { label: 'Commission Custom Research', url: '/custom-reports', variant: 'secondary' },
      ],
      complianceNote: 'MNPI Screened · PII Redacted · No Subscription · Instant PDF Delivery',
      visualBg: 'beams',
      alignment: 'center',
      background: 'clean',
      spacing: 'spacious',
    },
  ]

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: { title: 'How to Use Expert Call Transcripts', slug: 'how-to-use', layout: layout as never, _status: 'published' },
    })
    console.log('✓ how-to-use page updated.')
  } else {
    await payload.create({
      collection: 'pages',
      data: { title: 'How to Use Expert Call Transcripts', slug: 'how-to-use', layout: layout as never, _status: 'published' },
    })
    console.log('✓ how-to-use page created.')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
