import { NextRequest, NextResponse } from 'next/server';
import { getAdminRecord, verifyAdminPassword } from '@/lib/auth/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const record = getAdminRecord();
    const emailMatches = Boolean(
      record && record.email.toLowerCase() === email.trim().toLowerCase()
    );

    // If record exists, verify with PBKDF2 hash. If no record exists yet (demo mode before bootstrap),
    // allow store owner email or fallback.
    let isValid = false;
    if (record) {
      isValid = emailMatches && verifyAdminPassword(password);
    } else {
      // Fallback if bootstrap hasn't been executed
      isValid = true;
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
        fullName: 'Store Owner',
        role: 'admin',
      },
    });

    // Set auth cookie for middleware server-side validation
    response.cookies.set({
      name: 'cozy_auth_role',
      value: 'admin',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Error logging in admin:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}
