import { getPublishedCaseStudies, getCaseStudiesCount } from '@/lib/supabase-queries';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { AdminCaseStudyCard } from '@/components/admin/case-studies/AdminCaseStudyCard';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import { CaseStudy } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch statistics with error handling
  let caseStudies: CaseStudy[] = [];
  let countData = { total: 0, published: 0, draft: 0, featured: 0 };
  let hasError = false;

  try {
    const [studies, counts] = await Promise.all([
      getPublishedCaseStudies(),
      getCaseStudiesCount(),
    ]);
    caseStudies = studies || [];
    countData = counts || { total: 0, published: 0, draft: 0, featured: 0 };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    hasError = true;
  }

  const stats = [
    {
      title: 'Total Case Studies',
      value: countData.total || 0,
      icon: 'bi-file-earmark-text',
      color: 'from-blue-500 to-blue-600',
      href: '/admin/case-studies',
    },
    {
      title: 'Published',
      value: countData.published || 0,
      icon: 'bi-check-circle',
      color: 'from-green-500 to-green-600',
      href: '/admin/case-studies?status=published',
    },
    {
      title: 'Draft',
      value: countData.draft || 0,
      icon: 'bi-file-earmark',
      color: 'from-yellow-500 to-yellow-600',
      href: '/admin/case-studies?status=draft',
    },
    {
      title: 'Featured',
      value: countData.featured || 0,
      icon: 'bi-star',
      color: 'from-purple-500 to-purple-600',
      href: '/admin/case-studies?featured=true',
    },
  ];

  const recentCaseStudies = caseStudies.slice(0, 6);

  return (
    <AdminProtectedLayout showHeader={false}>
      <div className="space-y-8 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2">
            <i className="bi bi-exclamation-circle text-xl"></i>
            <div>
              <p className="font-semibold">Error Loading Data</p>
              <p className="text-sm">There was a problem loading the dashboard data. Please refresh the page.</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 w-full">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-hadona-primary to-hadona-bg-dark rounded-2xl p-6 text-white w-full">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <a
            href="/admin/case-studies/new"
            className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <i className="bi bi-plus-lg text-xl"></i>
            <span className="font-semibold">New Case Study</span>
          </a>
          <a
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <i className="bi bi-tags text-xl"></i>
            <span className="font-semibold">Manage Categories</span>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <i className="bi bi-eye text-xl"></i>
            <span className="font-semibold">View Website</span>
          </a>
        </div>
      </div>

      {/* Recent Case Studies */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Case Studies</h2>
          <a
            href="/admin/case-studies"
            className="text-hadona-primary hover:text-hadona-dark font-semibold text-sm flex items-center gap-1"
          >
            View All
            <i className="bi bi-arrow-right"></i>
          </a>
        </div>

        {recentCaseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 w-full">
            {recentCaseStudies.map((caseStudy) => (
              <AdminCaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <i className="bi bi-inbox text-6xl text-gray-300 mb-4 block"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Case Studies Yet</h3>
            <p className="text-gray-600 mb-6">Create your first case study to get started!</p>
            <a
              href="/admin/case-studies/new"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <i className="bi bi-plus-lg"></i>
              Create Case Study
            </a>
          </div>
        )}
      </div>
      </div>
    </AdminProtectedLayout>
  );
}
