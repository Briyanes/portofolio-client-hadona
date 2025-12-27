import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://portofolio.hadona.id';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Get dynamic data using admin client (no auth needed)
  let caseStudies: any[] = [];
  let categories: any[] = [];

  try {
    const [csResult, catResult] = await Promise.all([
      supabaseAdmin
        .from('case_studies')
        .select('slug, updated_at')
        .eq('is_published', true),
      supabaseAdmin
        .from('categories')
        .select('slug')
        .eq('is_active', true),
    ]);

    caseStudies = csResult.data || [];
    categories = catResult.data || [];
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Case study pages
  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${baseUrl}/studi-kasus/${cs.slug}`,
    lastModified: cs.updated_at ? new Date(cs.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...caseStudyPages];
}
