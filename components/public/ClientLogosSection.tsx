'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
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

  // Use all clients and duplicate for seamless infinite loop
  // Duplicate array 3 times for seamless infinite scrolling
  const duplicatedClients = [...clients, ...clients, ...clients];

  // Drag functionality
  const handleMouseDown = () => {
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
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
      <div className="relative overflow-hidden">
        {/* Fade Edge - Left */}
        <div className="absolute inset-y-0 left-0 w-24 slider-fade-left z-10 pointer-events-none"></div>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className={`flex gap-8 md:gap-12 animate-scroll slider-track ${
            isPaused ? 'pause-animation' : ''
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => !isDragging && setIsPaused(true)}
          style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedClients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={client.logo_url}
                alt={client.name}
                width={200}
                height={100}
                className="h-16 md:h-20 lg:h-24 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Fade Edge - Right */}
        <div className="absolute inset-y-0 right-0 w-24 slider-fade-right z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}
