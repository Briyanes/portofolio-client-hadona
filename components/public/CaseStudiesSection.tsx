'use client';

import { useState, useMemo, useEffect } from 'react';
import { CategoryFilter } from '@/components/public/CategoryFilter';
import { SearchBar } from '@/components/public/SearchBar';
import { CaseStudyCard } from '@/components/public/CaseStudyCard';
import type { CaseStudy, Category } from '@/lib/types';

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
  categories: Category[];
}

export function CaseStudiesSection({ caseStudies, categories }: CaseStudiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Responsive items per page
  const itemsPerPage = useMemo(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 9; // Desktop
      if (window.innerWidth >= 768) return 6;   // Tablet
      return 4;                                 // Mobile
    }
    return 9; // Default to desktop for SSR
  }, []);

  // Recalculate items per page on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) return 9;
      if (window.innerWidth >= 768) return 6;
      return 4;
    };

    const resizeHandler = () => {
      handleResize();
      // Reset to page 1 when resize
      setCurrentPage(1);
    };

    window.addEventListener('resize', resizeHandler);

    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // Filter case studies based on selected category and search query
  const filteredCaseStudies = caseStudies.filter((cs) => {
    const matchesCategory = !selectedCategory || cs.categories?.slug === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cs.results && cs.results.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCaseStudies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayCaseStudies = filteredCaseStudies.slice(startIndex, endIndex);

  return (
    <>
      {/* 6. Category Filter */}
      {categories.length > 0 && (
        <section id="kategori" className="section-container py-4 md:py-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(slug) => setSelectedCategory(slug)}
          />
        </section>
      )}

      {/* 7. Search Bar */}
      <section className="section-container pb-4 md:pb-6">
        <SearchBar onSearchChange={(query) => setSearchQuery(query)} />
      </section>

      {/* 8. Case Studies Grid */}
      <section className="section-container py-4 md:py-6 min-h-[400px]">
        {/* Header */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || 'Studi Kasus'
                : searchQuery
                  ? 'Hasil Pencarian'
                  : 'Semua Studi Kasus'}
            </h2>
            <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
              <i className="bi bi-collection-play text-hadona-primary"></i>
              Menampilkan{' '}
              <span className="font-bold text-hadona-primary">{displayCaseStudies.length}</span>{' '}
              dari{' '}
              <span className="font-bold text-hadona-primary">{filteredCaseStudies.length}</span>{' '}
              studi kasus
              {totalPages > 1 && (
                <span className="ml-2 text-xs md:text-sm">
                  (Halaman <span className="font-bold text-hadona-primary">{currentPage}</span> dari {totalPages})
                </span>
              )}
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
        {displayCaseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayCaseStudies.map((caseStudy, index) => (
              <div
                key={caseStudy.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <CaseStudyCard caseStudy={caseStudy} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 md:mb-6">
              <i className="bi bi-inbox text-3xl md:text-5xl text-gray-400"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Tidak Ada Hasil Ditemukan</h3>
            <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto mb-4 md:mb-6">
              {searchQuery || selectedCategory
                ? 'Tidak ada studi kasus yang cocok dengan filter saat ini. Silakan coba filter lain.'
                : 'Belum ada studi kasus yang dipublikasikan. Kunjungi lagi nanti!'}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-hadona-primary text-white text-sm md:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <i className="bi bi-arrow-left"></i>
                Lihat Semua Studi Kasus
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Page Info */}
            <div className="text-xs md:text-sm text-gray-600">
              Menampilkan halaman <span className="font-bold text-hadona-primary">{currentPage}</span> dari {totalPages}
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-hadona-primary hover:text-white hover:border-hadona-primary'
                }`}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-semibold transition-all text-sm md:text-base ${
                      currentPage === pageNum
                        ? 'bg-hadona-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-hadona-primary hover:text-white hover:border-hadona-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-hadona-primary hover:text-white hover:border-hadona-primary'
                }`}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
