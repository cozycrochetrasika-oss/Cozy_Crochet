import type { Metadata, Viewport } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const fontDisplay = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Cozy_Crochets — The Living Yarn Store',
  description:
    'Handmade artisan crochet creations made one stitch at a time. Discover everlasting bouquets, woven bags, plush footwear, floral stems, and bespoke gifts.',
  robots: { index: false, follow: false },
  keywords: ['crochet', 'handmade', 'yarn', 'crochet flowers', 'crochet bag', 'artisan craft'],
  openGraph: {
    title: 'Cozy_Crochets — The Living Yarn Store',
    description: 'Heirloom handmade crochet art crafted loop by loop with love.',
    siteName: 'Cozy_Crochets',
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFCFD',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="font-body bg-bg text-fg min-h-screen flex flex-col selection:bg-pink-100 selection:text-pink-900">
        <SmoothScrollProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
