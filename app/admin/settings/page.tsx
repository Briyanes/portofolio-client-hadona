import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import { getPixelSettings } from '@/lib/supabase-queries';
import { PixelSettingsForm } from '@/components/admin/PixelSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  // Fetch pixel settings
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
    <AdminProtectedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your tracking and analytics settings</p>
        </div>

        {/* Pixel & Analytics Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <i className="bi bi-graph-up-arrow text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pixel & Analytics Settings</h2>
              <p className="text-sm text-gray-600">Configure Meta Pixel, Instagram Pixel, and Google Analytics</p>
            </div>
          </div>

          <PixelSettingsForm initialData={pixelSettings} />
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <i className="bi bi-info-circle text-blue-600 text-xl mt-0.5"></i>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Tracking Implementation</h3>
              <p className="text-blue-700 text-sm">
                Once configured, tracking pixels will be automatically added to your portfolio homepage.
                Events tracked include ViewContent (case study views) and InitiateCheckout (WhatsApp clicks).
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
