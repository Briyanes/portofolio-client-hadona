import { HeroSection } from '@/components/public/HeroSection';
import { CategoryFilter } from '@/components/public/CategoryFilter';
import { SearchBar } from '@/components/public/SearchBar';
import { CTASection } from '@/components/public/CTASection';
import { CaseStudyCard } from '@/components/public/CaseStudyCard';
import { getPublishedCaseStudies, getActiveCategories } from '@/lib/supabase-queries';

interface HomePageProps {
  searchParams: { category?: string; search?: string };
}

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage({ searchParams }: HomePageProps) {
  const caseStudies = await getPublishedCaseStudies({
    category: searchParams.category,
    search: searchParams.search,
  });

  const categories = await getActiveCategories();

  return (
    <main className="min-h-screen">
      {/* Header Spacer */}
      <div className="header-spacer" />

      {/* Hero Section */}
      <section className="section-container py-12 md:py-16">
        <HeroSection />
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section id="kategori" className="section-container py-8">
          <CategoryFilter categories={categories} />
        </section>
      )}

      {/* Search Bar */}
      <section className="section-container pb-8">
        <SearchBar />
      </section>

      {/* Case Studies Grid */}
      <section className="section-container py-8 min-h-[600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {searchParams.category
                ? categories.find((c) => c.slug === searchParams.category)
                    ?.name || 'Studi Kasus'
                : 'Semua Studi Kasus'}
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <i className="bi bi-collection-play text-hadona-primary"></i>
              Menampilkan <span className="font-bold text-hadona-primary">{caseStudies.length}</span> studi kasus
            </p>
          </div>

          {/* Sort/View Options (visual only for now) */}
          <div className="hidden md:flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-hadona-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
              <i className="bi bi-grid-3x3-gap-fill mr-1"></i>
              Grid
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        {caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((caseStudy, index) => (
              <div
                key={caseStudy.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CaseStudyCard caseStudy={caseStudy} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
              <i className="bi bi-inbox text-5xl text-gray-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchParams.search || searchParams.category
                ? 'Tidak Ada Hasil Ditemukan'
                : 'Belum Ada Studi Kasus'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchParams.search
                ? `Tidak ada studi kasus yang cocok dengan pencarian "${searchParams.search}"`
                : searchParams.category
                ? 'Belum ada studi kasus untuk kategori ini. Silakan pilih kategori lain.'
                : 'Belum ada studi kasus yang dipublikasikan. Kunjungi lagi nanti!'}
            </p>
            {(searchParams.search || searchParams.category) && (
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-hadona-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <i className="bi bi-arrow-left"></i>
                Kembali ke Semua Kategori
              </a>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {caseStudies.length > 0 && (
        <CTASection variant="home" />
      )}
    </main>
  );
}
