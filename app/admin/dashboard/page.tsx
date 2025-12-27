import { adminGetStatistics, adminGetAllCaseStudies } from '@/lib/supabase-queries';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase-admin';

export default async function AdminDashboardPage() {
  const statistics = await adminGetStatistics();
  const caseStudies = await adminGetAllCaseStudies();
  const recentCaseStudies = caseStudies.slice(0, 5);

  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="text-sm text-gray-500">Portofolio Hadona</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-hadona-primary transition-colors"
              >
                Lihat Website →
              </Link>
              <form action="/admin/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Studi Kasus</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalCaseStudies}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="bi bi-file-earmark-text text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-green-600">{statistics.publishedCaseStudies}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <i className="bi bi-check-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Draft</p>
                <p className="text-3xl font-bold text-yellow-600">{statistics.draftCaseStudies}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <i className="bi bi-pencil text-yellow-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kategori</p>
                <p className="text-3xl font-bold text-purple-600">{statistics.totalCategories}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="bi bi-folder text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/dashboard/case-studies/new"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-hadona-primary text-white flex items-center justify-center group-hover:bg-hadona-dark transition-colors">
                  <i className="bi bi-plus-lg text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tambah Studi Kasus</h3>
                  <p className="text-sm text-gray-600">Buat studi kasus baru</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/dashboard/case-studies"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-hadona-yellow text-gray-900 flex items-center justify-center group-hover:bg-hadona-yellow-dark transition-colors">
                  <i className="bi bi-list-ul text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kelola Studi Kasus</h3>
                  <p className="text-sm text-gray-600">Lihat semua studi kasus</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/dashboard/categories"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-600 text-white flex items-center justify-center group-hover:bg-green-700 transition-colors">
                  <i className="bi bi-tags text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kelola Kategori</h3>
                  <p className="text-sm text-gray-600">Atur kategori studi kasus</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Case Studies */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Studi Kasus Terbaru</h2>
            <Link
              href="/admin/dashboard/case-studies"
              className="text-sm text-hadona-primary hover:text-hadona-dark transition-colors"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {recentCaseStudies.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Klien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Featured
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentCaseStudies.map((cs) => (
                    <tr key={cs.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/dashboard/case-studies/${cs.id}`}
                          className="text-sm font-medium text-hadona-primary hover:text-hadona-dark"
                        >
                          {cs.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cs.client_name}</td>
                      <td className="px-6 py-4">
                        {cs.is_published ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {cs.is_featured ? (
                          <i className="bi bi-star-fill text-yellow-500"></i>
                        ) : (
                          <i className="bi bi-star text-gray-300"></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">Belum ada studi kasus</p>
                <Link
                  href="/admin/dashboard/case-studies/new"
                  className="inline-block mt-4 text-hadona-primary hover:text-hadona-dark font-semibold"
                >
                  Buat studi kasus pertama →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
