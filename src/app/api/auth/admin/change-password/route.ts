import { ADMIN_COOKIE, verifyAdminSession, adminCookieOptions } from '@/lib/auth/admin-session';
import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword } from '@/lib/auth/admin-auth';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  if (!(await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value))) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || !currentPassword || !newPassword || currentPassword.length > 1024 || newPassword.length > 1024) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    const result = changeAdminPassword(currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Password change failed.' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true, message: 'Password updated. Please sign in again.' });
    response.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    console.error('Error changing admin password:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
