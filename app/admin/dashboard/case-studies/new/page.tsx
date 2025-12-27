import { adminGetAllCategories } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase-admin';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';

export default async function NewCaseStudyPage() {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const categories = await adminGetAllCategories();

  async function createCaseStudy(formData: FormData) {
    'use server';

    const supabase = await createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/case-studies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Failed to create case study' };
      }

      redirect('/admin/dashboard/case-studies');
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
                href="/admin/dashboard/case-studies"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Case Studies
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Tambah Studi Kasus Baru</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg-12 py-8">
        <CaseStudyForm
          categories={categories}
          onSubmit={createCaseStudy}
        />
      </div>
    </div>
  );
}
