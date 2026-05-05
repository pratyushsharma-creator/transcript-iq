import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCurrentUser() {
  try {
    const payload = await getPayload({ config: await config })
    const { user } = await payload.auth({ headers: await headers() })
    return user ?? null
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}
