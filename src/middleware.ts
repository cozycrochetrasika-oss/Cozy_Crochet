import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/auth/admin-session';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side route protection for Cozy_Crochets Admin
 * Enforces server-side authentication rejecting unauthenticated or non-admin requests.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exempt /admin/login from authentication barrier
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect /admin and any nested route /admin/*
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const session = request.cookies.get(ADMIN_COOKIE)?.value;

    if (!(await verifyAdminSession(session))) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
