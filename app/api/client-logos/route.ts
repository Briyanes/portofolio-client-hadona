import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';

// GET all client logos (admin only)
export async function GET() {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching client logos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch client logos' },
      { status: 500 }
    );
  }
}

// POST create client logo
export async function POST(request: Request) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, logo_url, website_url, is_active, display_order } = body;

    // Validate required fields
    if (!name || !logo_url) {
      return NextResponse.json(
        { error: 'Name and logo URL are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .insert({
        name,
        logo_url,
        website_url: website_url || null,
        is_active: is_active !== undefined ? is_active : true,
        display_order: display_order || 0,
        created_by: auth.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client logo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create client logo' },
      { status: 500 }
    );
  }
}
