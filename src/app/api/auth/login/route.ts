import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'

/**
 * POST /api/auth/login
 *
 * Thin proxy around Payload's /api/users/login that verifies a Cloudflare
 * Turnstile token before forwarding credentials. All Payload auth cookies
 * (Set-Cookie headers) are preserved and forwarded to the browser.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email?: string
      password?: string
      turnstileToken?: string
    }

    // 1. Verify Turnstile (dev bypass when secret key is unset)
    const { success, errorCode } = await verifyTurnstile(body.turnstileToken)
    if (!success) {
      return NextResponse.json(
        { errors: [{ message: 'Bot verification failed. Please refresh and try again.' }], errorCode },
        { status: 403 },
      )
    }

    // 2. Forward credentials to Payload REST endpoint
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const payloadRes = await fetch(`${siteUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password }),
    })

    // 3. Forward Payload's response (status + body + Set-Cookie headers)
    const responseBody = await payloadRes.text()
    const res = new NextResponse(responseBody, {
      status: payloadRes.status,
      headers: { 'Content-Type': payloadRes.headers.get('Content-Type') ?? 'application/json' },
    })

    // Copy all Set-Cookie headers (Payload auth session cookie)
    const setCookies = payloadRes.headers.getSetCookie?.() ?? []
    setCookies.forEach((cookie) => res.headers.append('Set-Cookie', cookie))

    return res
  } catch (err) {
    console.error('[api/auth/login]', err)
    return NextResponse.json(
      { errors: [{ message: 'Something went wrong. Please try again.' }] },
      { status: 500 },
    )
  }
}
