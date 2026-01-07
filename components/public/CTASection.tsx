import { getWhatsAppURL } from '@/lib/constants';

interface CTASectionProps {
  variant?: 'home' | 'category' | 'case-study';
}

export function CTASection({ variant = 'home' }: CTASectionProps) {
  const getContent = () => {
    switch (variant) {
      case 'home':
        return {
          title: 'Ingin Hasil Seperti Ini?',
          description: 'Konsultasikan kebutuhan digital marketing bisnis Anda dengan Hadona Digital Media dan raih target bisnis Anda bersama kami',
        };
      case 'category':
        return {
          title: 'Butuh Bantuan di Kategori Ini?',
          description: 'Tim kami siap membantu Anda mencapai target digital marketing di industri ini',
        };
      case 'case-study':
        return {
          title: 'Tertarik dengan Hasil Ini?',
          description: 'Diskusikan kebutuhan bisnis Anda dengan kami dan dapatkan strategi yang tepat',
        };
      default:
        return {
          title: 'Ingin Hasil Seperti Ini?',
          description: 'Konsultasikan kebutuhan digital marketing bisnis Anda',
        };
    }
  };

  const content = getContent();

  return (
    <section className="section-container py-10">
      <div className="bg-gradient-to-br from-hadona-primary via-hadona-dark to-hadona-bg-dark rounded-3xl p-6 md:p-8 lg:p-10 text-center text-white shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-dots-pattern" style={{
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 animate-float">
            <i className="bi bi-rocket-takeoff-fill text-3xl text-hadona-yellow"></i>
          </div>

          {/* Content */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
            {content.title}
          </h2>
          <p className="text-body text-gray-200 mb-8 max-w-2xl mx-auto">
            {content.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppURL(`Halo Hadona, saya tertarik dengan ${variant === 'case-study' ? 'studi kasus' : 'layanan'} yang saya lihat di portfolio`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-hadona-yellow text-gray-900 hover:bg-hadona-yellow-dark group w-full sm:w-auto"
            >
              <i className="bi bi-whatsapp text-xl"></i>
              Hubungi via WhatsApp
            </a>
            <a
              href="https://hadona.id"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all hover:scale-105 inline-flex items-center gap-2 w-full sm:w-auto"
            >
              <i className="bi bi-globe text-xl"></i>
              Kunjungi Website
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
