/**
 * seed-can-europe-win-post.ts
 * Seeds (or updates) the fourth EV blog post:
 *   "The European EV Question Has an Answer. Here's Who We Asked, and Why It's Not in This Article."
 *   → /resources/can-europe-win-ev-ecosystem
 *
 * Mirrors the first three EV posts: in-body blogCta banners (all → /reports/ev-ecosystem),
 * a sidebar lead form (cloned from the gigafactory post so the Resend recipient + CC routing
 * matches), per-post SEO meta. FAQ / closing / cover live in code-maps keyed by slug
 * (faq-data.ts / article-closing.ts / article-cover.ts).
 *
 * Usage (MUST be NODE_ENV=production or the postgres adapter hangs on a schema prompt):
 *   NODE_ENV=production npx --yes tsx@4.19.2 scripts/seed-can-europe-win-post.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const SLUG = 'can-europe-win-ev-ecosystem'
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
const liRich = (children: any[], value: number) => ({
  type: 'listitem', value, children, direction: 'ltr', format: '', indent: 0, version: 1,
})
const ul = (items: Array<{ bold: string; rest: string }>) => ({
  type: 'list', listType: 'bullet', tag: 'ul', start: 1,
  children: items.map((it, i) => liRich([txt(it.bold, 1), txt(' ' + it.rest)], i + 1)),
  direction: 'ltr', format: '', indent: 0, version: 1,
})
const olRich = (items: Array<{ bold: string; rest: string }>) => ({
  type: 'list', listType: 'number', tag: 'ol', start: 1,
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
      p("There's a version of the European EV story that has become so familiar it barely registers: Europe tried to build a battery supply chain, China was cheaper and faster, several flagship projects failed, the layer above the cell is a genuine opportunity, AI will change things somehow, V2G is coming eventually."),
      p("That version isn't wrong. It's just not the version that helps you make a decision. In May and June 2026, Nextyn Research sat down with three people who ran the operations, not analysts, not market researchers, and asked them seven questions the familiar story doesn't answer. We'll tell you the questions, who answered them, and the verdict they reached. The contested calls are in the report."),

      h2('The three practitioners'),
      ul([
        {
          bold: 'A former Technical Team Lead at Audi AG,',
          rest: 'responsible for battery cell technology development, gigafactory ramp planning, and European supply-chain strategy. He sat in the rooms where the bets were placed and watched them succeed or fail at an operational level.',
        },
        {
          bold: 'A former Director at Sunlight Group,',
          rest: 'across product strategy, market development, and energy-platform commercialisation, operating in the layer above the cell where the contest is still open. His view on who ultimately controls that layer is not the consensus view.',
        },
        {
          bold: 'A former Engineer at E-GAP,',
          rest: "hands-on with charging network deployment, grid integration, thermal management, and software platforms. When he says something is systematically mispriced in charging, it is because he watched it fail from inside the operation, not because he modelled it.",
        },
      ]),
      p("These aren't people who study the European EV market. They operated inside it, at a senior level, during the period when the critical decisions were being made. That is a different category of source, and it produces a different category of intelligence."),

      h2('The seven questions'),
      olRich([
        {
          bold: 'Why did Europe lose the battery manufacturing race, and is the verdict as final as it seems?',
          rest: 'The cause was execution, not technology: Europe bought the machinery but not the engineers who could run a line to commercial yield. Whether that verdict is truly final is the part the report argues.',
        },
        {
          bold: "Which gigafactory bets survive, and what is the actual differentiator?",
          rest: 'One variable predicts survival more reliably than any engineering metric: OEM backing. ACC and PowerCo had automotive parents to absorb the ramp; the well-funded independents did not, and failed.',
        },
        {
          bold: 'Where does value migrate when the core component is commoditised?',
          rest: 'Two experts from entirely different parts of the stack reached the same conclusion independently: defensible margin moves above the cell, into orchestration software, maintenance, and energy platforms, not the hardware.',
        },
        {
          bold: 'Does software eat the ecosystem, or do the battery manufacturers who own the field data win?',
          rest: 'This is where the three disagree most sharply. The Audi lead says the data owners hold the cards; the Sunlight director says the battery is passive and the software layer wins. Both are operationally backed, and the resolution may be determined by regulation, not technology.',
        },
        {
          bold: "What does V2G actually look like over the next decade, versus what is being sold to investors?",
          rest: 'The near-term architecture is not the one being marketed, and the gap has direct implications for any thesis built on consumer V2G adoption.',
        },
        {
          bold: 'Where should capital go in EV charging, and what is the market systematically mispricing?',
          rest: 'It is not the hardware, and it is not network density. The most mispriced element is something experienced infrastructure investors consistently underweight, and the former E-GAP engineer knows exactly what it is.',
        },
        {
          bold: "What is AI's real role in this ecosystem, and who captures the value?",
          rest: 'All three reach the same conclusion: AI is a multiplier for whoever already owns the data, the scale, and the deployed asset base, not a leapfrog path for latecomers. One expert phrases it in a way that reframes every AI-efficiency claim of the last two years.',
        },
      ]),

      cta(
        'Seven questions, answered',
        'The practitioner answers to all seven questions, in full',
        'Every question above, answered on the record by three named operators who ran these businesses. One decision-ready report.',
        'Read the EV ecosystem report',
      ),

      h2('What we tell you about the disagreement'),
      p("On at least one of these seven questions, one of the most consequential for capital allocation, two of the three practitioners hold directly opposing views. Both are backed by direct operating experience. Neither has a clean resolution. The report does not paper over it; it presents the disagreement in full and explains why the answer may ultimately be determined by something outside any individual company's control. That single unresolved tension is worth the read on its own."),

      cta(
        'Where the experts split',
        'Who controls the layer above the battery?',
        'Two former operators, opposite conclusions, both built from direct experience. The report presents the disagreement in full, and what may decide it.',
        'Get your report now',
      ),

      h2('Who this report is written for'),
      ul([
        {
          bold: 'PE and investment teams',
          rest: 'building or stress-testing European EV theses: practitioner testimony you cannot source from public data, structured around the exact questions that determine whether a thesis holds.',
        },
        {
          bold: 'OEM and Tier-1 strategists',
          rest: "who need an independent practitioner benchmark, not a consultant's synthesis of the same public data their competitors already have.",
        },
        {
          bold: 'Consultants and equity research analysts',
          rest: 'who need primary, citable interview data, traceable to named practitioners, with no client relationship shaping the conclusions.',
        },
        {
          bold: 'Policy and government teams',
          rest: "who need the operator's view of how policy met commercial reality, not in a policy submission, but in a structured interview with no political agenda.",
        },
      ]),

      h2('The point'),
      p("The conventional narrative is broadly true in broad strokes: Europe did lose the cell race, Chinese costs are genuinely lower, flagship projects did fail. But broad strokes are not decision-relevant. What is decision-relevant is the specific, operational, practitioner answer to what comes next: who controls the layer above the battery, where defensible value migrates, what the market is mispricing now, and which contested questions get resolved by regulation rather than technology. Three practitioners answered those on the record. Their answers are not all the same, and all of them are more useful than the conventional narrative has produced."),

      cta(
        'Primary practitioner intelligence',
        'Three insiders. Seven contested questions. Zero hedged conclusions.',
        'Practitioner testimony you cannot source from public data, structured around the exact questions that determine whether a thesis holds.',
        'Primary research at your fingertips',
      ),
    ],
  },
}

const TITLE = "The European EV Question Has an Answer. Here's Who We Asked, and Why It's Not in This Article."
const EXCERPT =
  "The familiar European EV story is broadly true and useless for decisions. Three former Audi, Sunlight Group and E-GAP operators answer the seven questions it doesn't: who controls the layer above the cell, what is mispriced, and which calls get decided by regulation."
const META = {
  title: 'Can Europe Win the EV Ecosystem? 3 Insiders Answer',
  description:
    "Three former operators from Audi, Sunlight and E-GAP answer seven contested questions on Europe's EV future: charging, software, V2G, AI, and where capital goes.",
}

async function main() {
  const payload = await getPayload({ config: await payloadConfig })
  console.log('\n📰 Seeding "can Europe win the EV ecosystem" post...\n')

  // Mirror the gigafactory post's lead-form recipient/CC + author + contentType.
  const gigaRes = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: GIGA_SLUG } },
    depth: 0,
    limit: 1,
  })
  const giga = gigaRes.docs[0] as any | undefined
  if (giga) console.log(`  ↳ cloning lead-form/author/contentType from "${GIGA_SLUG}"`)
  else console.log('  ⚠ gigafactory post not found, falling back to default lead form')

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
