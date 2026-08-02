import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { comparePassword } from './password';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error('Invalid email or password.');
        }

        const isPasswordValid = await comparePassword(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password.');
        }

        if (!user.isActive) {
          throw new Error('Your administrator account has been disabled.');
        }

        // Update lastLogin without waiting to avoid blocking response
        prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        }).catch(console.error);

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
});
