import { NextRequest, NextResponse } from 'next/server';
import {
  verifyCredentials,
  createSessionToken,
  getSessionCookieOptions,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit
} from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'client-ip';
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${rateCheck.remainingWaitSecs} seconds before trying again.`
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    const isValid = verifyCredentials(email, password);

    if (!isValid) {
      recordFailedAttempt(ip);
      // Generic failure message to avoid account enumeration
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Success: clear rate limit counter and issue token
    clearRateLimit(ip);
    const token = createSessionToken(email.trim().toLowerCase());
    const cookieOpts = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      user: {
        email: email.trim().toLowerCase(),
        role: 'Author Administrator'
      }
    });

    response.cookies.set({
      name: cookieOpts.name,
      value: token,
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable.' },
      { status: 500 }
    );
  }
}
