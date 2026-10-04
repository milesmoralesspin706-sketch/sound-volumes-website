'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Colophon } from '@/components/common/Colophon';
import { Lock, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch('/api/admin/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.replace('/admin');
            return;
          }
        }
      } catch {
        // ignore
      } finally {
        setCheckingSession(false);
      }
    }
    checkExistingSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // Success: redirect to protected /admin
      router.push('/admin');
    } catch {
      setErrorMessage('Unable to connect to authentication service.');
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-stone-500 font-sans animate-pulse">
          Verifying editorial session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3eb] flex flex-col justify-between p-3 sm:p-6 lg:p-8">
      {/* Top Bar Link back to public sites */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#736b62] hover:text-[#1c1917] transition-colors font-sans min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Sites</span>
        </Link>
        <span className="text-[11px] font-mono text-[#8c847a]">Sound Volumes Network</span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8 sm:my-12 bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-8 md:p-10 shadow-xs">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <Colophon size={40} className="text-[#1c1917]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium tracking-tight mb-1">
            Author Admin
          </h1>
          <p className="text-[#736b62] text-xs uppercase tracking-widest font-sans">
            Sound Volumes Private Portal
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-[#fbf0ec] border-l-2 border-[#944222] text-[#7a3218] text-xs font-sans flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#944222] mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs uppercase tracking-widest text-[#524b43] font-sans mb-1.5"
            >
              Author / Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alec@soundvolumes.com"
              className="w-full bg-[#fbf9f4] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs min-h-[44px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs uppercase tracking-widest text-[#524b43] font-sans"
              >
                Password
              </label>
            </div>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#fbf9f4] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs min-h-[44px]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors disabled:opacity-50 min-h-[44px]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Author Admin'}</span>
            </button>
          </div>
        </form>

        {/* Admin Credentials Notice for quick reference */}
        <div className="mt-6 p-3.5 bg-[#f5ede1] border border-[#ded5c5] rounded-xs text-xs font-sans text-[#524b43] space-y-1">
          <div className="font-medium text-[#1c1917] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#944222]" />
            <span>Administrator Credentials</span>
          </div>
          <div className="text-[11px] text-[#635c53]">
            Sign in with your administrator email and password (e.g. <code className="font-mono text-[#1c1917] bg-[#ede6d8] px-1 py-0.5 rounded">alec@soundvolumes.com</code> or your environment account).
          </div>
          <div className="text-[11px] text-[#736b62]">
            Your login password and administrator email can always be changed and updated inside Author Admin.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#eae3d5] flex items-center justify-center gap-2 text-[11px] text-[#736b62] font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-[#944222]" />
          <span>Server-enforced cryptographic authentication (PBKDF2 SHA-512).</span>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-[#8c847a] font-sans py-2">
        © {new Date().getFullYear()} Sound Volumes. Private author and publishing infrastructure.
      </div>
    </div>
  );
}
