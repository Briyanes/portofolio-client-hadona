import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { ClientLogoForm } from '@/components/admin/ClientLogoForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export default async function NewClientLogoPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  async function createClientLogo(formData: FormData) {
    'use server';

    const { getAdminUserForAction } = await import('@/lib/admin-auth');
    const auth = await getAdminUserForAction();

    if (!auth) {
      return { error: 'Unauthorized' };
    }

    try {
      const name = formData.get('name') as string;
      const logo_url = formData.get('logo_url') as string;
      const website_url = formData.get('website_url') as string;
      const is_active = formData.get('is_active') === 'on';
      const display_order = parseInt(formData.get('display_order') as string) || 0;

      const { error } = await supabaseAdmin
        .from('client_logos')
        .insert({
          name,
          logo_url,
          website_url: website_url || null,
          is_active,
          display_order,
          created_by: auth.user.id,
          updated_by: auth.user.id,
        });

      if (error) {
        console.error('Supabase insert error:', error);
        return { error: error.message || 'Failed to create client logo' };
      }

      revalidatePath('/admin/client-logos');
      revalidatePath('/admin/client-logos/new');
      revalidatePath('/');

      return { success: true };
    } catch (error: any) {
      console.error('Create client logo error:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Tambah Logo Klien Baru</h1>
        </div>

        <div className="w-full">
          <ClientLogoForm onSubmit={createClientLogo} />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
