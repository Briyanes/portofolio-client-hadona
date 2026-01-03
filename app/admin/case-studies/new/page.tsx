import { adminGetAllCategories } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { caseStudySchema } from '@/lib/validators';

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
      console.log('Creating case study...');
      console.log('FormData keys:', Array.from(formData.keys()));

      // Helper untuk mengambil string dari FormData
      const getString = (key: string): string => {
        const val = formData.get(key);
        if (val instanceof File) return '';
        return val === null || val === undefined ? '' : String(val);
      };

      // Helper untuk boolean dari FormData
      const getBoolean = (key: string): boolean => {
        const val = formData.get(key);
        return val === 'on' || val === 'true';
      };

      // Parse metrics JSON
      let parsedMetrics;
      const metrics_json = getString('metrics');
      if (metrics_json && metrics_json.trim() !== '') {
        try {
          parsedMetrics = JSON.parse(metrics_json);
        } catch (e) {
          parsedMetrics = undefined;
        }
      }

      // Parse meta keywords
      let parsedKeywords;
      const meta_keywords_str = getString('meta_keywords');
      if (meta_keywords_str && meta_keywords_str.trim() !== '') {
        parsedKeywords = meta_keywords_str.split(',').map((k: string) => k.trim()).filter(Boolean);
      }

      // Parse gallery_urls
      let gallery_urls;
      const gallery_urls_str = formData.get('gallery_urls');
      if (gallery_urls_str && typeof gallery_urls_str === 'string' && gallery_urls_str.trim() !== '') {
        try {
          gallery_urls = JSON.parse(gallery_urls_str);
          if (!Array.isArray(gallery_urls)) {
            gallery_urls = undefined;
          }
        } catch (e) {
          gallery_urls = undefined;
        }
      }

      // Prepare data for validation
      const rawData = {
        title: getString('title').trim(),
        slug: getString('slug').trim(),
        client_name: getString('client_name').trim(),
        category_id: getString('category_id').trim(),
        challenge: getString('challenge').trim(),
        strategy: getString('strategy').trim(),
        results: getString('results').trim(),
        testimonial: getString('testimonial').trim(),
        testimonial_author: getString('testimonial_author').trim(),
        testimonial_position: getString('testimonial_position').trim(),
        metrics: parsedMetrics,
        meta_title: getString('meta_title').trim(),
        meta_description: getString('meta_description').trim(),
        meta_keywords: parsedKeywords,
        thumbnail_url: getString('thumbnail_url').trim(),
        hero_image_url: getString('hero_image_url').trim(),
        client_logo_url: getString('client_logo_url').trim(),
        gallery_urls: gallery_urls,
        display_order: parseInt(getString('display_order')) || 0,
        is_featured: getBoolean('is_featured'),
        is_published: getBoolean('is_published'),
        website_url: getString('website_url').trim(),
        instagram_url: getString('instagram_url').trim(),
        facebook_url: getString('facebook_url').trim(),
        services: getString('services').trim(),
      };

      // Validate with Zod
      const validatedData = caseStudySchema.parse(rawData);

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

      console.log('✓ Case study created successfully');

      // Revalidate paths
      revalidatePath('/admin/case-studies');
      revalidatePath('/admin/case-studies/new');

      // Revalidate public page if slug exists
      if (validatedData.slug) {
        revalidatePath(`/studi-kasus/${validatedData.slug}`);
      }

      // Return success - client will handle redirect
      return { success: true };
    } catch (error: any) {
      console.error('Create error:', error);
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
