import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import React from 'react'
import '../globals.css'

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { CACHE_TAGS } from '@/lib/cache/revalidation'
import { ThemeProvider } from '@/components/site/ThemeProvider'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { CartProvider } from '@/context/CartContext'
import { CartDrawer } from '@/components/site/CartDrawer'
import { CookieBanner } from '@/components/site/CookieBanner'

const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const getCachedSiteSettings = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config: await config })
      return await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    } catch {
      // SiteSettings not yet saved, or DB unavailable — return null so layout falls back to wordmark
      return null
    }
  },
  ['site-settings'],
  { tags: [CACHE_TAGS.siteSettings], revalidate: 86400 },
)

export const metadata: Metadata = {
  metadataBase: new URL('https://transcript-iq.com'),
  title: {
    default: 'Expert Call Transcripts Without the Subscription | Transcript IQ',
    template: '%s | Transcript IQ',
  },
  description:
    'Buy individual MNPI-screened expert call transcripts from $349. 77+ transcripts across 12 sectors. No subscription. Compliance certified.',
  openGraph: {
    siteName: 'Transcript IQ',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let logoUrl: string | null = null
  let logoDarkUrl: string | null = null

  const settings = await getCachedSiteSettings()
  const logo = settings?.logo
  const logoDark = settings?.logoDark
  if (logo && typeof logo === 'object' && 'url' in logo) logoUrl = (logo as { url: string }).url ?? null
  if (logoDark && typeof logoDark === 'object' && 'url' in logoDark) logoDarkUrl = (logoDark as { url: string }).url ?? null

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <CartProvider>
            <Header logoUrl={logoUrl} logoDarkUrl={logoDarkUrl} />
            <CartDrawer />
            <CookieBanner />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
