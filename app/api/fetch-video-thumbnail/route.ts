import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Fetch thumbnail from video URL using various methods
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
        sourceUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    } else if (platform === 'instagram') {
      // Instagram - try multiple methods
      sourceUrl = await fetchInstagramThumbnail(video_url);
    }

    // If we got a source URL, try to download and upload to Supabase
    if (sourceUrl) {
      try {
        // Download the image
        const imageResponse = await fetch(sourceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
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
        // For YouTube, return direct URL as fallback
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
            ? 'Instagram membatasi akses. Silakan screenshot dan upload manual.'
            : 'Could not fetch thumbnail automatically' 
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thumbnail' },
      { status: 500 }
    );
  }
}

// Special function to try multiple methods for Instagram
async function fetchInstagramThumbnail(url: string): Promise<string | null> {
  // Extract shortcode from URL
  const shortcodeMatch = url.match(/\/(reel|p|reels)\/([A-Za-z0-9_-]+)/);
  if (!shortcodeMatch) return null;
  
  const shortcode = shortcodeMatch[2];

  // Method 1: Try Instagram oEmbed API (official - may work for public posts)
  try {
    const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);

    if (response.ok) {
      const data = await response.json();
      if (data.thumbnail_url) {
        return data.thumbnail_url;
      }
    }
  } catch (e) {
    console.log('Instagram oEmbed failed:', e);
  }

  // Method 2: Try embed page scraping with Googlebot
  try {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/`;
    const response = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    if (response.ok) {
      const html = await response.text();
      
      // Look for display_url or thumbnail in the HTML
      const patterns = [
        /"display_url":"([^"]+)"/,
        /"thumbnail_src":"([^"]+)"/,
        /poster="([^"]+)"/,
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          const imageUrl = match[1].replace(/\\u0026/g, '&').replace(/\\/g, '');
          if (imageUrl.startsWith('https://')) {
            return imageUrl;
          }
        }
      }
    }
  } catch (e) {
    console.log('Embed scraping failed:', e);
  }

  // Method 3: Try with Facebook crawler user-agent
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1',
      },
    });

    if (response.ok) {
      const html = await response.text();
      const ogMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
      if (ogMatch && ogMatch[1]) {
        return ogMatch[1];
      }
    }
  } catch (e) {
    console.log('Facebook crawler failed:', e);
  }

  return null;
}
