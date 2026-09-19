import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword } from '@/lib/auth/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
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

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated.',
    });
  } catch (error) {
    console.error('Error changing admin password:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
