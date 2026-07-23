import React from 'react';
import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import '../styles/globals.css';
import '../styles/pages.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollAnimate from './ScrollAnimate';

// Initialize fonts using next/font/google
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-heading',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kallipgur Coalition Aboriginal Corporation',
  description:
    'Rooted in Country. Rising Together. A community-focused Aboriginal organisation dedicated to cultural strength, community wellbeing, and self-determination.',
  openGraph: {
    title: 'Kallipgur Coalition Aboriginal Corporation',
    description:
      'Rooted in Country. Rising Together. A community-focused Aboriginal organisation dedicated to cultural strength, community wellbeing, and self-determination.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hankenGrotesk.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollAnimate />
      </body>
    </html>
  );
}
