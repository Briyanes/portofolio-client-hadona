import { adminGetAllCategories } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export default async function NewCaseStudyPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  const categories = await adminGetAllCategories();

  async function createCaseStudy(formData: FormData) {
    'use server';

    const { getAdminUserForAction } = await import('@/lib/admin-auth');
    const auth = await getAdminUserForAction();

    if (!auth) {
      return { error: 'Unauthorized' };
    }

    try {
      const { parseCaseStudyFormData } = await import('@/lib/parse-case-study-form');

      // Parse and validate FormData
      const validatedData = parseCaseStudyFormData(formData);

      // Check if slug is unique
      if (validatedData.slug) {
        const { data: existing } = await supabaseAdmin
          .from('case_studies')
          .select('id')
          .eq('slug', validatedData.slug)
          .single();

        if (existing) {
          return { error: 'Slug already exists' };
        }
      }

      // Insert case study
      const { data: newCaseStudy, error } = await supabaseAdmin
        .from('case_studies')
        .insert({
          ...validatedData,
          created_by: auth.user.id,
          updated_by: auth.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Revalidate paths
      revalidatePath('/admin/case-studies');
      revalidatePath('/admin/case-studies/new');
      revalidatePath('/');

      // Revalidate public page if slug exists
      if (validatedData.slug) {
        revalidatePath(`/studi-kasus/${validatedData.slug}`);
      }

      // Return success - client will handle redirect
      return { success: true };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return { error: 'Validation error', details: error.errors };
      }
      return { error: error.message || 'Something went wrong' };
    }
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/case-studies"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Case Studies
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Studi Kasus Baru</h1>
        </div>

        <div className="w-full">
          <CaseStudyForm
            categories={categories}
            onSubmit={createCaseStudy}
          />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
