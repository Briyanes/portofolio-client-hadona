import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { AdminSidebar } from './layout/AdminSidebar';
import { AdminHeader } from './layout/AdminHeader';

export default async function AdminProtectedLayout({
  children,
  showHeader = true,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar - Fixed positioning */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Header - Can be hidden */}
        {showHeader && <AdminHeader user={user} />}

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
