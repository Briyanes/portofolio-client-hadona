import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { caseStudySchema } from '@/lib/validators';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET single case study
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session from cookies
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(session.access_token);

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

    const { data: caseStudy, error } = await supabaseAdmin
      .from('case_studies')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', params.id)
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
  { params }: { params: { id: string } }
) {
  try {
    // Get session from cookies
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error in PUT:', sessionError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(session.access_token);

    if (authError || !user) {
      console.error('Auth error in PUT:', authError);
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
      console.error('User is not admin in PUT:', user.id);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    console.log('PUT received form data keys:', Array.from(formData.keys()));

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

    // Check if slug is unique (excluding current case study)
    if (validatedData.slug) {
      const { data: existing } = await supabaseAdmin
        .from('case_studies')
        .select('id')
        .eq('slug', validatedData.slug)
        .neq('id', params.id)
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
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
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
  { params }: { params: { id: string } }
) {
  try {
    // Get session from cookies
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(session.access_token);

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

    const { error } = await supabaseAdmin
      .from('case_studies')
      .delete()
      .eq('id', params.id);

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
