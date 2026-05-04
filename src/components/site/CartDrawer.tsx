'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, ShoppingCart, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCart, type CartItem } from '@/context/CartContext'

// ── Item type icon ──────────────────────────────────────────────────────────────

function ItemIcon({ type, ticker }: { type: CartItem['type']; ticker?: string }) {
  const isEarnings = type === 'earnings'
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-mono text-[9px] font-semibold"
      style={
        isEarnings
          ? { background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.28)', color: '#FBBF24' }
          : { background: 'var(--accent-tint)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }
      }
    >
      {isEarnings && ticker ? `$${ticker}` : 'EXP'}
    </div>
  )
}

// ── Single cart item row ────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem } = useCart()

  const typeLabel =
    item.type === 'earnings'
      ? `Earnings Analysis${item.quarter ? ` · ${item.quarter}` : ''}`
      : `Expert Transcript${item.tier ? ` · ${item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}` : ''}`

  return (
    <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
      <ItemIcon type={item.type} ticker={item.ticker} />
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--mist)]">
          {typeLabel}
        </p>
        <p className="mb-2 line-clamp-2 text-[12px] font-medium leading-[1.35] text-[var(--ink)]">
          {item.title}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {item.originalPriceUsd && item.originalPriceUsd > item.priceUsd && (
              <span className="font-mono text-[11px] text-[var(--mist)] line-through">
                ${item.originalPriceUsd}
              </span>
            )}
            <span className="font-mono text-[15px] font-medium leading-none tracking-[-0.02em] text-[var(--accent)]">
              ${item.priceUsd}
            </span>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[9px] text-[var(--mist)] transition-colors duration-fast hover:text-[#F87171]"
            aria-label="Remove item"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Cart drawer ─────────────────────────────────────────────────────────────────

export function CartDrawer() {
  const { items, isOpen, itemCount, subtotal, closeCart } = useCart()
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeCart}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed right-0 top-0 z-[91] flex h-full w-[420px] max-w-[100vw] flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-modal transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              Your Cart
            </span>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent-tint)] px-1.5 font-mono text-[10px] font-medium text-[var(--accent)]">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink-2)] transition-all duration-fast hover:border-[var(--border-2)] hover:text-[var(--ink)]"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items area */}
        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)]">
              <ShoppingCart className="h-7 w-7 text-[var(--mist)]" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-[var(--ink)]">Your cart is empty</p>
              <p className="mt-1 text-[13px] text-[var(--ink-2)]">
                Browse transcripts and add items to get started.
              </p>
            </div>
            <Link
              href="/expert-transcripts"
              onClick={closeCart}
              className="inline-flex items-center gap-2 rounded-lg bg-btn-primary px-5 py-2.5 text-[13px] font-medium text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
            >
              Browse Transcripts
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:thin]">
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[var(--border)] px-6 py-5">
              {/* Subtotal */}
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[13px] text-[var(--ink-2)]">Subtotal</span>
                <span className="font-mono text-[20px] font-medium tracking-[-0.03em] text-[var(--ink)]">
                  ${subtotal.toFixed(0)}
                </span>
              </div>
              <p className="mb-5 font-mono text-[10px] text-[var(--mist)]">
                Taxes & discounts calculated at checkout · Instant PDF delivery
              </p>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="group flex w-full items-center justify-center gap-2 rounded-[10px] bg-btn-primary py-[14px] text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
                style={{ letterSpacing: '-0.01em' }}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={closeCart}
                className="mt-3 w-full py-2 text-center text-[12px] text-[var(--mist)] transition-colors duration-fast hover:text-[var(--ink-2)]"
              >
                ← Continue Shopping
              </button>

              {/* Compliance note */}
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-tint)] p-3">
                <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                <p className="font-mono text-[9px] leading-[1.6] text-[var(--accent)]">
                  Every transcript is MNPI-screened and PII-redacted. Compliant with SEC §10b-5 and FCA expert network guidelines.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
