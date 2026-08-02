import { ReactNode } from 'react';
import Link from 'next/link';
import { auth, signOut } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // If session somehow drops but middleware misses it, we fallback securely, but 
  // normally middleware intercepts the request before rendering.
  if (!session?.user) {
    redirect('/admin/login');
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Membership Applications', href: '/admin/dashboard' }, // Placeholder
    { name: 'News (Placeholder)', href: '/admin/dashboard' },
    { name: 'Gallery (Placeholder)', href: '/admin/dashboard' },
    { name: 'Donations (Placeholder)', href: '/admin/dashboard' },
    { name: 'Settings (Placeholder)', href: '/admin/dashboard' },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <h1 className="text-xl font-bold text-primary-400">Kallipgur Admin</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-neutral-100 bg-red-900/50 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6">
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-200">
                {session.user.name}
              </p>
              <p className="text-xs text-neutral-500 capitalize">
                {(session.user as any).role.replace('_', ' ').toLowerCase()}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-900 flex items-center justify-center text-primary-400 font-bold border border-primary-700">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
