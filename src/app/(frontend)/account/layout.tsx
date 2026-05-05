import { requireAuth } from '@/lib/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My account',
  robots: { index: false, follow: false },
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  return <>{children}</>
}
