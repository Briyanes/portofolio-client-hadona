'use client';

import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function AdminHeader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      toast.error('Failed to logout');
      console.error('Logout error:', error);
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Dashboard</h1>
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
