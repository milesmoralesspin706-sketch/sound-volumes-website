import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'sv_admin_session';

// Production & fallback credentials from environment variables
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'alec@soundvolumes.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SoundVolumes2026!Author';
const SESSION_SECRET = process.env.SESSION_SECRET || 'sv-literary-session-secret-key-production-2026';

// Path for persistent admin credentials file
const AUTH_FILE_PATH = path.join(process.cwd(), 'data', 'admin-auth.json');

export interface StoredAdminCredentials {
  email: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

// Retrieve current admin credentials (from file or defaults)
export function getStoredAdminCredentials(): StoredAdminCredentials {
  try {
    if (fs.existsSync(AUTH_FILE_PATH)) {
      const content = fs.readFileSync(AUTH_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (data && data.email && data.passwordHash && data.salt) {
        return data;
      }
    }
  } catch {
    // fallback to defaults
  }

  const defaultSalt = 'soundvolumes-author-salt-2026';
  const defaultHash = crypto.pbkdf2Sync(DEFAULT_ADMIN_PASSWORD, defaultSalt, 100000, 64, 'sha512').toString('hex');
  return {
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash: defaultHash,
    salt: defaultSalt,
    updatedAt: 'Initial'
  };
}

// Brute-force rate limiting: max 5 failed attempts per IP/key in 15 minutes
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();

export function checkRateLimit(identifier: string): { allowed: boolean; remainingWaitSecs?: number } {
  const record = loginAttempts.get(identifier);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingWaitSecs = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingWaitSecs };
  }

  if (record.attempts >= 5) {
    // Reset if cooldown has passed
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15 minute lock
  }
  loginAttempts.set(identifier, record);
}

export function clearRateLimit(identifier: string) {
  loginAttempts.delete(identifier);
}

export function verifyCredentials(email: string, password: string): boolean {
  if (!email || !password) return false;

  const currentCreds = getStoredAdminCredentials();
  const normalizedInputEmail = email.trim().toLowerCase();
  const normalizedAdminEmail = currentCreds.email.trim().toLowerCase();

  // Primary check: against stored credentials (or env default)
  if (normalizedInputEmail === normalizedAdminEmail) {
    const inputHash = crypto.pbkdf2Sync(password, currentCreds.salt, 100000, 64, 'sha512').toString('hex');
    const isPasswordMatch = crypto.timingSafeEqual(
      Buffer.from(inputHash),
      Buffer.from(currentCreds.passwordHash)
    );
    if (isPasswordMatch) return true;
  }

  // Fallback initial check: if no custom credentials file has been created yet,
  // also allow the default imprint credentials (alec@soundvolumes.com / SoundVolumes2026!Author)
  if (!fs.existsSync(AUTH_FILE_PATH)) {
    if (normalizedInputEmail === 'alec@soundvolumes.com') {
      const defaultSalt = 'soundvolumes-author-salt-2026';
      const defaultHash = crypto.pbkdf2Sync('SoundVolumes2026!Author', defaultSalt, 100000, 64, 'sha512').toString('hex');
      const inputHash = crypto.pbkdf2Sync(password, defaultSalt, 100000, 64, 'sha512').toString('hex');
      if (crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(defaultHash))) {
        return true;
      }
    }
  }

  return false;
}

// Update Admin Email and/or Password with verification
export function updateAdminCredentials(
  currentPassword: string,
  newEmail?: string,
  newPassword?: string
): { success: boolean; error?: string; email?: string } {
  const currentCreds = getStoredAdminCredentials();

  // Verify current password first
  const inputHash = crypto.pbkdf2Sync(currentPassword, currentCreds.salt, 100000, 64, 'sha512').toString('hex');
  let isPasswordMatch = crypto.timingSafeEqual(
    Buffer.from(inputHash),
    Buffer.from(currentCreds.passwordHash)
  );

  if (!isPasswordMatch && !fs.existsSync(AUTH_FILE_PATH)) {
    const defaultSalt = 'soundvolumes-author-salt-2026';
    const fallbackHash = crypto.pbkdf2Sync('SoundVolumes2026!Author', defaultSalt, 100000, 64, 'sha512').toString('hex');
    const fallbackInputHash = crypto.pbkdf2Sync(currentPassword, defaultSalt, 100000, 64, 'sha512').toString('hex');
    if (crypto.timingSafeEqual(Buffer.from(fallbackInputHash), Buffer.from(fallbackHash))) {
      isPasswordMatch = true;
    }
  }

  if (!isPasswordMatch) {
    return { success: false, error: 'Current password does not match. Please verify your current password.' };
  }

  let updatedEmail = currentCreds.email;
  if (newEmail && newEmail.trim()) {
    const trimmedEmail = newEmail.trim().toLowerCase();
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    updatedEmail = trimmedEmail;
  }

  let updatedHash = currentCreds.passwordHash;
  let updatedSalt = currentCreds.salt;

  if (newPassword && newPassword.trim()) {
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }
    // Generate fresh cryptographic salt for updated password
    updatedSalt = crypto.randomBytes(16).toString('hex');
    updatedHash = crypto.pbkdf2Sync(newPassword, updatedSalt, 100000, 64, 'sha512').toString('hex');
  }

  const payload: StoredAdminCredentials = {
    email: updatedEmail,
    passwordHash: updatedHash,
    salt: updatedSalt,
    updatedAt: new Date().toISOString()
  };

  try {
    const dir = path.dirname(AUTH_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
    return { success: true, email: updatedEmail };
  } catch (err) {
    console.error('Failed to write admin credentials:', err);
    return { success: false, error: 'Failed to save updated credentials to secure storage.' };
  }
}


export interface SessionPayload {
  email: string;
  role: 'author_admin';
  iat: number;
  exp: number;
}

export function createSessionToken(email: string): string {
  const now = Date.now();
  const payload: SessionPayload = {
    email,
    role: 'author_admin',
    iat: now,
    exp: now + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  if (!token || typeof token !== 'string') return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payloadStr, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadStr)
    .digest('base64url');

  // Timing safe signature verification
  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedSigBuffer.length) {
    return { valid: false };
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return { valid: false };
  }

  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadStr, 'base64url').toString('utf8')
    );

    if (Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

// Helper to check authentication in Next.js Server Components / Route Handlers
export async function getAuthenticatedAdmin(): Promise<{ authenticated: boolean; email?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return { authenticated: false };
    }

    const verification = verifySessionToken(sessionCookie.value);
    return {
      authenticated: verification.valid,
      email: verification.email
    };
  } catch {
    return { authenticated: false };
  }
}

export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
  };
}
