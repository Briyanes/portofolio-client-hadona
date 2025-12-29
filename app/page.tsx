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
  getFeaturedTestimonials,
} from '@/lib/supabase-queries';
import { AGENCY_INFO, AGENCY_SERVICES } from '@/lib/constants';
import { getClientLogosFromFolder } from '@/lib/get-client-logos';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [caseStudies, categories, testimonials] = await Promise.all([
    getPublishedCaseStudies(),
    getActiveCategories(),
    getFeaturedTestimonials(10),
  ]);

  // Get client logos from static folder
  const allClientLogos = getClientLogosFromFolder();
  const clientLogos = allClientLogos.slice(0, 49); // Use all 49 logos

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
