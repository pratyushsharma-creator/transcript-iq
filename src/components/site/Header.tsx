'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, openCart } = useCart()
  const pathname = usePathname()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      // Focus the close button for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
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
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5" onClick={closeMenu}>
            {logoUrl ? (
              <>
                <div className={`relative h-11 w-48${logoDarkUrl ? ' block dark:hidden' : ''}`}>
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

          {/* Desktop nav */}
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

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {/* Cart — visible on all screen sizes */}
            <button
              onClick={openCart}
              aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? '' : 's'})` : ''}`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)] transition-all duration-fast hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 font-mono text-[9px] font-semibold text-btn-primary-fg">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Free transcript CTA — hidden on mobile (shown inside mobile menu) */}
            <Link
              href="/free-transcript"
              className="hidden sm:inline-flex items-center justify-center rounded-md bg-btn-primary px-4 py-2 text-[13px] font-medium text-btn-primary-fg shadow-cta transition-all duration-fast ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
            >
              Free transcript
            </Link>

            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)] transition-all duration-fast hover:border-[var(--accent-border)] hover:text-[var(--accent)] md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              aria-hidden
            />

            {/* Slide-in panel */}
            <motion.div
              key="mobile-menu"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-[min(320px,90vw)] flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-xl md:hidden"
            >
              {/* Panel header */}
              <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6">
                <span className="font-sans text-[14px] font-semibold text-[var(--ink)]">Menu</span>
                <button
                  ref={closeButtonRef}
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-2)] transition-all duration-fast hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex flex-1 flex-col overflow-y-auto">
                {NAV_ITEMS.map((item, idx) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={[
                      'flex items-center px-6 py-4 text-[16px] font-medium text-[var(--ink)] transition-colors duration-fast hover:bg-[var(--bg)] hover:text-[var(--accent)]',
                      idx > 0 ? 'border-t border-[var(--border)]' : '',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Panel footer — CTA */}
              <div className="border-t border-[var(--border)] p-6">
                <Link
                  href="/free-transcript"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-md bg-btn-primary px-4 py-3 text-[14px] font-medium text-btn-primary-fg shadow-cta transition-all duration-fast ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
                >
                  Free transcript
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
