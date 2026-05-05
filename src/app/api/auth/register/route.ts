import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'

/**
 * POST /api/auth/register
 *
 * Verifies Turnstile, creates a new user via Payload REST, then auto-logs
 * in so the browser receives the auth cookie immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name?: string
      email?: string
      password?: string
      company?: string
      turnstileToken?: string
    }

    // 1. Turnstile verification
    const { success, errorCode } = await verifyTurnstile(body.turnstileToken)
    if (!success) {
      return NextResponse.json(
        { errors: [{ message: 'Bot verification failed. Please refresh and try again.' }], errorCode },
        { status: 403 },
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    // 2. Create user via Payload REST
    const createRes = await fetch(`${siteUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password,
        company: body.company,
      }),
    })

    if (!createRes.ok) {
      const data = await createRes.text()
      return new NextResponse(data, {
        status: createRes.status,
        headers: { 'Content-Type': createRes.headers.get('Content-Type') ?? 'application/json' },
      })
    }

    // 3. Auto-login to set session cookie
    const loginRes = await fetch(`${siteUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password }),
    })

    const loginBody = await loginRes.text()
    const res = new NextResponse(loginBody, {
      status: loginRes.status,
      headers: { 'Content-Type': loginRes.headers.get('Content-Type') ?? 'application/json' },
    })

    const setCookies = loginRes.headers.getSetCookie?.() ?? []
    setCookies.forEach((cookie) => res.headers.append('Set-Cookie', cookie))

    return res
  } catch (err) {
    console.error('[api/auth/register]', err)
    return NextResponse.json(
      { errors: [{ message: 'Something went wrong. Please try again.' }] },
      { status: 500 },
    )
  }
}
