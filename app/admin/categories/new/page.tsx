import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { CategoryForm } from '@/components/admin/CategoryForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { categorySchema } from '@/lib/validators';

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

      // Validate with Zod
      const validatedData = categorySchema.parse(data);

      // Check if slug is unique
      if (validatedData.slug) {
        const { data: existing } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('slug', validatedData.slug)
          .single();

        if (existing) {
          return { error: 'Slug sudah digunakan' };
        }
      }

      // Insert directly via supabaseAdmin
      const { error } = await supabaseAdmin
        .from('categories')
        .insert(validatedData);

      if (error) throw error;

      // Revalidate paths
      revalidatePath('/admin/categories');
      revalidatePath('/admin/categories/new');

      // Return success - client will handle redirect
      return { success: true };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return { error: 'Validation error: ' + error.errors.map((e: any) => e.message).join(', ') };
      }
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
