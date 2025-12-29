import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/types';
import { ClientLogo } from '@/components/public/ClientLogo';

interface AdminCaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function AdminCaseStudyCard({ caseStudy }: AdminCaseStudyCardProps) {
  return (
    <Link
      href={`/admin/case-studies/${caseStudy.id}`}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={caseStudy.thumbnail_url || caseStudy.hero_image_url || '/placeholder.jpg'}
          alt={caseStudy.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          {caseStudy.is_featured && (
            <span className="px-2 py-1 bg-hadona-yellow text-hadona-bg-dark rounded-lg text-xs font-bold">
              <i className="bi bi-star-fill mr-1"></i>
              Featured
            </span>
          )}
          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
            caseStudy.is_published
              ? 'bg-green-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {caseStudy.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Client Logo & Name */}
        <div className="flex items-center gap-3 mb-3">
          <ClientLogo
            src={caseStudy.client_logo_url}
            clientName={caseStudy.client_name}
            size="sm"
            variant="rounded"
          />
          <span className="text-sm font-semibold text-gray-900 line-clamp-1">
            {caseStudy.client_name}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-hadona-primary transition-colors">
          {caseStudy.title}
        </h3>

        {/* Category */}
        {caseStudy.category && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <i className={`bi ${caseStudy.category.icon || 'bi-tag'}`}></i>
            <span>{caseStudy.category.name}</span>
          </div>
        )}

        {/* Date */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            <i className="bi bi-calendar3 mr-1"></i>
            {new Date(caseStudy.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </Link>
  );
}
