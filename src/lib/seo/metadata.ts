const BASE_URL = 'https://transcript-iq.com'

/** Returns the full canonical URL for a given path */
export function canonical(path: string): string {
  return `${BASE_URL}${path}`
}

/** Truncates a string to maxLen chars, appending '…' if cut */
export function truncate(str: string | null | undefined, maxLen = 155): string {
  if (!str) return ''
  return str.length <= maxLen ? str : str.slice(0, maxLen - 1) + '…'
}

// ── Sector metadata map ───────────────────────────────────────────────────────

export type SectorMeta = { title: string; description: string }

export const SECTOR_META: Record<string, SectorMeta> = {
  'technology-saas': {
    title: 'Technology & SaaS Expert Call Transcripts',
    description:
      'Former executives from Tier-1 SaaS, semiconductor, and cloud companies. MNPI-screened. Buy individual transcripts from $349.',
  },
  'healthcare-pharma': {
    title: 'Healthcare & Pharma Expert Call Transcripts',
    description:
      'Former pharma, biotech, and medical device executives. Regulatory, pricing, pipeline dynamics. MNPI-screened.',
  },
  'financial-services': {
    title: 'Financial Services Expert Call Transcripts',
    description:
      'Insurance, banking, fintech, and asset management sector experts. MNPI-screened. Buy per transcript.',
  },
  'energy-utilities': {
    title: 'Energy & Utilities Expert Call Transcripts',
    description:
      'Oil & gas, renewables, and grid infrastructure expert calls. MNPI-screened.',
  },
  'industrials-manufacturing': {
    title: 'Industrials & Manufacturing Expert Transcripts',
    description:
      'Aerospace, defence, capital goods, and supply chain executives. MNPI-screened.',
  },
  telecommunications: {
    title: 'Telecommunications Expert Call Transcripts',
    description:
      'Telco infrastructure, spectrum, and enterprise connectivity experts. MNPI-screened.',
  },
  chemicals: {
    title: 'Chemicals Sector Expert Call Transcripts',
    description:
      'Specialty chemicals, commodity, and materials sector practitioners. MNPI-screened.',
  },
  'metals-mining': {
    title: 'Metals & Mining Expert Call Transcripts',
    description:
      'Base metals, precious metals, and critical minerals experts. MNPI-screened.',
  },
  'professional-services': {
    title: 'Professional Services Expert Call Transcripts',
    description:
      'Consulting, legal, and outsourcing sector expert calls. MNPI-screened.',
  },
  'space-economy': {
    title: 'Space Economy Expert Call Transcripts',
    description:
      'Satellite, launch, and space infrastructure expert perspectives. MNPI-screened.',
  },
  'transportation-logistics': {
    title: 'Transportation & Logistics Expert Transcripts',
    description:
      'Freight, logistics, maritime, and aviation sector experts. MNPI-screened.',
  },
  'real-estate-infrastructure': {
    title: 'Real Estate & Infrastructure Expert Transcripts',
    description:
      'Commercial RE, infrastructure, and PropTech expert calls. MNPI-screened.',
  },
}
