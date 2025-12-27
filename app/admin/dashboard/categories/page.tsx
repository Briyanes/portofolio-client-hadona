import { adminGetAllCategories } from '@/lib/supabase-queries';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase-admin';

export default async function AdminCategoriesPage() {
  const categories = await adminGetAllCategories();
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
            </div>
            <Link
              href="/admin/dashboard/categories/new"
              className="bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
            >
              + Tambah Baru
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-8">
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
                <div className="flex gap-2">
                  <Link
                    href={`/admin/dashboard/categories/${category.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <form
                    action={`/api/categories/${category.id}/delete`}
                    method="POST"
                    onSubmit={(e) => {
                      if (!confirm('Yakin ingin menghapus kategori ini?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">Belum ada kategori</p>
            <Link
              href="/admin/dashboard/categories/new"
              className="inline-block bg-hadona-primary text-white px-6 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
            >
              Buat kategori pertama →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
