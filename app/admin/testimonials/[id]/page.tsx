import { adminGetTestimonialById } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const auth = await getAdminUserWithToken();

    if (!auth) {
      redirect('/admin/login');
    }

    const testimonial = await adminGetTestimonialById(params.id);

    if (!testimonial) {
      redirect('/admin/testimonials');
    }

    async function updateTestimonial(formData: FormData) {
      'use server';

      const { getAdminUserForAction } = await import('@/lib/admin-auth');
      const auth = await getAdminUserForAction();

      if (!auth) {
        return { error: 'Unauthorized' };
      }

      try {
        const client_name = formData.get('client_name') as string;
        const testimonial_text = formData.get('testimonial') as string;
        const position = formData.get('position') as string;
        const is_featured = formData.get('is_featured') === 'on';
        const is_published = formData.get('is_published') === 'on';
        const display_order = parseInt(formData.get('display_order') as string) || 0;

        const { error } = await supabaseAdmin
          .from('testimonials')
          .update({
            client_name,
            testimonial: testimonial_text,
            position: position || null,
            is_featured,
            is_published,
            display_order,
            updated_by: auth.user.id,
          })
          .eq('id', params.id);

        if (error) {
          console.error('Supabase update error:', error);
          return { error: error.message || 'Failed to update testimonial' };
        }

        revalidatePath('/admin/testimonials');
        revalidatePath(`/admin/testimonials/${params.id}`);
        revalidatePath('/');

        return { success: true };
      } catch (error: any) {
        console.error('Update testimonial error:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Testimoni</h1>
          </div>

          <div className="w-full">
            <TestimonialForm
              initialData={{
                client_name: testimonial.client_name,
                testimonial: testimonial.testimonial,
                position: testimonial.position || '',
                is_featured: testimonial.is_featured,
                is_published: testimonial.is_published,
                display_order: testimonial.display_order,
              }}
              onSubmit={updateTestimonial}
            />
          </div>
        </div>
      </AdminProtectedLayout>
    );
  } catch (error: any) {
    console.error('Edit testimonial page error:', error);
    redirect('/admin/testimonials');
  }
}
