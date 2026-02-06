import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { caseStudySchema } from '@/lib/validators';
import { getAdminUserForAction } from '@/lib/admin-auth';

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
    console.error('Error fetching case study:', error);
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

    // Parse video_embeds
    let video_embeds;
    const video_embeds_str = getString('video_embeds');
    if (video_embeds_str && video_embeds_str.trim() !== '') {
      try {
        video_embeds = JSON.parse(video_embeds_str);
        if (!Array.isArray(video_embeds)) {
          video_embeds = [];
        }
      } catch (e) {
        video_embeds = [];
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
      video_embeds: video_embeds || [],
    };

    // Validate with Zod
    const validatedData = caseStudySchema.parse(rawData);

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

    const { error } = await supabaseAdmin
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting case study:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete case study' },
      { status: 500 }
    );
  }
}
