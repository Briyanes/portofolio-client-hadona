import type { CaseStudy } from '@/lib/types';

interface QuickInfoBarProps {
  caseStudy: CaseStudy;
}

interface InfoCard {
  icon: string;
  label: string;
  value: string | React.ReactNode;
  href?: string;
}

export function QuickInfoBar({ caseStudy }: QuickInfoBarProps) {
  const infoCards: InfoCard[] = [
    {
      icon: 'bi-building',
      label: 'Nama Klien',
      value: caseStudy.client_name,
    },
  ];

  // Add category card if exists
  if (caseStudy.category) {
    infoCards.push({
      icon: 'bi-tag',
      label: 'Industry',
      value: caseStudy.category.name,
    });
  }

  // Add services card
  if (caseStudy.services) {
    infoCards.push({
      icon: 'bi-gear',
      label: 'Layanan',
      value: caseStudy.services,
    });
  }

  // Add website card if exists
  if (caseStudy.website_url) {
    infoCards.push({
      icon: 'bi-globe',
      label: 'Website',
      value: (
        <a
          href={caseStudy.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-hadona-yellow transition-colors inline-flex items-center gap-2 group"
        >
          <span>Kunjungi</span>
          <i className="bi bi-box-arrow-up-right text-sm group-hover:translate-x-1 transition-transform"></i>
        </a>
      ),
    });
  }

  // Add social media card if any links exist
  if (caseStudy.instagram_url || caseStudy.facebook_url) {
    infoCards.push({
      icon: 'bi-share',
      label: 'Social Media',
      value: (
        <div className="flex flex-col gap-2">
          {caseStudy.instagram_url && (
            <a
              href={caseStudy.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-hadona-yellow transition-colors inline-flex items-center gap-2 group"
            >
              <i className="bi bi-instagram group-hover:scale-110 transition-transform"></i>
              <span>Instagram</span>
            </a>
          )}
          {caseStudy.facebook_url && (
            <a
              href={caseStudy.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-hadona-yellow transition-colors inline-flex items-center gap-2 group"
            >
              <i className="bi bi-facebook group-hover:scale-110 transition-transform"></i>
              <span>Facebook</span>
            </a>
          )}
        </div>
      ),
    });
  }

  return (
    <section className="bg-gradient-to-br from-hadona-primary to-hadona-bg-dark text-white py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6
                         hover:bg-white/15 transition-all duration-300
                         hover:scale-105 hover:shadow-xl
                         animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <i className={`bi ${card.icon} text-2xl text-hadona-yellow`}></i>
                <p className="text-sm text-gray-200 font-medium uppercase tracking-wide">
                  {card.label}
                </p>
              </div>
              <div className="text-xl font-bold leading-tight">
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
