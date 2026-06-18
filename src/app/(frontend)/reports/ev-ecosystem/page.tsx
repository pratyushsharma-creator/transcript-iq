import type { Metadata } from 'next'
import { EV_REPORT, FAQS } from '@/lib/ev-report/content'
import { EvEcosystemLanding } from '@/components/ev-report/EvEcosystemLanding'
import { Rb2bPageScript } from '@/components/site/Rb2bPageScript'
import { UTMCapture } from '@/components/site/UTMCapture'
import { AnalyticsTags } from '@/components/site/AnalyticsTags'

export const metadata: Metadata = {
  title: 'Can Europe Win the EV Ecosystem? | Research Report — Nextyn Research',
  description:
    'A 25-page practitioner research report on Europe’s EV value chain. Only 10% of announced gigafactory projects reached production. Find out where value goes next. $3,499.',
  keywords: [
    'European EV value chain report',
    'EV ecosystem research report',
    'European gigafactory economics',
    'EV battery supply chain Europe',
    'Northvolt gigafactory analysis',
    'European battery manufacturing report',
    'V2G outlook Europe',
    'EV charging investment',
    'Nextyn Research',
  ],
  openGraph: {
    title: 'Can Europe Win the EV Ecosystem? | Nextyn Research',
    description:
      '3 practitioners. 7 contested questions. The definitive view on where Europe lost — and what’s still winnable.',
    type: 'website',
    url: EV_REPORT.url,
    images: [{ url: '/og/ev-ecosystem-report.jpg', width: 1200, height: 630, alt: 'Can Europe Win the EV Ecosystem? — Nextyn Research' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can Europe Win the EV Ecosystem?',
    description:
      '10% of announced gigafactories reached commercial production. Read the full expert analysis. $3,499.',
  },
  alternates: { canonical: EV_REPORT.url },
  robots: { index: true, follow: true },
}

function JsonLd() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Can Europe Win the EV Ecosystem? — Research Report',
    description: '25-page practitioner research report on Europe’s EV value chain execution gap.',
    brand: { '@type': 'Organization', name: EV_REPORT.publisher },
    offers: {
      '@type': 'Offer',
      price: String(EV_REPORT.priceUsd),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: EV_REPORT.url,
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // Top 5 — kept in sync with the visible FAQ accordion (Google requires visible content)
    mainEntity: FAQS.slice(0, 5).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  const reportSchema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: EV_REPORT.title,
    author: { '@type': 'Organization', name: EV_REPORT.publisher },
    datePublished: EV_REPORT.datePublished,
    publisher: { '@type': 'Organization', name: EV_REPORT.publisher },
    about: 'European electric vehicle ecosystem, battery manufacturing, gigafactory economics',
    url: EV_REPORT.url,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.transcript-iq.com' },
      { '@type': 'ListItem', position: 2, name: 'Reports', item: 'https://www.transcript-iq.com/reports' },
      { '@type': 'ListItem', position: 3, name: EV_REPORT.title, item: EV_REPORT.url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reportSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}

export default function EvEcosystemReportPage() {
  return (
    <>
      <JsonLd />
      <AnalyticsTags />
      <UTMCapture />
      <Rb2bPageScript />
      <EvEcosystemLanding />
    </>
  )
}
