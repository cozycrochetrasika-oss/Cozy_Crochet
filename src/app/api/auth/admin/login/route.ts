import { ADMIN_COOKIE, createAdminSession, adminCookieOptions } from '@/lib/auth/admin-session';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminRecord, verifyAdminPassword, bootstrapAdmin } from '@/lib/auth/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    if (origin && origin !== request.nextUrl.origin && !origin.includes('netlify.app')) {
      return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password || password.length > 1024) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const adminEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || 'cozycrochetrasika@gmail.com').toLowerCase();
    const emailMatches = adminEmail === email.trim().toLowerCase();

    if (!emailMatches) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    let isValid = verifyAdminPassword(password);

    // Initial bootstrap check if no stored record exists yet
    if (!isValid && !getAdminRecord() && process.env.ADMIN_BOOTSTRAP_PASSWORD) {
      if (password === process.env.ADMIN_BOOTSTRAP_PASSWORD) {
        bootstrapAdmin(adminEmail, password);
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: 'admin_owner',
        email: email.trim().toLowerCase(),
        fullName: 'Rasika (Store Owner)',
        role: 'admin',
      },
    });

    const sessionToken = await createAdminSession();
    response.cookies.set(ADMIN_COOKIE, sessionToken, adminCookieOptions);
    response.cookies.set('cozy_auth_role', 'admin', { path: '/', maxAge: 86400, sameSite: 'lax' });

    return response;
  } catch (error) {
    console.error('Error logging in admin:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}
