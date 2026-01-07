type SectionType = 'challenge' | 'strategy' | 'results';

interface ContentSectionProps {
  type: SectionType;
  content: string;
  title?: string;
}

const sectionConfig = {
  challenge: {
    icon: 'bi-exclamation-triangle',
    iconColor: '#E74C3C',
    label: 'REQUEST',
    title: 'Tantangan Klien',
    bgGradient: 'from-red-50 to-orange-50',
    borderColor: 'border-red-500',
    labelColor: 'text-red-600',
  },
  strategy: {
    icon: 'bi-lightbulb',
    iconColor: '#2B46BB',
    label: 'ACTION',
    title: 'Strategi & Eksekusi',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-600',
    labelColor: 'text-blue-600',
  },
  results: {
    icon: 'bi-trophy',
    iconColor: '#27AE60',
    label: 'RESULT',
    title: 'Hasil & Dampak',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-600',
    labelColor: 'text-green-600',
  },
} as const;

export function ContentSection({ type, content, title }: ContentSectionProps) {
  const config = sectionConfig[type];

  return (
    <section className="mb-10 animate-slide-in-left">
      <div className={`bg-gradient-to-br ${config.bgGradient} rounded-2xl p-6
                      border-l-4 ${config.borderColor}
                      shadow-lg hover:shadow-xl transition-all duration-300
                      hover:scale-[1.01]`}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center
                       bg-white shadow-lg hover:scale-110
                       transition-transform duration-300"
          >
            <i className={`bi ${config.icon} text-xl md:text-2xl`} style={{ color: config.iconColor }}></i>
          </div>
          <div>
            <p className={`text-sm font-bold ${config.labelColor} uppercase tracking-wide`}>
              {config.label}
            </p>
            <h2 className="text-h4-mobile md:text-h4-tablet lg:text-h4-desktop font-bold text-gray-900">
              {title || config.title}
            </h2>
          </div>
        </div>

        <div className="prose max-w-none mt-6">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base md:text-lg">
            {content}
          </p>
        </div>
      </div>
    </section>
  );
}
