import { NextRequest, NextResponse } from 'next/server'

/**
 * Sets an `x-pathname` request header so the (frontend) root layout can tell
 * which route is rendering — Next gives layouts no pathname otherwise. The root
 * layout uses it to inject the EV report's <head> tracking scripts (Clarity +
 * HappierLeads) on that route only.
 *
 * Scoped to the EV report path via the matcher, so middleware runs nowhere else.
 */
export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', req.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/reports/ev-ecosystem'],
}
