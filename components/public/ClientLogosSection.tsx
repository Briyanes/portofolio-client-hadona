'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { ClientLogo } from '@/lib/types';

interface ClientLogosSectionProps {
  clients: ClientLogo[];
  showTitle?: boolean;
}

export function ClientLogosSection({
  clients,
  showTitle = true,
}: ClientLogosSectionProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Duplicate array 2 times (instead of 3) for seamless infinite scrolling — less DOM
  const duplicatedClients = [...clients, ...clients];

  // Drag functionality
  const handleMouseDown = () => {
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Don't unpause here — mouse is still over the slider, wrapper handles unpause on leave
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    // isPaused managed by wrapper's onMouseEnter/onMouseLeave
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const scrollSpeed = 2;
    sliderRef.current.scrollLeft -= e.movementX * scrollSpeed;
  };

  // Touch drag for mobile
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  if (clients.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in relative">
      {showTitle && (
        <div className="text-center mb-10">
          <h2 className="text-section-title text-gray-900 mb-4">
            Dipercaya oleh Brand Terkemuka
          </h2>
          <p className="text-body text-gray-600">
            Kami telah membantu lebih dari {clients.length}+ brand mencapai target digital marketing mereka
          </p>
        </div>
      )}

      {/* Slider Container with Fade Edges */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => !isDragging && setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade Edge - Left */}
        <div className="absolute inset-y-0 left-0 w-24 slider-fade-left z-10 pointer-events-none"></div>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className={`flex items-center gap-8 md:gap-12 w-max animate-scroll slider-track ${
            isPaused ? 'pause-animation' : ''
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {duplicatedClients.map((client, index) => {
            // Convert relative path to absolute URL if needed
            let logoSrc = client.logo_url;

            // Only convert if it's a valid non-empty string
            if (logoSrc && typeof logoSrc === 'string' && logoSrc.trim() && !logoSrc.startsWith('http')) {
              if (logoSrc.startsWith('/')) {
                // Use production URL as default since we're in client component
                logoSrc = `https://portofolio.hadona.id${logoSrc}`;
              }
            }

            // Check if logoSrc is valid
            const isValidLogo = logoSrc && typeof logoSrc === 'string' && logoSrc.trim() && logoSrc !== '{}' && logoSrc !== 'null';

            return (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              >
                {isValidLogo ? (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-50 border border-gray-100 overflow-hidden">
                    <Image
                      src={logoSrc}
                      alt={client.name}
                      fill
                      className="object-contain p-3 md:p-4"
                      sizes="112px"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-text absolute inset-0 flex items-center justify-center text-xs text-gray-500 text-center p-2 font-semibold';
                          fallback.textContent = client.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xs text-gray-500 text-center p-2 font-semibold">
                    {client.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fade Edge - Right */}
        <div className="absolute inset-y-0 right-0 w-24 slider-fade-right z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}
