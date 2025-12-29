import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/types';

interface RelatedCaseStudiesProps {
  caseStudies: CaseStudy[];
}

export function RelatedCaseStudies({ caseStudies }: RelatedCaseStudiesProps) {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-hadona-primary/10 flex items-center justify-center">
          <i className="bi bi-collection text-2xl text-hadona-primary"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Studi Kasus Terkait</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((relatedCase, index) => (
          <Link
            key={relatedCase.id}
            href={`/studi-kasus/${relatedCase.slug}`}
            className="group"
          >
            <div
              className="card-base overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={relatedCase.thumbnail_url}
                  alt={relatedCase.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                {relatedCase.categories && (
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: relatedCase.categories.color || '#2B46BB' }}
                    >
                      <i className={`bi ${relatedCase.categories.icon || 'bi-tag'}`}></i>
                      {relatedCase.categories.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-hadona-primary transition-colors">
                  {relatedCase.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  <i className="bi bi-building mr-1"></i>
                  {relatedCase.client_name}
                </p>

                {/* Preview of results */}
                {relatedCase.results && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {relatedCase.results}
                  </p>
                )}

                {/* Read more link */}
                <div className="mt-4 inline-flex items-center gap-2 text-hadona-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  Baca Selengkapnya
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
