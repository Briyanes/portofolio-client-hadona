import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Debug endpoint to check video embeds data
export async function GET() {
  try {
    // Query all video embeds
    const { data: allVideos, error: allError } = await supabaseAdmin
      .from('video_embeds')
      .select('*');

    // Query featured videos
    const { data: featuredVideos, error: featuredError } = await supabaseAdmin
      .from('video_embeds')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true);

    return NextResponse.json({
      success: true,
      debug: {
        allVideos: {
          count: allVideos?.length || 0,
          data: allVideos,
          error: allError?.message,
        },
        featuredVideos: {
          count: featuredVideos?.length || 0,
          data: featuredVideos,
          error: featuredError?.message,
        },
      },
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
