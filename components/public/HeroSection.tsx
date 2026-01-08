'use client';

import { getWhatsAppURL } from '@/lib/constants';
import { usePixelTracking } from '@/lib/hooks/usePixelTracking';

export function HeroSection() {
  const { trackInitiateCheckout } = usePixelTracking();

  const handleScrollToCategories = () => {
    const element = document.getElementById('kategori');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="text-center p-4 md:p-8 lg:p-10 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 animate-fade-in relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-hadona-primary rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-hadona-yellow rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-hero-mobile md:text-hero-tablet lg:text-hero-desktop font-bold text-gray-900 mb-6 md:mb-8 animate-scale-in" style={{ lineHeight: '1.2' }}>
          Studi Kasus<br />
          <span className="text-hadona-primary">Digital Marketing</span>
        </h1>
        <p className="text-body-mobile md:text-body-tablet lg:text-body-desktop text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
          Lihat bagaimana Hadona Digital Media membantu berbagai bisnis mencapai tujuan
          digital marketing mereka dengan strategi yang terbukti efektif.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <button
            onClick={handleScrollToCategories}
            className="btn-primary group w-full sm:w-auto text-sm md:text-base"
          >
            <i className="bi bi-grid-fill text-base md:text-lg"></i>
            Lihat Studi Kasus
          </button>
          <a
            href={getWhatsAppURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary group w-full sm:w-auto text-sm md:text-base"
            onClick={() => trackInitiateCheckout()}
          >
            <i className="bi bi-whatsapp text-base md:text-lg"></i>
            Hubungi Kami
          </a>
        </div>
      </div>
    </div>
  );
}
