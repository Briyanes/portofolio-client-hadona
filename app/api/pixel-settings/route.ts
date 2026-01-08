import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import { updatePixelSettings } from '@/lib/supabase-queries';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Verify admin user
    const auth = await getAdminUserWithToken();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      meta_pixel_id,
      ig_pixel_id,
      gtag_id,
      gtm_id,
      is_meta_enabled,
      is_ig_enabled,
      is_gtag_enabled,
      is_gtm_enabled,
    } = body;

    // Validate
    if (is_meta_enabled && !meta_pixel_id) {
      return NextResponse.json(
        { error: 'Meta Pixel ID is required when Meta Pixel is enabled' },
        { status: 400 }
      );
    }

    if (is_ig_enabled && !ig_pixel_id) {
      return NextResponse.json(
        { error: 'IG Pixel ID is required when IG Pixel is enabled' },
        { status: 400 }
      );
    }

    if (is_gtag_enabled && !gtag_id) {
      return NextResponse.json(
        { error: 'GTag ID is required when Google Analytics is enabled' },
        { status: 400 }
      );
    }

    if (is_gtm_enabled && !gtm_id) {
      return NextResponse.json(
        { error: 'GTM ID is required when Google Tag Manager is enabled' },
        { status: 400 }
      );
    }

    // Update settings
    const settings = await updatePixelSettings({
      meta_pixel_id: meta_pixel_id || null,
      ig_pixel_id: ig_pixel_id || null,
      gtag_id: gtag_id || null,
      gtm_id: gtm_id || null,
      is_meta_enabled,
      is_ig_enabled,
      is_gtag_enabled,
      is_gtm_enabled,
    });

    // Revalidate settings page to clear cache
    revalidatePath('/admin/settings');
    revalidatePath('/api/pixel-settings');

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error updating pixel settings:', error);
    return NextResponse.json(
      { error: 'Failed to update pixel settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getPixelSettings } = await import('@/lib/supabase-queries');
    const settings = await getPixelSettings();

    return NextResponse.json({
      settings,
    });
  } catch (error) {
    console.error('Error fetching pixel settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pixel settings' },
      { status: 500 }
    );
  }
}
