import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'

/**
 * POST /api/auth/reset-password
 *
 * Verifies Turnstile before forwarding the reset-password request to Payload.
 * The token parameter here is the email reset token (from the link), not
 * the Turnstile token.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      token?: string        // email reset token from URL param
      password?: string
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

    // 2. Forward to Payload REST
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const payloadRes = await fetch(`${siteUrl}/api/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: body.token, password: body.password }),
    })

    const responseBody = await payloadRes.text()
    return new NextResponse(responseBody, {
      status: payloadRes.status,
      headers: { 'Content-Type': payloadRes.headers.get('Content-Type') ?? 'application/json' },
    })
  } catch (err) {
    console.error('[api/auth/reset-password]', err)
    return NextResponse.json(
      { errors: [{ message: 'Something went wrong. Please try again.' }] },
      { status: 500 },
    )
  }
}
