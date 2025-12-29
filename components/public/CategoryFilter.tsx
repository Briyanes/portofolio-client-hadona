'use client';

import type { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categorySlug: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const handleCategoryClick = (categorySlug: string | null) => {
    onCategoryChange(categorySlug);
  };

  return (
    <section id="kategori" className="py-6 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hadona-primary to-hadona-light flex items-center justify-center shadow-lg">
            <i className="bi bi-funnel-fill text-white text-lg"></i>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Kategori</h2>
            <p className="text-sm md:text-base text-gray-500">Filter studi kasus berdasarkan layanan</p>
          </div>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-3 min-w-max">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-bold whitespace-nowrap transition-all duration-300 shadow-md ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-hadona-primary to-hadona-light text-white shadow-lg shadow-hadona-primary/30 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <i className={`bi ${!selectedCategory ? 'bi-grid-fill' : 'bi-grid'}`}></i>
              Semua Kategori
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
                style={
                  selectedCategory === category.slug
                    ? {
                        backgroundColor: category.color || '#2B46BB',
                        boxShadow: `0 10px 25px -5px ${(category.color || '#2B46BB')}40`,
                      }
                    : {}
                }
              >
                <i className={`bi ${selectedCategory === category.slug ? `${category.icon}-fill` : category.icon}`}></i>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${
              !selectedCategory
                ? 'bg-gradient-to-r from-hadona-primary to-hadona-light text-white shadow-lg shadow-hadona-primary/30 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102 border-2 border-gray-200'
            }`}
          >
            <i className={`bi text-lg ${!selectedCategory ? 'bi-grid-fill' : 'bi-grid'}`}></i>
            <span>Semua Kategori</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${
                selectedCategory === category.slug
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102 border-2 border-gray-200'
              }`}
              style={
                selectedCategory === category.slug
                  ? {
                      backgroundColor: category.color || '#2B46BB',
                      boxShadow: `0 10px 25px -5px ${(category.color || '#2B46BB')}40`,
                    }
                  : {}
              }
            >
              <i className={`bi text-lg ${selectedCategory === category.slug ? `${category.icon}-fill` : category.icon}`}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <i className="bi bi-info-circle"></i>
          <span>
            {selectedCategory
              ? `Menampilkan kategori: ${categories.find((c) => c.slug === selectedCategory)?.name}`
              : 'Menampilkan semua kategori'}
          </span>
        </div>
      </div>
    </section>
  );
}
