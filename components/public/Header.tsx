'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200'
        }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between py-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Portofolio Hadona
              </h1>
              <p className="text-sm text-gray-600">
                Powered by <span className="font-semibold">Hadona Digital Media</span>
              </p>
            </div>
          </Link>

          <div className="flex items-center">
            <a
              href="https://hadona.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo/logo-hadona.png"
                alt="Hadona Digital Media"
                width={200}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
