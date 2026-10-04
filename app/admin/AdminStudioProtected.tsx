'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminStudioView } from '@/components/admin/AdminStudioView';

interface AdminStudioProtectedProps {
  adminEmail: string;
}

export function AdminStudioProtected({ adminEmail }: AdminStudioProtectedProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  const handleExitToPublic = () => {
    router.push('/');
  };

  return (
    <AdminStudioView
      onExit={handleExitToPublic}
      adminEmail={adminEmail}
      onLogout={handleLogout}
    />
  );
}
