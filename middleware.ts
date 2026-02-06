import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // For admin routes, check if auth cookie exists (quick guard — full verification is done server-side)
  const hasAuthCookie = request.cookies.getAll().some(
    (cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')
  );

  if (!hasAuthCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only match admin routes — don't intercept public pages or static assets
export const config = {
  matcher: ['/admin/:path*'],
};
