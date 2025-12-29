import { adminGetAllCategories, adminGetCaseStudyById } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';
import { updateCaseStudy } from './actions';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditCaseStudyPage({
  params,
}: {
  params: { id: string };
}) {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  const [categories, caseStudy] = await Promise.all([
    adminGetAllCategories(),
    adminGetCaseStudyById(params.id),
  ]);

  if (!caseStudy) {
    redirect('/admin/case-studies');
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Studi Kasus</h1>
        </div>

        <div className="max-w-4xl">
          <CaseStudyForm
            initialData={{
              title: caseStudy.title,
              slug: caseStudy.slug || '',
              client_name: caseStudy.client_name,
              category_id: caseStudy.category_id || '',
              challenge: caseStudy.challenge || '',
              strategy: caseStudy.strategy || '',
              results: caseStudy.results || '',
              testimonial: caseStudy.testimonial || '',
              testimonial_author: caseStudy.testimonial_author || '',
              testimonial_position: caseStudy.testimonial_position || '',
              thumbnail_url: caseStudy.thumbnail_url || '',
              client_logo_url: caseStudy.client_logo_url || '',
              hero_image_url: caseStudy.hero_image_url || '',
              gallery_urls: caseStudy.gallery_urls || [],
              metrics: caseStudy.metrics ? Object.entries(caseStudy.metrics).map(([label, value]) => ({ label, value })) : [],
              meta_title: caseStudy.meta_title || '',
              meta_description: caseStudy.meta_description || '',
              meta_keywords: caseStudy.meta_keywords || [],
              is_featured: caseStudy.is_featured,
              is_published: caseStudy.is_published,
              display_order: caseStudy.display_order,
              website_url: caseStudy.website_url || '',
              instagram_url: caseStudy.instagram_url || '',
              facebook_url: caseStudy.facebook_url || '',
              services: caseStudy.services || '',
            }}
            categories={categories}
            onSubmit={updateCaseStudy.bind(null, params.id)}
          />
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
