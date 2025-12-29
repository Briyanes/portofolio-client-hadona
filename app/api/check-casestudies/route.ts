import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    // Get all case studies (published and unpublished)
    const { data: allCaseStudies, error: allError } = await supabaseAdmin
      .from('case_studies')
      .select('*, categories(*)')
      .order('display_order', { ascending: true });

    // Get only published case studies
    const { data: publishedCaseStudies, error: publishedError } = await supabaseAdmin
      .from('case_studies')
      .select('*, categories(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    // Get categories
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    return NextResponse.json({
      success: true,
      caseStudies: {
        all: {
          count: allCaseStudies?.length || 0,
          data: allCaseStudies?.map(cs => ({
            id: cs.id,
            title: cs.title,
            is_published: cs.is_published,
            category_id: cs.category_id,
            category_slug: cs.categories?.slug,
            category_name: cs.categories?.name,
          })) || [],
        },
        published: {
          count: publishedCaseStudies?.length || 0,
          data: publishedCaseStudies?.map(cs => ({
            id: cs.id,
            title: cs.title,
            is_published: cs.is_published,
            category_id: cs.category_id,
            category_slug: cs.categories?.slug,
            category_name: cs.categories?.name,
          })) || [],
        },
      },
      categories: {
        count: categories?.length || 0,
        data: categories || [],
      },
      errors: {
        all: allError?.message || null,
        published: publishedError?.message || null,
        categories: categoriesError?.message || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
