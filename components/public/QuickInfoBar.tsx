'use client';

import { useRef, useState, useEffect } from 'react';
import type { CaseStudy } from '@/lib/types';

interface QuickInfoBarProps {
  caseStudy: CaseStudy;
  variant?: 'horizontal' | 'sidebar';
}

interface InfoCard {
  icon: string;
  label: string;
  value: string | React.ReactNode;
  href?: string;
}

export function QuickInfoBar({ caseStudy, variant = 'sidebar' }: QuickInfoBarProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showUpArrow, setShowUpArrow] = useState(false);
  const [showDownArrow, setShowDownArrow] = useState(true);

  const infoCards: InfoCard[] = [
    {
      icon: 'bi-building',
      label: 'Nama Klien',
      value: caseStudy.client_name,
    },
  ];

  // Add category card if exists
  if (caseStudy.category) {
    infoCards.push({
      icon: 'bi-tag',
      label: 'Industry',
      value: caseStudy.category.name,
    });
  }

  // Add services card
  if (caseStudy.services) {
    infoCards.push({
      icon: 'bi-gear',
      label: 'Layanan',
      value: caseStudy.services,
    });
  }

  // Add website card if exists
  if (caseStudy.website_url) {
    infoCards.push({
      icon: 'bi-globe',
      label: 'Website',
      value: (
        <a
          href={caseStudy.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-hadona-yellow transition-colors inline-flex items-center gap-2 group"
        >
          <span>Kunjungi</span>
          <i className="bi bi-box-arrow-up-right text-sm group-hover:translate-x-1 transition-transform"></i>
        </a>
      ),
    });
  }

  // Add social media card if any links exist
  if (caseStudy.instagram_url || caseStudy.facebook_url) {
    infoCards.push({
      icon: 'bi-share',
      label: 'Social Media',
      value: (
        <div className="flex flex-col gap-2">
          {caseStudy.instagram_url && (
            <a
              href={caseStudy.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-hadona-yellow transition-colors inline-flex items-center gap-2 group"
            >
              <i className="bi bi-instagram group-hover:scale-110 transition-transform"></i>
              <span>Instagram</span>
            </a>
          )}
          {caseStudy.facebook_url && (
            <a
              href={caseStudy.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-hadona-yellow transition-colors inline-flex items-center gap-2 group"
            >
              <i className="bi bi-facebook group-hover:scale-110 transition-transform"></i>
              <span>Facebook</span>
            </a>
          )}
        </div>
      ),
    });
  }

  // Check scroll position untuk show/hide arrows
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      if (variant === 'sidebar') {
        // Vertical scroll untuk sidebar
        setShowUpArrow(slider.scrollTop > 0);
        setShowDownArrow(
          slider.scrollTop < slider.scrollHeight - slider.clientHeight
        );
      } else {
        // Horizontal scroll untuk mobile
        setShowLeftArrow(slider.scrollLeft > 0);
        setShowRightArrow(
          slider.scrollLeft < slider.scrollWidth - slider.clientWidth
        );
      }
    };

    slider.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => slider.removeEventListener('scroll', handleScroll);
  }, [variant]);

  // Scroll functions
  const scrollUp = () => {
    sliderRef.current?.scrollBy({ top: -200, behavior: 'smooth' });
  };

  const scrollDown = () => {
    sliderRef.current?.scrollBy({ top: 200, behavior: 'smooth' });
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Drag handlers
  const handleMouseDown = () => {
    setIsDragging(true);
    sliderRef.current?.setAttribute('data-dragging', 'true');
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    sliderRef.current?.removeAttribute('data-dragging');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();

    if (variant === 'sidebar') {
      const scrollTop = sliderRef.current.scrollTop;
      const y = e.pageY - sliderRef.current.offsetTop;
      const walk = (y - scrollTop) * 2;
      sliderRef.current.scrollTop = scrollTop - walk;
    } else {
      const scrollLeft = sliderRef.current.scrollLeft;
      const x = e.pageX - sliderRef.current.offsetLeft;
      const walk = (x - scrollLeft) * 2;
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Sidebar variant (desktop)
  if (variant === 'sidebar') {
    return (
      <aside className="hidden lg:block sticky top-24 h-fit animate-fade-in pt-12">
        <div className="relative">
          {/* Up Arrow Button */}
          {showUpArrow && (
            <button
              onClick={scrollUp}
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-10
                         w-8 h-8 rounded-full bg-hadona-primary backdrop-blur-sm
                         flex items-center justify-center text-white
                         hover:bg-hadona-primary/80 transition-colors shadow-lg"
              aria-label="Scroll up"
            >
              <i className="bi bi-chevron-up"></i>
            </button>
          )}

          {/* Vertical Slider Container */}
          <div
            ref={sliderRef}
            className="flex flex-col gap-3 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide
                       scroll-smooth cursor-grab active:cursor-grabbing select-none
                       px-1"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {infoCards.map((card, index) => (
              <div
                key={index}
                className="w-72 bg-gradient-to-br from-hadona-primary to-hadona-bg-dark
                           rounded-xl p-5 hover:shadow-xl
                           transition-all duration-300
                           hover:scale-[1.02] animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <i className={`bi ${card.icon} text-xl text-hadona-yellow`}></i>
                  <p className="text-xs text-gray-200 font-medium uppercase tracking-wide">
                    {card.label}
                  </p>
                </div>
                <div className="text-white font-bold leading-tight">
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Down Arrow Button */}
          {showDownArrow && (
            <button
              onClick={scrollDown}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10
                         w-8 h-8 rounded-full bg-hadona-primary backdrop-blur-sm
                         flex items-center justify-center text-white
                         hover:bg-hadona-primary/80 transition-colors shadow-lg"
              aria-label="Scroll down"
            >
              <i className="bi bi-chevron-down"></i>
            </button>
          )}
        </div>
      </aside>
    );
  }

  // Horizontal variant (mobile/tablet)
  return (
    <section className="bg-gradient-to-br from-hadona-primary to-hadona-bg-dark text-white py-3 lg:hidden">
      <div className="section-container">
        <div className="relative">
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                         w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm
                         flex items-center justify-center text-white
                         hover:bg-white/30 transition-colors
                         hidden md:flex"
              aria-label="Scroll left"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          )}

          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide
                       scroll-smooth cursor-grab
                       active:cursor-grabbing
                       select-none py-1"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {infoCards.map((card, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-56 md:w-64 bg-white/10 backdrop-blur-sm
                           rounded-xl p-3 md:p-4 hover:bg-white/15
                           transition-all duration-300
                           hover:scale-105 hover:shadow-xl
                           animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  minWidth: '224px',
                }}
              >
                <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                  <i className={`bi ${card.icon} text-lg md:text-xl text-hadona-yellow`}></i>
                  <p className="text-[10px] md:text-xs text-gray-200 font-medium uppercase tracking-wide">
                    {card.label}
                  </p>
                </div>
                <div className="text-sm md:text-base font-bold leading-tight">
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                         w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm
                         flex items-center justify-center text-white
                         hover:bg-white/30 transition-colors
                         hidden md:flex"
              aria-label="Scroll right"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
