import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and application settings</p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <i className="bi bi-person-fill text-blue-600 text-xl"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Manage your admin account preferences and security settings.
            </p>
            <div className="text-gray-400 text-sm italic">
              Coming soon...
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <i className="bi bi-sliders text-purple-600 text-xl"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">General Settings</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Configure application-wide settings and preferences.
            </p>
            <div className="text-gray-400 text-sm italic">
              Coming soon...
            </div>
          </div>

          {/* Site Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <i className="bi bi-globe text-green-600 text-xl"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Site Settings</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Manage site configuration, SEO, and metadata.
            </p>
            <div className="text-gray-400 text-sm italic">
              Coming soon...
            </div>
          </div>

          {/* Backup & Export */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <i className="bi bi-cloud-download text-orange-600 text-xl"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Backup & Export</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Export data and manage backups.
            </p>
            <div className="text-gray-400 text-sm italic">
              Coming soon...
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <i className="bi bi-info-circle text-blue-600 text-xl mt-0.5"></i>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Settings Page Under Development</h3>
              <p className="text-blue-700 text-sm">
                The settings page is currently under development. Features will be added soon including
                account management, site configuration, and data export capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
