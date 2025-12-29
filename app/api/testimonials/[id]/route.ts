import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';

// GET testimonial by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT update testimonial
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { client_name, testimonial, position, is_featured, is_published, display_order, case_study_id } = body;

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update({
        client_name,
        testimonial,
        position: position || null,
        is_featured: is_featured || false,
        is_published: is_published || false,
        display_order: display_order || 0,
        case_study_id: case_study_id || null,
        updated_by: auth.user.id,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE testimonial
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
