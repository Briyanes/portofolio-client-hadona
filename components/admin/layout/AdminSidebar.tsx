'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: 'bi-grid-1x2',
  },
  {
    href: '/admin/case-studies',
    label: 'Case Studies',
    icon: 'bi-file-earmark-text',
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: 'bi-tags',
  },
  {
    href: '/admin/testimonials',
    label: 'Testimonials',
    icon: 'bi-chat-quote',
  },
  {
    href: '/admin/client-logos',
    label: 'Client Logos',
    icon: 'bi-badge-ad',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: 'bi-gear',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button - Hide on desktop */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-hadona-primary text-white rounded-xl shadow-lg hover:bg-hadona-dark transition-colors"
        aria-label="Toggle menu"
      >
        <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl`}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen
          bg-gradient-to-b from-hadona-primary to-hadona-bg-dark
          w-64 flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          shadow-2xl
          ${isMobileMenuOpen ? 'translate-x-0 z-50' : '-translate-x-full lg:translate-x-0 lg:z-40'}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-black text-white">
              Hadona<span className="text-hadona-yellow">Admin</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'bg-hadona-yellow/20 text-hadona-yellow'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`bi ${item.icon} text-lg`}></i>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-xl bg-hadona-yellow flex items-center justify-center">
                <i className="bi bi-person-fill text-hadona-bg-dark text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin</p>
                <p className="text-xs text-gray-400 truncate">admin@hadona.id</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile - Only show when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
