'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="section-container py-6 text-center">
        <p className="text-sm text-gray-600 mb-2 flex items-center justify-center flex-wrap gap-1">
          <span>© {currentYear} Portofolio Hadona. Powered by</span>{' '}
          <Link
            href="https://hadona.id"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-hadona-primary hover:text-hadona-dark transition-colors"
          >
            Hadona Digital Media
          </Link>
        </p>
        <p className="text-xs text-gray-400">
          Designed & Developed by <span className="font-semibold text-gray-600">Briyanes</span>
        </p>
      </div>
    </footer>
  );
}
