/**
 * seed-five-numbers-post.ts
 * Seeds (or updates) the second EV blog post:
 *   "Five Numbers. Three EV Insiders. One Question Nobody Has Answered in Public."
 *   → /resources/europe-ev-battery-numbers-three-insiders
 *
 * Mirrors the EV gigafactory post: in-body blogCta banners (all → /reports/ev-ecosystem),
 * a statGrid "number cards" block, a sidebar lead form (cloned from the gigafactory post
 * so the Resend recipient + CC routing matches), per-post SEO meta. FAQ / closing / cover
 * live in code-maps keyed by slug (faq-data.ts / article-closing.ts / article-cover.ts).
 *
 * Usage (MUST be NODE_ENV=production or the postgres adapter hangs on a schema prompt):
 *   NODE_ENV=production npx --yes tsx@4.19.2 scripts/seed-five-numbers-post.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const SLUG = 'europe-ev-battery-numbers-three-insiders'
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
const li = (text: string, value: number) => ({
  type: 'listitem', value, children: [txt(text)], direction: 'ltr', format: '', indent: 0, version: 1,
})
const ol = (items: string[]) => ({
  type: 'list', listType: 'number', tag: 'ol', start: 1,
  children: items.map((t, i) => li(t, i + 1)),
  direction: 'ltr', format: '', indent: 0, version: 1,
})
const cta = (eyebrow: string, heading: string, subline: string, buttonLabel: string) => ({
  type: 'block', format: '', version: 2,
  fields: { blockType: 'blogCta', eyebrow, heading, subline, buttonLabel, buttonUrl: REPORT_URL },
})
const statGrid = (items: Array<{ figure: string; lead: string; body: string }>) => ({
  type: 'block', format: '', version: 2,
  fields: { blockType: 'statGrid', items },
})

const body = {
  root: {
    type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
    children: [
      p('The European EV market produces a lot of data. Most of it is public, and most of it tells you roughly what you already know.'),
      p("What isn't public, and hasn't been properly documented anywhere, is what the people who actually ran these businesses think the numbers mean. In May and June 2026, Nextyn Research interviewed three of them. Here are five numbers, and what changes once a practitioner explains each one."),

      quote([
        txt('"Korea bought the equipment from Japan and hired the people who knew how to run it. China bought from Korea. We bought the machines, but not the people."'),
        br(),
        txt('Former Technical Team Lead, Audi AG'),
      ]),
      para([txt('That single sentence reframes every "European battery renaissance" narrative currently in circulation.')]),

      h2('The five numbers'),
      statGrid([
        {
          figure: '~10%',
          lead: 'The share of announced European gigafactory projects that reached commercial production.',
          body: "The failures weren't random. Almost every well-funded independent, Northvolt, Morrow, Freyr, Britishvolt, Italvolt, stalled in the scale-up valley of death, while the survivors (ACC and PowerCo) had automotive parents to absorb the ramp losses. The former Audi AG lead explains why that pattern, not the technology, is what should worry anyone deploying capital here.",
        },
        {
          figure: '15%',
          lead: 'The cost penalty for producing the same cell design in Europe versus importing it from China.',
          body: "And that's before any policy support. The dependency runs deeper than most executives realise: a single cathode-processing step, calcination, has no European supplier at all. The former Sunlight Group director has a pointed view on whether Europe's localisation debate is even being argued correctly.",
        },
        {
          figure: '6 vs 24',
          lead: 'Months from concept to certification for next-generation energy storage. One is China. One is Europe.',
          body: "The gap isn't technology: China and Korea hold no patents Europe lacks.",
        },
        {
          figure: '20%',
          lead: 'The site utilisation level at which a charging asset finally crosses into sustainable economics.',
          body: 'The first of two numbers the market is systematically mispricing. Much of the capital now flooding EV charging models it as a hardware rollout, not as a utilisation-and-maintenance business. The practitioners reached this figure from inside the systems, not from a spreadsheet.',
        },
        {
          figure: '10 yrs',
          lead: 'How far away meaningful consumer vehicle-to-grid actually is.',
          body: 'The second mispriced number. V2G is real, but for consumers it is roughly a decade out, constrained by battery-wear concerns and grid limits. What to do about both numbers is the part you read the report for.',
        },
      ]),

      cta(
        'The numbers, decoded',
        'Five public numbers, and what the people who ran these businesses say they actually mean',
        'The full practitioner read on every figure above, plus the two the market is mispricing, in one decision-ready report.',
        'Read the EV ecosystem report',
      ),

      h2("The question the numbers can't answer"),
      p('Every number above is public in one form or another. What no amount of data analysis produces on its own is the practitioner judgment about what comes next, and on the sharpest question, two of the three experts hold directly opposing views.'),
      p('The former Audi AG lead argues the battery manufacturers hold the cards: they own the deployed cells, and therefore the field data that every AI-driven quality and optimisation tool depends on. The former Sunlight Group director argues the opposite, that the battery is a passive component, and whoever runs the software that orchestrates charging, storage, and discharge captures the value that compounds.'),
      p("Both are backed by direct operating experience. Both are internally coherent. The report doesn't resolve the disagreement, because the experts don't, but it explains precisely what hangs on which view turns out to be right, and argues the answer may be decided by something no single company controls. Right now, that is one of the most consequential unresolved questions in European EV capital allocation."),

      cta(
        'Where the experts split',
        'Who controls the EV ecosystem once the cell is commoditised?',
        'Two former operators, opposite conclusions, both built from direct experience. See both cases, and what hangs on which one is right, in full.',
        'Get your report now',
      ),

      h2('The seven questions this report answers'),
      p('Not data questions. Decision questions:'),
      ol([
        'Why did Europe lose the battery manufacturing race, and is the verdict as final as it seems?',
        'Which gigafactory bets survive, and what is the actual differentiator?',
        'Where does value migrate when the core component is commoditised?',
        'Does software eat the EV ecosystem, or do the battery manufacturers who own the field data win?',
        'What does V2G actually look like over the next decade, versus the version being sold to investors right now?',
        'Where should capital go in EV charging infrastructure, and what is the market systematically mispricing?',
        "What is AI's real role in this ecosystem, and who captures the value it creates?",
      ]),
      p('Each answer comes from a practitioner with direct operating experience in the relevant layer. Every claim is traceable. No hedged consultant language.'),

      h2('For the PE analyst running this thesis'),
      p("You already know the headline numbers, and you've probably built a model around some version of the conventional narrative. What this report gives you is a stress test you can't run from public data: three practitioners who operated inside the decisions your model is pricing, telling you what they actually think, not what they were paid to present, not what they published in a white paper."),
      p('If your thesis is right, the report confirms it with practitioner testimony. If it has a blind spot, this is where you find it.'),

      cta(
        'Practitioner intelligence',
        'Three insiders. Seven questions. One decision-ready brief.',
        'Stress-test your European EV thesis against three named operators who ran these businesses: primary practitioner testimony, not modelled projections.',
        'Primary research at your fingertips',
      ),
    ],
  },
}

const TITLE = 'Five Numbers. Three EV Insiders. One Question Nobody Has Answered in Public.'
const EXCERPT =
  'A roughly 10% gigafactory success rate. A 15% cost penalty. A 6-month versus 24-month certification gap. Three former leaders, from Audi, Sunlight Group and E-GAP, on what Europe\'s EV numbers actually mean.'
const META = {
  title: "Europe's EV Battery Numbers: 3 Insiders Decode Them",
  description:
    "A ~10% gigafactory success rate, a 15% cost penalty, a 6-vs-24-month gap. Three former Audi, Sunlight and E-GAP leaders on what Europe's EV numbers really mean.",
}

async function main() {
  const payload = await getPayload({ config: await payloadConfig })
  console.log('\n📰 Seeding "five numbers" EV post...\n')

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
