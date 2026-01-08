import { adminGetAllCaseStudies } from '@/lib/supabase-queries';
import Link from 'next/link';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import { DeleteCaseStudyButton } from './DeleteCaseStudyButton';
import { CaseStudyThumbnail } from '@/components/admin/case-studies/CaseStudyThumbnail';
import type { CaseStudy } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminCaseStudiesPage() {
  let caseStudies: CaseStudy[] = [];
  try {
    caseStudies = await adminGetAllCaseStudies();
  } catch (error) {
    console.error('Error loading case studies:', error);
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Kelola Studi Kasus</h1>
          <Link
            href="/admin/case-studies/new"
            className="bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
          >
            + Tambah Baru
          </Link>
        </div>

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
                          <CaseStudyThumbnail
                            src={cs.thumbnail_url}
                            alt={cs.title}
                          />
                        )}
                        <Link
                          href={`/admin/case-studies/${cs.id}`}
                          className="text-sm font-medium text-hadona-primary hover:text-hadona-dark line-clamp-2"
                        >
                          {cs.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.client_name}</td>
                    <td className="px-6 py-4">
                      {cs.categories?.name ? (
                        <span
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{
                            backgroundColor: cs.categories.color || '#2B46BB',
                          }}
                        >
                          {cs.categories.name}
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
                          href={`/admin/case-studies/${cs.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteCaseStudyButton
                          caseStudyId={cs.id}
                          caseStudyTitle={cs.title}
                        />
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
                href="/admin/case-studies/new"
                className="inline-block bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
              >
                Buat studi kasus pertama →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
