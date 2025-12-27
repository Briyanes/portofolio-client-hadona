import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { QuickInfoBar } from '@/components/public/QuickInfoBar';
import { CaseStudyHero } from '@/components/public/CaseStudyHero';
import { ContentSection } from '@/components/public/ContentSection';
import { TestimonialCard } from '@/components/public/TestimonialCard';
import { ImageGallery } from '@/components/public/ImageGallery';
import { RelatedCaseStudies } from '@/components/public/RelatedCaseStudies';
import { CTASection } from '@/components/public/CTASection';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/lib/supabase-queries';

interface CaseStudyPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return {
      title: 'Studi Kasus Tidak Ditemukan',
    };
  }

  return {
    title: caseStudy.meta_title || `${caseStudy.title} | Hadona Digital Media`,
    description: caseStudy.meta_description || caseStudy.results?.substring(0, 160),
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.meta_description,
      images: [caseStudy.thumbnail_url, caseStudy.hero_image_url].filter(Boolean) as string[],
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedCaseStudies = await getRelatedCaseStudies(
    caseStudy.category_id || '',
    caseStudy.id,
    4
  );

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.meta_description || caseStudy.results?.substring(0, 160),
    image: [caseStudy.thumbnail_url, caseStudy.hero_image_url].filter(Boolean),
    author: {
      '@type': 'Organization',
      name: 'Hadona Digital Media',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://portofolio.hadona.id',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hadona Digital Media',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://portofolio.hadona.id'}/logo/logo-hadona.png`,
      },
    },
    datePublished: caseStudy.created_at,
    dateModified: caseStudy.updated_at,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="header-spacer" />

      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'Kategori', href: '/' },
          ...(caseStudy.category
            ? [{ label: caseStudy.category.name, href: `/?category=${caseStudy.category.slug}` }]
            : []),
          { label: caseStudy.client_name },
        ]}
      />

      {/* Quick Info Bar */}
      <QuickInfoBar caseStudy={caseStudy} />

      {/* Hero Section */}
      <div className="section-container py-12">
        <CaseStudyHero caseStudy={caseStudy} />
      </div>

      {/* Challenge Section */}
      {caseStudy.challenge && (
        <div className="section-container">
          <ContentSection
            type="challenge"
            content={caseStudy.challenge}
          />
        </div>
      )}

      {/* Strategy Section */}
      {caseStudy.strategy && (
        <div className="section-container">
          <ContentSection
            type="strategy"
            content={caseStudy.strategy}
          />
        </div>
      )}

      {/* Results Section */}
      {caseStudy.results && (
        <div className="section-container">
          <ContentSection
            type="results"
            content={caseStudy.results}
          />
        </div>
      )}

      {/* Testimonial */}
      {caseStudy.testimonial && (
        <div className="section-container">
          <TestimonialCard testimonial={caseStudy} />
        </div>
      )}

      {/* Gallery */}
      {caseStudy.gallery_urls && caseStudy.gallery_urls.length > 0 && (
        <div className="section-container">
          <ImageGallery images={caseStudy.gallery_urls} />
        </div>
      )}

      {/* Related Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <div className="section-container">
          <RelatedCaseStudies caseStudies={relatedCaseStudies} />
        </div>
      )}

      {/* CTA Section */}
      <CTASection variant="case-study" />
    </>
  );
}
