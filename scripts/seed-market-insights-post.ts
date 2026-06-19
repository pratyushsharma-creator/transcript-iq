/**
 * seed-market-insights-post.ts
 * Seeds (or updates) the third EV blog post:
 *   "Draw the Map of Europe's EV Bets. Then Ask Why It Looks the Way It Does."
 *   → /resources/europe-ev-market-insights
 *
 * Mirrors the first two EV posts: in-body blogCta banners (all → /reports/ev-ecosystem),
 * the Audi quote epigraph, a sidebar lead form (cloned from the gigafactory post so the
 * Resend recipient + CC routing matches), per-post SEO meta. FAQ / closing / cover live
 * in code-maps keyed by slug (faq-data.ts / article-closing.ts / article-cover.ts).
 *
 * Usage (MUST be NODE_ENV=production or the postgres adapter hangs on a schema prompt):
 *   NODE_ENV=production npx --yes tsx@4.19.2 scripts/seed-market-insights-post.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const SLUG = 'europe-ev-market-insights'
const REPORT_URL = 'https://www.transcript-iq.com/reports/ev-ecosystem'
const GIGA_SLUG = 'why-europe-lost-the-gigafactory-race'

// ── Lexical builders ─────────────────────────────────────────────────────────
const txt = (text: string, format = 0) => ({
  type: 'text', detail: 0, format, mode: 'normal', style: '', text, version: 1,
})
const para = (children: any[]) => ({
  type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
})
const p = (text: string) => para([txt(text)])
const h2 = (text: string) => ({
  type: 'heading', tag: 'h2', children: [txt(text)], direction: 'ltr', format: '', indent: 0, version: 1,
})
const quote = (children: any[]) => ({
  type: 'quote', children, direction: 'ltr', format: '', indent: 0, version: 1,
})
const br = () => ({ type: 'linebreak', version: 1 })
const liRich = (children: any[], value: number) => ({
  type: 'listitem', value, children, direction: 'ltr', format: '', indent: 0, version: 1,
})
const ul = (items: Array<{ bold: string; rest: string }>) => ({
  type: 'list', listType: 'bullet', tag: 'ul', start: 1,
  children: items.map((it, i) => liRich([txt(it.bold, 1), txt(' ' + it.rest)], i + 1)),
  direction: 'ltr', format: '', indent: 0, version: 1,
})
const cta = (eyebrow: string, heading: string, subline: string, buttonLabel: string) => ({
  type: 'block', format: '', version: 2,
  fields: { blockType: 'blogCta', eyebrow, heading, subline, buttonLabel, buttonUrl: REPORT_URL },
})

const body = {
  root: {
    type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
    children: [
      p('Mark every announced European gigafactory project on a map. Now mark the ones that reached commercial production. Look at the gap between those two maps.'),
      p('That gap is not random, and it is not explained by engineering failure. The three practitioners Nextyn Research interviewed in May and June 2026 have a specific, uncomfortable explanation for why the pattern looks the way it does, and it is not the one most coverage has settled on.'),

      h2('The geography of the problem'),
      p('Sweden. The United Kingdom. France. Germany. Italy. Norway. These are not emerging economies attempting industrial policy for the first time. They are sophisticated markets with established engineering workforces, functioning capital markets, and genuine government commitment to the energy transition. The flagship project, Northvolt, raised billions, including a $5.8bn debt facility, and still filed for bankruptcy.'),
      p('The interesting question is not whether the projects failed. It is why the failure was so consistent across different countries, management teams, capital structures, and levels of government support.'),

      h2('The pattern the practitioners identified'),
      p('Most post-mortems point to the same variables: Chinese cost advantages, European energy prices, slow permitting, insufficient subsidy. All real. None of them is the full answer.'),
      p('When all three experts, coming from entirely different parts of the ecosystem, independently arrive at overlapping versions of the same diagnosis, that convergence is not coincidence. The critical variable they identify is operational, and largely absent from public discussion: Europe imported the machinery but not the people who knew how to run a line to commercial yield. Korea bought equipment from Japan and the engineers who built it; China bought from Korea and mastered the process; Europe bought the machines and tried to learn the process alone, mid-ramp, on investor money.'),
      quote([
        txt('"Korea bought the equipment from Japan and hired the people who knew how to run it. China bought from Korea. We bought the machines, but not the people."'),
        br(),
        txt('Former Technical Team Lead, Audi AG'),
      ]),
      p('The second half of the pattern is financial structure. Survival tracked OEM backing, not engineering quality: ACC and PowerCo had automotive parents to absorb losses through the long, low-yield ramp; the well-funded independents, Northvolt, Morrow, Freyr, Britishvolt, Italvolt, did not, and failed regardless of how much they raised. That is the verdict. The full evidence, and what it means for everything built above the cell, is the report.'),

      cta(
        'The pattern, decoded',
        "Why Europe's gigafactory failures were structural, not random",
        'The full practitioner read on what actually caused the collapse, and what it means for everything built above the cell, in one decision-ready report.',
        'Read the EV ecosystem report',
      ),

      h2('The contest the map does not show'),
      p('Here is the thing about the map: it shows you where Europe lost. It does not show you where the fight is still live.'),
      p("The three practitioners are not pessimistic about Europe's position. They are precise about it. The battery-manufacturing chapter has a verdict. The chapter above it, charging infrastructure, stationary storage, and the energy-orchestration software that runs them, does not. It is still being written, and the decisions European OEMs, infrastructure investors, energy companies, and policymakers make in the next 36 months will decide whether Europe builds a defensible position or repeats the same structural mistake one layer up."),
      p('On the sharpest question, who controls that layer, two of the three experts hold directly opposing views. The former Audi AG lead argues the battery manufacturers hold the cards, because they own the deployed cells and the field data every AI tool depends on. The former Sunlight Group director argues the opposite: the battery is a passive component, and whoever runs the orchestration software captures the value. Both are backed by direct operating experience. The report does not resolve the disagreement, because the experts do not, but it gives you the exact shape of the question you need to resolve before you commit capital, and argues the answer may be decided by something no single company controls.'),

      cta(
        'Where the experts split',
        'Who controls the EV ecosystem once the cell is commoditised?',
        'Two former operators, opposite conclusions, both built from direct experience. See both cases, and what hangs on which one is right, in full.',
        'Get your report now',
      ),

      h2('Four decision-makers who need this report'),
      ul([
        {
          bold: 'The OEM executive',
          rest: 'deciding whether to double down on European cell manufacturing or redirect capital above the cell: the report names which structural conditions the first bet requires to survive, and what the second actually looks like.',
        },
        {
          bold: 'The infrastructure investor',
          rest: 'modelling EV charging as a hardware rollout: the report shows what is systematically mispriced in that model and where the defensible returns actually sit.',
        },
        {
          bold: 'The policy team',
          rest: 'designing the next round of battery incentives: the report identifies which instruments have failed and what comparable cases suggest would work.',
        },
        {
          bold: 'The consultant or analyst',
          rest: 'building a client view on European EV: primary practitioner testimony you cannot replicate from public data.',
        },
      ]),

      h2('Why the practitioner view changes the picture'),
      p('The European EV challenge has been analysed by investment banks, consulting firms, and government agencies, and most of that analysis reaches broadly similar conclusions. What it structurally cannot have is the testimony of people who made decisions inside these operations and are now willing to say, on the record, what they actually think, not what is safe to publish in a white paper with a client list attached.'),
      p('That is what Transcript-IQ captures: every claim traceable to a named practitioner with direct operating experience, every question chosen because it is live and consequential rather than because it has a clean answer.'),

      cta(
        'Primary practitioner intelligence',
        'Three insiders. Seven contested questions. One decision-ready brief.',
        'What investment banks and consulting firms structurally cannot offer: named operators who ran these businesses, on the record. Not modelled projections.',
        'Primary research at your fingertips',
      ),
    ],
  },
}

const TITLE = "Draw the Map of Europe's EV Bets. Then Ask Why It Looks the Way It Does."
const EXCERPT =
  "Map every announced European gigafactory, then the ones that reached production. The gap is not random. Three former Audi, Sunlight Group and E-GAP leaders on what actually caused the collapse, and where the EV fight goes next."
const META = {
  title: "Why Europe's Gigafactories Failed: The Pattern Explained",
  description:
    "Northvolt, Britishvolt, Italvolt: the failures were not random. Three former Audi, Sunlight and E-GAP leaders on what really caused Europe's gigafactory collapse.",
}

async function main() {
  const payload = await getPayload({ config: await payloadConfig })
  console.log('\n📰 Seeding "market insights" EV post...\n')

  // Mirror the gigafactory post's lead-form recipient/CC + author + contentType.
  const gigaRes = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: GIGA_SLUG } },
    depth: 0,
    limit: 1,
  })
  const giga = gigaRes.docs[0] as any | undefined
  if (giga) console.log(`  ↳ cloning lead-form/author/contentType from "${GIGA_SLUG}"`)
  else console.log('  ⚠ gigafactory post not found — falling back to default lead form')

  const baseLead = (giga?.leadForm ?? {}) as Record<string, unknown>
  const leadForm = {
    ...baseLead,
    enabled: true,
    eyebrow: 'Talk to the research expert',
    heading: 'Request a conversation',
    subline:
      "Researching the European EV ecosystem? Tell us what you need and we'll line up the right expert call for your team.",
    selectLabel: 'You are a…',
    selectOptions: [
      'Private equity / venture / hedge fund',
      'Management or strategy consultant',
      'Corporate strategy / corp-dev',
      'OEM / automotive',
      'Energy / utility / charging operator',
      'Policy / public sector',
      'Other',
    ].join('\n'),
    collectCompany: false,
    collectMessage: false,
    submitLabel: 'Speak to an analyst',
    successMessage: "Thank you. We'll be in touch within one business day.",
    fineprint: 'No spam · Response within 1 business day',
  }

  const data: any = {
    title: TITLE,
    slug: SLUG,
    contentType: giga?.contentType ?? 'industry-deep-dive',
    excerpt: EXCERPT,
    body,
    leadForm,
    meta: META,
    publishedAt: new Date().toISOString(),
    _status: 'published',
  }
  if (giga?.author) data.author = giga.author

  const existing = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: SLUG } },
    limit: 1,
  })

  let id: string | number
  if (existing.docs.length > 0) {
    id = existing.docs[0]!.id
    await payload.update({ collection: 'blog-posts', id, data })
    console.log(`✓ Updated existing post (id ${id})`)
  } else {
    const created = await payload.create({ collection: 'blog-posts', data })
    id = created.id
    console.log(`✓ Created post (id ${id})`)
  }

  console.log(`\n✅ Done! /resources/${SLUG}  EXIT:0\n`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
