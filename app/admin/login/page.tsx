'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import AdminInput from '@/components/admin/AdminInput';
import AdminPasswordInput from '@/components/admin/AdminPasswordInput';
import AdminButton from '@/components/admin/AdminButton';
import AdminAlert from '@/components/admin/AdminAlert';
import '../../../styles/admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Fade-in animation mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setEmailError(undefined);
    setPasswordError(undefined);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let hasError = false;

    // Custom Validation
    if (!email) {
      setEmailError('Email address is required.');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    }

    if (hasError) return;

    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          if (
            result.error.includes('disabled') ||
            result.error === 'Your administrator account has been disabled.'
          ) {
            setError('Your administrator account has been disabled.');
          } else {
            setError('Invalid email or password.');
          }
        } else {
          router.push('/admin/dashboard');
          router.refresh();
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      }
    });
  };

  return (
    <div className="admin-login">
      <main 
        className={`admin-login__card ${mounted ? 'admin-fade-in' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.5s ease-out' }}
      >
        <div className="admin-login__header">
          {/* Brand Logo Mark */}
          <div className="admin-login__logo" aria-hidden="true" />
          <h1 className="admin-login__title">
            Kallipgur Coalition
          </h1>
          <span className="admin-login__subtitle">
            Administration Portal
          </span>
          <p className="admin-login__desc">
            Secure access for authorised administrators.
          </p>
        </div>

        {error && (
          <AdminAlert variant="error" dismissible className="mb-5" onDismiss={() => setError(null)}>
            {error}
          </AdminAlert>
        )}

        <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
          <AdminInput
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="admin@kallipgur.org.au"
            required
            disabled={isPending}
            error={emailError}
            autoComplete="email"
          />

          <AdminPasswordInput
            label="Password"
            id="password"
            name="password"
            required
            disabled={isPending}
            error={passwordError}
            autoComplete="current-password"
            placeholder="••••••••"
          />

          <div className="admin-login__extras">
            <label className="admin-checkbox-wrapper">
              <input 
                type="checkbox" 
                name="remember" 
                className="admin-checkbox"
                disabled={isPending}
              />
              <span className="admin-checkbox-label">Remember Me</span>
            </label>

            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Please contact the IT Administrator to reset your password.'); }} 
              className="admin-login__forgot"
            >
              Forgot Password?
            </a>
          </div>

          <AdminButton
            type="submit"
            variant="primary"
            loading={isPending}
            fullWidth
            style={{ marginTop: '0.5rem' }}
          >
            {isPending ? 'Signing in...' : 'Sign in to portal'}
          </AdminButton>
        </form>

        <div className="admin-login__footer">
          <p className="admin-login__footer-text">
            © {new Date().getFullYear()} Kallipgur Coalition Aboriginal Corporation. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
