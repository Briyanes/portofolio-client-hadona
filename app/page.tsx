import { HeroSection } from '@/components/public/HeroSection';
import { CTASection } from '@/components/public/CTASection';
import { AboutSection } from '@/components/public/AboutSection';
import { ClientLogosSection } from '@/components/public/ClientLogosSection';
import { ServicesOverviewSection } from '@/components/public/ServicesOverviewSection';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';
import { CaseStudiesSection } from '@/components/public/CaseStudiesSection';
import {
  getPublishedCaseStudies,
  getActiveCategories,
  getFeaturedTestimonialsFromDB,
  getActiveClientLogos,
} from '@/lib/supabase-queries';
import { AGENCY_INFO, AGENCY_SERVICES } from '@/lib/constants';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [caseStudies, categories, testimonialsFromDB, clientLogos] = await Promise.all([
    getPublishedCaseStudies(),
    getActiveCategories(),
    getFeaturedTestimonialsFromDB(10),
    getActiveClientLogos(),
  ]);

  // Map testimonials from database to format expected by TestimonialsSection
  const testimonials = testimonialsFromDB.map(t => ({
    id: t.id,
    slug: '', // Standalone testimonials don't have slug
    testimonial: t.testimonial,
    testimonial_author: t.client_name,
    testimonial_position: t.position || null,
    client_name: t.client_name,
    client_logo_url: null, // Standalone testimonials don't have logo
    thumbnail_url: '', // Will use default if needed
  }));

  return (
    <main className="min-h-screen">
      {/* Header Spacer for fixed header */}
      <div className="header-spacer"></div>

      {/* 1. Hero Section */}
      <section className="section-container py-6 md:py-10">
        <HeroSection />
      </section>

      {/* 2. Client Logos Section */}
      {clientLogos.length > 0 && (
        <section className="section-container py-6 md:py-10">
          <ClientLogosSection clients={clientLogos} />
        </section>
      )}

      {/* 3. About Section */}
      <section className="section-container py-6 md:py-10">
        <AboutSection agencyInfo={AGENCY_INFO} />
      </section>

      {/* 4. Services Overview */}
      <section className="section-container py-6 md:py-10">
        <ServicesOverviewSection services={AGENCY_SERVICES} columns={3} />
      </section>

      {/* 5-7. Category Filter, Search Bar & Case Studies Grid (Client-Side Filtering) */}
      <CaseStudiesSection caseStudies={caseStudies} categories={categories} />

      {/* 8. Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="section-container py-6 md:py-10">
          <TestimonialsSection testimonials={testimonials} layout="grid" limit={10} />
        </section>
      )}

      {/* 9. CTA Section */}
      {caseStudies.length > 0 && <CTASection variant="home" />}
    </main>
  );
}
