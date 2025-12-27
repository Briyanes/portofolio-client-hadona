import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://portofolio.hadona.id'),
  title: {
    default: 'Portofolio Hadona Digital Media - Studi Kasus Digital Marketing',
    template: '%s | Hadona Digital Media',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  description:
    'Lihat bagaimana Hadona Digital Media membantu berbagai bisnis mencapai tujuan digital marketing mereka. Studi kasus lengkap dari klien kami.',
  keywords: [
    'Hadona',
    'Digital Media',
    'Studi Kasus',
    'Portofolio',
    'Digital Marketing',
    'Iklan Digital',
    'Social Media Marketing',
  ],
  authors: [{ name: 'Hadona Digital Media' }],
  creator: 'Hadona Digital Media',
  publisher: 'Hadona Digital Media',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://portofolio.hadona.id',
    siteName: 'Portofolio Hadona',
    title: 'Portofolio Hadona Digital Media - Studi Kasus Digital Marketing',
    description:
      'Lihat bagaimana Hadona Digital Media membantu berbagai bisnis mencapai tujuan digital marketing mereka.',
    images: [
      {
        url: '/logo/logo-hadona.png',
        width: 1200,
        height: 630,
        alt: 'Hadona Digital Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portofolio Hadona Digital Media - Studi Kasus Digital Marketing',
    description:
      'Lihat bagaimana Hadona Digital Media membantu berbagai bisnis mencapai tujuan digital marketing mereka.',
    images: ['/logo/logo-hadona.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        {/* Spacer for fixed header */}
        <div className="header-spacer" style={{ height: '140px' }}></div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
