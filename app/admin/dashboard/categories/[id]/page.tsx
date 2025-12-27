import { adminGetCategoryById } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase-admin';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const category = await adminGetCategoryById(params.id);

  if (!category) {
    redirect('/admin/dashboard/categories');
  }

  async function updateCategory(formData: FormData) {
    'use server';

    const supabase = await createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    try {
      const data = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description') || null,
        icon: formData.get('icon'),
        color: formData.get('color'),
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_active: formData.get('is_active') === 'on',
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Failed to update category' };
      }

      redirect('/admin/dashboard/categories');
    } catch (error: any) {
      return { error: error.message || 'Something went wrong' };
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/admin/dashboard/categories"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Categories
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Edit Kategori</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-12 py-8">
        <CategoryForm
          initialData={{
            name: category.name,
            slug: category.slug,
            description: category.description || undefined,
            icon: category.icon || undefined,
            color: category.color || undefined,
            display_order: category.display_order,
            is_active: category.is_active,
          }}
          onSubmit={updateCategory}
        />
      </div>
    </div>
  );
}
