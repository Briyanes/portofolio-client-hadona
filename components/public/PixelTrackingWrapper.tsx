import { getPixelSettings } from '@/lib/supabase-queries';
import { PixelTracking } from './PixelTracking';

export async function PixelTrackingWrapper() {
  let pixelSettings = {
    meta_pixel_id: null,
    ig_pixel_id: null,
    gtag_id: null,
    gtm_id: null,
    is_meta_enabled: false,
    is_ig_enabled: false,
    is_gtag_enabled: false,
    is_gtm_enabled: false,
  };

  try {
    pixelSettings = await getPixelSettings();
  } catch (error) {
    console.error('Error loading pixel settings:', error);
  }

  return (
    <PixelTracking
      metaPixelId={pixelSettings.meta_pixel_id}
      igPixelId={pixelSettings.ig_pixel_id}
      gtagId={pixelSettings.gtag_id}
      gtmId={pixelSettings.gtm_id}
      isMetaEnabled={pixelSettings.is_meta_enabled}
      isIgEnabled={pixelSettings.is_ig_enabled}
      isGtagEnabled={pixelSettings.is_gtag_enabled}
      isGtmEnabled={pixelSettings.is_gtm_enabled}
    />
  );
}
