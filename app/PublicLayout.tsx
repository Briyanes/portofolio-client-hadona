'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Cek apakah halaman saat ini adalah halaman admin
  const isAdminPage = pathname?.startsWith('/admin');

  // Jangan tampilkan Header dan Footer untuk halaman admin
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Tampilkan Header dan Footer untuk halaman publik
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
