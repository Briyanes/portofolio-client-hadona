import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';

// GET single video embed by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('video_embeds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch video embed' },
      { status: 500 }
    );
  }
}

// PUT update video embed
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { 
      title, 
      video_url, 
      platform, 
      client_name, 
      description, 
      thumbnail_url,
      is_active, 
      is_featured, 
      display_order 
    } = body;

    // Validate required fields
    if (!title || !video_url || !platform) {
      return NextResponse.json(
        { error: 'Title, video URL, and platform are required' },
        { status: 400 }
      );
    }

    // Validate platform
    if (!['instagram', 'tiktok', 'youtube'].includes(platform)) {
      return NextResponse.json(
        { error: 'Platform must be instagram, tiktok, or youtube' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('video_embeds')
      .update({
        title,
        video_url,
        platform,
        client_name: client_name || null,
        description: description || null,
        thumbnail_url: thumbnail_url || null,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
        display_order: display_order ?? 0,
        updated_by: auth.user.id,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update video embed' },
      { status: 500 }
    );
  }
}

// DELETE video embed
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('video_embeds')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Video embed deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete video embed' },
      { status: 500 }
    );
  }
}
