'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide header on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="floating-header" style={{
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: isScrolled
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div className="responsive-header" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div>
            <h1 className="responsive-header-title" style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
              marginBottom: '4px',
              lineHeight: '1.2'
            }}>
              Portofolio Hadona
            </h1>
            <p className="responsive-header-subtitle" style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.4'
            }}>
              Powered by <span style={{ fontWeight: '600' }}>Hadona Digital Media</span>
            </p>
          </div>
        </Link>
        <div className="responsive-header-logo-container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <a
            href="https://hadona.id"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            <Image
              src="/logo/logo-hadona.png"
              alt="Hadona Digital Media"
              className="responsive-header-logo"
              width={200}
              height={80}
              style={{
                height: '80px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </a>
        </div>
      </div>
    </header>
  );
}
