import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import React from 'react'
import '../globals.css'

import { getPayload } from 'payload'
import config from '@/payload.config'
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

export const metadata: Metadata = {
  title: {
    default: 'Transcript IQ — Intelligence at the speed of now',
    template: '%s — Transcript IQ',
  },
  description:
    'Anonymized expert call transcripts and earnings analysis briefs for analysts who run six LLM tabs in parallel.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let logoUrl: string | null = null
  let logoDarkUrl: string | null = null

  try {
    const payload = await getPayload({ config: await config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    const logo = settings?.logo
    const logoDark = settings?.logoDark
    if (logo && typeof logo === 'object' && 'url' in logo) logoUrl = (logo as { url: string }).url ?? null
    if (logoDark && typeof logoDark === 'object' && 'url' in logoDark) logoDarkUrl = (logoDark as { url: string }).url ?? null
  } catch {
    // site settings not yet saved — fall back to wordmark
  }

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
