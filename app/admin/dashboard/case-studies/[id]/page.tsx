import { adminGetAllCategories, adminGetCaseStudyById } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase-admin';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';
import { updateCaseStudy } from './actions';

export default async function EditCaseStudyPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const [categories, caseStudy] = await Promise.all([
    adminGetAllCategories(),
    adminGetCaseStudyById(params.id),
  ]);

  if (!caseStudy) {
    redirect('/admin/dashboard/case-studies');
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Studi Kasus</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg-px-12 py-8">
        <CaseStudyForm
          initialData={{
            title: caseStudy.title,
            slug: caseStudy.slug,
            client_name: caseStudy.client_name,
            category_id: caseStudy.category_id || '',
            challenge: caseStudy.challenge || '',
            strategy: caseStudy.strategy || '',
            results: caseStudy.results || '',
            testimonial: caseStudy.testimonial || undefined,
            testimonial_author: caseStudy.testimonial_author || undefined,
            testimonial_position: caseStudy.testimonial_position || undefined,
            thumbnail_url: caseStudy.thumbnail_url,
            client_logo_url: caseStudy.client_logo_url || undefined,
            hero_image_url: caseStudy.hero_image_url || undefined,
            gallery_urls: caseStudy.gallery_urls || undefined,
            metrics: caseStudy.metrics ? Object.entries(caseStudy.metrics).map(([label, value]) => ({ label, value })) : undefined,
            meta_title: caseStudy.meta_title || undefined,
            meta_description: caseStudy.meta_description || undefined,
            meta_keywords: caseStudy.meta_keywords || undefined,
            is_featured: caseStudy.is_featured,
            is_published: caseStudy.is_published,
            display_order: caseStudy.display_order,
            website_url: caseStudy.website_url || undefined,
            instagram_url: caseStudy.instagram_url || undefined,
            facebook_url: caseStudy.facebook_url || undefined,
            services: caseStudy.services || undefined,
          }}
          categories={categories}
          onSubmit={updateCaseStudy.bind(null, params.id)}
        />
      </div>
    </div>
  );
}
