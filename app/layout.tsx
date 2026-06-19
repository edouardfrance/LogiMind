import type { Metadata, Viewport } from 'next';
import { Crimson_Pro, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';

const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif-google',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans-google',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://logimind.org'),
  title: {
    default: 'Logimind — Bibliothèque Édouard de Boysson',
    template: '%s — Logimind',
  },
  description:
    'Travaux d\'analyse et de synthèse en psychothérapies et sciences cognitives. Méthode documentaire et systémique. Disponibles en PDF, broché, relié et Kindle.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://logimind.org',
    siteName: 'Logimind',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1b18' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${crimson.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll />
        <Header />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
