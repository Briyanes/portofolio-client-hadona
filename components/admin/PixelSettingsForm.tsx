'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';

interface PixelSettingsFormProps {
  initialData?: {
    meta_pixel_id: string | null;
    ig_pixel_id: string | null;
    gtag_id: string | null;
    gtm_id: string | null;
    is_meta_enabled: boolean;
    is_ig_enabled: boolean;
    is_gtag_enabled: boolean;
    is_gtm_enabled: boolean;
  };
}

export function PixelSettingsForm({ initialData }: PixelSettingsFormProps) {
  const [formData, setFormData] = useState({
    meta_pixel_id: initialData?.meta_pixel_id || '',
    ig_pixel_id: initialData?.ig_pixel_id || '',
    gtag_id: initialData?.gtag_id || '',
    gtm_id: initialData?.gtm_id || '',
    is_meta_enabled: initialData?.is_meta_enabled || false,
    is_ig_enabled: initialData?.is_ig_enabled || false,
    is_gtag_enabled: initialData?.is_gtag_enabled || false,
    is_gtm_enabled: initialData?.is_gtm_enabled || false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync initialData to formData when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        meta_pixel_id: initialData.meta_pixel_id || '',
        ig_pixel_id: initialData.ig_pixel_id || '',
        gtag_id: initialData.gtag_id || '',
        gtm_id: initialData.gtm_id || '',
        is_meta_enabled: initialData.is_meta_enabled || false,
        is_ig_enabled: initialData.is_ig_enabled || false,
        is_gtag_enabled: initialData.is_gtag_enabled || false,
        is_gtm_enabled: initialData.is_gtm_enabled || false,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/pixel-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save pixel settings');
      }

      toast.success('Pixel settings saved successfully!');

      // Refresh page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving pixel settings:', error);
      toast.error('Failed to save pixel settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Meta Pixel Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="bi bi-facebook text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Meta Pixel (Facebook)</h3>
              <p className="text-sm text-gray-600">Track conversions from Facebook & Instagram ads</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_meta_enabled}
              onChange={(e) => setFormData({ ...formData, is_meta_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {formData.is_meta_enabled && (
          <div className="ml-13 pl-13">
            <Input
              label="Meta Pixel ID"
              name="meta_pixel_id"
              placeholder="e.g., 1234567890123456"
              value={formData.meta_pixel_id}
              onChange={(e) => setFormData({ ...formData, meta_pixel_id: e.target.value })}
              helperText="Find your Pixel ID in Meta Events Manager"
              required={formData.is_meta_enabled}
            />
          </div>
        )}
      </div>

      {/* IG Pixel Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <i className="bi bi-instagram text-pink-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Instagram Pixel</h3>
              <p className="text-sm text-gray-600">Track Instagram-specific conversions</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_ig_enabled}
              onChange={(e) => setFormData({ ...formData, is_ig_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
          </label>
        </div>

        {formData.is_ig_enabled && (
          <div className="ml-13 pl-13">
            <Input
              label="Instagram Pixel ID"
              name="ig_pixel_id"
              placeholder="e.g., 1234567890123456"
              value={formData.ig_pixel_id}
              onChange={(e) => setFormData({ ...formData, ig_pixel_id: e.target.value })}
              helperText="Find your Pixel ID in Meta Events Manager"
              required={formData.is_ig_enabled}
            />
          </div>
        )}
      </div>

      {/* Google Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <i className="bi bi-google text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Analytics (GA4)</h3>
              <p className="text-sm text-gray-600">Track website traffic and user behavior</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_gtag_enabled}
              onChange={(e) => setFormData({ ...formData, is_gtag_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>

        {formData.is_gtag_enabled && (
          <div className="ml-13 pl-13">
            <Input
              label="Google Analytics Measurement ID"
              name="gtag_id"
              placeholder="e.g., G-XXXXXXXXXX"
              value={formData.gtag_id}
              onChange={(e) => setFormData({ ...formData, gtag_id: e.target.value })}
              helperText="Format: G-XXXXXXXXXX (found in GA4 Admin → Data Streams)"
              required={formData.is_gtag_enabled}
            />
          </div>
        )}
      </div>

      {/* Google Tag Manager Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="bi bi-google text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Tag Manager (GTM)</h3>
              <p className="text-sm text-gray-600">Manage all tracking tags with GTM container</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_gtm_enabled}
              onChange={(e) => setFormData({ ...formData, is_gtm_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {formData.is_gtm_enabled && (
          <div className="ml-13 pl-13">
            <Input
              label="GTM Container ID"
              name="gtm_id"
              placeholder="e.g., GTM-XXXXXXX"
              value={formData.gtm_id}
              onChange={(e) => setFormData({ ...formData, gtm_id: e.target.value })}
              helperText="Format: GTM-XXXXXXX (found in GTM Admin → Install GTM)"
              required={formData.is_gtm_enabled}
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-hadona-primary text-white rounded-lg hover:bg-hadona-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <i className="bi bi-info-circle text-blue-600 text-lg mt-0.5"></i>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-2">Event Tracking Setup</p>
            <ul className="space-y-1 text-blue-800">
              <li>• <strong>ViewContent</strong> - Automatically tracked on case study detail pages</li>
              <li>• <strong>InitiateCheckout</strong> - Tracked when WhatsApp button is clicked</li>
              <li>• <strong>PageView</strong> - Automatically tracked on all page views</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
