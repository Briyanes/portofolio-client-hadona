import { supabaseAdmin } from '@/lib/supabase-admin';

const STORAGE_BUCKET = 'case-study-images';

/**
 * Extract the storage path from a Supabase public URL.
 * URL format: https://<ref>.supabase.co/storage/v1/object/public/case-study-images/<path>
 */
function extractStoragePath(url: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

/**
 * Remove orphaned images from Supabase Storage for a deleted case study.
 * Silently ignores errors so deletion always succeeds.
 */
export async function cleanupCaseStudyImages(caseStudy: {
  thumbnail_url?: string | null;
  hero_image_url?: string | null;
  client_logo_url?: string | null;
  gallery_urls?: string[] | null;
}): Promise<void> {
  const urls: string[] = [
    caseStudy.thumbnail_url,
    caseStudy.hero_image_url,
    caseStudy.client_logo_url,
    ...(caseStudy.gallery_urls ?? []),
  ].filter(Boolean) as string[];

  const paths = urls.map(extractStoragePath).filter(Boolean) as string[];

  if (paths.length === 0) return;

  try {
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove(paths);
  } catch {
    // Silently ignore — image cleanup is best-effort
  }
}
