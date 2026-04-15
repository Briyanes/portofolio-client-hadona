import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createSupabaseAdminClient } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Get user from session cookie
    const supabase = await createSupabaseAdminClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch case study data to get image URLs for cleanup
    const { data: caseStudy } = await supabaseAdmin
      .from('case_studies')
      .select('thumbnail_url, hero_image_url, client_logo_url, gallery_urls')
      .eq('id', id)
      .single();

    // Delete case study
    const { error } = await supabaseAdmin
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Clean up orphaned images (best-effort)
    if (caseStudy) {
      const { cleanupCaseStudyImages } = await import('@/lib/cleanup-storage');
      await cleanupCaseStudyImages(caseStudy);
    }

    // Revalidate the case studies page
    revalidatePath('/admin/case-studies');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete case study' },
      { status: 500 }
    );
  }
}
