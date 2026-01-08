import { adminGetAllCategories } from '@/lib/supabase-queries';
import Link from 'next/link';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import { DeleteCategoryButton } from './DeleteCategoryButton';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await adminGetAllCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
          </div>
          <Link
            href="/admin/categories/new"
            className="bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
          >
            + Tambah Baru
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description || '-'}</p>
                </div>
                {category.icon && (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color || '#2B46BB' }}
                  >
                    <i className={`bi ${category.icon} text-xl`}></i>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <span className="text-gray-300">|</span>
                  <DeleteCategoryButton
                    categoryId={category.id}
                    categoryName={category.name}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">Belum ada kategori</p>
            <Link
              href="/admin/categories/new"
              className="inline-block bg-hadona-primary text-white px-6 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
            >
              Buat kategori pertama →
            </Link>
          </div>
        )}
      </div>
    </AdminProtectedLayout>
  );
}
