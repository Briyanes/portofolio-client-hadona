'use client';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  features: readonly string[] | string[];
}

interface ServicesOverviewSectionProps {
  services: readonly Service[] | Service[];
  columns?: 2 | 3 | 4;
}

export function ServicesOverviewSection({ services, columns = 3 }: ServicesOverviewSectionProps) {
  const gridCols =
    columns === 2
      ? 'md:grid-cols-2'
      : columns === 4
        ? 'md:grid-cols-2 lg:grid-cols-4'
        : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-2 bg-hadona-primary/10 text-hadona-primary
                        rounded-full text-sm font-bold mb-4">
          LAYANAN KAMI
        </span>
        <h2 className="text-section-title text-gray-900 mb-6">
          Solusi Digital Marketing Terintegrasi
        </h2>
        <p className="text-body text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Kami menawarkan layanan lengkap untuk membantu bisnis Anda tumbuh di era digital
        </p>
      </div>

      {/* Services Grid */}
      <div className={`grid grid-cols-1 ${gridCols} gap-6 md:gap-8 mb-8`}>
        {services.map((service, index) => (
          <div
            key={service.id}
            className="card-base hover:shadow-xl hover:scale-[1.02]
                       transition-all duration-300 flex flex-col animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${service.color}15` }}
            >
              <i
                className={`bi ${service.icon} text-2xl`}
                style={{ color: service.color }}
              ></i>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed flex-1">{service.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-600 mb-6">Butuh layanan yang tidak tercantum di atas?</p>
        <a
          href="https://hadona.id/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <i className="bi bi-chat-dots text-xl"></i>
          Diskusikan Kebutuhan Anda
        </a>
      </div>
    </section>
  );
}
