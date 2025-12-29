import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';

// GET client logo by ID
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
      .from('client_logos')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Client logo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching client logo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch client logo' },
      { status: 500 }
    );
  }
}

// PUT update client logo
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
    const { name, logo_url, website_url, is_active, display_order } = body;

    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .update({
        name,
        logo_url,
        website_url: website_url || null,
        is_active: is_active !== undefined ? is_active : true,
        display_order: display_order || 0,
        updated_by: auth.user.id,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating client logo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update client logo' },
      { status: 500 }
    );
  }
}

// DELETE client logo
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
      .from('client_logos')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Client logo deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting client logo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete client logo' },
      { status: 500 }
    );
  }
}
