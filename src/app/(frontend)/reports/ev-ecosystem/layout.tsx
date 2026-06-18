import React from 'react'
import { HappierLeadsPageScript } from '@/components/site/HappierLeadsPageScript'

/**
 * Route layout for /reports/ev-ecosystem.
 *
 * Exists solely to mount HappierLeads via a beforeInteractive script so it lands
 * in the document <head> (per HappierLeads' install instructions) while staying
 * scoped to this single route — no other page loads it.
 */
export default function EvEcosystemReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HappierLeadsPageScript />
      {children}
    </>
  )
}
