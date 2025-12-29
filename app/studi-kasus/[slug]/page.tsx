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
          ...(caseStudy.categories
            ? [{ label: caseStudy.categories.name, href: `/?category=${caseStudy.categories.slug}` }]
            : []),
          { label: caseStudy.client_name },
        ]}
      />

      {/* Quick Info Bar - Mobile Horizontal */}
      <QuickInfoBar caseStudy={caseStudy} variant="horizontal" />

      {/* Main Content with Sidebar - Desktop */}
      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Hero Section */}
            <CaseStudyHero caseStudy={caseStudy} />

            {/* Challenge Section */}
            {caseStudy.challenge && (
              <ContentSection
                type="challenge"
                content={caseStudy.challenge}
              />
            )}

            {/* Strategy Section */}
            {caseStudy.strategy && (
              <ContentSection
                type="strategy"
                content={caseStudy.strategy}
              />
            )}

            {/* Results Section */}
            {caseStudy.results && (
              <ContentSection
                type="results"
                content={caseStudy.results}
              />
            )}

            {/* Testimonial */}
            {caseStudy.testimonial && (
              <TestimonialCard testimonial={caseStudy} />
            )}

            {/* Gallery */}
            {caseStudy.gallery_urls && caseStudy.gallery_urls.length > 0 && (
              <ImageGallery images={caseStudy.gallery_urls} />
            )}

            {/* Related Case Studies */}
            {relatedCaseStudies.length > 0 && (
              <RelatedCaseStudies caseStudies={relatedCaseStudies} />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <QuickInfoBar caseStudy={caseStudy} variant="sidebar" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection variant="case-study" />
    </>
  );
}
