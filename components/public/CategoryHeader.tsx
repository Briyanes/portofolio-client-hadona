import type { Category } from '@/lib/types';

interface CategoryHeaderProps {
  category: Category;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 animate-fade-in">
      <div className="section-container py-12">
        {/* Icon with background */}
        {category.icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-hadona-primary/10 mb-6 animate-scale-in">
            <i className={`bi ${category.icon} text-3xl text-hadona-primary`}></i>
          </div>
        )}

        {/* Category Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>

        {/* Description */}
        {category.description && (
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}
