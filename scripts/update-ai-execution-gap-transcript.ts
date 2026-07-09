/**
 * update-ai-execution-gap-transcript.ts
 *
 * Updates the single transcript at
 *   /expert-transcripts/operationalizing-ai-finance-pilot-to-production
 * with new copy sourced from the expert call PDF:
 *   • new title
 *   • rewritten one-paragraph summary
 *   • rewritten executive summary preview (intro paragraph + 5 bullet takeaways)
 *   • verbatim expert bio + experience/patents credential boxes
 *
 * The slug is passed explicitly so the beforeValidate slug hook keeps the
 * existing slug — the live URL does NOT change even though the title does.
 *
 * Prerequisite: the 20260709_000000_expert_profile_fields migration must
 * already be applied (it adds expert_bio / expert_experience / expert_patents).
 *
 * Run:
 *   DATABASE_URI=<prod> npx tsx scripts/update-ai-execution-gap-transcript.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const SLUG = 'operationalizing-ai-finance-pilot-to-production'

const TITLE =
  'The AI Execution Gap in Indian Financial Institutions: Why Pilots Succeed but Production Deployments Stall'

const SUMMARY =
  'An enterprise AI leader with two decades inside Indian banking and financial services unpacks why generative and agentic AI pilots move fast but stall on the way to production. He walks through what a real production-grade architecture looks like — integration layers, RAG, business-domain agents, DAG-based orchestration and day-one observability — and why regulated decisions like loan and claims underwriting stay human-in-the-loop while productivity, customer service and internal automation scale fastest. Legacy systems, regulator traceability, information-security risk and hard ROI thresholds emerge as the real constraints separating a working POC from a deployed system.'

// Intro paragraph, blank line, then 5 "- " bullet lines.
// The product page renders consecutive "- " lines as a bulleted list.
const EXECUTIVE_SUMMARY = [
  'This expert call examines the execution gap between AI experimentation and production inside Indian financial institutions. Building a proof-of-concept in a GenAI world is now easy; taking it into production at scale is where "hell breaks loose" — integration with legacy monoliths, compliance and information-security review, regulator demands for traceability, and the hunt for defensible ROI. The expert details how production architectures are converging on agent-plus-API designs — an integration layer, vector-database RAG, business-domain agents, DAG-based orchestration, and observability built in from day one — and explains why financial decision-making stays human-led even as autonomous capabilities are deployed in lower-scrutiny, non-customer-facing workflows.',
  [
    '- Pilots succeed, production stalls: a GenAI POC is fast and cheap to build, but production forces integration with legacy monoliths (e.g. Salesforce) plus legal, compliance and information-security sign-off — the real bottleneck is organizational, not technical.',
    '- Regulated decisions stay human-in-the-loop: loan and insurance-claim underwriting keep a human decision-maker while AI generates credit memos, summaries and assessments; autonomy is reserved for marketing, internal process automation, chatbots and voice AI.',
    '- Architecture is converging on agent + API: a bottom integration layer, RAG over a vector database, specialized business-domain agents, a DAG-based orchestration layer, and an observability layer built in from day one — not bolted on after launch.',
    '- ROI is the constraint that kills scale: production needs 2-3x ROI to justify development, infrastructure and AI costs, measured through TAT reduction, cost savings and productivity gains, with feasibility and ROI checks run before a use case is even picked.',
    '- Governance and latency are the operational risks: regulators reject black boxes and demand traceability, bias controls and explainability, while non-deterministic outputs, PII exposure and prompt-injection add risk — and under high volume, latency (not hallucination) is what breaks first.',
  ].join('\n'),
].join('\n\n')

const EXPERT_BIO =
  'An enterprise AI leader with over two decades of experience in data, analytics, and artificial intelligence, he has held leadership roles at Bank of America (BA Continuum), Deloitte, and HSBC, where he built and scaled enterprise AI, machine learning, and analytics solutions across banking and financial services. He has led high-performing teams, developed innovative AI-driven products and platforms, holds 16 granted U.S. patents and one Indian patent in data science and AI, and is a regular speaker at leading AI and fintech conferences.'

const EXPERT_EXPERIENCE = '20+ years'
const EXPERT_PATENTS = '16 U.S. + 1 Indian'

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  const res = await payload.find({
    collection: 'expert-transcripts',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
  })

  const doc = res.docs[0]
  if (!doc) {
    console.log(`❌ Transcript not found for slug "${SLUG}"`)
    process.exit(1)
  }

  await payload.update({
    collection: 'expert-transcripts',
    id: doc.id,
    data: {
      title: TITLE,
      slug: SLUG, // pin slug — keeps the live URL unchanged despite the new title
      summary: SUMMARY,
      executiveSummaryPreview: EXECUTIVE_SUMMARY,
      expertBio: EXPERT_BIO,
      expertExperience: EXPERT_EXPERIENCE,
      expertPatents: EXPERT_PATENTS,
      _status: 'published',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  })

  console.log(`✓ Updated transcript "${SLUG}"`)
  console.log(`  Title    → ${TITLE}`)
  console.log(`  Bio/exp/patents populated; slug + price left unchanged.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
