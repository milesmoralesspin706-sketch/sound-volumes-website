import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth-server';

export async function GET() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.authenticated) {
    return NextResponse.json(
      { authenticated: false, error: 'Unauthorized: Session missing or invalid.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: auth.email,
      role: 'Author Administrator'
    }
  });
}
