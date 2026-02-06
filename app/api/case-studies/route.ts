import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';
import { parseCaseStudyFormData } from '@/lib/parse-case-study-form';

// GET all case studies (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json(
      { error: error.message || 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}

// POST create new case study
export async function POST(request: NextRequest) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    // Parse and validate FormData
    const validatedData = parseCaseStudyFormData(formData);

    // Check if slug is unique
    if (validatedData.slug) {
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

    return NextResponse.json({ data: newCaseStudy }, { status: 201 });
  } catch (error: any) {
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
