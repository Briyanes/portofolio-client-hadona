import { adminGetAllCategories } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';

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

    const { accessToken } = auth;

    try {
      console.log('Creating case study...');

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/case-studies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result);
        return { error: result.error || 'Failed to create case study' };
      }

      console.log('✓ Case study created successfully');

      // Revalidate paths
      revalidatePath('/admin/case-studies');
      revalidatePath('/admin/case-studies/new');

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
            href="/admin/case-studies"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Case Studies
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Studi Kasus Baru</h1>
        </div>

        <div className="max-w-4xl">
          <CaseStudyForm
            categories={categories}
            onSubmit={createCaseStudy}
          />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
