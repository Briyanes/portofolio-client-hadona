import { adminGetClientLogoById } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { ClientLogoForm } from '@/components/admin/ClientLogoForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditClientLogoPage({
  params,
}: {
  params: { id: string };
}) {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  const clientLogo = await adminGetClientLogoById(params.id);

  if (!clientLogo) {
    redirect('/admin/client-logos');
  }

  async function updateClientLogo(formData: FormData) {
    'use server';

    const { getAdminUserForAction } = await import('@/lib/admin-auth');
    const auth = await getAdminUserForAction();

    if (!auth) {
      return { error: 'Unauthorized' };
    }

    const { accessToken } = auth;

    try {
      const name = formData.get('name') as string;
      const logo_url = formData.get('logo_url') as string;
      const website_url = formData.get('website_url') as string;
      const is_active = formData.get('is_active') === 'on';
      const display_order = parseInt(formData.get('display_order') as string) || 0;

      const data = {
        name,
        logo_url,
        website_url: website_url || '',
        is_active,
        display_order,
      };

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/client-logos/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      });

      if (!response.ok) {
        const result = await response.json();
        return { error: result.error || 'Failed to update client logo' };
      }

      revalidatePath('/admin/client-logos');
      revalidatePath(`/admin/client-logos/${params.id}`);

      return { success: true };
    } catch (error: any) {
      return { error: error.message || 'Something went wrong' };
    }
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/client-logos"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Client Logos
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Logo Klien</h1>
        </div>

        <div className="w-full">
          <ClientLogoForm
            initialData={{
              name: clientLogo.name,
              logo_url: clientLogo.logo_url,
              website_url: clientLogo.website_url || '',
              is_active: clientLogo.is_active,
              display_order: clientLogo.display_order,
            }}
            onSubmit={updateClientLogo}
          />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
