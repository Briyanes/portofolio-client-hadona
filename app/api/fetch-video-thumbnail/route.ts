import { NextResponse } from 'next/server';

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

    if (platform === 'tiktok') {
      // TikTok oEmbed API (public, no auth required)
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(video_url)}`;
      const response = await fetch(oembedUrl);
      
      if (response.ok) {
        const data = await response.json();
        thumbnailUrl = data.thumbnail_url;
      }
    } else if (platform === 'youtube') {
      // YouTube - extract video ID and construct thumbnail URL
      const match = video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\s]+)/);
      if (match) {
        const videoId = match[1];
        // YouTube provides multiple thumbnail sizes
        // maxresdefault.jpg = highest quality (may not exist for all videos)
        // hqdefault.jpg = high quality (always exists)
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } else if (platform === 'instagram') {
      // Instagram - try to get thumbnail from the page meta tags
      // Note: This might not always work due to Instagram's restrictions
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
            thumbnailUrl = ogImageMatch[1];
          }
        }
      } catch (e) {
        console.log('Instagram thumbnail fetch failed, user can upload manually');
      }
    }

    if (thumbnailUrl) {
      return NextResponse.json({ success: true, thumbnail_url: thumbnailUrl });
    } else {
      return NextResponse.json(
        { success: false, error: 'Could not fetch thumbnail automatically' },
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
