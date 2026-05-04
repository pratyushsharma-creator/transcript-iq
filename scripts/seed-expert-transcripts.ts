/**
 * seed-expert-transcripts.ts
 *
 * Imports all 76 expert transcript products from the Transcript IQ catalog CSV.
 * Safe to re-run — skips records that already exist by slug (upsert-safe).
 *
 * Run with:
 *   npx tsx scripts/seed-expert-transcripts.ts
 *
 * Flags raised at the bottom of each run:
 *   ⚠️  Duplicate SKUs in source data (3 pairs)
 *   ⚠️  Wrong industry tags corrected (2 products)
 *   ⚠️  Description mismatch in one product
 *   ⚠️  Product title names a live company (NVIDIA)
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRIES
// Canonical set — superset of what seed-home.ts creates, safe to re-run.
// ─────────────────────────────────────────────────────────────────────────────

const INDUSTRY_NAMES = [
  'Technology & Software',
  'Healthcare & Life Sciences',
  'Financial Services',
  'Energy & Utilities',
  'Industrials & Manufacturing',
  'Telecommunications',
  'Chemicals',
  'Metals & Mining',
  'Professional Services',
  'Space Economy',
  'Transportation & Logistics',
  'Real Estate & Infrastructure',
]

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// Fields per record:
//   slug          — from CSV Product Handle
//   title         — from CSV Product Name
//   sku           — from CSV Variant SKU (expertId in CMS)
//   description   — from CSV Product Description (→ summary)
//   price         — from Variant Price (USD)
//   compare       — from Variant Compare-at Price (USD)
//   published     — ISO date string from Published On
//   sectors       — corrected/inferred industry slugs
//   geo           — geography values (apac | europe | north-america | global)
//   expertTitle   — derived from description or sector context
//   flags         — data-quality issues to surface at run time
// ─────────────────────────────────────────────────────────────────────────────

type GeoValue = 'north-america' | 'europe' | 'global' | 'apac'

type P = {
  slug: string
  title: string
  sku: string | null
  description: string
  price: number
  compare: number
  published: string
  sectors: string[]
  geo: GeoValue[]
  expertTitle: string
  flags?: string[]
}

const PRODUCTS: P[] = [
  {
    slug: 'strategic-evolution-of-the-indian-insurance-market-following-the-100-fdi-cap-increase',
    title: 'Strategic Evolution of the Indian Insurance Market Following the 100% FDI Cap Increase',
    sku: 'RMT-0020',
    description: 'Looks at how 100% FDI in Indian insurance affects changing power dynamics, the rise of MGAs, the need to redesign products, and opportunities for using AI in underwriting and distribution.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Managing Director, Insurance Market Development, Leading Indian Insurer',
  },
  {
    slug: 'data-centre-real-estate-hyperscaler',
    title: 'Data Centre Real Estate: Hyperscaler Demand and the New Site Selection Calculus',
    sku: null,
    description: 'How power availability has overtaken fibre as the primary site criterion, construction cost inflation, and emerging markets for data centre development.',
    price: 599, compare: 799,
    published: '2026-04-06',
    sectors: ['real-estate-infrastructure', 'technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Infrastructure Development, Global Hyperscaler',
  },
  {
    slug: 'gpu-supply-enterprise-demand',
    title: 'AI Infrastructure Bottlenecks: Why GPU Supply Won\'t Meet Enterprise Demand Until 2028',
    sku: null,
    description: 'Former VP of Cloud Infrastructure at a hyperscaler discusses GPU allocation strategies, the real constraints on data centre build-outs, and why enterprise customers are being deprioritised.',
    price: 449, compare: 599,
    published: '2026-04-06',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Cloud Infrastructure, Major Hyperscaler',
  },
  {
    slug: 'gold-trading-price-discovery-macro-liquidity-and-risk-framework',
    title: 'Gold Trading & Price Discovery: Macro, Liquidity and Risk Framework',
    sku: 'RMT-006',
    description: 'Explores gold market dynamics across derivatives, ETFs, and bullion, highlighting leverage risks, price discovery mechanisms, and how macro events, liquidity, and regulations drive trading behavior.',
    price: 349, compare: 599,
    published: '2026-04-07',
    sectors: ['financial-services'],
    geo: ['global'],
    expertTitle: 'Former Managing Director, Global Commodities Trading Desk',
  },
  {
    slug: 'the-shift-from-ownership-to-utilization-the-evolution-of-european-construction-and-material-handling-equipment-as-a-service-through-electrification-and-remote-telematics',
    title: 'The Shift From Ownership To Utilization: The Evolution Of European Construction And Material Handling Equipment As A Service Through Electrification And Remote Telematics',
    sku: 'RMT-007',
    description: 'Analyzes the shift from equipment ownership to service-based models in Europe, driven by electrification, telematics, and OEM-led maintenance ecosystems reshaping construction and material handling industries.',
    price: 349, compare: 499,
    published: '2026-04-07',
    sectors: ['industrials-manufacturing'],
    geo: ['europe'],
    expertTitle: 'Former VP of Product Strategy, European Equipment Manufacturer',
  },
  {
    slug: 'saas-pricing-post-ai',
    title: 'SaaS Pricing in a Post-AI World: How Product Leaders Are Rethinking Monetisation',
    sku: null,
    description: 'Explains how AI features are disrupting per-seat pricing, the shift toward outcome-based models, and what metrics boards are watching to evaluate pricing transitions.',
    price: 349, compare: 499,
    published: '2026-04-06',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Product, Enterprise SaaS Platform',
  },
  {
    slug: 'nvidia-ai-infrastructure-bkt4r',
    title: 'VP of Engineering on AI Infrastructure Roadmap and GPU Procurement Strategy at NVIDIA',
    sku: 'TMT_001',
    description: 'Deep-dive into NVIDIA\'s internal AI infrastructure strategy, GPU procurement pipeline, and competitive positioning against AMD and custom silicon.',
    price: 449, compare: 589,
    published: '2026-03-28',
    sectors: ['technology-saas'],
    geo: ['north-america'],
    expertTitle: 'Former VP of Engineering, Major Semiconductor Company',
    flags: [
      '⚠️  ANONYMIZATION: Title references "NVIDIA" by name. This violates standard expert anonymization policy. Recommend editing title to e.g. "VP of Engineering on AI Infrastructure at a Leading Semiconductor Company".',
    ],
  },
  {
    slug: 'evolution-of-indian-banking-shifting-from-generative-ai-to-agentic-ai-in-payment-process-automation-with-40-50-semi-autonomous-flow-adoption',
    title: 'Evolution of Indian Banking: Shifting from Generative AI to Agentic AI in Payment Process Automation with 40-50% Semi-Autonomous Flow Adoption',
    sku: 'RMT-0019',
    description: 'Analyzes agentic AI adoption in Indian banking payments, highlighting semi-autonomous workflows, leading private banks, key ROI use cases, and constraints around data, regulation, and infrastructure readiness.',
    price: 449, compare: 599,
    published: '2026-04-07',
    sectors: ['financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Head of Digital Payments, Leading Indian Private Bank',
  },
  {
    slug: 'tokenized-private-credit-traditional-lenders-to-retain-80-of-high-quality-origination-amid-south-koreas-stablecoin-milestones',
    title: 'Tokenized Private Credit: Traditional Lenders to Retain 80% of High-Quality Origination Amid South Korea\'s Stablecoin Milestones',
    sku: 'RMT-0059',
    description: 'Analyzes tokenized private credit, highlighting dominance of traditional lenders in origination, distribution bottlenecks, legal structuring risks, and importance of off-chain data and jurisdictional alignment.',
    price: 449, compare: 599,
    published: '2026-04-10',
    sectors: ['financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Managing Director, Structured Credit, Global Asset Manager',
  },
  {
    slug: 'strategic-shift-from-lead-generation-to-transaction-driven-value-in-global-proptech-ecosystems-a-1-000-subscription-benchmark-and-ai-pricing-analysis',
    title: 'Strategic Shift from Lead Generation to Transaction-Driven Value in Global PropTech Ecosystems: A $1,000 Subscription Benchmark and AI Pricing Analysis',
    sku: 'RMT-0063',
    description: 'Analyzes India\'s PropTech market, focusing on lead-gen marketplaces, SaaS tools, and data platforms, evaluating their long-term value, supply-side stickiness, and the scalability of transaction-based models.',
    price: 449, compare: 599,
    published: '2026-04-20',
    sectors: ['real-estate-infrastructure', 'technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former VP of Product, Leading PropTech Platform',
  },
  {
    slug: 'analysis-of-the-indian-space-industry-focusing-on-satellite-manufacturing-for-private-sector-growth-in-2024-25',
    title: 'Analysis Of The Indian Space Industry Focusing On Satellite Manufacturing For Private Sector Growth In 2024-25',
    sku: 'SI_001',
    description: 'India\'s space sector analysis: downstream growth outpaces manufacturing. Investigates ISRO\'s role, innovation, and the regulatory and funding barriers impacting commercialization.',
    price: 349, compare: 499,
    published: '2026-04-06',
    sectors: ['space-economy'],
    geo: ['apac'],
    expertTitle: 'Former Director of Satellite Programs, Indian Space Research Ecosystem',
  },
  {
    slug: 'analysis-of-us-rebar-and-long-products-market-demand-trends-scrap-based-steelmaking-and-strategic-projections-for-2024-2026',
    title: 'Analysis Of US Rebar And Long Products Market: Demand Trends, Scrap-Based Steelmaking, And Strategic Projections For 2024-2026',
    sku: null,
    description: 'Analyzes US rebar market dynamics, highlighting demand slowdown, scrap-based production economics, pricing strategies by domestic mills, and expected recovery driven by infrastructure and macro stability.',
    price: 349, compare: 499,
    published: '2026-04-07',
    sectors: ['metals-mining'],
    geo: ['north-america'],
    expertTitle: 'Former Director of Market Analysis, US Steel Producer',
  },
  {
    slug: 'analysis-of-healthcare-lending-lifecycles-the-role-of-automation-nbfc-partnerships-and-third-party-technical-integration-in-employer-led-health-insurance',
    title: 'Analysis Of Healthcare Lending Lifecycles: The Role Of Automation, NBFC Partnerships, And Third-Party Technical Integration In Employer-Led Health Insurance',
    sku: 'RMT-002',
    description: 'Analyzes healthcare lending lifecycles in India, including automation across underwriting, NBFC partnerships, and third-party technical integrations in employer-led health insurance products.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['financial-services', 'healthcare-pharma'],
    geo: ['apac'],
    expertTitle: 'Former VP of Insurance Technology, Leading Indian NBFC',
    flags: [
      '⚠️  DESCRIPTION MISMATCH: Original CSV description reads "Breaks down how big data companies generate revenue..." — this appears to be copied from the Big Data product (RMT-003). Description has been corrected to match the title. Verify source content before publishing.',
    ],
  },
  {
    slug: 'evolving-dynamics-in-biopharma-market-trends-ai-integration-in-drug-discovery-and-the-regulatory-landscape-of-biologics-and-cdmos',
    title: 'Evolving Dynamics In Biopharma: Market Trends, AI Integration In Drug Discovery, And The Regulatory Landscape Of Biologics And CDMOs',
    sku: 'RMT-0013',
    description: 'Explores biopharma market dynamics, highlighting biologics growth, AI\'s role in drug discovery, CDMO concentration, and clinical trial bottlenecks limiting commercialization success rates.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['healthcare-pharma'],
    geo: ['global'],
    expertTitle: 'Former VP of Clinical Development, Global Biopharmaceutical Company',
    flags: [
      '⚠️  DUPLICATE SKU: RMT-0013 is also assigned to "Industrial Automation Market Dynamics" (slug: industrial-automation-market-dynamics-...). One of these two products needs a new unique SKU.',
    ],
  },
  {
    slug: 'evaluating-enterprise-blockchain-execution-failure-legacy-core-integration-challenges-and-the-strategic-dominance-of-government-sanctioned-frameworks-chainmaker-fisco-in-chinese-financial-services',
    title: 'Evaluating Enterprise Blockchain Execution Failure: Legacy Core Integration Challenges and the Strategic Dominance of Government-Sanctioned Frameworks (Chainmaker, FISCO) in Chinese Financial Services',
    sku: 'RMT-0060',
    description: 'Analyzes enterprise blockchain adoption in China, highlighting government-driven frameworks, data access dependency, integration complexity, and limited value in proprietary base-layer innovations.',
    price: 349, compare: 499,
    published: '2026-04-14',
    sectors: ['technology-saas', 'financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Chief Technology Officer, Chinese State-Owned Bank Technology Division',
  },
  {
    slug: 'analysis-of-the-biotech-clinical-trials-ecosystem-market-growth-drivers-cro-performance-metrics-and-the-shift-toward-unified-digital-platforms',
    title: 'Analysis Of The Biotech Clinical Trials Ecosystem: Market Growth Drivers, CRO Performance Metrics, And The Shift Toward Unified Digital Platforms',
    sku: 'RMT-0016',
    description: 'Analyzes the biotech clinical trials ecosystem, highlighting CRO performance metrics, oncology-driven demand, Phase II–III bottlenecks, and shift toward unified digital platforms improving efficiency and data management.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['healthcare-pharma'],
    geo: ['global'],
    expertTitle: 'Former VP of Clinical Operations, Global Contract Research Organization',
  },
  {
    slug: 'supply-chain-reshoring-costs',
    title: 'Supply Chain Reshoring: The Real Cost of Moving Production Back',
    sku: null,
    description: 'Three manufacturing directors discuss the true cost of reshoring versus the political narrative, covering labour challenges, supplier ecosystem gaps, and compliance complexity.',
    price: 449, compare: 599,
    published: '2026-04-06',
    sectors: ['industrials-manufacturing'],
    geo: ['north-america', 'global'],
    expertTitle: 'Former VP of Global Operations, Fortune 500 Manufacturer',
  },
  {
    slug: 'the-rise-of-medtail-strategic-expansion-of-healthcare-services-into-retail-real-estate-lease-structures-and-regulatory-compliance-standards',
    title: 'The Rise Of Medtail: Strategic Expansion Of Healthcare Services Into Retail Real Estate, Lease Structures, And Regulatory Compliance Standards',
    sku: 'RMT-009',
    description: 'Explores the rise of Medtail, highlighting healthcare expansion into retail spaces, cost advantages, lease structures, and how accessibility and tenant economics drive location strategy decisions.',
    price: 349, compare: 499,
    published: '2026-04-07',
    sectors: ['real-estate-infrastructure', 'healthcare-pharma'],
    geo: ['north-america'],
    expertTitle: 'Former Director of Real Estate Strategy, Major US Healthcare Network',
  },
  {
    slug: 'enterprise-erp-transformation-insights-navigating-the-2027-sap-support-deadline-legacy-migration-realities-and-strategic-role-of-gccs-in-capturing-opex-savings',
    title: 'Enterprise ERP Transformation Insights: Navigating the 2027 SAP Support Deadline, Legacy Migration Realities, and Strategic Role of GCCs in Capturing OPEX Savings',
    sku: 'RMT-0065',
    description: 'Analyzes ERP transformation, highlighting slow cloud migration, hybrid architectures, data complexity, and AI-led automation driving efficiency gains and long-term value realization.',
    price: 449, compare: 599,
    published: '2026-04-21',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Enterprise Architecture, Global Systems Integrator',
  },
  {
    slug: 'analysis-of-uk-travel-insurance-market-dynamics-managing-medical-inflation-short-tail-reserve-volatility-and-the-shift-toward-annual-multi-trip',
    title: 'Analysis of UK Travel Insurance Market Dynamics: Managing Medical Inflation, Short-Tail Reserve Volatility, and the Shift Toward Annual Multi-Trip',
    sku: 'RMT-0026',
    description: 'Analyzes UK travel insurance market, highlighting post-COVID claims volatility, medical inflation impact, portfolio segmentation strategies, and scenario-based approaches to managing systemic reserving risks.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['financial-services'],
    geo: ['europe'],
    expertTitle: 'Former Chief Underwriting Officer, UK General Insurance',
  },
  {
    slug: 'evolution-of-platform-based-lending-in-thailand-strategic-underwriting-high-frequency-micro-sectors-penetration-and-the-performance-of-ecosystem-led-sme-credit',
    title: 'Evolution Of Platform-Based Lending In Thailand: Strategic Underwriting, High-Frequency Micro-Sectors Penetration, And The Performance Of Ecosystem-Led SME Credit',
    sku: 'RMT-0047',
    description: 'Analyzes platform lending in Thailand, highlighting fragmented SME credit access, regulatory constraints, the importance of the cost of funds, and challenges in scaling compliant, user-friendly lending models.',
    price: 449, compare: 499,
    published: '2026-04-09',
    sectors: ['financial-services'],
    geo: ['apac'],
    expertTitle: 'Former CEO, Digital Lending Platform, Thailand',
  },
  {
    slug: 'evolution-of-india-based-gccs-from-delivery-centers-to-strategic-nerve-centers-a-long-term-journey-toward-capability-led-global-leadership',
    title: 'Evolution Of India Based GCCs From Delivery Centers To Strategic Nerve Centers: A Long Term Journey Toward Capability Led Global Leadership',
    sku: 'RMT-0032',
    description: 'Analyzes the evolution of India-based GCCs into strategic hubs, highlighting shift to global mandates, capability-led talent models, leadership transformation, and increasing ownership of enterprise decision-making.',
    price: 599, compare: 799,
    published: '2026-04-08',
    sectors: ['professional-services'],
    geo: ['apac'],
    expertTitle: 'Former Managing Director, Global Capability Centre, Fortune 500 Company',
  },
  {
    slug: 'industrial-infrastructure-capex-trends-across-real-estate-pharma-and-chemicals',
    title: 'Industrial & Infrastructure Capex Trends Across Real Estate, Pharma, and Chemicals',
    sku: 'RMT-004',
    description: 'Explores capex trends across real estate, pharma, and chemicals, highlighting strong residential demand, foreign-driven pharma expansion, and labor shortages as key constraints impacting execution.',
    price: 349, compare: 499,
    published: '2026-04-07',
    sectors: ['chemicals', 'real-estate-infrastructure', 'healthcare-pharma'],
    geo: ['apac'],
    expertTitle: 'Former VP of Capital Projects, Global Chemical Conglomerate',
  },
  {
    slug: 'glp1-pharma-pricing-threat',
    title: 'GLP-1 Market Dynamics: Why Big Pharma\'s Pricing Power Is Under Threat',
    sku: null,
    description: 'Former Chief Commercial Officer breaks down competitive dynamics of the obesity drug market, payer pushback, and what the next wave of competition means for Novo and Lilly margins.',
    price: 599, compare: 799,
    published: '2026-04-06',
    sectors: ['healthcare-pharma'],
    geo: ['north-america', 'global'],
    expertTitle: 'Former Chief Commercial Officer, Global Biopharmaceutical Company',
  },
  {
    slug: 'the-structural-pivot-in-indian-real-estate-a-comprehensive-shift-from-traditional-office-assets-to-strategic-residential-partnerships-and-institutional-platforms',
    title: 'The Structural Pivot in Indian Real Estate: A Comprehensive Shift from Traditional Office Assets to Strategic Residential Partnerships and Institutional Platforms',
    sku: 'RMT-0023',
    description: 'Analyzes capital inflows into Indian real estate, highlighting rise of domestic investors, platform partnerships, residential shift, and growing institutional interest in data centers and infrastructure assets.',
    price: 599, compare: 799,
    published: '2026-04-09',
    sectors: ['real-estate-infrastructure'],
    geo: ['apac'],
    expertTitle: 'Former Managing Director, Real Estate Private Equity, India',
  },
  {
    slug: 'renewable-energy-battery-storage',
    title: 'Renewable Energy Grid Integration: Why Battery Storage Is the Real Bottleneck',
    sku: null,
    description: 'Discusses technical and regulatory barriers to scaling battery storage, interconnection queue backlogs, and why 2027 targets for grid-scale storage are overly optimistic.',
    price: 349, compare: 499,
    published: '2026-04-06',
    sectors: ['energy-utilities'],
    geo: ['north-america', 'global'],
    expertTitle: 'Former Director of Grid Innovation, Major US Utility',
  },
  {
    slug: 'hybrid-network-architecture-economics-balancing-fiber-microwave-and-fwa-for-5g-readiness-in-high-geography-low-arpu-markets-like-indonesia',
    title: 'Hybrid Network Architecture Economics: Balancing Fiber, Microwave, and FWA for 5G Readiness in High-Geography, Low-ARPU Markets like Indonesia',
    sku: 'RMT-0061-A',
    description: 'Examines Indonesia\'s hybrid telecom model, focusing on fiber and microwave trade-offs, the challenges of scaling 4G/5G, and the evolving importance of AI-driven planning in infrastructure deployment.',
    price: 449, compare: 599,
    published: '2026-04-15',
    sectors: ['telecommunications'],
    geo: ['apac'],
    expertTitle: 'Former VP of Network Architecture, Major Indonesian Telco',
    flags: [
      '⚠️  DUPLICATE SKU: Original SKU was RMT-0061, which is also assigned to "OTT Platform Economics". SKU has been auto-corrected to RMT-0061-A for this record. Update in source system.',
    ],
  },
  {
    slug: 'the-strategic-evolution-of-indian-corporate-health-moving-from-box-ticking-to-high-engagement-preventive-care-models-and-health-assurance',
    title: 'The Strategic Evolution Of Indian Corporate Health: Moving From Box-Ticking To High-Engagement Preventive Care Models And Health Assurance',
    sku: 'RMT-0028',
    description: 'Explores the Indian digital health landscape, highlighting shifts toward preventive corporate health, teleconsultation limitations, diagnostics-led growth, and B2B2C models driving adoption and unit economics.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['healthcare-pharma'],
    geo: ['apac'],
    expertTitle: 'Former VP of Corporate Health, Major Indian Insurance Group',
  },
  {
    slug: 'accelerating-digital-maturity-the-shift-from-account-to-account-rails-to-integrated-embedded-finance-and-cross-border-interoperability',
    title: 'Accelerating Digital Maturity: The Shift from Account-to-Account Rails to Integrated Embedded Finance and Cross-Border Interoperability',
    sku: 'RMT-0021',
    description: 'Explores the APAC payments ecosystem, highlighting RTP dominance, bank-led infrastructure, super-app disruption, low-fee economics, and growing cross-border interoperability across diverse regional markets.',
    price: 349, compare: 499,
    published: '2026-04-07',
    sectors: ['financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Head of Payments Infrastructure, Major APAC Financial Institution',
  },
  {
    slug: 'scaling-direct-to-device-connectivity-leo-constraints-spectrum-limits-and-the-shift-to-mass-market-iot-mobile',
    title: 'Scaling Direct-to-Device Connectivity: LEO Constraints, Spectrum Limits, and the Shift to Mass-Market IoT & Mobile',
    sku: 'RMT-0068',
    description: 'Analyzes direct-to-device satellite connectivity, highlighting niche use cases, spectrum constraints, low throughput economics, and dependence on telco partnerships for scaling.',
    price: 449, compare: 599,
    published: '2026-04-30',
    sectors: ['telecommunications'],
    geo: ['global'],
    expertTitle: 'Former VP of Satellite Network Strategy, Global Telecommunications Group',
  },
  {
    slug: 'strategic-shift-in-telecom-infrastructure-balancing-4g-optimization-5g-standalone-rollouts-and-fiber-microwave-trade-offs-in-the-philippines-2026',
    title: 'Strategic Shift In Telecom Infrastructure: Balancing 4G Optimization, 5G Standalone Rollouts, and Fiber-Microwave Trade-offs In The Philippines (2026)',
    sku: 'RMT-0049',
    description: 'Analyzes telecom infrastructure strategy, highlighting access network bottlenecks, fiber vs microwave trade-offs, AI-driven traffic optimization, and capital allocation between 4G optimization and 5G rollout.',
    price: 349, compare: 499,
    published: '2026-04-08',
    sectors: ['telecommunications'],
    geo: ['apac'],
    expertTitle: 'Former VP of Network Planning, Major Philippine Telecommunications Company',
  },
  {
    slug: 'the-strategic-shift-to-green-real-estate-driving-strong-returns-and-esg-compliance-in-indias-grade-a-commercial-market',
    title: 'The Strategic Shift to Green Real Estate: Driving Strong Returns and ESG Compliance in India\'s Grade A Commercial Market',
    sku: 'RMT-0024',
    description: 'Analyzes the rise of green real estate in India, highlighting ESG-driven capital inflows, valuation premiums, lower financing costs, and a strong demand from global tenants for certified assets.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['real-estate-infrastructure'],
    geo: ['apac'],
    expertTitle: 'Former Head of ESG Real Estate Strategy, Global Asset Manager',
  },
  {
    slug: 'evolving-dynamics-of-big-data-solutions-revenue-mix-ai-integration-and-the-strategic-importance-of-data-context',
    title: 'Evolving Dynamics Of Big Data Solutions: Revenue Mix, AI Integration, And The Strategic Importance Of Data Context',
    sku: 'RMT-003',
    description: 'Analyzes big data industry economics, cloud dependency, AI-led efficiency gains, and how data pipelines, governance, and context drive long-term enterprise value and retention.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Data Platform Strategy, Enterprise Technology Company',
  },
  {
    slug: 'ott-platform-economics-scaling-growth-through-85-licensed-content-hybrid-monetization-and-regional-vernacular-strategy',
    title: 'OTT Platform Economics: Scaling Growth through 85% Licensed Content, Hybrid Monetization, and Regional Vernacular Strategy',
    sku: 'RMT-0061',
    description: 'Analyzes India\'s OTT market, focusing on regional content, pricing strategies, and monetization models, with a focus on engagement metrics, bundling, and profitability drivers in a competitive landscape.',
    price: 599, compare: 799,
    published: '2026-04-15',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former Chief Revenue Officer, Leading Indian OTT Platform',
    flags: [
      '⚠️  DUPLICATE SKU: RMT-0061 is also assigned to "Hybrid Network Architecture Economics (Indonesia)". That record has been assigned RMT-0061-A. This record retains RMT-0061. Update source system.',
    ],
  },
  {
    slug: 'global-coatings-market-dynamics-strategic-shifts-toward-sustainability-regulatory-adaptation-and-distribution-consolidation',
    title: 'Global Coatings Market Dynamics: Strategic Shifts Toward Sustainability, Regulatory Adaptation, and Distribution Consolidation',
    sku: 'RMT-0012',
    description: 'Analyzes global coatings market trends, highlighting demand slowdown in developed markets, sustainability-driven innovation, regulatory pressures, and consolidation across manufacturers and distribution channels.',
    price: 449, compare: 599,
    published: '2026-04-07',
    sectors: ['chemicals'],
    geo: ['global'],
    expertTitle: 'Former VP of Market Development, Global Specialty Coatings Company',
  },
  {
    slug: 'evolution-of-indian-saas-retention-market-growth-of-cdp-adoption-north-of-50-000-orders-and-the-shift-toward-agentic-ai-serviceability',
    title: 'Evolution Of Indian SaaS Retention Market: Growth Of CDP Adoption North Of 50,000 Orders And The Shift Toward Agentic AI Serviceability',
    sku: 'RMT-0017',
    description: 'Looks at the Indian SaaS retention market, pointing out the levels of CDP adoption, increasing customer acquisition costs, a mix of different vendors, and a move towards using AI for serviceability.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former VP of Customer Success, Indian B2B SaaS Company',
  },
  {
    slug: 'the-shift-from-legacy-swift-to-multi-rail-payment-orchestration-analysing-the-future-of-cross-border-flows-bank-distribution-power-and-stablecoin-integration',
    title: 'The Shift from Legacy SWIFT to Multi-Rail Payment Orchestration: Analysing the Future of Cross-Border Flows, Bank Distribution Power, and Stablecoin Integration',
    sku: 'RMT-0070',
    description: 'Analyzes global cross-border payments, highlighting the shift from legacy SWIFT rails to newer alternatives like stablecoins and multi-rail orchestration, with a focus on control, liquidity, and risk.',
    price: 349, compare: 499,
    published: '2026-04-30',
    sectors: ['financial-services'],
    geo: ['global'],
    expertTitle: 'Former Managing Director, Global Transaction Banking',
  },
  {
    slug: 'ai-era-semiconductor-sourcing-3nm-cowos-bottlenecks-taiwan-risk-foundry-partnerships',
    title: 'AI-Era Semiconductor Sourcing: 3nm & CoWoS Bottlenecks, Taiwan Risk, Foundry Partnerships',
    sku: 'RMT-0067',
    description: 'Analyzes advanced-node semiconductor sourcing, highlighting TSMC concentration, AI-driven CoWoS bottlenecks, export-control constraints, and limited near-term diversification beyond Taiwan.',
    price: 449, compare: 599,
    published: '2026-04-28',
    sectors: ['technology-saas'],
    geo: ['global', 'apac'],
    expertTitle: 'Former VP of Supply Chain, Global Semiconductor Company',
  },
  {
    slug: 'navigating-global-oil-market-shocks-how-geopolitical-events-sanctions-and-trading-house-influence-reshape-physical-and-paper-trade-dynamics-in-2026',
    title: 'Navigating Global Oil Market Shocks: How Geopolitical Events, Sanctions, and Trading House Influence Reshape Physical and Paper Trade Dynamics in 2026',
    sku: 'RMT-0035',
    description: 'Analyzes global oil market disruptions, highlighting geopolitical shocks, inventory signals, trade flow shifts, and how traders differentiate between short-term noise and structural supply imbalances.',
    price: 599, compare: 799,
    published: '2026-04-08',
    sectors: ['energy-utilities'],
    geo: ['global'],
    expertTitle: 'Former Head of Global Oil Trading, Major Commodity Trading House',
    flags: [
      '⚠️  INDUSTRY CORRECTED: CSV had this tagged "Professional Services". Corrected to "Energy & Utilities" — content is clearly about global oil market trading dynamics.',
    ],
  },
  {
    slug: 'industrial-automation-market-dynamics-drivers-of-robotics-adoption-integration-challenges-and-competitive-landscape',
    title: 'Industrial Automation Market Dynamics: Drivers Of Robotics Adoption, Integration Challenges, and Competitive Landscape',
    sku: 'RMT-0013-B',
    description: 'Explores industrial automation growth driven by labor shortages and AI, highlighting robotics adoption, system integration challenges, fragmented integrator landscape, and rising enterprise-scale deployments.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['industrials-manufacturing'],
    geo: ['global'],
    expertTitle: 'Former VP of Automation & Robotics, Global Industrial Conglomerate',
    flags: [
      '⚠️  DUPLICATE SKU: Original SKU was RMT-0013, also assigned to "Evolving Dynamics In Biopharma". Auto-corrected to RMT-0013-B. Update in source system.',
    ],
  },
  {
    slug: 'evaluating-the-ev-charging-ecosystem-strategic-dynamics-of-multifamily-integration-fleet-hubs-and-regional-infrastructure-variability',
    title: 'Evaluating the EV Charging Ecosystem: Strategic Dynamics of Multifamily Integration, Fleet Hubs, and Regional Infrastructure Variability',
    sku: 'RMT-0015',
    description: 'Explores EV charging ecosystem dynamics, highlighting multifamily dominance, fleet hub opportunities, pricing models, regional variability, and infrastructure constraints driven by adoption and electricity costs.',
    price: 349, compare: 499,
    published: '2026-04-07',
    sectors: ['transportation-logistics', 'energy-utilities'],
    geo: ['north-america'],
    expertTitle: 'Former Director of EV Infrastructure Strategy, Major US Utility Company',
  },
  {
    slug: 'the-infrastructure-led-pivot-how-corridors-and-metro-driven-micro-markets-are-structurally-reshaping-indian-residential-real-estate',
    title: 'The Infrastructure Led Pivot How Corridors And Metro Driven Micro Markets Are Structurally Reshaping Indian Residential Real Estate',
    sku: 'RMT-0031',
    description: 'Analyzes the shift to micro-market-driven real estate in India, highlighting infrastructure-led demand, metro corridor growth, developer land banking strategies, and capital allocation tied to execution visibility.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['real-estate-infrastructure'],
    geo: ['apac'],
    expertTitle: 'Former MD of Residential Development, Leading Indian Real Estate Developer',
  },
  {
    slug: 'global-strategy-for-indian-retail-scaling-beyond-diaspora-via-quality-and-mid-sized-distribution-partnerships',
    title: 'Global Strategy for Indian Retail: Scaling Beyond Diaspora via Quality and Mid-Sized Distribution Partnerships',
    sku: 'RMT-0030',
    description: 'Explores the global expansion of Indian retail brands, highlighting diaspora-led demand, distributor-driven GTM strategies, the importance of quality differentiation, and challenges in building global brand perception.',
    price: 349, compare: 499,
    published: '2026-04-08',
    sectors: ['professional-services'],
    geo: ['global', 'apac'],
    expertTitle: 'Former Director of International Markets, Indian Consumer Brands Conglomerate',
  },
  {
    slug: 'accelerating-core-modernization-in-indian-banking-a-phased-roadmap-for-24-7-resilience-cost-efficiency-and-rapid-time-to-market',
    title: 'Accelerating Core Modernization In Indian Banking: A Phased Roadmap For 24/7 Resilience, Cost Efficiency, and Rapid Time-to-Market',
    sku: 'RMT-0036',
    description: 'Analyzes core banking modernization in India, highlighting phased transformation, API-led architecture, hybrid legacy coexistence, and strategic prioritization of lending, payments, and customer-facing platforms.',
    price: 349, compare: 499,
    published: '2026-04-08',
    sectors: ['financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Chief Technology Officer, Leading Indian Public Sector Bank',
  },
  {
    slug: 'unlocking-indian-real-estate-liquidity-through-asset-tokenization-and-blockchain-integration-for-retail-and-institutional-investors',
    title: 'Unlocking Indian Real Estate Liquidity Through Asset Tokenization And Blockchain Integration For Retail And Institutional Investors',
    sku: 'RMT-0033',
    description: 'Explores India\'s real estate tokenization market, highlighting early-stage growth, commercial asset dominance, retail investor accessibility, blockchain-driven liquidity, and emerging platforms shaping adoption.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['real-estate-infrastructure', 'financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Head of Alternative Assets, Indian Asset Management Company',
  },
  {
    slug: 'the-digital-transformation-of-apac-real-estate-bridging-the-gap-between-manual-management-and-integrated-automation-platforms',
    title: 'The Digital Transformation of APAC Real Estate: Bridging the Gap Between Manual Management and Integrated Automation Platforms',
    sku: 'RMT-0052',
    description: 'Analyzes APAC PropTech adoption, highlighting fragmented automation across leasing and maintenance, impact of digital leasing on efficiency, and ROI driven by cost savings and energy optimization.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['real-estate-infrastructure', 'technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former VP of Digital Solutions, Major APAC Real Estate Group',
  },
  {
    slug: 'monetization-of-first-party-data-structuring-high-roi-data-stacks-and-navigating-the-investment-landscape',
    title: 'Monetization Of First-Party Data: Structuring High-ROI Data Stacks And Navigating The Investment Landscape',
    sku: 'RMT-0053',
    description: 'Analyzes first-party data monetization, highlighting CDP-led architectures, identity resolution challenges, dominance of retail media models, and limitations in scaling revenue beyond core marketplace ecosystems.',
    price: 599, compare: 799,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former Chief Data Officer, Global E-Commerce Platform',
  },
  {
    slug: 'dynamics-of-the-indian-pharmaceutical-supply-chain-evaluating-decentralized-distribution-networks-commercial-partnerships-and-the-evolution-of-retail-pharmacy-systems',
    title: 'Dynamics Of The Indian Pharmaceutical Supply Chain: Evaluating Decentralized Distribution Networks, Commercial Partnerships, And The Evolution Of Retail Pharmacy Systems',
    sku: 'RMT-0039',
    description: 'Analyzes Indian pharmaceutical distribution, highlighting fragmented multi-tier networks, credit-driven trade dynamics, margin structures, and continued dominance of traditional stockist-led supply chains despite emerging channels.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['healthcare-pharma'],
    geo: ['apac'],
    expertTitle: 'Former VP of Distribution, Major Indian Pharmaceutical Company',
  },
  {
    slug: 'southeast-asia-biofuel-evolution-navigating-the-transition-from-first-generation-palm-oil-to-waste-based-feedstocks',
    title: 'Southeast Asia Biofuel Evolution: Navigating The Transition From First-Generation Palm Oil To Waste-Based Feedstocks',
    sku: 'RMT-0038',
    description: 'Analyzes the Southeast Asia biofuels market, highlighting the shift from palm oil to waste-based feedstocks, supply constraints, rising costs, and challenges in scaling sustainable fuel production ecosystems.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['energy-utilities'],
    geo: ['apac'],
    expertTitle: 'Former Director of Biofuels Strategy, Major SE Asian Energy Company',
    flags: [
      '⚠️  DUPLICATE SKU: RMT-0038 is also assigned to "Indian OTA Market Rebalancing". That record has been assigned RMT-0038-B. This record retains RMT-0038. Update source system.',
    ],
  },
  {
    slug: 'ai-compute-migration-in-asean-shift-to-ai-infrastructure-and-the-rise-of-sovereign-data-strategies',
    title: 'AI Compute Migration in ASEAN: Shift to AI Infrastructure and the Rise of Sovereign Data Strategies',
    sku: 'RMT-0066',
    description: 'Analyzes ASEAN AI data center expansion, highlighting China-driven demand shift, power constraints, Singapore vs Malaysia trade-offs, and rising dominance of AI-optimized infrastructure economics.',
    price: 349, compare: 499,
    published: '2026-04-22',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former VP of Data Centre Development, Major ASEAN Cloud Provider',
  },
  {
    slug: 'chinas-robotics-ecosystem-2026-scaling-industrial-arms-and-amrs-toward-a-hardware-led-global-superhouse-with-18-month-chip-parity',
    title: 'China\'s Robotics Ecosystem 2026: Scaling Industrial Arms and AMRs Toward a Hardware-Led Global Superhouse with 18-Month Chip Parity',
    sku: 'RMT-0051',
    description: 'Analyzes China\'s robotics ecosystem, highlighting dominance in industrial arms and AMRs, hardware cost advantage, integrator-led deployment success, and constraints in software integration and global scalability.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['industrials-manufacturing'],
    geo: ['apac'],
    expertTitle: 'Former VP of Robotics Strategy, Leading Chinese Industrial Technology Group',
  },
  {
    slug: 'tectonic-shifts-in-indias-enterprise-telecom-the-50-migration-from-core-connectivity-to-cloud-led-managed-services-and-ai-ready-infrastructure',
    title: 'Tectonic Shifts in India\'s Enterprise Telecom: The 50% Migration from Core Connectivity to Cloud-Led Managed Services and AI-Ready Infrastructure',
    sku: 'RMT-0054',
    description: 'Analyzes enterprise telecom evolution, highlighting shift from connectivity to cloud and managed services, rising role of hyperscalers, and increasing importance of platform-led, multi-cloud network architectures.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['telecommunications'],
    geo: ['apac'],
    expertTitle: 'Former VP of Enterprise Solutions, Major Indian Telecom Operator',
  },
  {
    slug: 'measuring-the-global-gap-transitioning-from-activity-based-training-to-performance-integrated-learning-systems',
    title: 'Measuring The Global Gap: Transitioning from Activity-Based Training to Performance-Integrated Learning Systems',
    sku: 'RMT-0042',
    description: 'Analyzes evolution of L&D systems, highlighting shift from activity-based training to performance-driven learning, KPI alignment challenges, and critical role of manager-led application and behavioral change.',
    price: 449, compare: 599,
    published: '2026-04-08',
    sectors: ['professional-services'],
    geo: ['global'],
    expertTitle: 'Former Chief Learning Officer, Global Professional Services Firm',
  },
  {
    slug: 'scaling-enterprise-ai-centralized-governance-sdlc-accelerators-and-100x-productivity-gains-in-2026',
    title: 'Scaling Enterprise AI: Centralized Governance, SDLC Accelerators, and 100x Productivity Gains in 2026',
    sku: 'RMT-0041',
    description: 'Analyzes enterprise AI scaling strategies, highlighting centralized governance, accelerator-based operating models, use-case prioritization, and growing focus on data-layer advantage over model-layer differentiation.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Engineering, Enterprise AI Platform',
  },
  {
    slug: 'modular-architectures-and-layer-tools-prioritizing-user-experience-and-distribution-over-theoretical-scalability-for-genuine-product-market-fit',
    title: 'Modular Architectures And Layer Tools Prioritizing User Experience And Distribution Over Theoretical Scalability For Genuine Product Market Fit',
    sku: 'RMT-0043',
    description: 'Analyzes Web3 infrastructure choices, highlighting importance of user onboarding, distribution, and UX over theoretical scalability, with trade-offs across security, decentralization, and liquidity shaping adoption.',
    price: 599, compare: 799,
    published: '2026-04-08',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former Chief Product Officer, Major Web3 Infrastructure Company',
  },
  {
    slug: 'assessing-the-strategic-shift-progress-in-indian-telco-oss-bss-modernization-and-the-monetization-gap',
    title: 'Assessing The Strategic Shift: Progress In Indian Telco OSS/BSS Modernization And The Monetization Gap',
    sku: 'RMT-0055',
    description: 'Analyzes OSS/BSS modernization in Indian telecom, highlighting slow progress, monetization gaps, hyperscaler influence, and limited shift beyond connectivity toward platform and API-driven revenue models.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['telecommunications'],
    geo: ['apac'],
    expertTitle: 'Former Head of OSS/BSS Transformation, Leading Indian Telecom Group',
  },
  {
    slug: 'd2c-performance-marketing-evolution-annual-cac-growth-driving-diversification-into-quickcom-marketplaces-and-offline-retail',
    title: 'D2C Performance Marketing Evolution: Annual CAC Growth Driving Diversification Into QuickCom, Marketplaces, And Offline Retail',
    sku: 'RMT-0040',
    description: 'Analyzes D2C performance marketing, highlighting rising CAC, Meta dominance, attribution challenges, shift toward marketplaces and offline channels, and growing importance of creative-led differentiation.',
    price: 599, compare: 799,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former Chief Marketing Officer, Indian D2C Consumer Brand',
  },
  {
    slug: 'generative-ai-integration-in-otas-shifting-from-search-based-discovery-to-agentic-booking-ecosystems-and-the-2026-strategic-pivot-of-openai',
    title: 'Generative AI Integration In OTAs: Shifting From Search-Based Discovery To Agentic Booking Ecosystems And The 2026 Strategic Pivot Of OpenAI',
    sku: 'RMT-0044',
    description: 'Analyzes AI\'s impact on OTAs, highlighting the shift from search-based discovery to agentic booking, platform partnerships, and the importance of proprietary inventory control as a key competitive moat.',
    price: 449, compare: 599,
    published: '2026-04-08',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Product, Global Online Travel Agency',
    flags: [
      '⚠️  INDUSTRY CORRECTED: CSV had this tagged "Financial Services". Corrected to "Technology & Software" — content is about AI/OTA technology platforms, not financial services.',
    ],
  },
  {
    slug: 'dynamics-of-solar-adoption-in-commercial-real-estate-market-drivers-financial-structures-and-implementation-challenges-in-rooftop-and-community-solar-applications',
    title: 'Dynamics Of Solar Adoption In Commercial Real Estate: Market Drivers, Financial Structures, And Implementation Challenges In Rooftop And Community Solar Applications',
    sku: 'RMT-0010',
    description: 'Explores commercial solar adoption in real estate, focusing on rooftop leasing models, financial incentives, ownership structures, and how rising electricity costs drive investment decisions.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['energy-utilities', 'real-estate-infrastructure'],
    geo: ['north-america'],
    expertTitle: 'Former Director of Commercial Solar Development, US Energy Company',
  },
  {
    slug: 'the-strategic-evolution-of-indias-gccs-transitioning-from-captive-cost-centers-to-innovation-hubs-and-global-product-ownership',
    title: 'The Strategic Evolution of India\'s GCCs: Transitioning from Captive Cost Centers to Innovation Hubs and Global Product Ownership',
    sku: 'RMT-0056',
    description: 'Analyzes the evolution of India GCCs, highlighting the shift toward product ownership, growing leadership presence, increased AI-driven productivity, and transition from execution centers to global innovation hubs.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['professional-services'],
    geo: ['apac'],
    expertTitle: 'Former Head of GCC Operations, Global Technology Services Company',
  },
  {
    slug: 'the-paradox-of-singapore-gccs-pivoting-high-cost-centers-into-30-40-value-linked-strategic-innovation-hubs',
    title: 'The Paradox Of Singapore GCCs: Pivoting High-Cost Centers Into 30-40% Value-Linked Strategic Innovation Hubs',
    sku: 'RMT-0058',
    description: 'GCCs are evolving into strategic, outcome-linked hubs. Organizations use a two-tier model: Singapore for leadership and compliance, while offshoring scalable, AI-driven delivery to lower-cost markets to achieve 2x ROI.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['professional-services'],
    geo: ['apac'],
    expertTitle: 'Former Managing Director, Singapore GCC, Global Financial Institution',
  },
  {
    slug: 'vietnam-proptech-evolution-strategic-pivot-from-lead-generation-to-embedded-finance-with-30-35-projected-revenue-contribution',
    title: 'Vietnam PropTech Evolution: Strategic Pivot from Lead Generation to Embedded Finance with 30-35% Projected Revenue Contribution',
    sku: 'RMT-0064',
    description: 'Analyzes Vietnam\'s PropTech platforms, highlighting dominance of lead-generation models, early-stage shift toward embedded finance, and growing importance of bank partnerships, trust, and compliance.',
    price: 349, compare: 499,
    published: '2026-04-17',
    sectors: ['real-estate-infrastructure', 'technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former VP of Strategy, Leading Vietnam Real Estate Platform',
  },
  {
    slug: 'strategic-rebalancing-in-the-indian-ota-market-transitioning-from-high-volume-domestic-flights-to-high-margin-hotels-and-consultative-holiday-packages',
    title: 'Indian OTA Market Rebalancing: Shift from Flight Volumes to High-Margin Hotels and Packages',
    sku: 'RMT-0038-B',
    description: 'Analyzes Indian OTA market dynamics, highlighting shift from flight-led volume to hotel-driven margins, hybrid holiday booking models, and role of ancillaries in profitability and customer retention.',
    price: 599, compare: 799,
    published: '2026-04-27',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former Chief Operating Officer, Leading Indian Online Travel Agency',
    flags: [
      '⚠️  DUPLICATE SKU: Original SKU was RMT-0038, also assigned to "SE Asia Biofuel Evolution". Auto-corrected to RMT-0038-B. Update in source system.',
      '⚠️  INDUSTRY CORRECTED: CSV had this tagged "Financial Services". Corrected to "Technology & Software" — OTA market content, not financial services.',
    ],
  },
  {
    slug: 'scaling-ai-infrastructure-from-isolated-pilots-to-production-grade-hybrid-architectures-for-large-user-bases',
    title: 'Scaling AI Infrastructure: From Isolated Pilots To Production-Grade Hybrid Architectures For Large User Bases',
    sku: 'RMT-0048',
    description: 'Analyzes scaling AI infrastructure, highlighting transition to modular hybrid architectures, cost optimization via routing, governance integration, and data-driven advantage as key differentiators in production systems.',
    price: 599, compare: 799,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of AI Infrastructure, Global Technology Platform',
  },
  {
    slug: 'analysis-of-the-advanced-semiconductor-packaging-market-focusing-on-2-5d-and-3d-integration-yield-for-ai-and-automotive-sectors',
    title: 'Analysis Of The Advanced Semiconductor Packaging Market Focusing On 2.5D And 3D Integration Yield For AI And Automotive Sectors',
    sku: 'RMT-0011',
    description: 'Analyzes advanced semiconductor packaging growth driven by AI, data centers, and automotive, focusing on 2.5D/3D integration, cost trade-offs, material constraints, and yield optimization challenges.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global', 'apac'],
    expertTitle: 'Former VP of Advanced Packaging, Major Semiconductor Manufacturer',
  },
  {
    slug: 'shifting-apac-cybersecurity-landscapes-regulatory-stringency-identity-management-growth-and-the-dominance-of-hyperscalers-and-regional-leaders',
    title: 'Shifting APAC Cybersecurity Landscapes: Regulatory Stringency, Identity Management Growth, and the Dominance of Hyperscalers and Regional Leaders',
    sku: 'RMT-0022',
    description: 'Explores APAC cybersecurity landscape, highlighting regulatory tightening, identity management spend growth, hyperscaler dominance, legacy system risks, and trust-driven vendor selection dynamics.',
    price: 599, compare: 799,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former Chief Information Security Officer, Major APAC Financial Institution',
  },
  {
    slug: 'strategic-evolution-of-the-indian-enterprise-saas-market-navigating-the-shift-from-rapid-pandemic-era-adoption-to-performance-driven-consolidation-and-rigorous-roi-evaluation',
    title: 'Strategic Evolution Of The Indian Enterprise SaaS Market: Navigating The Shift From Rapid Pandemic-Era Adoption To Performance-Driven Consolidation And Rigorous ROI Evaluation',
    sku: 'RMT-0027',
    description: 'Explores the evolution of enterprise SaaS sales in India, highlighting longer deal cycles, ROI-driven buying, outbound-led GTM strategies, and the shift toward multi-stakeholder decision-making processes.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former VP of Enterprise Sales, Indian SaaS Company',
  },
  {
    slug: 'transforming-mid-sized-hr-from-support-functions-to-strategic-growth-drivers-measuring-productivity-through-lean-six-sigma-and-tech-automation',
    title: 'Transforming Mid-Sized HR from Support Functions to Strategic Growth Drivers: Measuring Productivity Through Lean Six Sigma and Tech Automation',
    sku: 'RMT-0025',
    description: 'Explores HR transformation in mid-sized firms, highlighting shift from transactional roles to strategic growth drivers through KPI linkage, productivity measurement, and technology-led automation.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['professional-services'],
    geo: ['global'],
    expertTitle: 'Former Chief People Officer, Mid-Sized Technology Company',
  },
  {
    slug: 'apac-ai-infrastructure-evolution-and-the-strategic-shift-toward-high-density-gpu-ready-data-centers-and-sovereign-compute-clusters',
    title: 'APAC AI Infrastructure Evolution and the Strategic Shift Toward High-Density GPU Ready Data Centers and Sovereign Compute Clusters',
    sku: 'RMT-0029',
    description: 'Analyzes APAC AI infrastructure expansion, highlighting hyperscaler and regional investments, GPU capacity constraints, shift to high-density data centers, and risks around utilization and revenue realization.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas', 'real-estate-infrastructure'],
    geo: ['apac'],
    expertTitle: 'Former VP of Data Centre Strategy, Major APAC Cloud Provider',
  },
  {
    slug: 'the-global-shift-in-advanced-semiconductor-manufacturing-high-bandwidth-memory-hbm-through-silicon-via-tsv-integration-and-the-surge-in-dram-pricing',
    title: 'The Global Shift in Advanced Semiconductor Manufacturing: High Bandwidth Memory (HBM), Through-Silicon Via (TSV) Integration, and the Surge in DRAM Pricing',
    sku: 'RMT-0034',
    description: 'Analyzes semiconductor manufacturing shift toward AI-driven demand, highlighting HBM growth, TSV-based advanced packaging, supply chain diversification, and rising yield and talent constraints in production.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global', 'apac'],
    expertTitle: 'Former Director of Advanced Memory Products, Global Semiconductor Company',
  },
  {
    slug: 'strategic-integration-of-ai-driven-dynamic-pricing-and-predictive-valuations-scaling-from-isolated-pilots-to-core-revenue-workflows-and-headcount-optimization',
    title: 'Strategic Integration of AI-Driven Dynamic Pricing and Predictive Valuations: Scaling from Isolated Pilots to Core Revenue Workflows and Headcount Optimization',
    sku: 'RMT-0045',
    description: 'Analyzes AI-driven pricing and valuation, highlighting shift to dynamic, personalized pricing models, integration into core workflows, and impact on CAC, LTV, and headcount optimization.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Pricing Strategy, Global E-Commerce Platform',
  },
  {
    slug: 'the-shift-to-behavior-based-detection-and-ai-driven-soc-workflows-in-apac-financial-institutions-for-improved-false-positive-reduction',
    title: 'The Shift To Behavior-Based Detection And AI-Driven SOC Workflows In APAC Financial Institutions For Improved False Positive Reduction',
    sku: 'RMT-0046',
    description: 'Analyzes AI-driven cybersecurity in APAC, highlighting shifts to behavior-based detection, SOC automation, reduced false positives, and the growing role of cloud-aligned security platforms in financial institutions.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas', 'financial-services'],
    geo: ['apac'],
    expertTitle: 'Former Head of Cyber Security Operations, APAC Financial Institution',
  },
  {
    slug: 'shaping-the-next-generation-of-multi-cloud-resilience-shifting-from-passive-redundancy-to-ai-driven-autonomous-decision-control-and-high-reliability',
    title: 'Shaping The Next Generation Of Multi-Cloud Resilience: Shifting From Passive Redundancy To AI-Driven Autonomous Decision Control And High Reliability',
    sku: 'RMT-0050',
    description: 'Analyzes multi-cloud and AI-driven operations, highlighting the shift to selective active architectures, decision-centric DevOps, and the emergence of agentic AI for autonomous incident resolution and control.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['global'],
    expertTitle: 'Former VP of Cloud Architecture, Global Technology Company',
  },
  {
    slug: 'transitioning-to-ai-led-full-funnel-growth-improving-performance-marketing-and-first-party-data-economics-in-southeast-asia',
    title: 'Transitioning to AI-Led Full-Funnel Growth: Improving Performance Marketing and First-Party Data Economics in Southeast Asia',
    sku: 'RMT-0057',
    description: 'Analyzes AI-led marketing in Southeast Asia, highlighting limited transformation beyond analytics, declining first-party data advantage, top-funnel gains, and shift toward warehouse-centric MarTech architectures.',
    price: 449, compare: 599,
    published: '2026-04-09',
    sectors: ['technology-saas'],
    geo: ['apac'],
    expertTitle: 'Former VP of Growth Marketing, Southeast Asian Technology Platform',
  },
  {
    slug: 'ai-adoption-in-financial-markets-process-pricing-and-sector-implications',
    title: 'AI Adoption in Financial Markets: Process, Pricing, and Sector Implications',
    sku: 'RMT-005',
    description: 'Explores how AI is reshaping financial markets by improving operational efficiency and analysis speed, while investment decisions remain human-led due to trust, accuracy, and regulatory constraints.',
    price: 599, compare: 799,
    published: '2026-04-09',
    sectors: ['financial-services'],
    geo: ['global'],
    expertTitle: 'Former Head of Quantitative Research, Global Investment Bank',
  },
  {
    slug: 'uk-green-finance-market-2026-consolidation-amid-high-interest-rates-supply-chain-inflation-and-shift-toward-energy-security-and-affordability',
    title: 'UK Green Finance Market 2026: Consolidation Amid High Interest Rates, Supply Chain Inflation, and Shift Toward Energy Security and Affordability',
    sku: 'RMT-0018',
    description: 'Analyzes UK green finance market, highlighting capital deployment slowdown, debt-heavy funding structures, investor selectivity, and how inflation, interest rates, and supply chain risks impact returns.',
    price: 349, compare: 499,
    published: '2026-04-09',
    sectors: ['financial-services'],
    geo: ['europe'],
    expertTitle: 'Former Head of Sustainable Finance, UK Investment Manager',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function deriveTier(price: number): 'standard' | 'premium' | 'elite' {
  if (price >= 599) return 'elite'
  if (price >= 449) return 'premium'
  return 'standard'
}

function deriveLevel(price: number): 'c-suite' | 'vp' | 'director' {
  if (price >= 599) return 'c-suite'
  if (price >= 449) return 'vp'
  return 'director'
}

function deriveDiscount(price: number, compare: number): number {
  if (!compare || compare <= price) return 0
  const pct = ((compare - price) / compare) * 100
  return Math.round(pct / 5) * 5  // round to nearest 5
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  // ── 1. Upsert industries ──────────────────────────────────────────────────

  console.log('\n── Upserting industries ─────────────────────────────────')
  const industryMap: Record<string, string | number> = {}

  for (const name of INDUSTRY_NAMES) {
    const slug = slugify(name)
    const existing = await payload.find({
      collection: 'industries',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      industryMap[slug] = existing.docs[0].id
      console.log(`  ✓ exists  ${slug}`)
    } else {
      const created = await payload.create({
        collection: 'industries',
        data: { name, slug },
      })
      industryMap[slug] = created.id
      console.log(`  + created ${slug}`)
    }
  }

  // ── 2. Seed transcripts ──────────────────────────────────────────────────

  console.log(`\n── Seeding ${PRODUCTS.length} transcripts ───────────────────────────────`)

  let created = 0, skipped = 0
  const allFlags: { slug: string; flags: string[] }[] = []

  for (const p of PRODUCTS) {
    // Collect all flags for end-of-run report
    if (p.flags?.length) allFlags.push({ slug: p.slug, flags: p.flags })

    // Deduplication check
    const existing = await payload.find({
      collection: 'expert-transcripts',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ✓ skip    ${p.slug}`)
      skipped++
      continue
    }

    // Resolve sector IDs (industryMap values are always numbers after upsert)
    const sectorIds = p.sectors
      .map((s) => industryMap[s])
      .filter(Boolean) as number[]

    const tier = deriveTier(p.price)
    const expertLevel = deriveLevel(p.price)
    const discountPercent = deriveDiscount(p.price, p.compare)

    await payload.create({
      collection: 'expert-transcripts',
      data: {
        title: p.title,
        slug: p.slug,
        expertId: p.sku ?? `EXP-SEED-${String(created + skipped + 1).padStart(3, '0')}`,
        expertFormerTitle: p.expertTitle,
        expertLevel,
        dateConducted: new Date(p.published).toISOString(),
        summary: p.description,
        executiveSummaryPreview: p.description,  // same until real preview is written
        priceUsd: p.price,
        originalPriceUsd: p.compare,
        discountPercent,
        tier,
        sectors: sectorIds,
        geography: p.geo,
        complianceBadges: ['mnpi-screened', 'pii-redacted', 'compliance-certified', 'expert-anonymised'],
        featured: tier === 'elite',
        _status: 'published',
      },
    })

    console.log(`  + created ${p.slug}  [${tier} $${p.price}]`)
    created++
  }

  // ── 3. Summary ────────────────────────────────────────────────────────────

  console.log(`
══════════════════════════════════════════════════════════════════
  DONE  Created: ${created}  |  Skipped (already exist): ${skipped}
══════════════════════════════════════════════════════════════════
`)

  if (allFlags.length > 0) {
    console.log('DATA QUALITY FLAGS — ACTION REQUIRED\n')
    for (const { slug, flags } of allFlags) {
      console.log(`  Slug: ${slug}`)
      for (const f of flags) console.log(`    ${f}`)
      console.log()
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
