/**
 * seed-free-transcript.ts
 * Seeds the Pages collection with the /free-transcript page.
 *
 * Usage: npx tsx scripts/seed-free-transcript.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const pageData: any = {
  title: 'Get Your Free Expert Call Transcript',
  slug: 'free-transcript',
  _status: 'published' as const,
  layout: [
    // ── 1. Hero ─────────────────────────────────────────────────────────
    {
      blockType: 'freeTranscriptHero',
      eyebrow: 'Free · No Credit Card',
      heading: 'Your first\\n~~expert call~~\\n**transcript. Free.**',
      subtitle:
        'Get one MNPI-screened expert call transcript delivered to your inbox — matched to your sector. No subscription, no billing details. Just the research.',
      checklist: [
        { item: 'Full verbatim transcript PDF, not a summary' },
        { item: 'Executive summary written by our research team' },
        { item: 'MNPI-screened · PII-redacted · Compliance certified' },
        { item: 'Matched to your chosen sector — not a random pick' },
        { item: 'Delivered within 24 hours of signup' },
      ],
      socialProof: '400+ analysts claimed their free transcript this month',
      sectors: [
        { label: 'Technology / SaaS', value: 'tech' },
        { label: 'Healthcare', value: 'health' },
        { label: 'Financial Services', value: 'fin' },
        { label: 'Industrials', value: 'ind' },
        { label: 'Consumer', value: 'cons' },
        { label: 'Energy', value: 'energy' },
      ],
      ctaLabel: 'Get My Free Transcript',
      complianceItems: [
        { label: 'MNPI Screened' },
        { label: 'PII Redacted' },
        { label: 'PDF Yours Forever' },
      ],
    },

    // ── 2. How It Works ──────────────────────────────────────────────────
    {
      blockType: 'processSteps',
      variant: 'horizontal',
      eyebrow: 'How it works',
      heading: 'Three steps to your free transcript',
      numbering: 'mono',
      steps: [
        {
          title: 'Pick your sector',
          description:
            "Tell us which sector you research. We'll match a relevant transcript from our library — not a generic sample, but a real expert call that applies to your work.",
          icon: 'book-open',
        },
        {
          title: 'Enter your work email',
          description:
            'No credit card, no subscription, no billing details. Just your work email so we can send the PDF. That\'s the entire commitment.',
          icon: 'mail',
        },
        {
          title: 'PDF in your inbox',
          description:
            'Within 24 hours, you\'ll receive a full verbatim transcript PDF — with executive summary, expert profile, and MNPI compliance certificate.',
          icon: 'download',
        },
      ],
    },

    // ── 3. What's in the PDF ─────────────────────────────────────────────
    {
      blockType: 'freeTranscriptFeatures',
      eyebrow: "What's in your free PDF",
      heading: 'The same quality as the library.',
      features: [
        {
          title: 'Full verbatim transcript',
          description:
            "The complete Q&A dialogue — same format as our $349–$599 library transcripts. Every word, timestamp, and speaker label.",
        },
        {
          title: 'Executive summary',
          description:
            'A 150–300 word structured overview written by our research team. Not AI-generated. Covers key findings, data points, and contrarian signals.',
        },
        {
          title: 'Expert profile',
          description:
            "Anonymised background — seniority, sector, tenure. You know exactly who you're hearing from, without PII.",
        },
        {
          title: 'MNPI compliance certificate',
          description:
            'The same screening certificate that accompanies every paid transcript. Suitable for internal compliance review.',
        },
      ],
    },

    // ── 4. Trust numbers ─────────────────────────────────────────────────
    {
      blockType: 'trustNumbers',
      stats: [
        { value: '135K+', label: 'Expert network' },
        { value: '77+', label: 'Transcripts in library' },
        { value: '100%', label: 'MNPI screened' },
        { value: '24hr', label: 'Delivery commitment' },
      ],
      animateOnScroll: false,
    },

    // ── 5. Testimonials ───────────────────────────────────────────────────
    {
      blockType: 'testimonial',
      variant: 'grid',
      eyebrow: 'What analysts say',
      heading: 'From the research community',
      testimonials: [
        {
          quote:
            'The free transcript convinced me immediately. Same quality as what I\'d get through GLG — at a fraction of the cost. I\'ve purchased six since.',
          authorName: 'Portfolio Manager',
          authorTitle: 'Long/Short Equity · APAC Focus',
        },
        {
          quote:
            'I claimed the free one expecting a cut-down sample. Got a 35-page verbatim transcript with executive summary and compliance cert. Better than I expected.',
          authorName: 'Associate, Deal Team',
          authorTitle: 'Mid-Market PE · Technology Focus',
        },
        {
          quote:
            'The sector matching is genuinely useful. They sent me a semiconductor call that was directly relevant to a thesis I was working on. Not a generic sample.',
          authorName: 'Research Analyst',
          authorTitle: 'Hedge Fund · Global Macro',
        },
      ],
    },

    // ── 6. Final CTA ─────────────────────────────────────────────────────
    {
      blockType: 'cta',
      eyebrow: 'No credit card required',
      heading: 'Your first expert call transcript. Free.',
      subheading:
        'Choose your sector and enter your email. PDF delivered within 24 hours.',
      ctas: [
        {
          label: 'Get Free PDF',
          url: '#claim',
          style: 'primary',
        },
      ],
      alignment: 'center',
      visualBg: 'glow-grid',
      complianceNote: 'MNPI SCREENED · NO SUBSCRIPTION · DELIVERED WITHIN 24 HOURS',
    },
  ],
}

async function main() {
  const payload = await getPayload({ config: await payloadConfig })

  console.log('\n🆓 Seeding free-transcript page...\n')

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'free-transcript' } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0]!.id
    await payload.update({
      collection: 'pages',
      id,
      data: pageData,
    })
    console.log('✓ Updated existing free-transcript page')
  } else {
    await payload.create({
      collection: 'pages',
      data: pageData,
    })
    console.log('✓ Created free-transcript page')
  }

  console.log('\n✅ Done! EXIT:0\n')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
