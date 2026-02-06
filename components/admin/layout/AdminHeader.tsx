'use client';

import { supabase } from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/case-studies': 'Case Studies',
  '/admin/categories': 'Categories',
  '/admin/testimonials': 'Testimonials',
  '/admin/client-logos': 'Client Logos',
  '/admin/video-embeds': 'Video Embeds',
  '/admin/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Check if it's a sub-route (e.g. /admin/case-studies/new → Case Studies)
  const parentPath = Object.keys(PAGE_TITLES)
    .filter((p) => p !== '/admin')
    .find((p) => pathname.startsWith(p));
  return parentPath ? PAGE_TITLES[parentPath] : 'Dashboard';
}

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch {
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4 gap-2">
          {/* Page Title */}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{getPageTitle(pathname)}</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* View Website Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-hadona-primary/10 text-hadona-primary rounded-xl hover:bg-hadona-primary/20 transition-colors font-semibold text-sm"
              title="View Website"
            >
              <i className="bi bi-eye"></i>
              <span>View Site</span>
            </a>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[auto] sm:min-w-[100px]"
              title={isLoading ? 'Logging out...' : 'Logout'}
            >
              {isLoading ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin"></i>
                  <span className="hidden sm:inline">Logging out...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="hidden sm:inline">Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
