import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import { CMSProvider } from '@/lib/cms-context';
import { AdminStudioProtected } from './AdminStudioProtected';

export const metadata = {
  title: 'Sound Volumes — Author Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  // SERVER-SIDE DIRECT URL PROTECTION:
  // Reject unauthenticated requests and redirect to /admin/login before rendering
  const auth = await getAuthenticatedAdmin();

  if (!auth.authenticated) {
    redirect('/admin/login');
  }

  return (
    <CMSProvider>
      <AdminStudioProtected adminEmail={auth.email || 'alec@soundvolumes.com'} />
    </CMSProvider>
  );
}
