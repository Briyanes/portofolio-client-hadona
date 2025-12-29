'use client';

import Image from 'next/image';
import type { CaseStudy } from '@/lib/types';
import { MetricCard } from './MetricCard';
import { ClientLogo } from './ClientLogo';

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
      {caseStudy.categories && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hadona-primary/10 text-hadona-primary font-semibold text-sm md:text-base mb-6">
          <i className={`bi ${caseStudy.categories.icon || 'bi-tag'}`}></i>
          {caseStudy.categories.name}
        </div>
      )}

      {/* Title */}
      <h1 className="text-hero-mobile md:text-hero-tablet lg:text-hero-desktop font-bold text-gray-900 mb-6 leading-tight">
        {caseStudy.title}
      </h1>

      {/* Client Logo */}
      {caseStudy.client_name && (
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-md border border-gray-100">
            <ClientLogo
              src={caseStudy.client_logo_url}
              clientName={caseStudy.client_name}
              size="md"
              variant="rounded"
            />
            <span className="text-lg md:text-xl font-semibold text-gray-900">{caseStudy.client_name}</span>
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
          {metrics.map(([key, value]) => (
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
