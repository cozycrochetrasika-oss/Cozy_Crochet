import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side route protection for Cozy_Crochets Admin
 * Enforces server-side authentication rejecting unauthenticated or non-admin requests.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and any nested route /admin/*
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const roleCookie = request.cookies.get('cozy_auth_role')?.value;

    if (roleCookie !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'admin_access_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
