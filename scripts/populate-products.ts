import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  // ── Industry ID lookup ──────────────────────────────────────────────
  const industries = await payload.find({ collection: 'industries', limit: 100, depth: 0 })
  const indBySlug = new Map<string, string | number>()
  for (const ind of industries.docs as Array<{ id: string | number; slug: string }>) {
    indBySlug.set(ind.slug, ind.id)
  }
  const findInd = (name: string) => indBySlug.get(slugify(name))

  // ── Companies — upsert ──────────────────────────────────────────────
  const COMPANY_SEED: Array<{ name: string; ticker: string; exchange?: string }> = [
    { name: 'Amazon', ticker: 'AMZN', exchange: 'NASDAQ' },
    { name: 'Apple', ticker: 'AAPL', exchange: 'NASDAQ' },
    { name: 'Ashok Leyland', ticker: 'ASHLF', exchange: 'NSE' },
    { name: 'AST SpaceMobile', ticker: 'ASTS', exchange: 'NASDAQ' },
    { name: 'AT&T', ticker: 'T', exchange: 'NYSE' },
    { name: 'Bharti Airtel', ticker: 'BHARTIARTL', exchange: 'NSE' },
    { name: 'EchoStar', ticker: 'SATS', exchange: 'NASDAQ' },
    { name: 'Globalstar', ticker: 'GSAT', exchange: 'NYSE' },
    { name: 'Google', ticker: 'GOOGL', exchange: 'NASDAQ' },
    { name: 'Mahindra & Mahindra', ticker: 'MAHMF', exchange: 'NSE' },
    { name: 'Qualcomm', ticker: 'QCOM', exchange: 'NASDAQ' },
    { name: 'Rakuten', ticker: 'RKUNY', exchange: 'TSE' },
    { name: 'Rogers', ticker: 'RCI', exchange: 'NYSE' },
    { name: 'Samsung', ticker: 'SSNLF', exchange: 'NASDAQ' },
    { name: 'SES', ticker: 'SESG', exchange: 'NYSE' },
    { name: 'T-Mobile', ticker: 'TMUS', exchange: 'NASDAQ' },
    { name: 'Telstra', ticker: 'TLS', exchange: 'ASX' },
    { name: 'Vodafone', ticker: 'VOD', exchange: 'NASDAQ' },
    { name: 'Volvo', ticker: 'VLVLY', exchange: 'NASDAQ' },
    { name: 'AMD', ticker: 'AMD', exchange: 'NASDAQ' },
    { name: 'Amkor', ticker: 'AMKR', exchange: 'NASDAQ' },
    { name: 'ASE', ticker: 'ASX', exchange: 'NYSE' },
    { name: 'ASML', ticker: 'ASML', exchange: 'NASDAQ' },
    { name: 'Broadcom', ticker: 'AVGO', exchange: 'NASDAQ' },
    { name: 'Cadence', ticker: 'CDNS', exchange: 'NASDAQ' },
    { name: 'Foxconn', ticker: '2317.TW', exchange: 'TSE' },
    { name: 'Infineon', ticker: 'IFNNY', exchange: 'NASDAQ' },
    { name: 'Intel', ticker: 'INTC', exchange: 'NASDAQ' },
    { name: 'KLA', ticker: 'KLAC', exchange: 'NASDAQ' },
    { name: 'Meta', ticker: 'META', exchange: 'NASDAQ' },
    { name: 'NVIDIA', ticker: 'NVDA', exchange: 'NASDAQ' },
    { name: 'NXP', ticker: 'NXPI', exchange: 'NASDAQ' },
    { name: 'TSMC', ticker: 'TSM', exchange: 'NYSE' },
    { name: 'UMC', ticker: 'UMC', exchange: 'NYSE' },
    { name: 'SMIC', ticker: '0981.HK', exchange: 'HKEX' },
    { name: 'Alphabet', ticker: 'GOOGL', exchange: 'NASDAQ' },
    { name: 'ARM', ticker: 'ARM', exchange: 'NASDAQ' },
    { name: 'Baidu', ticker: 'BIDU', exchange: 'NASDAQ' },
    { name: 'Equinix', ticker: 'EQIX', exchange: 'NASDAQ' },
    { name: 'GDS', ticker: 'GDS', exchange: 'NASDAQ' },
    { name: 'Microsoft', ticker: 'MSFT', exchange: 'NASDAQ' },
    { name: 'Oracle', ticker: 'ORCL', exchange: 'NYSE' },
    { name: 'Singtel', ticker: 'Z74', exchange: 'SGX' },
    { name: 'Tesla', ticker: 'TSLA', exchange: 'NASDAQ' },
    { name: 'Accenture', ticker: 'ACN', exchange: 'NYSE' },
    { name: 'Capgemini', ticker: 'CAP', exchange: 'LSE' },
    { name: 'SAP', ticker: 'SAP', exchange: 'NYSE' },
  ]

  const companyByTicker = new Map<string, string | number>()
  for (const c of COMPANY_SEED) {
    const sl = slugify(c.ticker)
    const existing = await payload.find({ collection: 'companies', where: { slug: { equals: sl } }, limit: 1, depth: 0 })
    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'companies',
        data: { name: c.name, ticker: c.ticker, exchange: c.exchange as 'NASDAQ' | 'NYSE' | 'NSE' | 'BSE' | 'LSE' | 'HKEX' | 'SGX' | 'TSE' | 'ASX' | 'PRIVATE' | undefined, slug: sl },
      })
      companyByTicker.set(c.ticker, (created as { id: string | number }).id)
    } else {
      companyByTicker.set(c.ticker, (existing.docs[0] as { id: string | number }).id)
    }
  }
  console.log(`✓ ${companyByTicker.size} companies upserted.`)

  const ids = (tickers: string[]) =>
    tickers.map((t) => companyByTicker.get(t)).filter((x): x is string | number => Boolean(x))

  // ── Expert transcripts ──────────────────────────────────────────────
  const TRANSCRIPTS = [
    {
      title: 'Scaling Direct-to-Device Connectivity: LEO Constraints, Spectrum Limits, and the Shift to Mass-Market IoT & Mobile',
      slug: 'scaling-direct-to-device-connectivity-leo-constraints-spectrum-limits-and-the-shift-to-mass-market-iot-mobile',
      summary:
        'Analyses direct-to-device satellite connectivity, highlighting niche use cases, spectrum constraints, low throughput economics, and dependence on telco partnerships for scaling.',
      executiveSummaryPreview:
        'A senior former operator at SES walks through where direct-to-device connectivity actually works (machine telemetry, asset tracking, last-mile mobile fallback) versus where the economics break down. Spectrum allocation, telco partnership dependencies, and the gap between LEO promise and current throughput economics are covered in detail.',
      expertId: 'EXP-247',
      expertFormerTitle: 'Former Vice President at a Tier-1 Satellite Operator',
      expertLevel: 'vp',
      tier: 'premium',
      dateConducted: '2026-04-27',
      duration: 47,
      pageCount: 32,
      priceUsd: 449,
      originalPriceUsd: 599,
      discountPercent: 25,
      sectorNames: ['Industrials / Manufacturing'],
      geography: ['apac'],
      companies: ['AMZN', 'AAPL', 'ASHLF', 'ASTS', 'T', 'BHARTIARTL', 'SATS', 'GSAT', 'GOOGL', 'MAHMF', 'QCOM', 'RKUNY', 'RCI', 'SSNLF', 'SESG', 'TMUS', 'TLS', 'VOD', 'VLVLY'],
      engagementCopy: 'Gaining traction among telecom and space infrastructure investors',
      featured: true,
      topicsCovered: [
        'LEO vs GEO economics',
        'Spectrum allocation limits',
        'Telco partnership dependencies',
        'Throughput per device',
        'Asset tracking use cases',
      ],
    },
    {
      title: 'AI-Era Semiconductor Sourcing: 3nm & CoWoS Bottlenecks, Taiwan Risk, Foundry Partnerships',
      slug: 'ai-era-semiconductor-sourcing-3nm-cowos-bottlenecks-taiwan-risk-foundry-partnerships',
      summary:
        'Analyses advanced-node semiconductor sourcing, highlighting TSMC concentration, AI-driven CoWoS bottlenecks, export-control constraints, and limited near-term diversification beyond Taiwan.',
      executiveSummaryPreview:
        'Former VP at ams AG breaks down the structural bottlenecks at 3nm and CoWoS packaging, why second-source plans rarely close the capability gap, and what the practical Taiwan-risk hedge looks like for hyperscaler buyers in 2026-27.',
      expertId: 'EXP-251',
      expertFormerTitle: 'Former Vice President at a Tier-1 Semiconductor Firm',
      expertLevel: 'vp',
      tier: 'premium',
      dateConducted: '2026-04-27',
      duration: 52,
      pageCount: 38,
      priceUsd: 449,
      originalPriceUsd: 599,
      discountPercent: 25,
      sectorNames: ['Technology / SaaS'],
      geography: ['apac'],
      companies: ['AMD', 'AMKR', 'AAPL', 'ASX', 'ASML', 'AVGO', 'CDNS', '2317.TW', 'GOOGL', 'IFNNY', 'INTC', 'KLAC', 'META', 'NVDA', 'NXPI', 'QCOM', 'SSNLF', '0981.HK', 'TSM', 'UMC'],
      engagementCopy: 'Gaining traction among institutional investors and research teams',
      featured: true,
      topicsCovered: [
        '3nm capacity allocation',
        'CoWoS packaging bottleneck',
        'Export control implications',
        'TSMC concentration risk',
        'Foundry second-sourcing',
      ],
    },
    {
      title: 'AI Compute Migration in ASEAN: Shift to AI Infrastructure and the Rise of Sovereign Data Strategies',
      slug: 'ai-compute-migration-in-asean-shift-to-ai-infrastructure-and-the-rise-of-sovereign-data-strategies',
      summary:
        'Analyses ASEAN AI data center expansion, highlighting China-driven demand shift, power constraints, Singapore vs Malaysia trade-offs, and rising dominance of AI-optimized infrastructure economics.',
      executiveSummaryPreview:
        'Former Head of Digital at ASM walks through how AI compute demand is reshaping ASEAN data center capex — Singapore power moratorium effects, Johor build-out economics, and which sovereign data strategies are real versus rhetorical.',
      expertId: 'EXP-198',
      expertFormerTitle: 'Former Head of Digital at a Major Asian Conglomerate',
      expertLevel: 'director',
      tier: 'standard',
      dateConducted: '2026-04-21',
      duration: 41,
      pageCount: 28,
      priceUsd: 349,
      originalPriceUsd: 499,
      discountPercent: 30,
      sectorNames: ['Technology / SaaS'],
      geography: ['apac'],
      companies: ['GOOGL', 'AMZN', 'AMD', 'AAPL', 'ARM', 'BIDU', 'EQIX', 'GDS', 'MSFT', 'NVDA', 'ORCL', 'Z74', 'TSLA'],
      engagementCopy: '100+ buyers last 30 days · Popular among data center and AI infrastructure investors',
      featured: true,
      topicsCovered: [
        'Singapore power moratorium',
        'Johor data center economics',
        'China demand displacement',
        'Sovereign data strategies',
        'Hyperscaler ASEAN footprint',
      ],
    },
    {
      title: 'Enterprise ERP Transformation Insights: Navigating the 2027 SAP Support Deadline, Legacy Migration Realities, and the Strategic Role of GCCs in Capturing OPEX Savings',
      slug: 'enterprise-erp-transformation-insights-navigating-the-2027-sap-support-deadline-legacy-migration-realities-and-strategic-role-of-gccs-in-capturing-opex-savings',
      summary:
        'Analyses ERP transformation, highlighting slow cloud migration, hybrid architectures, data complexity, and AI-led automation driving efficiency gains and long-term value realisation.',
      executiveSummaryPreview:
        'Former Head of Department at Birlasoft on what enterprise ERP migration actually looks like 18 months from the SAP support cliff — the gap between vendor narratives and customer reality, GCC offshoring economics, and where AI-led automation moves the needle.',
      expertId: 'EXP-189',
      expertFormerTitle: 'Former Head of Department at a Major Indian IT Services Firm',
      expertLevel: 'director',
      tier: 'premium',
      dateConducted: '2026-04-20',
      duration: 49,
      pageCount: 35,
      priceUsd: 449,
      originalPriceUsd: 599,
      discountPercent: 25,
      sectorNames: ['Technology / SaaS'],
      geography: ['apac'],
      companies: ['ACN', 'CAP', 'MSFT', 'ORCL', 'SAP'],
      engagementCopy: '100+ buyers last 30 days · Popular among enterprise IT and ERP leaders',
      featured: true,
      topicsCovered: [
        'SAP 2027 support deadline',
        'Hybrid ERP architecture',
        'GCC OPEX economics',
        'Data migration realities',
        'AI-led process automation',
      ],
    },
  ]

  for (const t of TRANSCRIPTS) {
    const existing = await payload.find({
      collection: 'expert-transcripts',
      where: { slug: { equals: t.slug } },
      limit: 1,
      depth: 0,
    })
    const sectorIds = t.sectorNames.map((n) => findInd(n)).filter((x): x is string | number => Boolean(x))
    const companyIds = ids(t.companies)
    const data = {
      title: t.title,
      slug: t.slug,
      summary: t.summary,
      executiveSummaryPreview: t.executiveSummaryPreview,
      expertId: t.expertId,
      expertFormerTitle: t.expertFormerTitle,
      expertLevel: t.expertLevel,
      tier: t.tier,
      dateConducted: t.dateConducted,
      duration: t.duration,
      pageCount: t.pageCount,
      priceUsd: t.priceUsd,
      originalPriceUsd: t.originalPriceUsd,
      discountPercent: t.discountPercent,
      sectors: sectorIds,
      geography: t.geography,
      companies: companyIds,
      engagementCopy: t.engagementCopy,
      featured: t.featured,
      topicsCovered: t.topicsCovered.map((tc) => ({ topic: tc })),
      complianceBadges: ['mnpi-screened', 'pii-redacted', 'compliance-certified', 'expert-anonymised'],
      _status: 'published',
    } as const
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'expert-transcripts', data: data as never })
      console.log(`  + ${t.expertId} · ${t.title.slice(0, 60)}…`)
    } else {
      await payload.update({
        collection: 'expert-transcripts',
        id: (existing.docs[0] as { id: string | number }).id,
        data: data as never,
      })
      console.log(`  ~ ${t.expertId} · ${t.title.slice(0, 60)}…`)
    }
  }
  console.log(`✓ ${TRANSCRIPTS.length} expert transcripts upserted.\n`)

  // ── Earnings analyses ───────────────────────────────────────────────
  const ANALYSES = [
    {
      title: 'Apple — Q2 FY2026 Earnings Analysis',
      slug: 'apple-q2-fy2026-earnings-analysis',
      summary:
        'iPhone demand signals in a competitive AI device cycle, Services revenue trajectory, and management commentary on Apple Intelligence adoption and India market expansion.',
      executiveSummaryPreview:
        'Apple beat EPS on Services margin expansion (gross margin >70%, double-digit growth), iPhone revenue in line with consensus despite mix shift to AI-capable devices, Apple Intelligence adoption metrics encouraging in pilot geographies, India revenue at all-time high. Capital return programme accelerating.',
      companyName: 'Apple Inc.',
      ticker: 'AAPL',
      exchange: 'NASDAQ',
      quarter: 'Q2',
      fiscalYear: 2026,
      reportDate: '2026-05-01',
      pageCount: 24,
      priceUsd: 99,
      sectorNames: ['Technology / Consumer'],
      companies: ['AAPL'],
      featured: true,
      performanceBadges: ['eps-beat', 'rev-in-line'],
      keyTopics: [
        'iPhone Demand',
        'Services Revenue',
        'Apple Intelligence',
        'India Growth',
        'Capital Return',
      ],
      keyMetrics: [
        { metric: 'Services revenue', value: '$24.2B', yoyChange: '+14% YoY' },
        { metric: 'iPhone revenue', value: '$45.8B', yoyChange: '+2% YoY' },
        { metric: 'Gross margin', value: '46.6%', yoyChange: '+90 bps' },
        { metric: 'India revenue', value: 'All-time high', yoyChange: '+38% YoY' },
      ],
      engagementCopy: 'Same-day delivery · Buy-side ready · Instant PDF',
    },
    {
      title: 'NVIDIA — Q1 FY2026 Earnings Analysis',
      slug: 'nvidia-q1-fy2026-earnings-analysis',
      summary:
        "Deep-dive analysis of NVIDIA's Q1 FY2026 earnings — Blackwell ramp, data centre revenue trajectory, and guidance read-throughs for the AI infrastructure supply chain.",
      executiveSummaryPreview:
        'NVIDIA delivered another double beat with Data Centre revenue running ahead of consensus on Blackwell ramp. Export controls absorbed in guide; sovereign AI deals now 12% of pipeline. Networking revenue inflecting; software ARR crossing $2B run-rate. Margin trajectory holds despite mix.',
      companyName: 'NVIDIA Corporation',
      ticker: 'NVDA',
      exchange: 'NASDAQ',
      quarter: 'Q1',
      fiscalYear: 2026,
      reportDate: '2026-05-28',
      pageCount: 28,
      priceUsd: 99,
      sectorNames: ['Technology / SaaS'],
      companies: ['NVDA'],
      featured: true,
      performanceBadges: ['eps-beat', 'rev-beat'],
      keyTopics: [
        'Data Centre Revenue',
        'Blackwell Ramp',
        'Export Controls',
        'Sovereign AI',
        'Guidance Read-through',
      ],
      keyMetrics: [
        { metric: 'Data Centre revenue', value: '$32.8B', yoyChange: '+89% YoY' },
        { metric: 'Gross margin', value: '75.1%', yoyChange: '+30 bps' },
        { metric: 'Software ARR', value: '$2.1B', yoyChange: 'crossed run-rate' },
        { metric: 'Networking', value: '$3.4B', yoyChange: '+115% YoY' },
      ],
      engagementCopy: 'Same-day delivery · Buy-side ready · Instant PDF',
    },
  ]

  for (const a of ANALYSES) {
    const existing = await payload.find({
      collection: 'earnings-analyses',
      where: { slug: { equals: a.slug } },
      limit: 1,
      depth: 0,
    })
    const sectorIds = a.sectorNames.map((n) => findInd(n)).filter((x): x is string | number => Boolean(x))
    const companyIds = ids(a.companies)
    const data = {
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      executiveSummaryPreview: a.executiveSummaryPreview,
      companyName: a.companyName,
      ticker: a.ticker,
      exchange: a.exchange,
      quarter: a.quarter,
      fiscalYear: a.fiscalYear,
      reportDate: a.reportDate,
      pageCount: a.pageCount,
      priceUsd: a.priceUsd,
      sectors: sectorIds,
      companies: companyIds,
      featured: a.featured,
      performanceBadges: a.performanceBadges,
      keyTopics: a.keyTopics.map((t) => ({ topic: t })),
      keyMetrics: a.keyMetrics,
      engagementCopy: a.engagementCopy,
      complianceBadges: ['mnpi-screened', 'pii-redacted', 'compliance-certified'],
      _status: 'published',
    } as const
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'earnings-analyses', data: data as never })
      console.log(`  + ${a.ticker} · ${a.title.slice(0, 60)}…`)
    } else {
      await payload.update({
        collection: 'earnings-analyses',
        id: (existing.docs[0] as { id: string | number }).id,
        data: data as never,
      })
      console.log(`  ~ ${a.ticker} · ${a.title.slice(0, 60)}…`)
    }
  }
  console.log(`✓ ${ANALYSES.length} earnings analyses upserted.\n`)

  console.log('All done. Visit /admin/collections/expert-transcripts and /admin/collections/earnings-analyses to verify.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Populate failed:', err)
  process.exit(1)
})
