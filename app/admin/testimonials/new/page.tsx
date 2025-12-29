import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export default async function NewTestimonialPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  async function createTestimonial(formData: FormData) {
    'use server';

    const { getAdminUserForAction } = await import('@/lib/admin-auth');
    const auth = await getAdminUserForAction();

    if (!auth) {
      return { error: 'Unauthorized' };
    }

    try {
      const client_name = formData.get('client_name') as string;
      const testimonial = formData.get('testimonial') as string;
      const position = formData.get('position') as string;
      const is_featured = formData.get('is_featured') === 'on';
      const is_published = formData.get('is_published') === 'on';
      const display_order = parseInt(formData.get('display_order') as string) || 0;

      const { error } = await supabaseAdmin
        .from('testimonials')
        .insert({
          client_name,
          testimonial,
          position: position || null,
          is_featured,
          is_published,
          display_order,
          created_by: auth.user.id,
          updated_by: auth.user.id,
        });

      if (error) {
        console.error('Supabase insert error:', error);
        return { error: error.message || 'Failed to create testimonial' };
      }

      revalidatePath('/admin/testimonials');
      revalidatePath('/admin/testimonials/new');
      revalidatePath('/');

      return { success: true };
    } catch (error: any) {
      console.error('Create testimonial error:', error);
      return { error: error.message || 'Something went wrong' };
    }
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/testimonials"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Testimonials
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Testimoni Baru</h1>
        </div>

        <div className="w-full">
          <TestimonialForm onSubmit={createTestimonial} />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
