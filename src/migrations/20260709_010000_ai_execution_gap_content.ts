import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Data migration: apply the new copy to the "AI execution gap" transcript.
 *
 * Mirrors scripts/update-ai-execution-gap-transcript.ts but runs automatically
 * during `payload migrate` (before `next build`), so the statically generated
 * product page picks up the new content in the same deploy — no manual script
 * run against prod required.
 *
 * Implementation note: this uses direct SQL rather than payload.update() on
 * purpose. payload.update() runs checkDocumentLockStatus(), which queries
 * payload_locked_documents_rels — a table that is missing the blog_leads_id
 * column on this database (pre-existing schema drift). That made the operation
 * (and the whole deploy) fail. Direct SQL touches only the transcript tables.
 *
 * We update both the main table (what the published frontend reads) and the
 * latest row of the _v versions table (what the admin edit view loads), so the
 * admin doesn't later revert the copy on save.
 *
 * The expert_bio / expert_experience / expert_patents columns were added by the
 * preceding 20260709_000000_expert_profile_fields migration.
 */

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

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Main table — what the published frontend reads.
  await db.execute(sql`
    UPDATE "expert_transcripts" SET
      "title" = ${TITLE},
      "summary" = ${SUMMARY},
      "executive_summary_preview" = ${EXECUTIVE_SUMMARY},
      "expert_bio" = ${EXPERT_BIO},
      "expert_experience" = ${EXPERT_EXPERIENCE},
      "expert_patents" = ${EXPERT_PATENTS},
      "updated_at" = now()
    WHERE "slug" = ${SLUG};
  `)

  // Latest version row — what the admin edit view loads (prevents revert on save).
  await db.execute(sql`
    UPDATE "_expert_transcripts_v" SET
      "version_title" = ${TITLE},
      "version_summary" = ${SUMMARY},
      "version_executive_summary_preview" = ${EXECUTIVE_SUMMARY},
      "version_expert_bio" = ${EXPERT_BIO},
      "version_expert_experience" = ${EXPERT_EXPERIENCE},
      "version_expert_patents" = ${EXPERT_PATENTS}
    WHERE "version_slug" = ${SLUG} AND "latest" = true;
  `)
}

export async function down(): Promise<void> {
  // No-op: this is a one-way content migration; the prior copy is not restored.
}
