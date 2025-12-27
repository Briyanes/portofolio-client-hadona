import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { caseStudySchema } from '@/lib/validators';

// GET all case studies (admin only)
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

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

    const { data: caseStudies, error } = await supabaseAdmin
      .from('case_studies')
      .select(`
        *,
        category:categories(*)
      `)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: caseStudies });
  } catch (error: any) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}

// POST create new case study
export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

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

    const formData = await request.formData();

    // Extract and validate form data
    const rawData: any = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      client_name: formData.get('client_name'),
      category_id: formData.get('category_id'),
      challenge: formData.get('challenge'),
      strategy: formData.get('strategy'),
      results: formData.get('results'),
      testimonial: formData.get('testimonial') || null,
      testimonial_author: formData.get('testimonial_author') || null,
      testimonial_position: formData.get('testimonial_position') || null,
      metrics: formData.get('metrics') ? JSON.parse(formData.get('metrics') as string) : null,
      meta_title: formData.get('meta_title') || null,
      meta_description: formData.get('meta_description') || null,
      meta_keywords: formData.get('meta_keywords')?.toString().split(',').map((k: string) => k.trim()).filter(Boolean) || null,
      thumbnail_url: formData.get('thumbnail_url') || null,
      hero_image_url: formData.get('hero_image_url') || null,
      client_logo_url: formData.get('client_logo_url') || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_featured: formData.get('is_featured') === 'on',
      is_published: formData.get('is_published') === 'on',
      // Quick Info fields
      website_url: formData.get('website_url') || null,
      instagram_url: formData.get('instagram_url') || null,
      facebook_url: formData.get('facebook_url') || null,
      services: formData.get('services') || '',
    };

    // Validate with Zod
    const validatedData = caseStudySchema.parse(rawData);

    // Check if slug is unique
    const { data: existing } = await supabaseAdmin
      .from('case_studies')
      .select('id')
      .eq('slug', validatedData.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Insert case study
    const { data: newCaseStudy, error } = await supabaseAdmin
      .from('case_studies')
      .insert({
        ...validatedData,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data: newCaseStudy }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating case study:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create case study' },
      { status: 500 }
    );
  }
}
