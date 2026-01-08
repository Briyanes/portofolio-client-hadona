import { adminGetAllTestimonials } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { DeleteTestimonialButton } from '@/components/admin/DeleteTestimonialButton';
import type { Testimonial } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  let testimonials: Testimonial[] = [];
  try {
    testimonials = await adminGetAllTestimonials();
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Testimoni</h1>
            <p className="text-gray-600 mt-1">Kelola testimoni klien</p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-hadona-primary text-white rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
          >
            <i className="bi bi-plus-lg"></i>
            Tambah Testimoni
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {testimonials.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Testimoni
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urutan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{testimonial.client_name}</div>
                        {testimonial.position && (
                          <div className="text-sm text-gray-500">{testimonial.position}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                        {testimonial.testimonial}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {testimonial.is_published && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        )}
                        {testimonial.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {!testimonial.is_published && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {testimonial.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/testimonials/${testimonial.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteTestimonialButton
                          testimonialId={testimonial.id}
                          testimonialTitle={testimonial.client_name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-4">Belum ada testimoni</p>
              <Link
                href="/admin/testimonials/new"
                className="inline-block bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
              >
                Buat testimoni pertama →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
