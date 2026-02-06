import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';
import { parseCaseStudyFormData } from '@/lib/parse-case-study-form';

// GET single case study
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: caseStudy, error } = await supabaseAdmin
      .from('case_studies')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!caseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    return NextResponse.json({ data: caseStudy });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch case study' },
      { status: 500 }
    );
  }
}

// PUT update case study
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    // Parse and validate FormData
    const validatedData = parseCaseStudyFormData(formData);

    // Check if slug is unique (excluding current case study)
    if (validatedData.slug) {
      const { data: existing } = await supabaseAdmin
        .from('case_studies')
        .select('id')
        .eq('slug', validatedData.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update case study
    const { data: updatedCaseStudy, error } = await supabaseAdmin
      .from('case_studies')
      .update({
        ...validatedData,
        updated_by: auth.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data: updatedCaseStudy });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update case study' },
      { status: 500 }
    );
  }
}

// DELETE case study
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch case study data first to get image URLs for cleanup
    const { data: caseStudy } = await supabaseAdmin
      .from('case_studies')
      .select('thumbnail_url, hero_image_url, client_logo_url, gallery_urls')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Clean up orphaned images (best-effort, won't block deletion)
    if (caseStudy) {
      const { cleanupCaseStudyImages } = await import('@/lib/cleanup-storage');
      await cleanupCaseStudyImages(caseStudy);
    }

    // Revalidate paths
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin/case-studies');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete case study' },
      { status: 500 }
    );
  }
}
