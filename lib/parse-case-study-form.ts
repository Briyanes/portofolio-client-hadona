import { caseStudySchema, type CaseStudyInput } from '@/lib/validators';

/**
 * Helper to extract string from FormData (returns '' for Files or null)
 */
function getString(formData: FormData, key: string): string {
  const val = formData.get(key);
  if (val instanceof File) return '';
  return val === null || val === undefined ? '' : String(val);
}

/**
 * Helper to extract boolean from FormData
 */
function getBoolean(formData: FormData, key: string): boolean {
  const val = formData.get(key);
  return val === 'on' || val === 'true';
}

/**
 * Parse and validate case study FormData using Zod schema.
 * Shared between server actions and API routes.
 *
 * @returns Validated data conforming to caseStudySchema
 * @throws ZodError if validation fails
 */
export function parseCaseStudyFormData(formData: FormData): CaseStudyInput {
  // Parse metrics JSON
  let parsedMetrics: Record<string, string> | undefined;
  const metrics_json = getString(formData, 'metrics');
  if (metrics_json && metrics_json.trim() !== '') {
    try {
      parsedMetrics = JSON.parse(metrics_json);
    } catch {
      parsedMetrics = undefined;
    }
  }

  // Parse meta keywords
  let parsedKeywords: string[] | undefined;
  const meta_keywords_str = getString(formData, 'meta_keywords');
  if (meta_keywords_str && meta_keywords_str.trim() !== '') {
    parsedKeywords = meta_keywords_str
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean);
  }

  // Parse gallery_urls
  let gallery_urls: string[] | undefined;
  const gallery_urls_str = formData.get('gallery_urls');
  if (gallery_urls_str && typeof gallery_urls_str === 'string' && gallery_urls_str.trim() !== '') {
    try {
      const parsed = JSON.parse(gallery_urls_str);
      if (Array.isArray(parsed)) gallery_urls = parsed;
    } catch {
      gallery_urls = undefined;
    }
  }

  // Parse video_embeds
  let video_embeds: Array<{ url: string; platform: 'instagram' | 'tiktok' | 'youtube'; title?: string; thumbnail_url?: string }> = [];
  const video_embeds_str = getString(formData, 'video_embeds');
  if (video_embeds_str && video_embeds_str.trim() !== '') {
    try {
      const parsed = JSON.parse(video_embeds_str);
      if (Array.isArray(parsed)) video_embeds = parsed;
    } catch {
      video_embeds = [];
    }
  }

  // Prepare raw data
  const rawData = {
    title: getString(formData, 'title').trim(),
    slug: getString(formData, 'slug').trim(),
    client_name: getString(formData, 'client_name').trim(),
    category_id: getString(formData, 'category_id').trim(),
    challenge: getString(formData, 'challenge').trim(),
    strategy: getString(formData, 'strategy').trim(),
    results: getString(formData, 'results').trim(),
    testimonial: getString(formData, 'testimonial').trim(),
    testimonial_author: getString(formData, 'testimonial_author').trim(),
    testimonial_position: getString(formData, 'testimonial_position').trim(),
    metrics: parsedMetrics,
    meta_title: getString(formData, 'meta_title').trim(),
    meta_description: getString(formData, 'meta_description').trim(),
    meta_keywords: parsedKeywords,
    thumbnail_url: getString(formData, 'thumbnail_url').trim(),
    hero_image_url: getString(formData, 'hero_image_url').trim(),
    client_logo_url: getString(formData, 'client_logo_url').trim(),
    gallery_urls,
    video_embeds,
    display_order: parseInt(getString(formData, 'display_order')) || 0,
    is_featured: getBoolean(formData, 'is_featured'),
    is_published: getBoolean(formData, 'is_published'),
    website_url: getString(formData, 'website_url').trim(),
    instagram_url: getString(formData, 'instagram_url').trim(),
    facebook_url: getString(formData, 'facebook_url').trim(),
    services: getString(formData, 'services').trim(),
  };

  // Validate with Zod and return
  return caseStudySchema.parse(rawData);
}
