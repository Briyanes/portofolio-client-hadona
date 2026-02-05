import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Fetch thumbnail from video URL using oEmbed APIs
export async function POST(request: Request) {
  try {
    const { video_url, platform } = await request.json();

    if (!video_url || !platform) {
      return NextResponse.json(
        { error: 'Video URL and platform are required' },
        { status: 400 }
      );
    }

    let thumbnailUrl: string | null = null;
    let sourceUrl: string | null = null;

    if (platform === 'tiktok') {
      // TikTok oEmbed API (public, no auth required)
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(video_url)}`;
      const response = await fetch(oembedUrl);
      
      if (response.ok) {
        const data = await response.json();
        sourceUrl = data.thumbnail_url;
      }
    } else if (platform === 'youtube') {
      // YouTube - extract video ID and construct thumbnail URL
      const match = video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\s]+)/);
      if (match) {
        const videoId = match[1];
        // YouTube provides multiple thumbnail sizes - use maxres first, fallback to hq
        sourceUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    } else if (platform === 'instagram') {
      // Instagram - try to get thumbnail from the page meta tags
      try {
        const response = await fetch(video_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          },
        });
        
        if (response.ok) {
          const html = await response.text();
          
          // Try to extract og:image from meta tags
          const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
          if (ogImageMatch) {
            sourceUrl = ogImageMatch[1];
          }
        }
      } catch (e) {
        console.log('Instagram thumbnail fetch failed');
      }
    }

    // If we got a source URL, try to download and upload to Supabase
    if (sourceUrl) {
      try {
        // Download the image
        const imageResponse = await fetch(sourceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
          
          // Generate unique filename
          const ext = contentType.includes('png') ? 'png' : 'jpg';
          const filename = `video-thumbnails/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('images')
            .upload(filename, imageBuffer, {
              contentType,
              upsert: false,
            });

          if (!uploadError && uploadData) {
            // Get public URL
            const { data: urlData } = supabaseAdmin.storage
              .from('images')
              .getPublicUrl(filename);

            thumbnailUrl = urlData.publicUrl;
          }
        }
      } catch (downloadError) {
        console.log('Failed to download/upload thumbnail:', downloadError);
        // For YouTube, return direct URL as fallback (YouTube allows hotlinking)
        if (platform === 'youtube') {
          thumbnailUrl = sourceUrl;
        }
      }
    }

    if (thumbnailUrl) {
      return NextResponse.json({ success: true, thumbnail_url: thumbnailUrl });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: platform === 'instagram' 
            ? 'Instagram membatasi akses thumbnail. Silakan screenshot video dan upload manual.'
            : 'Could not fetch thumbnail automatically' 
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching thumbnail:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch thumbnail' },
      { status: 500 }
    );
  }
}
