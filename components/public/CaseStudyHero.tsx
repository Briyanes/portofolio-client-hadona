'use client';

import Image from 'next/image';
import type { CaseStudy } from '@/lib/types';
import { MetricCard } from './MetricCard';

interface CaseStudyHeroProps {
  caseStudy: CaseStudy;
}

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  // Extract metrics from metadata if available
  const metrics = caseStudy.metrics
    ? Object.entries(caseStudy.metrics).slice(0, 4)
    : [];

  return (
    <section className="animate-fade-in">
      {/* Category Badge */}
      {caseStudy.category && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hadona-primary/10 text-hadona-primary font-semibold text-sm mb-6">
          <i className={`bi ${caseStudy.category.icon || 'bi-tag'}`}></i>
          {caseStudy.category.name}
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        {caseStudy.title}
      </h1>

      {/* Client Logo */}
      {caseStudy.client_logo_url && (
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={caseStudy.client_logo_url}
                alt={caseStudy.client_name}
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-gray-900">{caseStudy.client_name}</span>
          </div>
        </div>
      )}

      {/* Hero Image */}
      {caseStudy.hero_image_url && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src={caseStudy.hero_image_url}
            alt={caseStudy.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Metrics Grid */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(([key, value], index) => (
            <MetricCard
              key={key}
              label={key}
              value={String(value)}
              icon="bi-graph-up-arrow"
              color="#2B46BB"
            />
          ))}
        </div>
      )}
    </section>
  );
}
