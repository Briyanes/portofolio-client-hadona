import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <Image
            src="/logo/logo-hadona.png"
            alt="Hadona Digital Media"
            width={150}
            height={60}
            className="h-auto mx-auto mb-6"
          />
          <h1 className="text-6xl md:text-8xl font-bold text-hadona-primary mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Studi Kasus Tidak Ditemukan
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Maaf, studi kasus yang Anda cari tidak tersedia atau telah dihapus.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#studi-kasus"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-hadona-primary text-white rounded-xl font-bold hover:bg-hadona-dark transition-colors shadow-lg"
          >
            <i className="bi bi-grid-3x3-gap"></i>
            Lihat Semua Studi Kasus
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-bold hover:border-hadona-primary hover:text-hadona-primary transition-colors"
          >
            <i className="bi bi-house"></i>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
