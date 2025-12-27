import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Link
      href={`/studi-kasus/${caseStudy.slug}`}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-hadona-primary/30"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={caseStudy.thumbnail_url}
          alt={caseStudy.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        {caseStudy.category && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: `${caseStudy.category.color || '#2B46BB'}dd`,
              }}
            >
              {caseStudy.category.icon && <i className={`bi ${caseStudy.category.icon}`}></i>}
              {caseStudy.category.name}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {caseStudy.is_featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg bg-yellow-500">
              <i className="bi bi-star-fill text-yellow-200"></i>
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Client Name */}
        <div className="flex items-center gap-3 mb-4">
          {caseStudy.client_logo_url ? (
            <>
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                <Image
                  src={caseStudy.client_logo_url}
                  alt={caseStudy.client_name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Klien</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {caseStudy.client_name}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Klien</p>
              <p className="text-sm font-bold text-gray-900">
                {caseStudy.client_name}
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-hadona-primary transition-colors duration-300 leading-snug">
          {caseStudy.title}
        </h3>

        {/* Metrics Preview */}
        {caseStudy.metrics && Object.keys(caseStudy.metrics).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(caseStudy.metrics).slice(0, 3).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-hadona-primary/10 to-hadona-light/10 text-hadona-primary text-xs font-bold rounded-lg border border-hadona-primary/20"
              >
                <i className="bi bi-graph-up-arrow text-xs"></i>
                {value}
              </span>
            ))}
          </div>
        )}

        {/* Results Preview */}
        {caseStudy.results && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {caseStudy.results}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-4 group-hover:from-hadona-primary/30 group-hover:via-hadona-primary/50 group-hover:to-hadona-primary/30 transition-all duration-300" />

        {/* Read More */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center text-hadona-primary font-bold text-sm group-hover:gap-2 transition-all duration-300">
            <span>Lihat Studi Kasus</span>
            <svg
              className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
          <span className="text-xs text-gray-400 group-hover:text-hadona-primary transition-colors">
            <i className="bi bi-clock"></i> 5 min baca
          </span>
        </div>
      </div>
    </Link>
  );
}
