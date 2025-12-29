import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    // Get all categories (both active and inactive)
    const { data: allCategories, error: allError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    // Get only active categories
    const { data: activeCategories, error: activeError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    return NextResponse.json({
      success: true,
      allCategories: {
        count: allCategories?.length || 0,
        data: allCategories || [],
      },
      activeCategories: {
        count: activeCategories?.length || 0,
        data: activeCategories || [],
      },
      errors: {
        all: allError?.message || null,
        active: activeError?.message || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
