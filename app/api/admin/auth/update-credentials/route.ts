import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedAdmin,
  updateAdminCredentials,
  createSessionToken,
  getSessionCookieOptions,
  getStoredAdminCredentials
} from '@/lib/auth-server';

export async function GET() {
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const creds = getStoredAdminCredentials();
  return NextResponse.json({
    email: creds.email,
    updatedAt: creds.updatedAt
  });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized: Session required to update administrator credentials.' },
      { status: 401 }
     );
  }

  try {
    const body = await req.json();
    const { currentPassword, newEmail, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required to verify your authorization.' },
        { status: 400 }
      );
    }

    if (!newEmail && !newPassword) {
      return NextResponse.json(
        { error: 'Please provide a new email address or new password to update.' },
        { status: 400 }
      );
    }

    const result = updateAdminCredentials(currentPassword, newEmail, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update credentials.' },
        { status: 400 }
      );
    }

    // Generate fresh session token with updated email
    const updatedEmail = result.email || auth.email || 'alec@soundvolumes.com';
    const newToken = createSessionToken(updatedEmail);
    const cookieOpts = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      email: updatedEmail,
      message: 'Admin credentials and password updated successfully!'
    });

    response.cookies.set(cookieOpts.name, newToken, {
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge
    });

    return response;
  } catch (error) {
    console.error('Update credentials error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating credentials.' },
      { status: 500 }
    );
  }
}
