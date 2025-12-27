'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <section id="kategori" className="py-10 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hadona-primary to-hadona-light flex items-center justify-center shadow-lg">
            <i className="bi bi-funnel-fill text-white text-lg"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kategori</h2>
            <p className="text-sm text-gray-500">Filter studi kasus berdasarkan layanan</p>
          </div>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-3 min-w-max">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-md ${
                !currentCategory
                  ? 'bg-gradient-to-r from-hadona-primary to-hadona-light text-white shadow-lg shadow-hadona-primary/30 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <i className={`bi ${!currentCategory ? 'bi-grid-fill' : 'bi-grid'}`}></i>
              Semua Kategori
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?category=${category.slug}`}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  currentCategory === category.slug
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
                style={
                  currentCategory === category.slug
                    ? {
                        backgroundColor: category.color || '#2B46BB',
                        boxShadow: `0 10px 25px -5px ${(category.color || '#2B46BB')}40`,
                      }
                    : {}
                }
              >
                <i className={`bi ${currentCategory === category.slug ? `${category.icon}-fill` : category.icon}`}></i>
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:flex flex-wrap gap-3">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              !currentCategory
                ? 'bg-gradient-to-r from-hadona-primary to-hadona-light text-white shadow-lg shadow-hadona-primary/30 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102 border-2 border-gray-200'
            }`}
          >
            <i className={`bi text-lg ${!currentCategory ? 'bi-grid-fill' : 'bi-grid'}`}></i>
            <span>Semua Kategori</span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?category=${category.slug}`}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                currentCategory === category.slug
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102 border-2 border-gray-200'
              }`}
              style={
                currentCategory === category.slug
                  ? {
                      backgroundColor: category.color || '#2B46BB',
                      boxShadow: `0 10px 25px -5px ${(category.color || '#2B46BB')}40`,
                    }
                  : {}
              }
            >
              <i className={`bi text-lg ${currentCategory === category.slug ? `${category.icon}-fill` : category.icon}`}></i>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <i className="bi bi-info-circle"></i>
          <span>
            {currentCategory
              ? `Menampilkan kategori: ${categories.find((c) => c.slug === currentCategory)?.name}`
              : 'Menampilkan semua kategori'}
          </span>
        </div>
      </div>
    </section>
  );
}
