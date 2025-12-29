'use client';

import { useEffect, useState, useRef } from 'react';

interface AgencyMetrics {
  totalClients?: number;
  totalCaseStudies?: number;
  avgROAS?: string;
  yearsExperience?: number;
  clientRetention?: string;
  totalRevenue?: string;
}

interface MetricsSectionProps {
  metrics: AgencyMetrics;
  variant?: 'gradient' | 'cards' | 'minimal';
}

interface MetricItem {
  icon: string;
  label: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  animationKey: string; // Unique key for animation
}

export function MetricsSection({ metrics, variant = 'gradient' }: MetricsSectionProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Define metrics
  const metricItems: MetricItem[] = [
    {
      icon: 'bi-people-fill',
      label: 'Total Klien',
      value: metrics.totalClients || 0,
      suffix: '+',
      animationKey: 'totalClients',
    },
    {
      icon: 'bi-folder-fill',
      label: 'Studi Kasus',
      value: metrics.totalCaseStudies || 0,
      suffix: '+',
      animationKey: 'totalCaseStudies',
    },
    {
      icon: 'bi-graph-up-arrow',
      label: 'Rata-rata ROAS',
      value: metrics.avgROAS || 'N/A',
      animationKey: 'avgROAS',
    },
    {
      icon: 'bi-calendar-check',
      label: 'Tahun Pengalaman',
      value: metrics.yearsExperience || 0,
      suffix: '+',
      animationKey: 'yearsExperience',
    },
  ];

  // Animate numbers on scroll
  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            metricItems.forEach((item) => {
              if (typeof item.value === 'number') {
                const targetValue = item.value;
                const duration = 2000;
                const steps = 60;
                const increment = targetValue / steps;
                let current = 0;

                const timer = setInterval(() => {
                  current += increment;
                  if (current >= targetValue) {
                    current = targetValue;
                    clearInterval(timer);
                  }
                  setAnimatedValues((prev) => ({
                    ...prev,
                    [item.animationKey]: Math.floor(current),
                  }));
                }, duration / steps);
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated, metricItems]);

  const getDisplayValue = (item: MetricItem) => {
    if (typeof item.value === 'string') return item.value;
    if (hasAnimated && animatedValues[item.animationKey] !== undefined) {
      return `${item.prefix || ''}${animatedValues[item.animationKey]}${item.suffix || ''}`;
    }
    return `${item.prefix || ''}${item.value}${item.suffix || ''}`;
  };

  if (variant === 'cards') {
    return (
      <section ref={sectionRef} className="animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-section-title text-gray-900 mb-4">Hasil Nyata yang Terbukti</h2>
          <p className="text-body text-gray-600">Angka berbicara lebih keras daripada kata-kata</p>
        </div>

        <div className="grid-responsive-4">
          {metricItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl
                         transition-all duration-300 hover:scale-105 border border-gray-100
                         text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hadona-primary/10
                            to-hadona-light/10 flex items-center justify-center mx-auto mb-4
                            group-hover:scale-110 transition-transform duration-300">
                <i className={`bi ${item.icon} text-3xl text-hadona-primary`}></i>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {getDisplayValue(item)}
              </div>
              <div className="text-gray-600 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Gradient variant (default)
  return (
    <section ref={sectionRef} className="animate-fade-in">
      <div
        className="bg-gradient-to-br from-hadona-primary via-hadona-dark to-hadona-bg-dark
                    rounded-3xl p-6 md:p-8 lg:p-10 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-dots-pattern"
            style={{ backgroundSize: '40px 40px' }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-section-title mb-4">Hasil Nyata yang Terbukti</h2>
            <p className="text-body text-gray-200">
              Angka berbicara lebih keras daripada kata-kata
            </p>
          </div>

          <div className="grid-responsive-4">
            {metricItems.map((item, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm
                                flex items-center justify-center mx-auto mb-4
                                group-hover:scale-110 group-hover:bg-white/30
                                transition-all duration-300"
                >
                  <i className={`bi ${item.icon} text-4xl text-hadona-yellow`}></i>
                </div>
                <div className="text-5xl font-bold mb-2">{getDisplayValue(item)}</div>
                <div className="text-gray-200 text-lg">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
