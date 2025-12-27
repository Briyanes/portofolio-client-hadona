import { adminGetAllCaseStudies } from '@/lib/supabase-queries';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase-admin';

export default async function AdminCaseStudiesPage() {
  const caseStudies = await adminGetAllCaseStudies();
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
              <h1 className="text-2xl font-bold text-gray-900">Kelola Studi Kasus</h1>
            </div>
            <Link
              href="/admin/dashboard/case-studies/new"
              className="bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
            >
              + Tambah Baru
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-8">
        {/* Case Studies Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {caseStudies.length > 0 ? (
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
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {caseStudies.map((cs) => (
                  <tr key={cs.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cs.thumbnail_url && (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={cs.thumbnail_url}
                              alt={cs.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Link
                          href={`/admin/dashboard/case-studies/${cs.id}`}
                          className="text-sm font-medium text-hadona-primary hover:text-hadona-dark line-clamp-2"
                        >
                          {cs.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.client_name}</td>
                    <td className="px-6 py-4">
                      {cs.category ? (
                        <span
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{
                            backgroundColor: cs.category.color || '#2B46BB',
                          }}
                        >
                          {cs.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/case-studies/${cs.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <form
                          action={`/api/case-studies/${cs.id}/delete`}
                          method="POST"
                          onSubmit={(e) => {
                            if (!confirm('Yakin ingin menghapus studi kasus ini?')) {
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-4">Belum ada studi kasus</p>
              <Link
                href="/admin/dashboard/case-studies/new"
                className="inline-block bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
              >
                Buat studi kasus pertama →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
