import { adminGetAllClientLogos } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import Image from 'next/image';
import { DeleteClientLogoButton } from '@/components/admin/DeleteClientLogoButton';

export const dynamic = 'force-dynamic';

export default async function ClientLogosPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  const clientLogos = await adminGetAllClientLogos();

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Logo Klien</h1>
            <p className="text-gray-600 mt-1">Kelola logo klien yang ditampilkan di home page</p>
          </div>
          <Link
            href="/admin/client-logos/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-hadona-primary text-white rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
          >
            <i className="bi bi-plus-lg"></i>
            Tambah Logo
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {clientLogos.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Klien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
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
                {clientLogos.map((logo) => (
                  <tr key={logo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={logo.logo_url}
                          alt={logo.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {logo.name}
                    </td>
                    <td className="px-6 py-4">
                      {logo.website_url ? (
                        <a
                          href={logo.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {logo.website_url}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {logo.is_active ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {logo.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/client-logos/${logo.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteClientLogoButton
                          logoId={logo.id}
                          logoName={logo.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-4">Belum ada logo klien</p>
              <Link
                href="/admin/client-logos/new"
                className="inline-block bg-hadona-primary text-white px-4 py-2 rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
              >
                Upload logo pertama →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
