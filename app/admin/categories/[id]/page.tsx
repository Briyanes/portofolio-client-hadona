import { adminGetCategoryById } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { CategoryForm } from '@/components/admin/CategoryForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  const category = await adminGetCategoryById(params.id);

  if (!category) {
    redirect('/admin/categories');
  }

  async function updateCategory(formData: FormData) {
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

      console.log('Updating category with data:', JSON.stringify(data, null, 2));

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/categories/${params.id}`, {
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
        console.error('API Error:', result);
        return { error: result.error || 'Failed to update category' };
      }

      // Revalidate paths
      revalidatePath('/admin/categories');
      revalidatePath(`/admin/categories/${params.id}`);

      // Return success - client will handle redirect
      return { success: true };
    } catch (error: any) {
      console.error('Update error:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Kategori</h1>
        </div>

        <div className="max-w-2xl">
          <CategoryForm
            initialData={{
              name: category.name,
              slug: category.slug,
              description: category.description || '',
              icon: category.icon || '',
              color: category.color || '',
              display_order: category.display_order,
              is_active: category.is_active,
            }}
            onSubmit={updateCategory}
          />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
