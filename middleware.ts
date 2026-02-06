import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Only match admin routes — don't intercept public pages or static assets
export const config = {
  matcher: ['/admin/:path*'],
};
