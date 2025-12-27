import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseClient } from './lib/supabase-admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = ['/', '/admin/login'];
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith('/studi-kasus'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin/dashboard')) {
    try {
      const supabase = await createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verify user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('id', session.user.id)
        .eq('is_active', true)
        .single();

      if (!adminUser) {
        // Not an admin, redirect to login
        await supabase.auth.signOut();
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown';
    const now = Date.now();

    // Simple in-memory rate limiting (for production, use Redis)
    const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
    const record = rateLimitMap.get(ip);

    const limits: Record<string, { limit: number; window: number }> = {
      '/api/upload': { limit: 10, window: 60000 }, // 10 req/min
      '/api/auth': { limit: 5, window: 60000 }, // 5 req/min
    };

    const limit = Object.entries(limits).find(([route]) => pathname.startsWith(route));

    if (limit) {
      const { limit: maxRequests, window } = limit[1];

      if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + window });
        return NextResponse.next();
      }

      if (record.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
          { status: 429 }
        );
      }

      record.count++;
      rateLimitMap.set(ip, record);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
