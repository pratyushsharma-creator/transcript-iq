/**
 * Single source of truth for the EV Ecosystem report landing page.
 * Imported by both the server page (JSON-LD schema) and the client UI (rendered
 * copy) so the visible answer blocks and the FAQPage schema never drift — which
 * is the core GEO/AEO lever for this page.
 */

export const EV_REPORT = {
  url: 'https://www.transcript-iq.com/reports/ev-ecosystem',
  title: 'Can Europe Win the EV Ecosystem?',
  publisher: 'Nextyn Research',
  pages: 25,
  priceUsd: 3499,
  originalPriceUsd: 5000,
  consultRateUsd: 350,
  datePublished: '2026-06-17',
  // Above-the-fold sell angle
  headline: 'Europe lost the battery war. The market hasn’t repriced what comes next.',
  subhead:
    'A 25-page practitioner report on Europe’s EV value chain — from the people who ran the gigafactory ramps and built the charging networks. Where margin moves next, and the bets that won’t survive.',
  benefits: [
    'Skip the gigafactories that won’t survive.',
    'See where margin goes once cells commoditise.',
    'Price V2G and charging on real economics.',
    'Arm your IC with primary-source conviction.',
  ],
  trustBar: ['25 pages', '3 practitioner interviews', '7 contested questions'],
} as const

export const STATS: { value: string; interpretation: string }[] = [
  {
    value: '10%',
    interpretation: 'Of announced European gigafactory projects reached commercial production. The battery race was lost on execution, not technology.',
  },
  {
    value: '15%',
    interpretation: 'Cost penalty to produce the same cell in Europe versus importing from China. A live boardroom trade-off for every OEM.',
  },
  {
    value: '6 vs 24 mo',
    interpretation: 'Concept-to-certification in China versus Europe. The execution gap, quantified: roughly 4x slower.',
  },
  {
    value: '95%+',
    interpretation: 'Manufacturing yield required for commercial viability. Most European independents never reached it.',
  },
  {
    value: '$5.8bn',
    interpretation: 'Raised by Northvolt — Europe’s flagship independent — which still failed to reach commercial-scale yield.',
  },
  {
    value: '10 yrs',
    interpretation: 'Before consumer V2G moves beyond captive-fleet deployments. The market is pricing V2G wrong today.',
  },
]

export const EXPERTS: { title: string; domain: string }[] = [
  {
    title: 'Former Technical Team Lead, Audi AG',
    domain: 'Battery cell technology, gigafactory ramp planning, and European supply-chain strategy.',
  },
  {
    title: 'Former Director, Sunlight Group',
    domain: 'Energy-storage product strategy and energy-platform commercialisation.',
  },
  {
    title: 'Former Engineer, E-GAP',
    domain: 'Charging-network deployment, grid integration, thermal management, and software platforms.',
  },
]

/**
 * Ordered by search intent / keyword priority (highest first).
 * The FAQ accordion shows the top 5; the "what it answers" list shows the top 6;
 * the top 5 also feed the FAQPage schema (kept in sync with what's visible).
 */
export const FAQS: { question: string; answer: string }[] = [
  {
    question: 'Why did Europe lose the EV battery manufacturing race?',
    answer:
      'Europe lost on execution, not technology. According to practitioners interviewed for Nextyn Research’s 2026 EV Ecosystem Report, the cell know-how existed, but the tacit manufacturing-knowledge transfer required to hit commercial yield never happened. The race is effectively over: only around 10% of announced European gigafactory projects reached commercial production.',
  },
  {
    question: 'Who are the major players in European battery manufacturing?',
    answer:
      'The European battery landscape spans OEM-backed cell ventures, independents such as Northvolt, and the policy scaffolding of the European Battery Alliance and EU Battery Regulation (2023/1542). Nextyn Research’s report assesses which of these survive the shift from announced capacity to commercial production.',
  },
  {
    question: 'Which European gigafactory projects survive?',
    answer:
      'OEM backing predicts survival more reliably than any engineering metric. Independent gigafactories consistently fail in the “valley of death” between pilot and volume production — Northvolt raised $5.8bn and still failed. Projects anchored to a committed OEM offtake are the ones that reach the 95%+ yield needed for viability.',
  },
  {
    question: 'Where should capital go in EV charging infrastructure?',
    answer:
      'Maintenance economics are the most systematically mispriced element of EV charging. Investors who model charger count rather than uptime and maintenance cost will misjudge the return profile. The return lives in operations, not installation.',
  },
  {
    question: 'What will vehicle-to-grid (V2G) actually look like this decade?',
    answer:
      'Near-term V2G is car-to-BESS-to-grid, not true car-to-grid. Consumer V2G at scale is roughly a 10-year horizon and remains confined to captive-fleet deployments today. Investors pricing in mass consumer V2G this decade are pricing it wrong.',
  },
  {
    question: 'What is AI’s real role in the EV ecosystem, and who captures it?',
    answer:
      'AI is a multiplier for whoever already holds the data and the deployed asset base — not a leapfrog path for latecomers. It compounds existing advantage rather than creating new entrants, so incumbents with deployed assets and data capture most of the upside.',
  },
  {
    question: 'Where does value go when the battery cell is commoditised?',
    answer:
      'Defensible margin migrates from the cell to software orchestration, predictive maintenance, and energy-platform control. The hardware is commoditising; the durable returns sit in the layer that coordinates assets and data, not in manufacturing the cell itself.',
  },
  {
    question: 'Will software or battery manufacturers capture the EV ecosystem?',
    answer:
      'This is genuinely contested. The outcome depends on data regulation, not on technology — specifically, who is allowed to own and use the operational data generated by the asset base. Manufacturers who secure rights to that data can defend the value; if the data opens up, software platforms capture it.',
  },
]
