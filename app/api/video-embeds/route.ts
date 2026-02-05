import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminUserForAction } from '@/lib/admin-auth';

// GET all video embeds (admin only)
export async function GET() {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('video_embeds')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching video embeds:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch video embeds' },
      { status: 500 }
    );
  }
}

// POST create video embed
export async function POST(request: Request) {
  try {
    const auth = await getAdminUserForAction();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      .insert({
        title,
        video_url,
        platform,
        client_name: client_name || null,
        description: description || null,
        thumbnail_url: thumbnail_url || null,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
        display_order: display_order ?? 0,
        created_by: auth.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating video embed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create video embed' },
      { status: 500 }
    );
  }
}
