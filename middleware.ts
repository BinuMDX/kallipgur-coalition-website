import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { NextResponse } from 'next/server';

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = nextUrl.pathname === '/admin/login';
  const isBaseAdminRoute = nextUrl.pathname === '/admin';

  // Always allow NextAuth API routes
  if (isApiAuthRoute) {
    return;
  }

  // Handle the Login Page
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    return;
  }

  // Handle base /admin route
  if (isBaseAdminRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    } else {
      return NextResponse.redirect(new URL('/admin/login', nextUrl));
    }
  }

  // Handle all other protected /admin routes
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', nextUrl));
  }

  return;
});

export const config = {
  // Protect /admin routes and API routes. Exclude static files and Next.js internals.
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
