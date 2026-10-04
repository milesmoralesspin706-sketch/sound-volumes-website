'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Check, AlertCircle, Eye, EyeOff, RefreshCw, Lock } from 'lucide-react';

interface AdminSecurityTabProps {
  initialEmail?: string;
  onCredentialsUpdated?: (newEmail: string) => void;
}

export function AdminSecurityTab({ initialEmail, onCredentialsUpdated }: AdminSecurityTabProps) {
  const [currentEmail, setCurrentEmail] = useState(initialEmail || 'alec@soundvolumes.com');
  const [newEmail, setNewEmail] = useState(initialEmail || 'alec@soundvolumes.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // Fetch current credentials profile on mount
  useEffect(() => {
    fetch('/api/admin/auth/update-credentials')
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setCurrentEmail(data.email);
          setNewEmail(data.email);
        }
        if (data.updatedAt) {
          setUpdatedAt(data.updatedAt);
        }
      })
      .catch(() => {
        // use initial
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage('Current password is required to authorize changes.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        setErrorMessage('New password must be at least 8 characters in length.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('New password and confirmation do not match.');
        return;
      }
    }

    if (newEmail.trim() === currentEmail && !newPassword) {
      setErrorMessage('Please enter a new password or change the email address to update.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail.trim() !== currentEmail ? newEmail.trim() : undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update admin credentials.');
      }

      setSuccessMessage(
        newPassword
          ? 'Admin username and password successfully updated! Future logins will require the new password.'
          : 'Admin username/email successfully updated!'
      );

      if (data.email) {
        setCurrentEmail(data.email);
        setNewEmail(data.email);
        if (onCredentialsUpdated) {
          onCredentialsUpdated(data.email);
        }
      }

      setUpdatedAt(new Date().toISOString());
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <div className="flex items-center gap-2 text-stone-900 mb-1">
          <Shield className="w-5 h-5 text-amber-600" />
          <h2 className="font-serif text-2xl font-medium">Admin Security & Password</h2>
        </div>
        <p className="text-xs text-stone-600 font-sans">
          Manage the authorized administrator account and change the login password at any time. Changes take effect immediately and persist permanently.
        </p>
      </div>

      {/* Security Status Card */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Active Admin Username:</span>
            <span className="font-mono font-semibold text-stone-900 bg-white px-2 py-0.5 border border-stone-200 rounded">
              {currentEmail}
            </span>
          </div>
          <div className="text-[11px] text-stone-500">
            Last Updated: {updatedAt && updatedAt !== 'Initial' ? new Date(updatedAt).toLocaleString() : 'Default Production Credentials'}
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium">
            <Check className="w-3 h-3 text-emerald-600" />
            PBKDF2 SHA-512 Protected
          </span>
        </div>
      </div>

      {/* Account Info Box */}
      <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded text-xs font-sans text-amber-950 space-y-1.5">
        <div className="font-semibold flex items-center gap-1.5 text-amber-900">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>Admin Account & Password Flexibility</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Initial system credentials are <code className="font-mono bg-amber-100/80 text-amber-950 px-1 py-0.5 rounded">alec@soundvolumes.com</code> with password <code className="font-mono bg-amber-100/80 text-amber-950 px-1 py-0.5 rounded">SoundVolumes2026!Author</code>. You can change your password and login email at any time using the form below. Once saved, the new password is encrypted with a unique salt and immediately required for subsequent logins.
        </p>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border-l-2 border-rose-600 text-rose-800 text-xs font-sans flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border-l-2 border-emerald-600 text-emerald-900 text-xs font-sans flex items-start gap-2.5">
          <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Credential Update Form */}
      <form onSubmit={handleUpdate} className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-stone-200 pb-4">
          <h3 className="font-serif text-lg font-medium text-stone-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-stone-700" />
            <span>Update Admin Login Password & Credentials</span>
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Enter your current password to verify authorization, then enter a new password or update the administrative email address.
          </p>
        </div>

        {/* 1. Admin Email */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
            Admin Username / Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
              placeholder="alec@soundvolumes.com"
            />
          </div>
          <span className="block text-[11px] text-stone-500 font-sans mt-1">
            Used to log in at /admin/login.
          </span>
        </div>

        {/* 2. Current Password */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
            Current Password <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type={showCurrent ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter existing password to verify"
              className="w-full bg-stone-50 border border-stone-300 pl-9 pr-10 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3. New Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
              New Password (Optional)
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                className="w-full bg-stone-50 border border-stone-300 px-3 py-2 pr-10 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="block text-[11px] text-stone-500 font-sans mt-1">
              Minimum 8 characters.
            </span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 font-sans">
            All passwords are encrypted with PBKDF2 with unique salts.
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs uppercase tracking-widest font-sans font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5" />
                <span>Save New Credentials</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
