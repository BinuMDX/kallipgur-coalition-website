import { ReactNode } from 'react';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import '../../../styles/admin.css';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // Route guard fallback
  if (!session?.user) {
    redirect('/admin/login');
  }

  const serializedUser = {
    name: session.user.name,
    email: session.user.email,
    role: (session.user as any).role || 'ADMIN',
  };

  return (
    <AdminPortalShell user={serializedUser}>
      {children}
    </AdminPortalShell>
  );
}
