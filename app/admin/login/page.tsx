'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Container from '@/components/ui/Container';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          // Auth.js v5 returns 'Configuration' or similar for custom thrown errors sometimes.
          // The actual thrown error message can be parsed or we can rely on standard generic messaging
          // if the custom message gets swallowed, but usually result.error contains it or 'CredentialsSignin'.
          if (result.error.includes('disabled') || result.error === 'Your administrator account has been disabled.') {
             setError('Your administrator account has been disabled.');
          } else {
             setError('Invalid email or password.');
          }
        } else {
          router.push('/admin/dashboard');
          router.refresh(); // Refresh to update middleware state
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-100">
            Kallipgur Administration
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Sign in to access the portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-neutral-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-700">
            {error && (
              <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isPending}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-500 bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    disabled={isPending}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-500 bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-neutral-400 hover:text-neutral-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-neutral-900 bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-neutral-900 disabled:opacity-50 transition-colors"
                >
                  {isPending ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
