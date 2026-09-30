import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Grain } from '@/components/chrome/Grain';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { copy, isLocale, locales } from '@/content/copy';
import '../globals.css';

const arabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['300', '400', '500'], variable: '--font-arabic', display: 'swap' });

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-display', display: 'swap' });

export const viewport: Viewport = { themeColor: '#0C0B0A', viewportFit: 'cover' };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const t = copy[params.locale];
  return {
    // Set NEXT_PUBLIC_SITE_URL in Vercel once the production domain is decided.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pluto-co.com'),
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: '/en', ar: '/ar' } },
    openGraph: { title: t.meta.title, description: t.meta.description, images: ['/posters/globe.jpg'] },
  };
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const rtl = params.locale === 'ar';

  return (
    <html lang={params.locale} dir={rtl ? 'rtl' : 'ltr'} className={`${GeistSans.variable} ${GeistMono.variable} ${arabic.variable} ${display.variable}`}>
      <head>
        <link rel="preload" as="image" href="/posters/globe.jpg" fetchPriority="high" />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Grain />
      </body>
    </html>
  );
}
