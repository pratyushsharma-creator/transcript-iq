'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ShoppingCart } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useCart } from '@/context/CartContext'

const NAV_ITEMS = [
  { label: 'Transcript Library', href: '/expert-transcripts' },
  { label: 'Earnings Analysis', href: '/earnings-analysis' },
  { label: 'How It Works', href: '/how-to-use' },
  { label: 'Custom Transcript', href: '/custom-reports' },
  { label: 'Resources', href: '/resources' },
]

interface HeaderProps {
  logoUrl?: string | null
  logoDarkUrl?: string | null
}

export function Header({ logoUrl, logoDarkUrl }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'sticky top-0 z-50 w-full transition-all duration-base ease-out',
        scrolled
          ? 'border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          {logoUrl ? (
            <>
              <div
                className={`relative h-11 w-48${logoDarkUrl ? ' block dark:hidden' : ''}`}
              >
                <Image
                  src={logoUrl}
                  alt="Transcript IQ"
                  fill
                  className="object-contain transition-opacity duration-fast group-hover:opacity-90"
                  priority
                />
              </div>
              {logoDarkUrl && (
                <div className="relative h-11 w-48 hidden dark:block">
                  <Image
                    src={logoDarkUrl}
                    alt="Transcript IQ"
                    fill
                    className="object-contain transition-opacity duration-fast group-hover:opacity-90"
                    priority
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <span
                aria-hidden
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br from-mint-500 to-mint-300 text-mint-900 shadow-cta transition-transform duration-base ease-out group-hover:-translate-y-px"
              >
                <span className="font-mono text-[11px] font-semibold tracking-tight">T</span>
              </span>
              <span className="font-sans text-[15px] font-medium tracking-tight text-[var(--ink)]">
                Transcript IQ
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-[var(--ink-2)] transition-colors duration-fast hover:bg-[var(--surface)] hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? '' : 's'})` : ''}`}
            className="relative hidden h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)] transition-all duration-fast hover:border-[var(--accent-border)] hover:text-[var(--accent)] sm:inline-flex"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 font-mono text-[9px] font-semibold text-[#052A18]">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
          <Link
            href="/free-transcript"
            className="inline-flex items-center justify-center rounded-md bg-btn-primary px-4 py-2 text-[13px] font-medium text-btn-primary-fg shadow-cta transition-all duration-fast ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            Free transcript
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
