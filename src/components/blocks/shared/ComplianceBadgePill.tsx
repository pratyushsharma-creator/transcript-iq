'use client'

import { ShieldCheck, Lock, UserX, FileCheck, Zap, Mail, Ban } from 'lucide-react'

const ICON_BY_VALUE: Record<string, React.ComponentType<{ className?: string }>> = {
  'mnpi-screened': ShieldCheck,
  'pii-redacted': Lock,
  'compliance-certified': FileCheck,
  'expert-anonymised': UserX,
  'same-day-delivery': Zap,
  'instant-pdf': Mail,
  'no-subscription': Ban,
}

const LABEL_BY_VALUE: Record<string, string> = {
  'mnpi-screened': 'MNPI Screened',
  'pii-redacted': 'PII Redacted',
  'compliance-certified': 'Compliance Certified',
  'expert-anonymised': 'Expert Anonymised',
  'same-day-delivery': 'Same-day delivery',
  'instant-pdf': 'Instant PDF',
  'no-subscription': 'No subscription',
}

export function ComplianceBadgePill({
  value,
  label,
  size = 'sm',
}: {
  value?: string
  label?: string
  size?: 'xs' | 'sm' | 'md'
}) {
  const Icon = (value && ICON_BY_VALUE[value]) || ShieldCheck
  const text = label ?? (value ? LABEL_BY_VALUE[value] : 'Verified')
  const sizing =
    size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'md' ? 'px-3 py-1 text-[12px]' : 'px-2 py-0.5 text-[10px]'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] font-mono font-medium uppercase tracking-[0.08em] text-[var(--accent)] ${sizing}`}
    >
      <Icon className="h-3 w-3" />
      {text}
    </span>
  )
}
