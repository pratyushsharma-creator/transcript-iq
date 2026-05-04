'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

type CTA = {
  label: string
  url: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'tertiary'
  magnetic?: boolean
}

function MagneticAnchor({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * 0.18
      const dy = (e.clientY - cy) * 0.18
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return (
    <Link ref={ref as never} href={href} className={`magnetic-target ${className ?? ''}`}>
      {children}
    </Link>
  )
}

function CTA({ cta }: { cta: CTA }) {
  const variant = cta.variant ?? 'primary'
  const Wrap = cta.magnetic ? MagneticAnchor : Link

  if (variant === 'primary') {
    return (
      <Wrap
        href={cta.url}
        className="group inline-flex items-center gap-2 rounded-md bg-btn-primary px-5 py-3 text-sm font-medium text-white shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
      >
        {cta.label}
        <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
      </Wrap>
    )
  }
  if (variant === 'secondary') {
    return (
      <Wrap
        href={cta.url}
        className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition-all duration-base ease-out hover:-translate-y-px hover:border-[var(--accent-border)]"
      >
        {cta.label}
      </Wrap>
    )
  }
  if (variant === 'ghost') {
    return (
      <Wrap
        href={cta.url}
        className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-[var(--ink-2)] transition-colors duration-fast hover:text-[var(--ink)]"
      >
        {cta.label}
      </Wrap>
    )
  }
  // tertiary
  return (
    <Wrap
      href={cta.url}
      className="group inline-flex items-center gap-1 px-1 py-3 text-sm font-medium text-[var(--accent)] transition-colors"
    >
      {cta.label}
      <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
    </Wrap>
  )
}

export function CTAButtons({ ctas }: { ctas?: CTA[] | null }) {
  if (!ctas || ctas.length === 0) return null
  return (
    <>
      {ctas.map((c, i) => (
        <CTA key={i} cta={c} />
      ))}
    </>
  )
}
