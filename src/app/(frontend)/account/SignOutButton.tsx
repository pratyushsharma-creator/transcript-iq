'use client'

import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await fetch('/api/users/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)] hover:text-[var(--ink)] transition-colors"
    >
      Sign out
    </button>
  )
}
