import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { CategoryForm } from '@/components/admin/CategoryForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewCategoryPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  async function createCategory(formData: FormData) {
    'use server';

    const { getAdminUserForAction } = await import('@/lib/admin-auth');
    const auth = await getAdminUserForAction();

    if (!auth) {
      return { error: 'Unauthorized' };
    }

    const { accessToken } = auth;

    try {
      const name = formData.get('name') as string;
      const slug = formData.get('slug') as string;
      const description = formData.get('description') as string;
      const icon = formData.get('icon') as string;
      const color = formData.get('color') as string;
      const display_order = parseInt(formData.get('display_order') as string) || 0;
      const is_active = formData.get('is_active') === 'on';

      const data = {
        name,
        slug,
        description: description || '',
        icon: icon || '',
        color: color || '',
        display_order,
        is_active,
      };

      console.log('Creating category with data:', JSON.stringify(data, null, 2));

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('API Error:', result);
        return { error: result.error || 'Failed to create category' };
      }

      // Revalidate paths
      revalidatePath('/admin/categories');
      revalidatePath('/admin/categories/new');

      // Return success - client will handle redirect
      return { success: true };
    } catch (error: any) {
      console.error('Create error:', error);
      return { error: error.message || 'Something went wrong' };
    }
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Categories
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Kategori Baru</h1>
        </div>

        <div className="w-full">
          <CategoryForm onSubmit={createCategory} />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
