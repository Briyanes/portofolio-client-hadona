import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getPublishedCaseStudies } from '@/lib/supabase-queries';
import { CaseStudyCard } from '@/components/public/CaseStudyCard';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { CategoryHeader } from '@/components/public/CategoryHeader';
import { SearchBar } from '@/components/public/SearchBar';
import { CTASection } from '@/components/public/CTASection';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { search?: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Kategori Tidak Ditemukan',
    };
  }

  return {
    title: `${category.name} | Hadona Digital Media`,
    description: category.description || `Studi kasus kategori ${category.name}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const caseStudies = await getPublishedCaseStudies({
    category: params.slug,
    search: searchParams.search,
  });

  return (
    <>
      <div className="header-spacer" />

      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'Kategori', href: '/' },
          { label: category.name },
        ]}
      />

      {/* Category Header */}
      <CategoryHeader category={category} />

      {/* Search Bar */}
      <div className="section-container pb-8">
        <SearchBar />
      </div>

      {/* Case Studies Grid */}
      <div className="section-container py-8">
        {/* Results Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-hadona-primary hover:text-hadona-dark font-medium transition-colors"
            >
              <i className="bi bi-arrow-left"></i>
              Kembali ke semua studi kasus
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">
              Menampilkan <span className="font-bold text-hadona-primary">{caseStudies.length}</span> studi kasus
            </span>
          </div>
        </div>

        {/* Grid */}
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
              {searchParams.search
                ? 'Tidak Ada Hasil Ditemukan'
                : 'Belum Ada Studi Kasus'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchParams.search
                ? `Tidak ada studi kasus yang cocok dengan pencarian "${searchParams.search}" di kategori ini`
                : 'Belum ada studi kasus untuk kategori ini. Kunjungi lagi nanti!'}
            </p>
            {searchParams.search && (
              <Link
                href={`/kategori/${params.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-hadona-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <i className="bi bi-x-circle"></i>
                Hapus Pencarian
              </Link>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {caseStudies.length > 0 && (
        <CTASection variant="category" />
      )}
    </>
  );
}
