import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';

// GET all testimonials (admin only)
export async function GET() {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST create testimonial
export async function POST(request: Request) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { client_name, testimonial, position, is_featured, is_published, display_order, case_study_id } = body;

    // Validate required fields
    if (!client_name || !testimonial) {
      return NextResponse.json(
        { error: 'Client name and testimonial are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        client_name,
        testimonial,
        position: position || null,
        is_featured: is_featured || false,
        is_published: is_published || false,
        display_order: display_order || 0,
        case_study_id: case_study_id || null,
        created_by: auth.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
